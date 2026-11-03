import { beforeEach, describe, expect, it, vi } from "vitest";
import { newScrapbookDraft, newScrapbookPage } from "../annual-book/scrapbook";
import { newPreparation } from "./model";
import { addPreparationToBook } from "./addToBook";

const mock = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn() }));
vi.mock("../annual-book/scrapbookStorage", () => ({
  readScrapbook: mock.read,
  writeScrapbook: mock.write,
}));
const memory = () => ({
  ...newPreparation().memory,
  image: "data:image/jpeg;base64,YWJj",
  caption: "Omat sanat",
  date: "2025-12-30",
});
beforeEach(() => {
  mock.read.mockReset().mockResolvedValue(null);
  mock.write.mockReset().mockResolvedValue(1);
});

describe("preparation page copied to the local book", () => {
  it("creates a personal book and preserves the event day", async () => {
    const page = memory();
    await expect(addPreparationToBook(page)).resolves.toEqual({
      alreadyAdded: false,
      puppyName: "Oma pentu",
    });
    const [saved, revision] = mock.write.mock.calls[0];
    expect(revision).toBe(0);
    expect(saved.selectedPageId).toBe(page.id);
    expect(saved.pages.at(-1)).toEqual(page);
  });
  it("appends without changing the existing name, palette, order or page edits", async () => {
    const draft = newScrapbookDraft();
    draft.puppyName = "Sisu";
    draft.palette = "berry";
    draft.pages[0].caption = "Aiempi tärkeä sivu";
    mock.read.mockResolvedValue({ revision: 7, draft });
    const page = memory();
    await addPreparationToBook(page);
    expect(mock.write).toHaveBeenCalledWith(
      { ...draft, pages: [...draft.pages, page], selectedPageId: page.id },
      7,
    );
    expect(draft.pages).toHaveLength(1);
  });
  it("does not duplicate a previous copy or overwrite edits made in the book", async () => {
    const page = memory();
    const draft = newScrapbookDraft();
    draft.pages = [{ ...page, caption: "Kirjassa muokattu teksti" }];
    draft.selectedPageId = page.id;
    mock.read.mockResolvedValue({ revision: 8, draft });
    expect((await addPreparationToBook(page)).alreadyAdded).toBe(true);
    expect(mock.write).not.toHaveBeenCalled();
  });
  it("selects an existing copy while retaining all of its content", async () => {
    const page = memory();
    const draft = newScrapbookDraft();
    draft.pages.push({ ...page, caption: "Kirjan oma teksti" });
    mock.read.mockResolvedValue({ revision: 4, draft });
    await addPreparationToBook(page);
    expect(mock.write).toHaveBeenCalledWith(
      { ...draft, selectedPageId: page.id },
      4,
    );
  });
  it("stops before writing when the book is full", async () => {
    const draft = newScrapbookDraft();
    draft.pages = Array.from({ length: 24 }, () => newScrapbookPage());
    draft.selectedPageId = draft.pages[0].id;
    mock.read.mockResolvedValue({ revision: 4, draft });
    await expect(addPreparationToBook(memory())).rejects.toThrow("24 sivua");
    expect(mock.write).not.toHaveBeenCalled();
  });
  it("keeps an unreadable destination intact", async () => {
    mock.read.mockRejectedValue(
      new Error("Tallennettua versiota ei voi lukea."),
    );
    await expect(addPreparationToBook(memory())).rejects.toThrow(
      "ei voi lukea",
    );
    expect(mock.write).not.toHaveBeenCalled();
  });
  it("surfaces a concurrent write instead of replacing a newer book", async () => {
    mock.write.mockRejectedValue(
      new Error("Toinen välilehti tallensi uudemman luonnoksen."),
    );
    await expect(addPreparationToBook(memory())).rejects.toThrow(
      "Toinen välilehti",
    );
    expect(mock.write).toHaveBeenCalledTimes(1);
  });
  it("requires a safe photo before reading or changing the book", async () => {
    await expect(addPreparationToBook(newPreparation().memory)).rejects.toThrow(
      "Valitse ensin kuva",
    );
    await expect(
      addPreparationToBook({
        ...memory(),
        image: "https://example.invalid/unsafe.jpg",
      }),
    ).rejects.toThrow("Valitse ensin kuva");
    expect(mock.read).not.toHaveBeenCalled();
    expect(mock.write).not.toHaveBeenCalled();
  });
});
