import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

interface AuthRequiredWrapperProps {
  children: ReactNode;
  feature: string;
  fallbackMessage?: string;
}

/**
 * Wrapper component that shows login prompt for features requiring authentication.
 * Use this to wrap features that need user authentication while allowing
 * guest users to see what they're missing.
 */
export function AuthRequiredWrapper({
  children,
  feature,
  fallbackMessage
}: AuthRequiredWrapperProps) {
  const { user } = useUser();
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <Lock className="mx-auto h-12 w-12 text-stone-400 mb-4" />
      <h3 className="text-lg font-semibold text-stone-900 mb-2">
        {feature} vaatii kirjautumisen
      </h3>
      <p className="text-stone-600 mb-6">
        {fallbackMessage || 'Luo ilmainen tili tallentaaksesi tiedot pilveen ja käyttääksesi kaikkia ominaisuuksia.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link to="/login">Kirjaudu sisään</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login?tab=register">Luo tili</Link>
        </Button>
      </div>
    </Card>
  );
}

export default AuthRequiredWrapper;
