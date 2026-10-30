import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuthProviders } from "@/hooks/useAuthProviders";
import {
  AUTH_PROVIDER_CHECK_FAILED,
  signInWithEnabledProvider,
} from "@/services/authProviderService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Dog, LogIn } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Syötä kelvollinen sähköpostiosoite"),
});
const emailPasswordSchema = emailSchema.extend({
  password: z.string().min(8, "Vähintään 8 merkkiä"),
});

type EmailForm = z.infer<typeof emailSchema>;
type EmailPasswordForm = z.infer<typeof emailPasswordSchema>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const track = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined") {
    window.gtag?.("event", event, params);
  }
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { providers, failed: providersFailed } = useAuthProviders();
  const googleEnabled = providers?.google === true;

  const redirectTo = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined,
    [],
  );

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session && typeof window !== "undefined") {
        window.location.replace("/");
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const emailPwdForm = useForm<EmailPasswordForm>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  async function signInWithGoogle() {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { error } = await signInWithEnabledProvider(
        "google",
        redirectTo ? { redirectTo } : undefined,
      );
      if (error) setError(error.message);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : AUTH_PROVIDER_CHECK_FAILED,
      );
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitEmailPwd(values: EmailPasswordForm) {
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        track("login", { method: "password" });
        setInfo("Kirjaudutaan sisään...");
        if (typeof window !== "undefined") {
          window.location.assign("/");
        }
      }
      return;
    }

    const payload: Parameters<typeof supabase.auth.signUp>[0] = {
      email: values.email,
      password: values.password,
    };
    if (redirectTo) {
      payload.options = { emailRedirectTo: redirectTo };
    }

    const { error } = await supabase.auth.signUp(payload);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setInfo("Tarkista sähköpostisi ja vahvista tilisi.");
      track("sign_up", { method: "password" });
    }
  }

  async function onSendMagicLink(values: EmailForm) {
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      ...(redirectTo ? { options: { emailRedirectTo: redirectTo } } : {}),
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setInfo("Kirjautumislinkki lähetetty. Tarkista sähköpostisi.");
      track("login", { method: "magic_link" });
    }
  }

  async function onResetPassword(values: EmailForm) {
    setError(null);
    setInfo(null);
    setLoading(true);
    const resetRedirect =
      redirectTo ??
      (typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      resetRedirect ? { redirectTo: resetRedirect } : undefined,
    );
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setInfo("Salasanan palautuslinkki lähetetty sähköpostiisi.");
      track("password_reset_request", { origin: "login_page" });
    }
  }

  const emailError = emailPwdForm.formState.errors.email?.message;
  const passwordError = emailPwdForm.formState.errors.password?.message;
  const magicEmailError = magicForm.formState.errors.email?.message;

  return (
    <div className="site-login min-h-screen bg-white">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-10">
        <div className="hidden flex-col justify-center md:flex">
          <div className="relative rounded-2xl border bg-white/60 p-8 shadow-soft backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white">
                <Dog className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-2xl font-semibold text-brand-ink">
                Tervetuloa Pentulaskuriin
              </p>
            </div>
            <p className="text-brand-ink/80">
              Tallenna pennun mittaukset, kuvat ja yhteiset hetket omaan
              tiliisi. Voit palata niiden pariin myöhemmin.
            </p>
            <ul className="mt-6 space-y-2 text-brand-ink/80">
              {googleEnabled ? <li>• Kirjautuminen Google-tilillä</li> : null}
              <li>
                Kirjaudu sähköpostilla ja salasanalla tai sähköpostiin
                lähetettävällä linkillä.
              </li>
            </ul>
          </div>
        </div>

        <Card
          id="auth-card"
          className="rounded-2xl border bg-white/90 shadow-soft backdrop-blur"
        >
          <CardHeader>
            <h1 className="flex items-center gap-2 text-2xl font-serif">
              <LogIn className="h-5 w-5 text-brand-orange" aria-hidden="true" />
              {mode === "signin" ? "Kirjaudu sisään" : "Luo tili"}
            </h1>
            <CardDescription>
              {googleEnabled
                ? "Jatka Googlella tai sähköpostilla."
                : "Kirjaudu sähköpostilla."}
            </CardDescription>
            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
              <a
                href="/weight-tracker"
                className="underline underline-offset-4"
              >
                Kokeile painonseurantaa ilman tiliä.
              </a>{" "}
              Ilman tiliä mittaukset säilyvät vain tässä selaimessa.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error ? (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertTitle>Virhe</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {info ? (
              <Alert role="status" aria-live="polite">
                <AlertTitle>OK</AlertTitle>
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            ) : null}

            {googleEnabled ? (
              <>
                <div className="grid gap-3">
                  <Button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="border border-stone-300 bg-white text-stone-900 hover:bg-stone-50"
                    variant="outline"
                  >
                    {loading ? (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    Jatka Google-tilillä
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-brand-ink/60">
                    tai sähköpostilla
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-stone-600" role="status">
                {providersFailed
                  ? AUTH_PROVIDER_CHECK_FAILED
                  : providers
                    ? "Google-kirjautuminen ei ole käytössä. Kirjaudu sähköpostilla."
                    : "Tarkistetaan kirjautumistapoja…"}
              </p>
            )}

            <form
              onSubmit={emailPwdForm.handleSubmit(onSubmitEmailPwd)}
              className="grid gap-4"
              noValidate
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Sähköpostiosoite</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="sinä@esimerkki.com"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={
                    emailError ? "login-email-error" : undefined
                  }
                  {...emailPwdForm.register("email")}
                />
                {emailError ? (
                  <p
                    id="login-email-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {emailError}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Salasana</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  placeholder="••••••••"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? "login-password-error" : undefined
                  }
                  {...emailPwdForm.register("password")}
                />
                {passwordError ? (
                  <p
                    id="login-password-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {passwordError}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-terracotta-700 text-white hover:bg-terracotta-800"
              >
                {loading ? (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {mode === "signin" ? "Kirjaudu" : "Luo tili"}
              </Button>
            </form>

            <details className="group">
              <summary className="cursor-pointer text-sm text-brand-ink/70 hover:text-brand-ink">
                Kirjaudu ilman salasanaa tai palauta salasana
              </summary>
              <div className="mt-4 grid gap-4">
                <form
                  onSubmit={magicForm.handleSubmit(onSendMagicLink)}
                  className="grid gap-3"
                  noValidate
                >
                  <Label htmlFor="magic-email">Sähköposti</Label>
                  <Input
                    id="magic-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="sinä@esimerkki.com"
                    aria-invalid={Boolean(magicEmailError)}
                    aria-describedby={
                      magicEmailError ? "login-link-email-error" : undefined
                    }
                    {...magicForm.register("email")}
                  />
                  {magicEmailError ? (
                    <p
                      id="login-link-email-error"
                      className="text-sm text-red-600"
                      role="alert"
                    >
                      {magicEmailError}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={loading}
                      className="bg-terracotta-700 text-white hover:bg-terracotta-800"
                    >
                      Lähetä kirjautumislinkki
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={magicForm.handleSubmit(onResetPassword)}
                      disabled={loading}
                    >
                      Palauta salasana
                    </Button>
                  </div>
                </form>
              </div>
            </details>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
            >
              {mode === "signin"
                ? "Ei tiliä? Luo uusi"
                : "Onko sinulla jo tili? Kirjaudu"}
            </Button>
            <div className="flex flex-wrap justify-center gap-x-4">
              <a
                href="/privacy"
                className="inline-flex min-h-11 items-center text-sm text-terracotta-700 underline underline-offset-2 hover:text-terracotta-800"
              >
                Tietosuoja
              </a>
              <a
                href="/terms"
                className="inline-flex min-h-11 items-center text-sm text-terracotta-700 underline underline-offset-2 hover:text-terracotta-800"
              >
                Käyttöehdot
              </a>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
