import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import AuthModal from "./AuthModal";
import { useAuthProviders } from "@/hooks/useAuthProviders";

vi.mock("@/hooks/useAuthProviders", () => ({ useAuthProviders: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("@/contexts/GuestAuthContext", () => ({
  useGuestAuth: () => ({
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    signInWithOAuth: vi.fn(),
    guestWeightEntries: [],
    syncGuestDataToUser: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.mocked(useAuthProviders).mockReturnValue({
    providers: { google: false, apple: false },
    failed: false,
  });
});

test("does not offer disabled Google or Apple login in the alternate form", () => {
  render(<AuthModal fullScreen mode="signin" />);
  expect(
    screen.queryByRole("button", { name: /Google|Apple/ }),
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("Sähköposti")).toBeEnabled();
  expect(
    screen.getByRole("button", { name: "Kirjaudu sisään" }),
  ).toBeEnabled();
});

test.each(["google", "apple"] as const)(
  "offers only the enabled %s provider",
  (provider) => {
    vi.mocked(useAuthProviders).mockReturnValue({
      providers: { google: provider === "google", apple: provider === "apple" },
      failed: false,
    });
    render(<AuthModal fullScreen mode="signin" />);
    expect(
      screen.getByRole("button", {
        name: provider === "google" ? /Google/ : /Apple/,
      }),
    ).toBeEnabled();
    expect(
      screen.queryByRole("button", {
        name: provider === "google" ? /Apple/ : /Google/,
      }),
    ).not.toBeInTheDocument();
  },
);

test("keeps focus and the full email while the form rerenders during typing", async () => {
  render(<AuthModal fullScreen mode="signin" />);
  const input = screen.getByLabelText("Sähköposti");
  await userEvent.type(input, "pentu@example.invalid");
  expect(input).toHaveFocus();
  expect(input).toHaveValue("pentu@example.invalid");
});
