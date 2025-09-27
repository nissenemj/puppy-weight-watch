import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Dog, LogIn } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Syötä kelvollinen sähköpostiosoite'),
});
const emailPasswordSchema = emailSchema.extend({
  password: z.string().min(8, 'Vähintään 8 merkkiä'),
});

type EmailForm = z.infer<typeof emailSchema>;
type EmailPasswordForm = z.infer<typeof emailPasswordSchema>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const track = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', event, params);
  }
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const redirectTo = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined),
    []
  );

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session && typeof window !== 'undefined') {
        window.location.replace('/');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const emailPwdForm = useForm<EmailPasswordForm>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: '', password: '' },
  });

  const magicForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  async function signInWithGoogle() {
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      ...(redirectTo ? { options: { redirectTo } } : {}),
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      track('login', { method: 'google' });
    }
  }

  async function onSubmitEmailPwd(values: EmailPasswordForm) {
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        track('login', { method: 'password' });
        setInfo('Kirjaudutaan sisään...');
        if (typeof window !== 'undefined') {
          window.location.assign('/');
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
      setInfo('Tarkista sähköpostisi ja vahvista tilisi.');
      track('sign_up', { method: 'password' });
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
      setInfo('Magic link lähetetty! Tarkista sähköpostisi.');
      track('login', { method: 'magic_link' });
    }
  }

  async function onResetPassword(values: EmailForm) {
    setError(null);
    setInfo(null);
    setLoading(true);
    const resetRedirect = redirectTo ??
      (typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined);
    const { error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      resetRedirect ? { redirectTo: resetRedirect } : undefined,
    );
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setInfo('Salasanan palautuslinkki lähetetty sähköpostiisi.');
      track('password_reset_request', { origin: 'login_page' });
    }
  }

  const emailError = emailPwdForm.formState.errors.email?.message;
  const passwordError = emailPwdForm.formState.errors.password?.message;
  const magicEmailError = magicForm.formState.errors.email?.message;

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-orange/15 via-white to-white dark:from-brand-orange/25 dark:via-slate-950 dark:to-slate-950">
      <a
        href="#auth-card"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 rounded bg-black px-3 py-2 text-white"
      >
        Hyppää sisältöön
      </a>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-10">
        <div className="hidden flex-col justify-center md:flex">
          <div className="relative rounded-2xl border bg-white/60 p-8 shadow-soft backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white">
                <Dog className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-ink">Tervetuloa Pentulaskuriin</h2>
            </div>
            <p className="text-brand-ink/80">
              Seuraa painoa 📊, laske ruoka-annokset 🍖 ja tallenna muistot 📚 yhdessä paikassa. Kirjaudu sisään jatkaaksesi.
            </p>
            <ul className="mt-6 space-y-2 text-brand-ink/80">
              <li>• Nopea Google-kirjautuminen</li>
              <li>• Sähköposti & salasana tai magic link</li>
              <li>• Yksityisyys & tietoturva by design</li>
            </ul>
          </div>
        </div>

        <Card id="auth-card" className="rounded-2xl border bg-white/90 shadow-soft backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LogIn className="h-5 w-5 text-brand-orange" aria-hidden="true" />
              {mode === 'signin' ? 'Kirjaudu sisään' : 'Luo tili'}
            </CardTitle>
            <CardDescription>Jatka Googlella tai sähköpostilla.</CardDescription>
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

            <div className="grid gap-3">
              <Button
                onClick={signInWithGoogle}
                disabled={loading}
                className="border bg-white text-brand-ink hover:bg-brand-yellow/20"
                variant="outline"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Jatka Google-tilillä
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-brand-ink/60">
                tai sähköpostilla
              </span>
            </div>

            <form onSubmit={emailPwdForm.handleSubmit(onSubmitEmailPwd)} className="grid gap-4" noValidate>
              <div className="grid gap-2">
                <Label htmlFor="email">Sähköpostiosoite</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="sinä@esimerkki.com"
                  {...emailPwdForm.register('email')}
                />
                {emailError ? <p className="text-sm text-red-600">{emailError}</p> : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Salasana</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  {...emailPwdForm.register('password')}
                />
                {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
              </div>

              <Button type="submit" disabled={loading} className="bg-brand-orange hover:bg-brand-orange/90">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {mode === 'signin' ? 'Kirjaudu' : 'Luo tili'}
              </Button>
            </form>

            <details className="group">
              <summary className="cursor-pointer text-sm text-brand-ink/70 hover:text-brand-ink">
                Vaihtoehdot: Magic link & salasanan palautus
              </summary>
              <div className="mt-4 grid gap-4">
                <form onSubmit={magicForm.handleSubmit(onSendMagicLink)} className="grid gap-3" noValidate>
                  <Label htmlFor="magic-email">Sähköposti</Label>
                  <Input
                    id="magic-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="sinä@esimerkki.com"
                    {...magicForm.register('email')}
                  />
                  {magicEmailError ? <p className="text-sm text-red-600">{magicEmailError}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" variant="secondary" disabled={loading}>
                      Lähetä magic link
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
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setInfo(null);
              }}
            >
              {mode === 'signin' ? 'Ei tiliä? Luo uusi' : 'Onko sinulla jo tili? Kirjaudu'}
            </Button>
            <a
              href="/tietosuoja"
              className="text-sm text-brand-ink/60 underline-offset-2 hover:underline"
            >
              Tietosuoja & käyttöehdot
            </a>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
