import { describe, expect, it } from "vitest";
import {
  draftDataSchema,
  draftSignature,
  makeDraftData,
  restoreDraftMemories,
} from "./draft";
import { makeDraftMemories, type SourceMemory } from "./sources";

const id = "44444444-4444-4444-8444-444444444441";
const source: SourceMemory = {
  id,
  caption: "Yksityinen teksti",
  content_type: "image",
  content_url: "private/signed?token=secret",
  created_at: "2026-10-27T00:00:00Z",
  timeline_entry_id: null,
  tags: [],
};
const memories = makeDraftMemories([source], new Map());
const data = makeDraftData(
  "Nuppu",
  "2026-04-01",
  "2027-03-31",
  false,
  memories,
);

describe("persistent annual book draft", () => {
  it("stores only choices and event dates, without copying private source data", () => {
    expect(data.memories).toEqual([
      { id, date: "", included: false, mishap: false },
    ]);
    expect(JSON.stringify(data)).not.toMatch(
      /secret|Yksityinen|2026-10-27|content_url|created_at/,
    );
    expect(draftDataSchema.safeParse(data).success).toBe(true);
  });
  it("preserves a confirmed or deliberately cleared date even for an unselected memory", () => {
    const saved = {
      ...data,
      memories: [{ id, date: "2026-06-03", included: false, mishap: true }],
    };
    expect(restoreDraftMemories(memories, saved).memories[0]).toMatchObject(
      saved.memories[0],
    );
    const linked = [{ ...memories[0], date: "2026-07-01" }];
    expect(restoreDraftMemories(linked, data).memories[0].date).toBe("");
  });
  it("allows incomplete fields without confusing them with a valid printable book", () => {
    expect(
      draftDataSchema.safeParse({
        ...data,
        puppyName: "",
        start: "",
        end: "2026-01-01",
      }).success,
    ).toBe(true);
    expect(
      draftDataSchema.safeParse({ ...data, start: "2026-02-30" }).success,
    ).toBe(false);
    expect(draftDataSchema.safeParse({ ...data, version: 3 }).success).toBe(
      false,
    );
    expect(
      draftDataSchema.safeParse({ ...data, caption: "not allowed" }).success,
    ).toBe(false);
    expect(
      draftDataSchema.safeParse({
        ...data,
        memories: [...data.memories, ...data.memories],
      }).success,
    ).toBe(false);
  });
  it("opens old drafts with a default design and round-trips new cover choices and the private letter", () => {
    const { design: _design, ...fields } = data;
    const old = { ...fields, version: 1 };
    const restored = draftDataSchema.parse(old);
    expect(restored.version).toBe(2);
    expect(restored.memories).toEqual(data.memories);
    const custom = {
      ...restored,
      design: {
        title: "Nupun seikkailu",
        palette: "lake" as const,
        coverArt: "illustration" as const,
        letter: "Pieni ystäväni…",
      },
    };
    expect(draftDataSchema.parse(custom)).toEqual(custom);
    expect(
      draftDataSchema.safeParse({
        ...custom,
        design: { ...custom.design, imageUrl: "external" },
      }).success,
    ).toBe(false);
    expect(
      draftDataSchema.safeParse({
        ...custom,
        design: { ...custom.design, letter: "a".repeat(1201) },
      }).success,
    ).toBe(false);
  });
  it("reconciles removed and new source memories by ID while retaining current captions", () => {
    const saved = {
      ...data,
      memories: [
        {
          id: "44444444-4444-4444-8444-444444444442",
          date: "2026-06-03",
          included: true,
          mishap: false,
        },
        ...data.memories,
      ],
    };
    const restored = restoreDraftMemories(memories, saved);
    expect(restored.missing).toBe(1);
    expect(restored.memories).toHaveLength(1);
    expect(restored.memories[0].caption).toBe(source.caption);
    expect(
      draftSignature({ ...saved, memories: [...saved.memories].reverse() }),
    ).toBe(draftSignature(saved));
  });
});
