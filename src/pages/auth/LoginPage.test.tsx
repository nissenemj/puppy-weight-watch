import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import "@testing-library/jest-dom";

import LoginPage from "./LoginPage";
import { supabase } from "@/integrations/supabase/client";
import {
  AUTH_PROVIDER_CHECK_FAILED,
  getEnabledAuthProviders,
} from "@/services/authProviderService";

vi.mock("@/integrations/supabase/client", () => {
  const auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
  };
  return {
    supabase: { auth },
    SUPABASE_URL: "https://auth-test.example.invalid",
    SUPABASE_PUBLISHABLE_KEY: "public-test-key",
  };
});

const fetchSettings = vi.fn();
const settings = (google = false) => ({
  ok: true,
  json: async () => ({ external: { google, apple: false, email: true } }),
});

beforeEach(() => {
  vi.clearAllMocks();
  fetchSettings.mockReset().mockImplementation(async () => settings());
  vi.stubGlobal("fetch", fetchSettings);
  vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
    data: { provider: "google", url: "https://accounts.example.invalid" },
    error: null,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("keeps email login available when Google is disabled", async () => {
  render(<LoginPage />);
  await screen.findByText(
    "Google-kirjautuminen ei ole käytössä. Kirjaudu sähköpostilla.",
  );
  const [emailInput] = screen.getAllByRole("textbox");
  expect(emailInput).toBeEnabled();
  expect(
    screen.getByRole("button", { name: "Kirjaudu" }),
  ).toBeEnabled();
  expect(
    screen.queryByRole("button", { name: /google/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText("Kirjautuminen Google-tilillä", { exact: false }),
  ).not.toBeInTheDocument();
  expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
});

test("validates email format", async () => {
  render(<LoginPage />);
  const [emailInput] = screen.getAllByRole("textbox");
  await userEvent.type(emailInput, "not-an-email");
  await userEvent.click(screen.getByRole("button", { name: /kirjaudu/i }));
  expect(await screen.findByText(/kelvollinen/i)).toBeInTheDocument();
});

test("starts Google OAuth only after verifying that the provider is enabled", async () => {
  fetchSettings.mockImplementation(async () => settings(true));
  render(<LoginPage />);
  await userEvent.click(
    await screen.findByRole("button", { name: "Jatka Google-tilillä" }),
  );

  expect(fetchSettings).toHaveBeenCalledTimes(2);
  expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
});

test("does not redirect when Google is disabled after the page was opened", async () => {
  fetchSettings.mockImplementationOnce(async () => settings(true));
  render(<LoginPage />);
  await userEvent.click(
    await screen.findByRole("button", { name: "Jatka Google-tilillä" }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Google-kirjautuminen ei ole käytössä.",
  );
  expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: "Kirjaudu" }),
  ).toBeEnabled();
});

test.each(["network", "http", "invalid-json"])(
  "keeps email login usable after a settings %s failure",
  async (failure) => {
    fetchSettings.mockImplementation(async () => {
      if (failure === "network") throw new TypeError("network unavailable");
      if (failure === "http") return { ok: false };
      return {
        ok: true,
        json: async () => {
          throw new SyntaxError("invalid JSON");
        },
      };
    });
    render(<LoginPage />);

    await screen.findByText(AUTH_PROVIDER_CHECK_FAILED);
    expect(
      screen.queryByRole("button", { name: /google/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Kirjaudu" }),
    ).toBeEnabled();
  },
);

test("shows an inline error and releases the form if the click-time settings check fails", async () => {
  fetchSettings.mockImplementationOnce(async () => settings(true));
  fetchSettings.mockRejectedValue(new TypeError("network unavailable"));
  render(<LoginPage />);
  await userEvent.click(
    await screen.findByRole("button", { name: "Jatka Google-tilillä" }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    AUTH_PROVIDER_CHECK_FAILED,
  );
  expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: "Kirjaudu" }),
  ).toBeEnabled();
});

test("times out a hanging provider check without sending a user session", async () => {
  vi.useFakeTimers();
  fetchSettings.mockImplementation(
    (_url, options: RequestInit) =>
      new Promise((_resolve, reject) => {
        options.signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      }),
  );
  const request = getEnabledAuthProviders();
  const result = expect(request).rejects.toThrow(AUTH_PROVIDER_CHECK_FAILED);
  await vi.advanceTimersByTimeAsync(5000);
  await result;
  expect(fetchSettings).toHaveBeenCalledWith(
    "https://auth-test.example.invalid/auth/v1/settings",
    expect.objectContaining({
      credentials: "omit",
      cache: "no-store",
      headers: { apikey: "public-test-key" },
    }),
  );
});
