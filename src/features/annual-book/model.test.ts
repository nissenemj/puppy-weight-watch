import { describe, expect, it } from "vitest";
import {
  annualBookSchema,
  buildBookPages,
  day,
  firstYearEnd,
  splitCaption,
  guidedPageSchema,
  guidedPageSetSchema,
  getGuidedPhotos,
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

describe("structured puppy-book pages", () => {
  const paw = {
    templateId: "paw" as const,
    date: "",
    first: "Pieni tumma antura",
    second: "",
    photoDescription: "",
  };
  it("accepts an undated answer or a photo without inventing an event day and rejects empty pages", () => {
    expect(guidedPageSchema.parse(paw).date).toBe("");
    expect(
      guidedPageSchema.safeParse({ ...paw, first: "", image }).success,
    ).toBe(true);
    expect(
      guidedPageSchema.safeParse({ ...paw, first: "   ", date: "2026-06-03" })
        .success,
    ).toBe(false);
    expect(
      guidedPageSchema.safeParse({ ...paw, date: "2026-02-29" }).success,
    ).toBe(false);
  });
  it("rejects remote image references, duplicate pages and content beyond the small printed-page budget", () => {
    expect(
      guidedPageSchema.safeParse({
        ...paw,
        image: "https://example.invalid/private-photo",
      }).success,
    ).toBe(false);
    expect(guidedPageSetSchema.safeParse([paw, paw]).success).toBe(false);
    expect(
      guidedPageSchema.safeParse({ ...paw, first: "W".repeat(141) }).success,
    ).toBe(false);
    expect(
      guidedPageSchema.safeParse({ ...paw, second: "X\n".repeat(10) }).success,
    ).toBe(false);
  });
  it("keeps selected pages in chapter order with their exact answers, without blank chapters or photo growth comparisons", () => {
    const toy = { ...paw, templateId: "toy" as const, first: "Kettu", image };
    const source = [toy, { ...paw, image }];
    const pages = buildBookPages(book, source);
    expect(pages.map((page) => page.kind)).toEqual([
      "cover",
      "guided",
      "guided",
    ]);
    expect(pages.map((page) => page.title)).toEqual([
      "Pennun ensimmäinen vuosi",
      "Pieni tassuni",
      "Lelupassi",
    ]);
    expect(pages[1].guided?.date).toBe("");
    expect(pages[1].guided?.first).toBe(paw.first);
    expect(source[0].templateId).toBe("toy");
  });
  it("accepts optional selections without answers, keeps older photo pages and requires an observation beyond an imagined defence", () => {
    const base = { ...paw, first: "", second: "" };
    expect(
      guidedPageSchema.safeParse({
        ...base,
        templateId: "sleep",
        details: { kind: "sleep", poses: ["back"] },
      }).success,
    ).toBe(true);
    expect(
      guidedPageSchema.safeParse({
        ...base,
        templateId: "toy",
        details: { kind: "toy", uses: ["carry"] },
      }).success,
    ).toBe(true);
    const incident = {
      ...base,
      templateId: "mishap",
      second: "Se oli sukan oma idea.",
      details: { kind: "mishap", items: [], other: "" },
    };
    expect(guidedPageSchema.safeParse(incident).success).toBe(false);
    expect(
      guidedPageSchema.safeParse({
        ...incident,
        first: "Sukka löytyi pedistä.",
      }).success,
    ).toBe(true);
    const older = guidedPageSchema.parse({
      ...base,
      templateId: "mishap",
      second: "Tämä nauratti.",
    });
    expect(older.details).toBeUndefined();
    expect(
      getGuidedPhotos({ ...paw, image, photoDescription: "Pieni tassu" })[0]
        .description,
    ).toBe("Pieni tassu");
  });
  it("rejects mixed page-specific data, repeated choices and oversized or duplicate photo collections", () => {
    const photo = {
      id: "one",
      image,
      name: "Taskurapu",
      description: "Pentu nukkuu",
    };
    const sleep = {
      ...paw,
      templateId: "sleep",
      photos: [photo],
      details: { kind: "sleep", poses: ["back"] },
    };
    for (const invalid of [
      { ...sleep, templateId: "toy" },
      { ...sleep, details: { kind: "toy", uses: ["carry"] } },
      { ...sleep, details: { kind: "sleep", poses: ["back", "back"] } },
      { ...sleep, image },
      { ...sleep, photos: [photo, photo] },
      {
        ...sleep,
        photos: Array.from({ length: 4 }, (_, n) => ({
          ...photo,
          id: String(n),
        })),
      },
      {
        ...sleep,
        photos: [{ ...photo, image: "https://example.invalid/photo.jpg" }],
      },
      { ...sleep, photos: [{ ...photo, name: "W".repeat(41) }] },
    ])
      expect(guidedPageSchema.safeParse(invalid).success).toBe(false);
  });
  it("gives each sleep photo its own stable page without duplicating answers or modifying the photo collection", () => {
    const photos = ["one", "two", "three"].map((id) => ({
      id,
      image,
      name: `Asento ${id}`,
      description: `Kuva ${id}`,
    }));
    const sleep = guidedPageSchema.parse({
      ...paw,
      templateId: "sleep",
      photos,
      details: { kind: "sleep", poses: ["curl", "back"] },
    });
    const pages = buildBookPages(book, [sleep]);
    expect(pages.map((page) => page.key)).toEqual([
      "cover",
      "guided-sleep",
      "guided-sleep-1",
      "guided-sleep-2",
    ]);
    expect(pages.slice(1).map((page) => page.guidedPhotoIndex)).toEqual([
      0, 1, 2,
    ]);
    expect(pages[3].title).toBe("Unen mestaruussarja · Unikuva 3");
    expect(getGuidedPhotos(sleep)).toEqual(photos);
    expect(
      buildBookPages(book, [{ ...paw, templateId: "sleep", image }]),
    ).toHaveLength(2);
  });
  it("keeps long structured answers on a separate page instead of shrinking or dropping photos and text", () => {
    const sleep = guidedPageSchema.parse({
      ...paw,
      templateId: "sleep",
      first: "W".repeat(140),
      second: "犬".repeat(140),
      details: { kind: "sleep", poses: ["back"] },
      photos: ["one", "two", "three"].map((id) => ({
        id,
        image,
        name: "Oma uniasento",
        description: "",
      })),
    });
    const pages = buildBookPages(book, [sleep]).slice(1);
    expect(pages.map((page) => page.guidedSection)).toEqual([
      "details",
      "photo",
      "photo",
      "photo",
    ]);
    expect(pages.map((page) => page.guidedPhotoIndex)).toEqual([
      undefined,
      0,
      1,
      2,
    ]);
    expect(pages[0].guided?.first).toBe(sleep.first);
    expect(pages[0].guided?.second).toBe(sleep.second);
    expect(new Set(pages.map((page) => page.key)).size).toBe(4);
  });
});
