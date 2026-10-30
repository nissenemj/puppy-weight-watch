import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDraftAutosave, AUTOSAVE_DELAY } from "./useDraftAutosave";
import {
  makeDraftData,
  type DraftData,
  type DraftSeed,
  type SavedDraft,
} from "./draft";

const mock = vi.hoisted(() => ({
  save: vi.fn(),
  Conflict: class extends Error {},
}));
vi.mock("./draftStorage", () => ({
  saveAnnualDraft: mock.save,
  DraftConflictError: mock.Conflict,
}));
const data = makeDraftData("Nuppu", "2026-04-01", "2027-03-31", true, []);
const seed: DraftSeed = { data, revision: 0, updatedAt: null };
const changed = { ...data, puppyName: "Nuppu uusi" };
function deferred() {
  let resolve!: (value: SavedDraft) => void;
  const promise = new Promise<SavedDraft>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
async function tick() {
  await act(async () => {
    vi.advanceTimersByTime(AUTOSAVE_DELAY);
  });
}
function renderDraft() {
  return renderHook(
    ({
      current,
      bookId = "book",
      initial = seed,
    }: {
      current: DraftData;
      bookId?: string;
      initial?: DraftSeed;
    }) => useDraftAutosave(bookId, "owner", current, initial),
    { initialProps: { current: data } },
  );
}
beforeEach(() => {
  vi.useFakeTimers();
  mock.save.mockReset();
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
  mock.save.mockImplementation(
    async (
      _book: string,
      _user: string,
      sent: DraftData,
      revision: number,
    ) => ({
      data: sent,
      revision: revision + 1,
      updatedAt: "2026-10-27T15:00:00Z",
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("annual draft autosave", () => {
  it("does not create a draft on a read-only visit and debounces successive edits", async () => {
    const hook = renderDraft();
    await tick();
    expect(mock.save).not.toHaveBeenCalled();
    hook.rerender({ current: { ...data, puppyName: "N" } });
    hook.rerender({ current: changed });
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
    await tick();
    expect(mock.save).toHaveBeenCalledTimes(1);
    expect(mock.save).toHaveBeenLastCalledWith("book", "owner", changed, 0);
    expect(hook.result.current.phase).toBe("saved");
    expect(hook.result.current.hasUnsavedChanges).toBe(false);
  });
  it("serializes writes and saves the latest edit after a delayed response", async () => {
    const pending = deferred();
    mock.save.mockReturnValueOnce(pending.promise);
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    const newest = { ...data, puppyName: "Viimeisin nimi" };
    hook.rerender({ current: newest });
    await tick();
    expect(mock.save).toHaveBeenCalledTimes(1);
    await act(async () =>
      pending.resolve({
        data: changed,
        revision: 1,
        updatedAt: "2026-10-27T15:00:00Z",
      }),
    );
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
    await tick();
    expect(mock.save).toHaveBeenLastCalledWith("book", "owner", newest, 1);
    expect(hook.result.current.hasUnsavedChanges).toBe(false);
  });
  it("keeps the leave guard when edits are reverted during an in-flight write", async () => {
    const pending = deferred();
    mock.save.mockReturnValueOnce(pending.promise);
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    hook.rerender({ current: data });
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
    await act(async () =>
      pending.resolve({
        data: changed,
        revision: 1,
        updatedAt: "2026-10-27T15:00:00Z",
      }),
    );
    await tick();
    expect(mock.save).toHaveBeenLastCalledWith("book", "owner", data, 1);
    expect(hook.result.current.hasUnsavedChanges).toBe(false);
  });
  it("retains unsaved changes on failure and retries the current choices", async () => {
    mock.save.mockRejectedValueOnce(new Error("Ei yhteyttä"));
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    expect(hook.result.current.phase).toBe("error");
    const newest = { ...data, includeWeights: false };
    hook.rerender({ current: newest });
    await tick();
    expect(mock.save).toHaveBeenCalledTimes(1);
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
    await act(async () => hook.result.current.retry());
    expect(mock.save).toHaveBeenLastCalledWith("book", "owner", newest, 0);
    expect(hook.result.current.hasUnsavedChanges).toBe(false);
  });
  it("does not retry a conflicting revision automatically", async () => {
    mock.save.mockRejectedValueOnce(new mock.Conflict("Uudempi versio"));
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    expect(hook.result.current.phase).toBe("conflict");
    hook.rerender({ current: { ...changed, includeWeights: false } });
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    await tick();
    expect(mock.save).toHaveBeenCalledTimes(1);
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
  });

  it("does not mark reverted values saved after an uncertain network failure", async () => {
    mock.save.mockRejectedValueOnce(new Error("Vastaus katkesi"));
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    hook.rerender({ current: data });
    expect(hook.result.current.hasUnsavedChanges).toBe(true);
    await act(async () => hook.result.current.retry());
    expect(mock.save).toHaveBeenLastCalledWith("book", "owner", data, 0);
    expect(hook.result.current.hasUnsavedChanges).toBe(false);
  });
  it("waits offline and resumes after the browser reports a connection", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const hook = renderDraft();
    hook.rerender({ current: changed });
    await tick();
    expect(hook.result.current.phase).toBe("offline");
    expect(mock.save).not.toHaveBeenCalled();
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    expect(hook.result.current.phase).toBe("saved");
  });
  it("cancels queued work and isolates a late save from another book", async () => {
    const pending = deferred();
    mock.save.mockReturnValueOnce(pending.promise);
    const first = renderDraft();
    first.rerender({ current: changed });
    await tick();
    first.rerender({ current: { ...changed, puppyName: "Ei saa tallentua" } });
    first.unmount();
    const secondSeed: DraftSeed = {
      data: { ...data, puppyName: "Toinen pentu" },
      revision: 4,
      updatedAt: "2026-10-27T14:00:00Z",
    };
    const second = renderHook(() =>
      useDraftAutosave(
        "other-book",
        "other-owner",
        secondSeed.data,
        secondSeed,
      ),
    );
    await act(async () =>
      pending.resolve({
        data: changed,
        revision: 1,
        updatedAt: "2026-10-27T15:00:00Z",
      }),
    );
    await tick();
    expect(mock.save).toHaveBeenCalledTimes(1);
    expect(second.result.current.hasUnsavedChanges).toBe(false);
    expect(second.result.current.updatedAt).toBe(secondSeed.updatedAt);
  });
});
