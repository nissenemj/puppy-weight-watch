import { describe, expect, it } from "vitest";
import {
  annualBookSchema,
  buildBookPages,
  day,
  firstYearEnd,
  splitCaption,
  type AnnualBook,
} from "./model";

const book: AnnualBook = {
  bookId: "33333333-3333-4333-8333-333333333333",
  puppyName: "Nuppu",
  start: "2026-04-01",
  end: "2027-03-31",
  entries: [],
  weights: [],
};
const image = "data:image/jpeg;base64,YWJj";

describe("annual book dates and content", () => {
  it("validates real dates and inclusive first years including leap days", () => {
    expect(day.safeParse("2026-02-29").success).toBe(false);
    expect(firstYearEnd("2024-02-29")).toBe("2025-02-28");
    expect(firstYearEnd("2023-03-01")).toBe("2024-02-29");
    expect(firstYearEnd("2026-04-01")).toBe("2027-03-31");
    expect(firstYearEnd("invalid")).toBe("");
    expect(
      annualBookSchema.safeParse({ ...book, end: "2027-04-01" }).success,
    ).toBe(false);
  });

  it("rejects an unconfirmed date, repeated memory and out-of-period event", () => {
    const entry = {
      id: "a",
      date: "2026-06-03",
      caption: "Kotiin",
      mishap: false,
    };
    for (const entries of [
      [{ ...entry, date: "" }],
      [entry, entry],
      [{ ...entry, date: "2026-03-31" }],
    ]) {
      expect(annualBookSchema.safeParse({ ...book, entries }).success).toBe(
        false,
      );
    }
  });

  it("does not request an arbitrary external image and limits the pilot to 24 memories", () => {
    const entry = {
      id: "a",
      date: "2026-06-03",
      caption: "",
      mishap: false,
      image: "https://external.invalid/private",
    };
    expect(
      annualBookSchema.safeParse({ ...book, entries: [entry] }).success,
    ).toBe(false);
    expect(
      annualBookSchema.safeParse({
        ...book,
        entries: Array.from({ length: 25 }, (_, n) => ({
          ...entry,
          id: String(n),
          image,
        })),
      }).success,
    ).toBe(false);
  });

  it("orders by confirmed event day, includes only measured weights in the period and invents no empty months", () => {
    const source: AnnualBook = {
      ...book,
      entries: [
        {
          id: "later",
          date: "2026-09-03",
          caption: "Syksy",
          mishap: true,
          image,
        },
        {
          id: "early",
          date: "2026-06-03",
          caption: "Kotiin",
          mishap: false,
          image,
        },
      ],
      weights: [
        { date: "2026-03-01", kg: 2 },
        { date: "2026-06-03", kg: 4.2 },
      ],
    };
    const pages = buildBookPages(source);
    expect(pages.map((page) => page.kind)).toEqual([
      "cover",
      "comparison",
      "month",
      "mishap",
      "growth",
      "measurements",
    ]);
    expect(pages[1].entries.map((entry) => entry.id)).toEqual([
      "early",
      "later",
    ]);
    expect(pages[4].weights).toEqual([{ date: "2026-06-03", kg: 4.2 }]);
    expect(source.entries[0].id).toBe("later");
    expect(source.weights).toHaveLength(2);
  });

  it("does not imply growth from two photos taken on the same day", () => {
    const entries = ["a", "b"].map((id) => ({
      id,
      date: "2026-06-03",
      caption: "",
      image,
      mishap: false,
    }));
    expect(
      buildBookPages({ ...book, entries }).some(
        (page) => page.kind === "comparison",
      ),
    ).toBe(false);
  });

  it("uses the full growth series before paginated tables and keeps a personal letter intact", () => {
    const weights = Array.from({ length: 35 }, (_, n) => ({
      date: `2026-06-${String((n % 28) + 1).padStart(2, "0")}`,
      kg: n + 1,
    }));
    const letter = "Muistan tämän.\n".repeat(60);
    const result = buildBookPages({
      ...book,
      weights,
      design: {
        title: "Nupun oma kirja",
        palette: "berry",
        coverArt: "illustration",
        letter,
      },
    });
    expect(result[0].title).toBe("Nupun oma kirja");
    expect(result.find((page) => page.kind === "growth")!.weights).toHaveLength(
      35,
    );
    expect(
      result
        .filter((page) => page.kind === "measurements")
        .flatMap((page) => page.weights),
    ).toHaveLength(35);
    expect(
      result
        .filter((page) => page.kind === "letter")
        .map((page) => page.text)
        .join(""),
    ).toBe(letter);
    expect(
      annualBookSchema.safeParse({
        ...book,
        design: { title: "", palette: "neon", coverArt: "photo", letter: "" },
      }).success,
    ).toBe(false);
  });

  it.each([
    "Tassut 🐾 ja ääkköset. ".repeat(200),
    "Pitkä\n\n".repeat(400),
    "W".repeat(5000),
    "\n".repeat(200),
  ])("keeps every character of long text across pages", (caption) => {
    const chunks = splitCaption(caption, true);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(caption);
    const pages = buildBookPages({
      ...book,
      entries: [
        { id: "long", date: "2026-06-03", caption, image, mishap: false },
      ],
    });
    const contents = pages.filter((page) => page.kind === "month");
    expect(
      contents
        .flatMap((page) => page.entries.map((entry) => entry.caption))
        .join(""),
    ).toBe(caption);
    expect(contents.slice(1).every((page) => !page.entries[0].image)).toBe(
      true,
    );
  });
});
