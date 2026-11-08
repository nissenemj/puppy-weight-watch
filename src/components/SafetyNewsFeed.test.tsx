import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SafetyNewsFeed from "./SafetyNewsFeed";
import {
  fetchSafetyNews,
  SAFETY_SOURCES,
  type SafetySnapshot,
} from "@/services/rssFeedService";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const fresh = (): SafetySnapshot => ({
  items: [],
  checks: SAFETY_SOURCES.map((source) => ({
    source_id: source.id,
    status: "ok",
    last_success_at: new Date().toISOString(),
    last_attempt_at: new Date().toISOString(),
    error_code: null,
  })),
});
describe("safety monitoring status", () => {
  it("renders persisted PostgreSQL timestamps while rejecting invalid dates", async () => {
    const timestamp = new Date().toISOString().replace("Z", "+00:00");
    const data = fresh();
    data.checks = data.checks.map((check) => ({
      ...check,
      last_attempt_at: timestamp,
      last_success_at: timestamp,
    }));
    data.items = [
      {
        id: "persisted-notice",
        source_id: SAFETY_SOURCES[0].id,
        title: "Koiranruoan tarkistustiedote",
        url: "https://www.ruokavirasto.fi/elaimet/rehut/notice/",
        published_at: timestamp,
        kind: "notice",
        region: null,
      },
    ];
    const fetcher = vi.fn().mockImplementation(async () =>
      new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    render(<SafetyNewsFeed />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Lähteet tarkistettu",
      ),
    );
    expect(
      screen.getByRole("link", { name: /Koiranruoan tarkistustiedote/ }),
    ).toBeVisible();
    data.items[0].published_at = "2026-02-31T18:40:02+00:00";
    await expect(fetchSafetyNews()).rejects.toThrow();
  });
  it("distinguishes a failed fetch from a successful check with no notices", async () => {
    const load = vi.fn().mockRejectedValue(new Error("offline"));
    render(<SafetyNewsFeed loadSnapshot={load} />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "ei saatu tarkistettua",
    );
    expect(screen.queryByText(/ei löytynyt viimeisen/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Lemmikkieläinten ruoan turvallisuus" }),
    ).toBeVisible();
  });
  it("reports a successful empty result only when both official sources are current", async () => {
    render(
      <SafetyNewsFeed loadSnapshot={vi.fn().mockResolvedValue(fresh())} />,
    );
    expect(
      await screen.findByText(
        /Seuratuista julkaisuista ei löytynyt viimeisen 90 päivän/,
      ),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Lähteet tarkistettu");
  });
  it("retains known items through a failed refresh without calling them current", async () => {
    const data = fresh();
    data.items = [
      {
        id: "notice",
        source_id: SAFETY_SOURCES[0].id,
        title: "Koiranruoan tarkistustiedote",
        url: "https://www.ruokavirasto.fi/elaimet/rehut/notice/",
        published_at: new Date().toISOString(),
        kind: "notice",
        region: null,
      },
    ];
    const load = vi
      .fn()
      .mockResolvedValueOnce(data)
      .mockRejectedValueOnce(new Error("offline"));
    render(<SafetyNewsFeed loadSnapshot={load} />);
    await screen.findByRole("link", { name: /Koiranruoan tarkistustiedote/ });
    await userEvent.click(
      screen.getByRole("button", { name: "Päivitä näkymä" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("säilyy näkyvissä"),
    );
    expect(
      screen.getByRole("link", { name: /Koiranruoan tarkistustiedote/ }),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Päivitystä ei voitu tarkistaa",
    );
  });
  it("keeps undated or old recalls in an explicitly accessible archive", async () => {
    const data = fresh();
    data.items = [
      {
        id: "notice",
        source_id: SAFETY_SOURCES[0].id,
        title: "Puruluiden takaisinveto",
        url: "https://www.ruokavirasto.fi/elaimet/rehut/notice/",
        published_at: null,
        kind: "recall",
        region: null,
      },
    ];
    render(<SafetyNewsFeed loadSnapshot={vi.fn().mockResolvedValue(data)} />);
    await userEvent.click(
      await screen.findByRole("button", { name: /Näytä myös aiemmat/ }),
    );
    expect(
      screen.getByRole("link", { name: /Puruluiden takaisinveto/ }),
    ).toBeVisible();
    expect(screen.getByText(/Julkaisupäivä ei ole saatavilla/)).toBeVisible();
  });
});
