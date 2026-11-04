import { describe, expect, it } from "vitest";
import {
  exampleBook,
  exampleBookPages,
  exampleScrapbookPages,
} from "./exampleBook";

describe("public example book", () => {
  it("keeps saved page links unique and uses the same complete pages for preview and print", () => {
    expect(exampleBookPages).toHaveLength(13);
    const slugs = exampleBookPages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(13);
    for (const slug of [
      "kansi",
      "silloin-ja-nyt",
      "ensimmaiset-paivat",
      "kommellus",
      "hetket",
      "kasvu",
      "mittaukset",
      "kirje",
    ])
      expect(slugs).toContain(slug);
    expect(
      exampleBookPages.filter((item) => item.page.scrapbookSection === "full"),
    ).toHaveLength(6);
    expect(exampleBookPages.at(-1)?.page.kind).toBe("letter");
  });
  it("uses distinct labelled sample scenes with plausible field lengths and explicit dates inside the book period", () => {
    expect(new Set(exampleScrapbookPages.map((page) => page.image)).size).toBe(
      6,
    );
    for (const page of exampleScrapbookPages) {
      expect(page.imageSource).toBe("example");
      expect(page.imageDescription).toContain("Tekoälyllä luotu");
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.caption.length).toBeLessThanOrEqual(140);
      expect(page.quote.length).toBeLessThanOrEqual(140);
      expect(
        page.date >= exampleBook.start && page.date <= exampleBook.end,
      ).toBe(true);
    }
  });
});
