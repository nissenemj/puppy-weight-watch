import { z } from "zod";
import {
  newScrapbookPage,
  scrapbookPageSchema,
} from "../annual-book/scrapbook";

export const PREPARATION_TASKS = [
  "walk",
  "bowls",
  "rest",
  "food",
  "play",
  "care",
  "clean",
  "home",
  "home-floor",
  "home-storage",
  "home-access",
  "home-rest",
] as const;

export const HOME_CHECKS = [
  {
    id: "home-floor",
    title: "Lattiat ja pienet tavarat",
    detail:
      "Käy huoneet läpi pennun korkeudelta. Siirrä johdot, sukat ja pienet lelut pois pennun ulottuvilta.",
  },
  {
    id: "home-storage",
    title: "Kaapit ja tasot",
    detail:
      "Aikuinen tarkistaa lääkkeiden, pesuaineiden ja muiden pennulle sopimattomien tavaroiden säilytyksen. Varmista, ettei pentu pääse niihin käsiksi.",
  },
  {
    id: "home-access",
    title: "Kulku ja rajat",
    detail:
      "Tarkista ovet, portaat ja mahdollinen parveke tai piha. Sopikaa, missä pentu saa liikkua ja miten kulkua rajataan.",
  },
  {
    id: "home-rest",
    title: "Rauhallinen oma paikka",
    detail:
      "Valmistele lepopaikka. Sopikaa perheen kanssa, että pentu saa levätä siinä rauhassa.",
  },
] as const;

export const FAMILY_ROLES = [
  {
    key: "atHome",
    label: "Pennun kanssa aluksi kotona",
    placeholder: "Kuka on pennun seurana…",
  },
  {
    key: "food",
    label: "Ruokinnasta huolehtii",
    placeholder: "Nimi tai teidän oma sopimuksenne…",
  },
  {
    key: "outdoors",
    label: "Ulkoiluista huolehtii",
    placeholder: "Miten jaatte ulkoilut…",
  },
] as const;

export const preparationSchema = z
  .object({
    version: z.literal(1),
    checked: z
      .array(z.enum(PREPARATION_TASKS))
      .max(PREPARATION_TASKS.length)
      .refine((values) => new Set(values).size === values.length),
    family: z
      .object({
        atHome: z.string().max(100),
        food: z.string().max(100),
        outdoors: z.string().max(100),
      })
      .strict(),
    memory: scrapbookPageSchema,
  })
  .strict();
export type PreparationDraft = z.infer<typeof preparationSchema>;
export type PreparationTask = (typeof PREPARATION_TASKS)[number];

export function newPreparation(): PreparationDraft {
  return {
    version: 1,
    checked: [],
    family: { atHome: "", food: "", outdoors: "" },
    memory: {
      ...newScrapbookPage("poster"),
      topic: "home",
      title: "Täällä sinua odotettiin",
      sticker: "heart",
    },
  };
}

export function hasPreparationContent(draft: PreparationDraft) {
  return Boolean(
    draft.checked.length ||
      Object.values(draft.family).some(Boolean) ||
      draft.memory.image ||
      draft.memory.caption ||
      draft.memory.date ||
      draft.memory.imageDescription,
  );
}
