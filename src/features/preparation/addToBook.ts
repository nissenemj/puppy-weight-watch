import {
  newScrapbookDraft,
  scrapbookPageSchema,
  type ScrapbookPage,
} from "../annual-book/scrapbook";
import { readScrapbook, writeScrapbook } from "../annual-book/scrapbookStorage";

/** Append once. Existing book pages, including edits to a previous copy, stay intact. */
export async function addPreparationToBook(page: ScrapbookPage) {
  const checked = scrapbookPageSchema.safeParse(page);
  if (!checked.success || !checked.data.image)
    throw new Error(
      "Valitse ensin kuva kirjasivulle ja tarkista sivun tiedot.",
    );
  const stored = await readScrapbook();
  const draft = stored?.draft ?? {
    ...newScrapbookDraft(),
    puppyName: "Oma pentu",
  };
  const alreadyAdded = draft.pages.some((item) => item.id === checked.data.id);
  if (!alreadyAdded && draft.pages.length >= 24)
    throw new Error(
      "Kirjaluonnoksessa on jo 24 sivua. Avaa kirja ja järjestele sivuja ennen uuden lisäämistä.",
    );
  if (!alreadyAdded || draft.selectedPageId !== checked.data.id) {
    await writeScrapbook(
      {
        ...draft,
        pages: alreadyAdded ? draft.pages : [...draft.pages, checked.data],
        selectedPageId: checked.data.id,
      },
      stored?.revision ?? 0,
    );
  }
  return { alreadyAdded, puppyName: draft.puppyName };
}
