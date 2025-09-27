import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  useEffect(() => {
    let active = true;
    const finalize = async () => {
      await supabase.auth.getSession();
      if (active && typeof window !== 'undefined') {
        window.location.replace('/');
      }
    };
    finalize();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-orange/15 via-white to-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange" aria-hidden="true" />
        <p className="text-brand-ink">Kirjautuminen onnistui, ohjataan eteenpäin...</p>
      </div>
    </main>
  );
}
