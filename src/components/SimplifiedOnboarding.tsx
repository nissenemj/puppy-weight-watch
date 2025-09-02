import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Dog, CheckCircle, ArrowRight, Info, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimplifiedOnboardingProps {
  user: User;
  onComplete: () => void;
  onSkip?: () => void;
}

interface DogProfile {
  name: string;
  breed: string;
  birthDate: string;
  currentWeight: string;
  gender: 'male' | 'female' | '';
  activityLevel: string;
  notifications: boolean;
}

const POPULAR_BREEDS = [
  'Labrador',
  'Kultainennoutaja',
  'Saksanpaimenkoira', 
  'Bordercollie',
  'Sekarotuinen',
  'Chihuahua',
  'Bulldoggi',
  'Beagle',
  'Muu rotu'
];

export function SimplifiedOnboarding({ user, onComplete, onSkip }: SimplifiedOnboardingProps) {
  const [profile, setProfile] = useState<DogProfile>({
    name: '',
    breed: '',
    birthDate: '',
    currentWeight: '',
    gender: '',
    activityLevel: '',
    notifications: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Pennun nimi on pakollinen';
    }
    
    if (!profile.breed) {
      newErrors.breed = 'Valitse rotu';
    }
    
    if (!profile.birthDate) {
      newErrors.birthDate = 'Syntymäaika on pakollinen';
    }
    
    if (!profile.currentWeight || parseFloat(profile.currentWeight) <= 0) {
      newErrors.currentWeight = 'Syötä kelvollinen paino';
    }
    
    if (!profile.gender) {
      newErrors.gender = 'Valitse sukupuoli';
    }
    
    if (!profile.activityLevel) {
      newErrors.activityLevel = 'Valitse aktiivisuustaso';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Täytä kaikki pakolliset kentät');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create dog profile
      const { data: dogData, error: dogError } = await supabase
        .from('dogs')
        .insert({
          user_id: user.id,
          name: profile.name.trim(),
          breed: profile.breed,
          birth_date: profile.birthDate,
          gender: profile.gender,
          activity_level: profile.activityLevel,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dogError) throw dogError;

      // Add initial weight entry
      if (dogData && profile.currentWeight) {
        const { error: weightError } = await supabase
          .from('weight_entries')
          .insert({
            user_id: user.id,
            dog_id: dogData.id,
            weight: parseFloat(profile.currentWeight),
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
          });

        if (weightError) console.warn('Weight entry failed:', weightError);
      }

      // Update user preferences
      if (profile.notifications) {
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            notifications_enabled: true,
            weekly_reminders: true,
            updated_at: new Date().toISOString()
          });

        if (prefsError) console.warn('Preferences update failed:', prefsError);
      }

      toast.success(`${profile.name} on lisätty onnistuneesti!`);
      onComplete();
      
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Virhe profiilin luomisessa. Yritä uudelleen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const updateField = (field: keyof DogProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0" role="main" aria-labelledby="onboarding-title">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto bg-[var(--color-primary-100)] rounded-full flex items-center justify-center mb-4">
              <Dog className="w-8 h-8 text-[var(--color-primary-500)]" aria-hidden="true" />
            </div>
            <CardTitle id="onboarding-title" className="text-h1 mb-2">
              Luo pennun profiili
            </CardTitle>
            <CardDescription className="text-body-lg max-w-md mx-auto">
              Kerro meille pennustasi, jotta voimme tarjota personoituja neuvojaja ja seurantaa
            </CardDescription>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" aria-hidden="true" />
                2 minuuttia
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Heart className="w-3 h-3" aria-hidden="true" />
                Ilmainen
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pennun nimi */}
                <div className="space-y-2">
                  <Label htmlFor="dog-name" className="required">Pennun nimi *</Label>
                  <Input
                    id="dog-name"
                    value={profile.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="esim. Rekku"
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    className={`touch-target ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                  <p id="name-help" className="text-sm text-muted-foreground">
                    Tämä nimi näkyy kaikissa seurannoissa
                  </p>
                </div>

                {/* Rotu */}
                <div className="space-y-2">
                  <Label id="breed-label" className="required">Rotu *</Label>
                  <Select value={profile.breed} onValueChange={(value) => updateField('breed', value)} required>
                    <SelectTrigger 
                      className={`touch-target ${errors.breed ? 'border-red-500' : ''}`}
                      aria-labelledby="breed-label"
                      aria-required="true"
                      aria-describedby={errors.breed ? 'breed-error' : 'breed-help'}
                    >
                      <SelectValue placeholder="Valitse rotu" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_BREEDS.map(breed => (
                        <SelectItem key={breed} value={breed} className="touch-target">
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.breed && (
                    <p id="breed-error" className="text-sm text-red-600" role="alert">
                      {errors.breed}
                    </p>
                  )}
                  <p id="breed-help" className="text-sm text-muted-foreground">
                    Auttaa laskemaan tarkkoja ruokamääriä
                  </p>
                </div>

                {/* Syntymäaika */}
                <div className="space-y-2">
                  <Label htmlFor="birth-date" className="required">Syntymäaika *</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.birthDate ? 'date-error' : 'date-help'}
                    className={`touch-target ${errors.birthDate ? 'border-red-500' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.birthDate && (
                    <p id="date-error" className="text-sm text-red-600" role="alert">
                      {errors.birthDate}
                    </p>
                  )}
                  <p id="date-help" className="text-sm text-muted-foreground">
                    Tarkkuus auttaa kasvuseurannassa
                  </p>
                </div>

                {/* Nykyinen paino */}
                <div className="space-y-2">
                  <Label htmlFor="current-weight" className="required">Nykyinen paino (kg) *</Label>
                  <Input
                    id="current-weight"
                    type="number"
                    step="0.1"
                    value={profile.currentWeight}
                    onChange={(e) => updateField('currentWeight', e.target.value)}
                    placeholder="esim. 2.5"
                    aria-required="true"
                    aria-describedby={errors.currentWeight ? 'weight-error' : 'weight-help'}
                    className={`touch-target ${errors.currentWeight ? 'border-red-500' : ''}`}
                  />
                  {errors.currentWeight && (
                    <p id="weight-error" className="text-sm text-red-600" role="alert">
                      {errors.currentWeight}
                    </p>
                  )}
                  <p id="weight-help" className="text-sm text-muted-foreground">
                    Punnitse pentu ennen täyttämistä
                  </p>
                </div>

                {/* Sukupuoli */}
                <div className="space-y-2">
                  <Label id="gender-label" className="required">Sukupuoli *</Label>
                  <Select value={profile.gender} onValueChange={(value) => updateField('gender', value)} required>
                    <SelectTrigger 
                      className={`touch-target ${errors.gender ? 'border-red-500' : ''}`}
                      aria-labelledby="gender-label"
                      aria-required="true"
                      aria-describedby={errors.gender ? 'gender-error' : undefined}
                    >
                      <SelectValue placeholder="Valitse sukupuoli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="touch-target">Uros</SelectItem>
                      <SelectItem value="female" className="touch-target">Narttu</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p id="gender-error" className="text-sm text-red-600" role="alert">
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Aktiivisuustaso */}
                <div className="space-y-2">
                  <Label id="activity-label" className="required">Aktiivisuustaso *</Label>
                  <Select value={profile.activityLevel} onValueChange={(value) => updateField('activityLevel', value)} required>
                    <SelectTrigger 
                      className={`touch-target ${errors.activityLevel ? 'border-red-500' : ''}`}
                      aria-labelledby="activity-label"
                      aria-required="true"
                      aria-describedby={errors.activityLevel ? 'activity-error' : 'activity-help'}
                    >
                      <SelectValue placeholder="Valitse aktiivisuus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="touch-target">Matala (sisäkoira)</SelectItem>
                      <SelectItem value="normal" className="touch-target">Normaali (päivittäiset kävelyt)</SelectItem>
                      <SelectItem value="active" className="touch-target">Aktiivinen (paljon liikuntaa)</SelectItem>
                      <SelectItem value="very-active" className="touch-target">Erittäin aktiivinen (työkoira)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.activityLevel && (
                    <p id="activity-error" className="text-sm text-red-600" role="alert">
                      {errors.activityLevel}
                    </p>
                  )}
                  <p id="activity-help" className="text-sm text-muted-foreground">
                    Vaikuttaa ruokamäärien laskentaan
                  </p>
                </div>
              </div>

              {/* Muistutukset */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]">
                <Checkbox
                  id="notifications"
                  checked={profile.notifications}
                  onCheckedChange={(checked) => updateField('notifications', Boolean(checked))}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="notifications" className="font-medium">
                    Viikoittaiset muistutukset
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lähetämme viikottaisen muistutuksen painon mittaamisesta ja pennun kehityksestä
                  </p>
                </div>
              </div>

              {/* Info alert */}
              <Alert className="border-[var(--color-info)] bg-[var(--color-secondary-50)]">
                <Info className="h-4 w-4 text-[var(--color-info)]" />
                <AlertDescription>
                  <strong>Tiedot pysyvät turvassa:</strong> Kaikki tiedot salataan ja tallennetaan turvallisesti. Voit muokata tai poistaa tietoja milloin tahansa.
                </AlertDescription>
              </Alert>

              {/* Submit buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 touch-target focus-enhanced"
                  aria-describedby="submit-help"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Luodaan profiilia...
                    </>
                  ) : (
                    <>
                      Luo profiili
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSkip}
                  className="touch-target focus-enhanced"
                >
                  Ohita toistaiseksi
                </Button>
              </div>
              <p id="submit-help" className="text-sm text-center text-muted-foreground">
                Profiili auttaa tarjoamaan tarkkoja neuvoja ja seurantaa
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}