import { describe, expect, it } from "vitest";
import {
  newPreparation,
  preparationSchema,
  hasPreparationContent,
  PREPARATION_TASKS,
} from "./model";

describe("preparation draft", () => {
  it("starts with an independent, undated book page and no saved claims", () => {
    const draft = newPreparation();
    expect(preparationSchema.parse(draft)).toEqual(draft);
    expect(hasPreparationContent(draft)).toBe(false);
    expect(draft.memory.date).toBe("");
    expect(draft.memory.topic).toBe("home");
    expect(newPreparation().memory.id).not.toBe(draft.memory.id);
  });
  it("retains the author's event day, words, photo and family plan", () => {
    const draft = newPreparation();
    draft.checked = [...PREPARATION_TASKS];
    draft.family.atHome = "Oma sopimus";
    draft.memory.image = "data:image/jpeg;base64,YWJj";
    draft.memory.caption = "Täällä sinua odotettiin.";
    draft.memory.date = "2025-12-30";
    expect(preparationSchema.parse(draft)).toEqual(draft);
    expect(hasPreparationContent(draft)).toBe(true);
  });
  it("rejects unknown versions and duplicate or unknown tasks", () => {
    const draft = newPreparation();
    for (const invalid of [
      { ...draft, version: 2 },
      { ...draft, checked: ["walk", "walk"] },
      { ...draft, checked: ["unknown"] },
      { ...draft, addedSecret: "unexpected" },
    ])
      expect(preparationSchema.safeParse(invalid).success).toBe(false);
  });
  it("rejects oversized family notes and external image references", () => {
    const draft = newPreparation();
    expect(
      preparationSchema.safeParse({
        ...draft,
        family: { ...draft.family, food: "x".repeat(101) },
      }).success,
    ).toBe(false);
    expect(
      preparationSchema.safeParse({
        ...draft,
        memory: {
          ...draft.memory,
          image: "https://example.invalid/private.jpg",
        },
      }).success,
    ).toBe(false);
  });
});
