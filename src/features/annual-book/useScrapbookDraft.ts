import {
  hasScrapbookContent,
  newScrapbookDraft,
  type ScrapbookDraft,
} from "./scrapbook";
import {
  readScrapbook,
  writeScrapbook,
  restoreScrapbook,
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
  const controller = useLocalDraft(repository);
  return {
    ...controller,
    restore: (draft: ScrapbookDraft) =>
      controller.replace(draft, restoreScrapbook),
  };
}
export type ScrapbookController = ReturnType<typeof useScrapbookDraft>;
