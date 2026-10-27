import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import "@testing-library/jest-dom";

import AuthCallbackPage from "./AuthCallback";
import { supabase } from "@/integrations/supabase/client";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession: vi.fn() } },
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/auth/callback");
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
    error: null,
  });
});

test("does not announce success while the session is still being checked", () => {
  vi.mocked(supabase.auth.getSession).mockReturnValue(new Promise(() => {}));
  render(<AuthCallbackPage />);
  expect(screen.getByRole("status")).toHaveTextContent("Vahvistetaan kirjautumista");
  expect(screen.queryByText(/kirjautuminen onnistui/i)).not.toBeInTheDocument();
});

test("offers a new login when no session was created", async () => {
  render(<AuthCallbackPage />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Kirjautuminen ei onnistunut");
  expect(screen.getByRole("link", { name: "Yritä kirjautumista uudelleen" })).toHaveAttribute("href", "/login");
});

test.each([
  "?error=server_error&error_description=OAuth+state+has+expired",
  "#error=server_error&error_description=OAuth+state+has+expired",
  "?error_code=flow_state_expired",
])("explains an expired callback from %s", async (suffix) => {
  window.history.replaceState(null, "", `/auth/callback${suffix}`);
  render(<AuthCallbackPage />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Kirjautumispyyntö vanheni");
  expect(supabase.auth.getSession).not.toHaveBeenCalled();
});

test("does not display an untrusted provider error description", async () => {
  window.history.replaceState(null, "", "/auth/callback#error=access_denied&error_description=private-provider-message");
  render(<AuthCallbackPage />);
  await screen.findByRole("alert");
  expect(screen.queryByText(/private-provider-message/)).not.toBeInTheDocument();
  expect(supabase.auth.getSession).not.toHaveBeenCalled();
});

test("shows a retry action when the session check throws", async () => {
  vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error("private-network-error"));
  render(<AuthCallbackPage />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Yritä uudelleen");
  expect(screen.queryByText(/private-network-error/)).not.toBeInTheDocument();
});
