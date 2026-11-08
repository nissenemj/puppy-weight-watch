// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  SAFETY_SOURCES,
  type SourceCheck,
} from "../../supabase/functions/_shared/safetySources";
import {
  classifyOfficialTitle,
  fetchOfficialPage,
  parseOfficialPage,
  sourceDate,
} from "../../supabase/functions/_shared/safetyParser";
import { refreshSafety } from "../../supabase/functions/_shared/safetyRefresh";
import { createSafetyHandler } from "../../supabase/functions/_shared/safetyHandler";

const now = new Date("2026-11-08T10:00:00Z");
const card = (
  title: string,
  description = "",
  date = "8. marraskuuta 2026",
  href = "/elaimet/rehut/testitiedote/",
) =>
  `<div class="content-list-block__card-item"><p class="content-list-block__date">${date}</p><h3 class="content-list-block__title">${title}</h3><p>${description}</p><a class="content-list-block__card-item-link" href="${href}">${title}</a></div>`;
const html = (content: string) =>
  `<html><body><main>${content}</main></body></html>`;
const response = (content: string) =>
  new Response(content, {
    headers: { "Content-Type": "text/html", ETag: "v2" },
  });

describe("official safety source parsing", () => {
  it("requires dog context, preserves missing dates and never infers a critical hazard", () => {
    const items = parseOfficialPage(
      html(
        card("Koiranruoan takaisinveto", "Tarkista erä alkuperäissivulta", "") +
          card(
            "Maidon allergeenivaroitus",
            "Ihmisravinto",
            "8. marraskuuta 2026",
            "/elaimet/rehut/maito/",
          ) +
          card(
            "Lintuinfluenssan tautitilanne",
            "Siipikarjaa koskeva ohje",
            "8. marraskuuta 2026",
            "/elaimet/linnut/",
          ),
      ),
      SAFETY_SOURCES[0],
      now,
    );
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      title: "Koiranruoan takaisinveto",
      kind: "recall",
      published_at: null,
      region: null,
    });
    expect(classifyOfficialTitle("Koiranomistajan uusi suositus")).toBe(
      "notice",
    );
    expect(classifyOfficialTitle("Ruokavirasto varoittaa puruluista")).toBe(
      "warning",
    );
  });
  it("supports the animal page's separate list layout and deduplicates canonical URLs", () => {
    const a = card("Koirien terveystiedote")
      .replaceAll(
        "content-list-block__card-item",
        "content-list-block__list-item",
      )
      .replaceAll(
        "content-list-block__list-item-link",
        "content-list-block__link",
      );
    const items = parseOfficialPage(
      html(
        a +
          card(
            "Koirien terveystiedote",
            "",
            "8. marraskuuta 2026",
            "/elaimet/rehut/testitiedote/?utm_source=feed#main",
          ),
      ),
      SAFETY_SOURCES[1],
      now,
    );
    expect(items).toHaveLength(1);
    expect(items[0].published_at).toBe("2026-11-08T00:00:00.000Z");
  });
  it("rejects changed layouts and unsafe destinations instead of reporting an empty successful feed", () => {
    expect(() =>
      parseOfficialPage(
        "<html><main>Blocked by upstream</main></html>",
        SAFETY_SOURCES[0],
        now,
      ),
    ).toThrow("source_layout_changed");
    expect(() =>
      parseOfficialPage(
        html(card("Koiravaroitus", "", "", "https://evil.example/dog")),
        SAFETY_SOURCES[0],
        now,
      ),
    ).toThrow("source_layout_changed");
  });
  it("does not invent a publication date from a fetch date or an invalid calendar date", () => {
    for (const value of [
      "",
      "31. helmikuuta 2026",
      "9. marraskuuta 2026",
      "uutinen",
    ])
      expect(sourceDate(value, now)).toBeNull();
    expect(sourceDate("16. tammikuuta 2025", now)).toBe(
      "2025-01-16T00:00:00.000Z",
    );
  });
  it("rejects a cross-origin redirect before contacting its destination", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(null, {
          status: 302,
          headers: { Location: "http://127.0.0.1/private" },
        }),
      );
    await expect(
      fetchOfficialPage(SAFETY_SOURCES[0], {}, fetcher),
    ).rejects.toThrow("source_redirect_rejected");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("enforces the response size limit", async () => {
    await expect(
      fetchOfficialPage(
        SAFETY_SOURCES[0],
        {},
        vi
          .fn()
          .mockResolvedValue(
            new Response("too large", {
              headers: {
                "Content-Type": "text/html",
                "Content-Length": "1048577",
              },
            }),
          ),
      ),
    ).rejects.toThrow("source_too_large");
  });
});

describe("scheduled monitoring", () => {
  it("keeps last success through a partial outage and updates the healthy source independently", async () => {
    const old: SourceCheck = {
      source_id: SAFETY_SOURCES[0].id,
      last_attempt_at: "2026-11-08T09:00:00Z",
      last_success_at: "2026-11-08T09:00:00Z",
      status: "ok",
      error_code: null,
    };
    const save = vi.fn();
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(
        response(html(card("Koirien uusi terveystiedote"))),
      );
    const result = await refreshSafety(
      { checks: async () => [old], save },
      now,
      fetcher,
    );
    expect(result.map((item) => item.status)).toEqual(["error", "ok"]);
    expect(save.mock.calls.find((args) => args[0] === old.source_id)).toEqual([
      old.source_id,
      null,
      expect.objectContaining({
        status: "error",
        last_success_at: old.last_success_at,
      }),
    ]);
    expect(
      save.mock.calls.find((args) => args[0] !== old.source_id)?.[1],
    ).toHaveLength(1);
  });
  it("honours source intervals and preserves etags through a valid 304", async () => {
    const old = SAFETY_SOURCES.map((source) => ({
      source_id: source.id,
      last_attempt_at: "2026-11-08T09:50:00Z",
      last_success_at: "2026-11-08T09:50:00Z",
      status: "ok" as const,
      error_code: null,
      etag: "v1",
    }));
    const save = vi.fn(),
      fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 304 }));
    await refreshSafety({ checks: async () => old, save }, now, fetcher);
    expect(fetcher).not.toHaveBeenCalled();
    await refreshSafety(
      { checks: async () => old, save },
      new Date("2026-11-08T10:30:00Z"),
      fetcher,
    );
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(
      new Headers(fetcher.mock.calls[0][1].headers).get("If-None-Match"),
    ).toBe("v1");
    expect(save.mock.calls[0][1]).toBeNull();
    expect(save.mock.calls[0][2]).toMatchObject({
      status: "ok",
      etag: "v1",
      last_success_at: "2026-11-08T10:30:00.000Z",
    });
  });
  it("allows public reads but refuses an unauthenticated upstream refresh", async () => {
    const repository = {
      snapshot: async () => ({ items: [], checks: [] }),
      checks: async () => [],
      save: vi.fn(),
      claimRefresh: vi.fn().mockResolvedValue(true),
    };
    const fetcher = vi.fn();
    const handler = createSafetyHandler(repository, "x".repeat(32), fetcher);
    expect(
      (await handler(new Request("https://app.example/safety-news"))).status,
    ).toBe(200);
    expect(
      (
        await handler(
          new Request("https://app.example/safety-news", { method: "POST" }),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await handler(
          new Request("https://app.example/safety-news", { method: "OPTIONS" }),
        )
      ).status,
    ).toBe(204);
    expect(repository.claimRefresh).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
