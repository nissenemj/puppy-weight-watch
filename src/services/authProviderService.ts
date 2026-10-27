import {
  supabase,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "@/integrations/supabase/client";

export type SocialAuthProvider = "google" | "apple";
export type EnabledAuthProviders = Record<SocialAuthProvider, boolean>;

export const AUTH_PROVIDER_CHECK_FAILED =
  "Kirjautumistapoja ei voitu tarkistaa. Voit käyttää sähköpostikirjautumista.";

export async function getEnabledAuthProviders(
  signal?: AbortSignal,
): Promise<EnabledAuthProviders> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  else signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, 5000);

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      credentials: "omit",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(AUTH_PROVIDER_CHECK_FAILED);

    const settings: unknown = await response.json();
    if (
      !settings ||
      typeof settings !== "object" ||
      !("external" in settings) ||
      !settings.external ||
      typeof settings.external !== "object"
    ) {
      throw new Error(AUTH_PROVIDER_CHECK_FAILED);
    }

    const external = settings.external;
    return {
      google: "google" in external && external.google === true,
      apple: "apple" in external && external.apple === true,
    };
  } catch {
    throw new Error(AUTH_PROVIDER_CHECK_FAILED);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

export async function signInWithEnabledProvider(
  provider: SocialAuthProvider,
  options?: Parameters<typeof supabase.auth.signInWithOAuth>[0]["options"],
) {
  // Check again on click: a provider can be disabled after the page was opened.
  const providers = await getEnabledAuthProviders();
  if (!providers[provider]) {
    const name = provider === "google" ? "Google" : "Apple";
    throw new Error(
      `${name}-kirjautuminen ei ole käytössä. Kirjaudu sähköpostilla.`,
    );
  }
  return supabase.auth.signInWithOAuth({ provider, options });
}
