import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VeterinaryDisclaimerProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const VeterinaryDisclaimer: React.FC<VeterinaryDisclaimerProps> = ({
  variant = 'default',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <p className={`text-xs text-stone-500 ${className}`}>
        <AlertTriangle className="w-3 h-3 inline mr-1" />
        Tämä sovellus ei korvaa eläinlääkärin neuvoja. Konsultoi aina eläinlääkäriä terveysasioissa.
      </p>
    );
  }

  return (
    <Alert variant="default" className={`border-amber-200 bg-amber-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 font-semibold">Huomio</AlertTitle>
      <AlertDescription className="text-amber-700 text-sm">
        <p className="mb-2">
          Pentulaskuri.com tarjoaa yleisiä suuntaviivoja koiranpennun ruokintaan ja kasvun seurantaan.
          <strong> Tämä ei ole eläinlääketieteellinen neuvo.</strong>
        </p>
        <p>
          Jokainen koira on yksilö. Konsultoi aina eläinlääkäriä tai ravitsemusasiantuntijaa
          ennen ruokinnan tai hoidon muutoksia, erityisesti jos koirallasi on terveysongelmia.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default VeterinaryDisclaimer;
