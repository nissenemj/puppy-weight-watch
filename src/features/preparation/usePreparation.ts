import {
  useLocalDraft,
  type LocalDraftRepository,
} from "../annual-book/useLocalDraft";
import {
  newPreparation,
  hasPreparationContent,
  type PreparationDraft,
  type PreparationTask,
} from "./model";
import {
  readPreparation,
  writePreparation,
  PreparationConflict,
} from "./storage";

const repository: LocalDraftRepository<PreparationDraft> = {
  create: newPreparation,
  read: readPreparation,
  write: writePreparation,
  isConflict: (cause) => cause instanceof PreparationConflict,
  hasContent: hasPreparationContent,
};

export function usePreparation() {
  return useLocalDraft(repository);
}
export type PreparationController = ReturnType<typeof usePreparation>;

export function preparationReady(controller: PreparationController) {
  return (
    (controller.mode === "ready" || controller.mode === "session") &&
    !controller.hasConflict
  );
}

export function togglePreparation(
  controller: PreparationController,
  task: PreparationTask,
  checked: boolean,
) {
  controller.change((draft) => ({
    ...draft,
    checked: checked
      ? [...draft.checked.filter((item) => item !== task), task]
      : draft.checked.filter((item) => item !== task),
  }));
}
