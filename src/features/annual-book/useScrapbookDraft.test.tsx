import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newScrapbookDraft } from "./scrapbook";
import { useScrapbookDraft } from "./useScrapbookDraft";

const mock = vi.hoisted(() => ({
  read: vi.fn(),
  write: vi.fn(),
  Conflict: class extends Error {},
}));
vi.mock("./scrapbookStorage", () => ({
  readScrapbook: mock.read,
  writeScrapbook: mock.write,
  ScrapbookConflict: mock.Conflict,
}));
beforeEach(() => {
  vi.useFakeTimers();
  mock.read.mockReset().mockResolvedValue(null);
  mock.write
    .mockReset()
    .mockImplementation(async (_draft, revision: number) => revision + 1);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
async function start() {
  const hook = renderHook(() => useScrapbookDraft());
  await act(async () => {});
  expect(hook.result.current.mode).toBe("ready");
  return hook;
}
async function tick() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
}
function pending() {
  let resolve!: (revision: number) => void;
  const promise = new Promise<number>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("browser scrapbook autosave", () => {
  it("does not write a read-only visit, debounces typing and undoes a whole text edit", async () => {
    const hook = await start();
    await tick();
    expect(mock.write).not.toHaveBeenCalled();
    act(() =>
      hook.result.current.change(
        (draft) => ({ ...draft, puppyName: "S" }),
        "name",
      ),
    );
    act(() =>
      hook.result.current.change(
        (draft) => ({ ...draft, puppyName: "Sisu" }),
        "name",
      ),
    );
    await tick();
    expect(mock.write).toHaveBeenCalledTimes(1);
    expect(hook.result.current.isSaved).toBe(true);
    act(() => hook.result.current.undo());
    expect(hook.result.current.document.puppyName).toBe("Nuppu");
    await tick();
    expect(mock.write).toHaveBeenLastCalledWith(
      expect.objectContaining({ puppyName: "Nuppu" }),
      1,
    );
  });
  it("keeps the leave guard while an older edit is in flight and saves a later undo", async () => {
    const slow = pending();
    mock.write.mockReturnValueOnce(slow.promise);
    const hook = await start();
    const original = hook.result.current.document;
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Uusi nimi",
      })),
    );
    await tick();
    act(() => hook.result.current.undo());
    expect(hook.result.current.document).toBe(original);
    expect(hook.result.current.isSaved).toBe(false);
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await act(async () => slow.resolve(1));
    await tick();
    expect(mock.write).toHaveBeenCalledTimes(2);
    expect(mock.write).toHaveBeenLastCalledWith(original, 1);
    expect(hook.result.current.isSaved).toBe(true);
  });
  it("finishes the latest edit on unmount even if the author reverted a pending save", async () => {
    const slow = pending();
    mock.write.mockReturnValueOnce(slow.promise);
    const hook = await start();
    const original = hook.result.current.document;
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Kesken",
      })),
    );
    await tick();
    act(() => hook.result.current.undo());
    hook.unmount();
    await act(async () => slow.resolve(1));
    await act(async () => {});
    expect(mock.write).toHaveBeenLastCalledWith(original, 1);
  });
  it("never overwrites an unreadable saved draft and requires an explicit temporary session", async () => {
    mock.read.mockRejectedValueOnce(new Error("Luonnosta ei voitu lukea."));
    const hook = renderHook(() => useScrapbookDraft());
    await act(async () => {});
    expect(hook.result.current.mode).toBe("blocked");
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Ei ylikirjoitusta",
      })),
    );
    await tick();
    expect(mock.write).not.toHaveBeenCalled();
    act(() => hook.result.current.continueWithoutSaving());
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Kertakokeilu",
      })),
    );
    await tick();
    expect(hook.result.current.document.puppyName).toBe("Kertakokeilu");
    expect(mock.write).not.toHaveBeenCalled();
  });
  it("retains local edits after a write failure and retries with the last acknowledged revision", async () => {
    mock.write.mockRejectedValueOnce(new Error("Tallennustila täynnä."));
    const hook = await start();
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Säilyvä nimi",
      })),
    );
    await tick();
    expect(hook.result.current.error).toContain("täynnä");
    expect(hook.result.current.document.puppyName).toBe("Säilyvä nimi");
    expect(hook.result.current.isSaved).toBe(false);
    await act(async () => hook.result.current.retry());
    expect(mock.write).toHaveBeenLastCalledWith(
      expect.objectContaining({ puppyName: "Säilyvä nimi" }),
      0,
    );
    expect(hook.result.current.isSaved).toBe(true);
    expect(hook.result.current.error).toBe("");
  });
  it("stops writes on a tab conflict until the author loads the newer draft", async () => {
    mock.write.mockRejectedValueOnce(
      new mock.Conflict("Toinen välilehti tallensi."),
    );
    const hook = await start();
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Tämä välilehti",
      })),
    );
    await tick();
    expect(hook.result.current.hasConflict).toBe(true);
    act(() =>
      hook.result.current.change((draft) => ({
        ...draft,
        puppyName: "Lisää muokkausta",
      })),
    );
    await tick();
    expect(mock.write).toHaveBeenCalledTimes(1);
    mock.read.mockResolvedValueOnce({
      revision: 9,
      draft: { ...newScrapbookDraft(), puppyName: "Toisen välilehden nimi" },
    });
    await act(async () => hook.result.current.reload());
    expect(hook.result.current.document.puppyName).toBe(
      "Toisen välilehden nimi",
    );
    expect(hook.result.current.hasConflict).toBe(false);
  });
});
