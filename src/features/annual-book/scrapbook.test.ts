import { describe, expect, it } from "vitest";
import { buildBookPages, type AnnualBook } from "./model";
import {
  chooseScrapbookTopic,
  hasScrapbookContent,
  newScrapbookDraft,
  newScrapbookPage,
  scrapbookDraftSchema,
  SCRAPBOOK_TOPICS,
  SCRAPBOOK_TOPIC_KEYS,
} from "./scrapbook";

const image = "data:image/jpeg;base64,YWJj";
const book: AnnualBook = {
  bookId: "33333333-3333-4333-8333-333333333333",
  puppyName: "Nuppu",
  start: "2026-04-01",
  end: "2027-03-31",
  entries: [],
  weights: [],
};
describe("local scrapbook document", () => {
  it("changes ideas without replacing the author's photo, words, date, layout or page identity", () => {
    const original = {
      ...newScrapbookPage("story"),
      title: "Meidän yhteinen tiistai", caption: "Oma havainto.",
      quote: "Leikillinen lause.", image, date: "2026-10-04",
      sticker: "heart" as const, imageDescription: "Oma kuvan kuvaus.",
    };
    for (const topic of SCRAPBOOK_TOPIC_KEYS) {
      const changed = chooseScrapbookTopic(original, topic);
      expect(changed).toEqual({ ...original, topic });
      const draft = newScrapbookDraft();
      expect(scrapbookDraftSchema.parse({ ...draft, pages: [changed], selectedPageId: changed.id }).pages[0]).toEqual(changed);
    }
  });
  it("keeps existing version 1 drafts readable and prints no empty template or helper questions", () => {
    const old = newScrapbookDraft();
    old.pages[0].topic = "sleep";
    old.pages[0].title = "Unen mestaruussarja";
    const parsed = scrapbookDraftSchema.parse(old);
    for (const topic of SCRAPBOOK_TOPIC_KEYS) {
      const changed = chooseScrapbookTopic(parsed.pages[0], topic);
      expect(changed.title).toBe(SCRAPBOOK_TOPICS[topic].title);
      expect(changed.date).toBe("");
      expect(changed.caption).toBe("");
      expect(buildBookPages(book, [], [changed])).toHaveLength(1);
      const pages = buildBookPages(book, [], [{ ...changed, image }]);
      expect(pages[1].title).toBe(SCRAPBOOK_TOPICS[topic].title);
      expect(pages[1].scrapbook?.caption).toBe("");
      expect(JSON.stringify(pages)).not.toContain(SCRAPBOOK_TOPICS[topic].questions[0]);
    }
  });
  it("keeps blank draft pages out of the book, supports repeated templates and preserves author order", () => {
    const draft = newScrapbookDraft();
    expect(hasScrapbookContent(draft.pages[0])).toBe(false);
    const first = {
      ...newScrapbookPage(),
      topic: "sleep" as const,
      title: "Taskurapu",
      image,
    };
    const second = {
      ...newScrapbookPage(),
      topic: "sleep" as const,
      title: "Pieni kerä",
      image,
    };
    const parsed = scrapbookDraftSchema.parse({
      ...draft,
      pages: [second, draft.pages[0], first],
    });
    expect(
      buildBookPages(book, [], parsed.pages).map((page) => page.title),
    ).toEqual(["Pennun ensimmäinen vuosi", "Pieni kerä", "Taskurapu"]);
    expect(
      buildBookPages(
        book,
        [],
        [{ ...newScrapbookPage(), quote: "Vain keksittyä puhetta" }],
      ),
    ).toHaveLength(1);
  });
  it("rejects incompatible drafts, duplicate page identities, unconfirmed dates and external image references", () => {
    const draft = newScrapbookDraft();
    for (const invalid of [
      { ...draft, version: 2 },
      { ...draft, selectedPageId: crypto.randomUUID() },
      { ...draft, pages: [draft.pages[0], draft.pages[0]] },
      {
        ...draft,
        pages: [
          { ...draft.pages[0], image: "https://example.invalid/photo.jpg" },
        ],
      },
      { ...draft, pages: [{ ...draft.pages[0], date: "2026-02-29" }] },
      { ...draft, pages: [{ ...draft.pages[0], sticker: "javascript" }] },
    ])
      expect(scrapbookDraftSchema.safeParse(invalid).success).toBe(false);
    expect(scrapbookDraftSchema.parse(draft).pages[0].date).toBe("");
  });
  it("continues long multiline text on new paper pages without dropping text or duplicating a photo", () => {
    const caption = "W\n".repeat(69) + "W";
    const quote = "犬\n".repeat(69) + "犬";
    const page = {
      ...newScrapbookPage(),
      title: "W".repeat(60),
      caption,
      quote,
      image,
      date: "2026-10-31",
    };
    const pages = buildBookPages(book, [], [page]).slice(1);
    expect(
      pages
        .filter((page) => page.scrapbookSection === "caption")
        .map((page) => page.text)
        .join(""),
    ).toBe(caption);
    expect(
      pages
        .filter((page) => page.scrapbookSection === "quote")
        .map((page) => page.text)
        .join(""),
    ).toBe(quote);
    expect(
      pages.filter((page) => page.scrapbookSection === "photo"),
    ).toHaveLength(1);
    expect(new Set(pages.map((page) => page.key)).size).toBe(pages.length);
    expect(pages.every((part) => part.scrapbook?.date === "2026-10-31")).toBe(
      true,
    );
  });
});
