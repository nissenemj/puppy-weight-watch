import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { URL as NodeURL } from "node:url";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(
  new NodeURL("../../public/sw.js", import.meta.url),
  "utf8",
);
const response = (body: string) => ({
  ok: true,
  body,
  clone() {
    return response(body);
  },
});
function worker(
  cached: ReturnType<typeof response>,
  fetch: ReturnType<typeof vi.fn>,
) {
  const store = {
    match: vi.fn(async () => cached),
    put: vi.fn(async () => {}),
  };
  const context = {
    self: { addEventListener: vi.fn() },
    caches: {
      match: vi.fn(async () => cached),
      open: vi.fn(async () => store),
    },
    fetch,
    URL,
    console: { log: vi.fn() },
    handleFetch: undefined as unknown as (request: {
      url: string;
      mode: string;
    }) => Promise<ReturnType<typeof response>>,
  };
  runInNewContext(source, context);
  return { handle: context.handleFetch, store, fetch };
}
describe("service worker document freshness", () => {
  it("serves and caches fresh HTML online even when the previous release is cached", async () => {
    const old = response('<script src="old-release.js"></script>');
    const fresh = response('<script src="new-release.js"></script>');
    const environment = worker(
      old,
      vi.fn(async () => fresh),
    );
    const request = {
      url: "https://example.invalid/puppy-book-landing",
      mode: "navigate",
    };
    expect(await environment.handle(request)).toBe(fresh);
    expect(environment.fetch).toHaveBeenCalledWith(request);
    expect(environment.store.put).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ body: fresh.body }),
    );
  });
  it("uses the cached document when the network is unavailable", async () => {
    const old = response("offline document");
    const environment = worker(
      old,
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    expect(
      await environment.handle({
        url: "https://example.invalid/calculator",
        mode: "navigate",
      }),
    ).toBe(old);
    expect(environment.store.put).not.toHaveBeenCalled();
  });
  it("retains the cache-first strategy for immutable versioned assets", async () => {
    const cached = response("cached module");
    const environment = worker(cached, vi.fn());
    expect(
      await environment.handle({
        url: "https://example.invalid/assets/index-abc123.js",
        mode: "cors",
      }),
    ).toBe(cached);
    expect(environment.fetch).not.toHaveBeenCalled();
  });
});
