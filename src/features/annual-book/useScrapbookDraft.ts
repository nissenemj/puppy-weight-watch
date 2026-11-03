import {
  hasScrapbookContent,
  newScrapbookDraft,
  type ScrapbookDraft,
} from "./scrapbook";
import {
  readScrapbook,
  writeScrapbook,
  ScrapbookConflict,
} from "./scrapbookStorage";
import { useLocalDraft, type LocalDraftRepository } from "./useLocalDraft";

const repository: LocalDraftRepository<ScrapbookDraft> = {
  create: newScrapbookDraft,
  read: readScrapbook,
  write: writeScrapbook,
  isConflict: (cause) => cause instanceof ScrapbookConflict,
  hasContent: (draft) => draft.pages.some(hasScrapbookContent),
};

export function useScrapbookDraft() {
  return useLocalDraft(repository);
}
export type ScrapbookController = ReturnType<typeof useScrapbookDraft>;
