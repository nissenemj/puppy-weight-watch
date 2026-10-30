import { z } from "zod";
import {
  bookDesignSchema,
  DEFAULT_BOOK_DESIGN,
  day,
  type BookDesign,
} from "./model";
import type { DraftMemory } from "./sources";

// An unfinished form is a valid draft. Export validation remains stricter.
const draftDay = z.union([day, z.literal("")]);
const draftFields = {
  puppyName: z.string().max(40),
  start: draftDay,
  end: draftDay,
  includeWeights: z.boolean(),
  memories: z
    .array(
      z
        .object({
          id: z.string().uuid(),
          date: draftDay,
          included: z.boolean(),
          mishap: z.boolean(),
        })
        .strict(),
    )
    .max(200),
};
export const draftDataSchema = z
  .discriminatedUnion("version", [
    z.object({ version: z.literal(1), ...draftFields }).strict(),
    z
      .object({
        version: z.literal(2),
        ...draftFields,
        design: bookDesignSchema,
      })
      .strict(),
  ])
  .transform((value) => ({
    ...value,
    version: 2 as const,
    design: "design" in value ? value.design : { ...DEFAULT_BOOK_DESIGN },
  }))
  .refine(
    (value) =>
      new Set(value.memories.map((m) => m.id)).size === value.memories.length,
  )
  .refine((value) => value.memories.filter((m) => m.included).length <= 24);

export type DraftData = z.infer<typeof draftDataSchema>;
export type SavedDraft = {
  data: DraftData;
  revision: number;
  updatedAt: string;
};
export type DraftSeed = {
  data: DraftData;
  revision: number;
  updatedAt: string | null;
};

export function makeDraftData(
  puppyName: string,
  start: string,
  end: string,
  includeWeights: boolean,
  memories: DraftMemory[],
  design: BookDesign = DEFAULT_BOOK_DESIGN,
): DraftData {
  return {
    version: 2,
    puppyName,
    start,
    end,
    includeWeights,
    design: { ...design },
    // Store references and choices, never captions, images or signed URLs.
    memories: memories.map(({ id, date, included, mishap }) => ({
      id,
      date,
      included,
      mishap,
    })),
  };
}

export function draftSignature(data: DraftData): string {
  return JSON.stringify({
    version: data.version,
    puppyName: data.puppyName,
    start: data.start,
    end: data.end,
    includeWeights: data.includeWeights,
    design: {
      title: data.design.title,
      palette: data.design.palette,
      coverArt: data.design.coverArt,
      letter: data.design.letter,
    },
    memories: [...data.memories].sort((a, b) => a.id.localeCompare(b.id)),
  });
}

export function restoreDraftMemories(memories: DraftMemory[], data: DraftData) {
  const saved = new Map(data.memories.map((memory) => [memory.id, memory]));
  const available = new Set(memories.map((memory) => memory.id));
  return {
    memories: memories.map((memory) => ({
      ...memory,
      ...saved.get(memory.id),
    })),
    missing: data.memories.filter((memory) => !available.has(memory.id)).length,
  };
}
