import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DraftConflictError,
  loadAnnualDraft,
  saveAnnualDraft,
} from "./draftStorage";
import { makeDraftData } from "./draft";

const mock = vi.hoisted(() => ({
  auth: vi.fn(),
  from: vi.fn(),
  filters: [] as unknown[][],
  insert: vi.fn(),
  update: vi.fn(),
  response: { data: null as unknown, error: null as { code: string } | null },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: mock.auth },
    from: (table: string) => {
      mock.from(table);
      const chain = {
        select: () => chain,
        abortSignal: () => chain,
        eq: (...args: unknown[]) => {
          mock.filters.push(args);
          return chain;
        },
        insert: (value: unknown) => {
          mock.insert(value);
          return chain;
        },
        update: (value: unknown) => {
          mock.update(value);
          return chain;
        },
        single: async () => mock.response,
        maybeSingle: async () => mock.response,
      };
      return chain;
    },
  },
}));
const data = makeDraftData("Nuppu", "2026-04-01", "2027-03-31", true, []);
const row = {
  book_id: "book",
  owner_id: "owner",
  payload: data,
  revision: 1,
  updated_at: "2026-10-27T15:00:00Z",
};
beforeEach(() => {
  vi.clearAllMocks();
  mock.filters = [];
  mock.auth.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
  mock.response = { data: row, error: null };
});

describe("annual draft storage", () => {
  it("scopes reads and revision-checked updates to the current owner and book", async () => {
    await loadAnnualDraft("book", "owner", new AbortController().signal);
    expect(mock.filters).toEqual([
      ["book_id", "book"],
      ["owner_id", "owner"],
    ]);
    mock.filters = [];
    mock.response.data = { ...row, revision: 2 };
    await saveAnnualDraft("book", "owner", data, 1);
    expect(mock.filters).toEqual([
      ["book_id", "book"],
      ["owner_id", "owner"],
      ["revision", 1],
    ]);
    expect(mock.update).toHaveBeenCalledWith({ payload: data, revision: 2 });
  });
  it("creates the first revision without upsert and reports concurrent inserts or updates", async () => {
    await saveAnnualDraft("book", "owner", data, 0);
    expect(mock.insert).toHaveBeenCalledWith({
      book_id: "book",
      owner_id: "owner",
      payload: data,
      revision: 1,
    });
    mock.response = { data: null, error: { code: "23505" } };
    await expect(
      saveAnnualDraft("book", "owner", data, 0),
    ).rejects.toBeInstanceOf(DraftConflictError);
    mock.response = { data: null, error: null };
    await expect(
      saveAnnualDraft("book", "owner", data, 1),
    ).rejects.toBeInstanceOf(DraftConflictError);
  });
  it("stops before table access when the account changed", async () => {
    mock.auth.mockResolvedValue({
      data: { user: { id: "other" } },
      error: null,
    });
    await expect(saveAnnualDraft("book", "owner", data, 0)).rejects.toThrow(
      "Kirjaudu",
    );
    await expect(
      loadAnnualDraft("book", "owner", new AbortController().signal),
    ).rejects.toThrow("Kirjaudu");
    expect(mock.from).not.toHaveBeenCalled();
  });
  it("never treats malformed, differently owned or unavailable data as an empty draft", async () => {
    for (const changed of [
      { ...row, owner_id: "other" },
      { ...row, payload: { version: 2 } },
      { ...row, revision: 0 },
    ]) {
      mock.response.data = changed;
      await expect(
        loadAnnualDraft("book", "owner", new AbortController().signal),
      ).rejects.toThrow("ei voitu avata");
    }
    mock.response = { data: null, error: { code: "42P01" } };
    await expect(
      loadAnnualDraft("book", "owner", new AbortController().signal),
    ).rejects.toThrow("lataus epäonnistui");
    expect(mock.insert).not.toHaveBeenCalled();
  });
});
