import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadBookSources,
  makeDraftMemories,
  type SourceMemory,
} from "./sources";

const mock = vi.hoisted(() => ({
  auth: vi.fn(),
  responses: {} as Record<string, { data: unknown; error: unknown }>,
  filters: [] as string[],
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: mock.auth },
    from: (table: string) => {
      const chain = {
        select: () => chain,
        order: () => chain,
        limit: () => chain,
        abortSignal: () => chain,
        eq: (key: string, value: string) => {
          mock.filters.push(`${table}.${key}=${value}`);
          return chain;
        },
        in: () => chain,
        single: () => Promise.resolve(mock.responses[table]),
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(mock.responses[table]).then(resolve),
      };
      return chain;
    },
  },
}));

const memory: SourceMemory = {
  id: "one",
  caption: "Kotiin",
  content_type: "text",
  content_url: null,
  created_at: "2026-10-27T00:00:00Z",
  timeline_entry_id: "event",
  tags: ["Kommellus"],
};
beforeEach(() => {
  mock.filters.length = 0;
  mock.auth.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
  mock.responses = {
    puppy_books: { data: { owner_id: "owner", dog_id: "dog" }, error: null },
    memories: { data: [memory], error: null },
    timeline_entries: {
      data: [{ id: "event", entry_date: "2026-06-03" }],
      error: null,
    },
    weight_entries: {
      data: [{ date: "2026-06-03", weight: 4.2 }],
      error: null,
    },
  };
});

describe("book source ownership and event dates", () => {
  it("never substitutes upload time for an unknown event date", () => {
    const [draft] = makeDraftMemories([memory], new Map());
    expect(draft.date).toBe("");
    expect(draft.included).toBe(false);
    expect(draft.mishap).toBe(true);
    expect(
      makeDraftMemories([memory], new Map([["event", "2026-02-30"]]))[0].date,
    ).toBe("");
  });
  it("scopes reads to the owner, selected book and its linked dog", async () => {
    const result = await loadBookSources(
      "book",
      "owner",
      new AbortController().signal,
    );
    expect(mock.filters).toEqual(
      expect.arrayContaining([
        "puppy_books.owner_id=owner",
        "puppy_books.id=book",
        "memories.book_id=book",
        "timeline_entries.book_id=book",
        "weight_entries.dog_id=dog",
        "weight_entries.user_id=owner",
      ]),
    );
    expect(result.memories[0].date).toBe("2026-06-03");
    expect(result.weights).toEqual([{ date: "2026-06-03", kg: 4.2 }]);
  });
  it("stops before reading memories when the signed-in user or owner differs", async () => {
    mock.auth.mockResolvedValueOnce({
      data: { user: { id: "another" } },
      error: null,
    });
    await expect(
      loadBookSources("book", "owner", new AbortController().signal),
    ).rejects.toThrow("Kirjaudu");
    expect(mock.filters).toEqual([]);
    mock.responses.puppy_books.data = { owner_id: "another", dog_id: "dog" };
    await expect(
      loadBookSources("book", "owner", new AbortController().signal),
    ).rejects.toThrow("käyttöoikeutta");
    expect(mock.filters.some((filter) => filter.startsWith("memories."))).toBe(
      false,
    );
  });
  it("does not attach the owner's other dogs' weights when the book has no dog", async () => {
    mock.responses.puppy_books.data = { owner_id: "owner", dog_id: null };
    const result = await loadBookSources(
      "book",
      "owner",
      new AbortController().signal,
    );
    expect(result.weights).toEqual([]);
    expect(
      mock.filters.some((filter) => filter.startsWith("weight_entries.")),
    ).toBe(false);
  });
});
