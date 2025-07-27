import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Heart, Calendar, Stethoscope } from '@/utils/iconImports';

interface VeterinaryGuidanceProps {
  ageWeeks?: number;
  showVaccinationWarning?: boolean;
  showDewormingSchedule?: boolean;
  showReactionGuidance?: boolean;
}

export const VeterinaryGuidance: React.FC<VeterinaryGuidanceProps> = ({
  ageWeeks = 0,
  showVaccinationWarning = false,
  showDewormingSchedule = false,
  showReactionGuidance = false
}) => {
  return (
    <div className="space-y-4">
      {/* Socialization Warning for Young Puppies */}
      {showVaccinationWarning && ageWeeks < 16 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Heart className="h-4 w-4" />
          <AlertDescription>
            <strong>Sosiaalistaminen ja rokotussuoja:</strong> Ennen täyttä rokotussuojaa (≥16 vk) 
            tapaa vain terveitä, rokotettuja koiria hallitusti. Vältä koirapuistoja ja muita riskialueita.
          </AlertDescription>
        </Alert>
      )}

      {/* Deworming Schedule */}
      {showDewormingSchedule && ageWeeks <= 12 && (
        <Alert className="border-green-200 bg-green-50">
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Madotusohjelma:</strong> 2 viikon iästä alkaen <em>joka 2. viikko</em> 10-12 viikon ikään. 
            Emä madotetaan samanaikaisesti. 16 viikossa: ulostenäyte → madota vain tarvittaessa.
          </AlertDescription>
        </Alert>
      )}

      {/* Stool Sample Reminder */}
      {ageWeeks >= 16 && ageWeeks <= 20 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Stethoscope className="h-4 w-4" />
          <AlertDescription>
            <strong>Ulostenäyte suositeltu:</strong> 16+ viikon iässä kannattaa ottaa kolmiputkitesti 
            madotusten tilalle. Näin vältetään turhaa lääkitystä.
          </AlertDescription>
        </Alert>
      )}

      {/* Vaccination Reaction Guidance */}
      {showReactionGuidance && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rokotusreaktiot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Normaalit lievät reaktiot (1-2 päivää):</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Paikallinen arkuus tai pieni kuhmu pistoskohdassa</li>
                <li>• Lievä väsymys tai vähentynyt aktiivisuus</li>
                <li>• Hieman alentunut ruokahalu</li>
                <li>• Lievä kuume</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Päivystykseen heti:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Oksentelu tai ripuli</li>
                <li>• Nokkosihottuma tai ihottuma</li>
                <li>• Kasvojen tai kurkun turvotus</li>
                <li>• Hengitysvaikeus tai vinkuna</li>
                <li>• Romahtaminen tai tajuttomuus</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};