import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const retryMessage = 'Kirjautumista ei voitu vahvistaa. Yritä uudelleen kirjautumissivulta.';

export default function AuthCallbackPage() {
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const finalize = async () => {
      const callbackError = [
        new URLSearchParams(window.location.search),
        new URLSearchParams(window.location.hash.slice(1)),
      ].find((params) => params.has('error') || params.has('error_code'));

      if (callbackError) {
        const expired = callbackError.get('error_code') === 'flow_state_expired'
          || callbackError.get('error_description')?.toLowerCase().includes('oauth state has expired');
        setFailure(expired
          ? 'Kirjautumispyyntö vanheni. Aloita uusi kirjautuminen ja vahvista se heti.'
          : retryMessage);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error || !data.session) {
          setFailure(retryMessage);
          return;
        }
        window.location.replace('/');
      } catch {
        if (active) setFailure(retryMessage);
      }
    };
    void finalize();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-terracotta-50 via-white to-white px-4">
      {failure ? (
        <div role="alert" className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-terracotta-700" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-stone-900">Kirjautuminen ei onnistunut</h1>
          <p className="text-stone-600">{failure}</p>
          <Button asChild className="min-h-11 bg-terracotta-700 text-white hover:bg-terracotta-800">
            <a href="/login">Yritä kirjautumista uudelleen</a>
          </Button>
        </div>
      ) : (
        <div role="status" className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-terracotta-700" aria-hidden="true" />
          <p className="text-stone-900">Vahvistetaan kirjautumista...</p>
        </div>
      )}
    </div>
  );
}
