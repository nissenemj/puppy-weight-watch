import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface OnboardingProgress {
  id?: string;
  user_id: string;
  current_step: number;
  step_data: Record<string, any>;
  completed: boolean;
}

export interface DogProfile {
  name: string;
  breed: string;
  age_years: number | null;
  weight_kg: number | null;
  activity_level: string;
}

export const useOnboardingState = (user: User) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dogProfile, setDogProfile] = useState<DogProfile>({
    name: '',
    breed: '',
    age_years: null,
    weight_kg: null,
    activity_level: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progressId, setProgressId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load existing progress on mount
  useEffect(() => {
    loadOnboardingProgress();
  }, [user.id]);

  const loadOnboardingProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setProgressId(data.id);
        setCurrentStep(data.current_step || 0);
        if (data.step_data && typeof data.step_data === 'object' && 'dogProfile' in data.step_data) {
          const profileData = (data.step_data as any).dogProfile;
          if (profileData && typeof profileData === 'object') {
            setDogProfile({
              name: profileData.name || '',
              breed: profileData.breed || '',
              age_years: profileData.age_years || null,
              weight_kg: profileData.weight_kg || null,
              activity_level: profileData.activity_level || 'medium'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  };

  const saveProgress = useCallback(async (
    step: number,
    stepData?: Record<string, any>,
    updatedDogProfile?: DogProfile
  ) => {
    setIsLoading(true);
    try {
      const profileToPersist = updatedDogProfile ?? dogProfile;
      const progressData = {
        user_id: user.id,
        current_step: step,
        step_data: {
          dogProfile: JSON.parse(JSON.stringify(profileToPersist)),
          ...stepData
        } as any,
        completed: false
      };

      if (progressId) {
        // Update existing progress
        const { error } = await supabase
          .from('onboarding_progress')
          .update(progressData)
          .eq('id', progressId);

        if (error) throw error;
      } else {
        // Create new progress
        const { data, error } = await supabase
          .from('onboarding_progress')
          .insert(progressData)
          .select()
          .single();

        if (error) throw error;
        setProgressId(data.id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Tallennusvirhe",
        description: "Tietojen tallentaminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user.id, dogProfile, progressId, toast]);

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Mark onboarding as completed
      if (progressId) {
        await supabase
          .from('onboarding_progress')
          .update({ completed: true })
          .eq('id', progressId);
      }

      // Save dog profile
      const { data: dogData, error: dogError } = await supabase
        .from('dogs')
        .insert({
          user_id: user.id,
          name: dogProfile.name,
          breed: dogProfile.breed,
          age_years: dogProfile.age_years,
          weight_kg: dogProfile.weight_kg,
          activity_level: dogProfile.activity_level
        })
        .select()
        .single();

      if (dogError) throw dogError;

      // Save initial weight entry if weight is provided
      if (dogProfile.weight_kg) {
        const { error: weightError } = await supabase
          .from('weight_entries')
          .insert({
            user_id: user.id,
            dog_id: dogData.id,
            weight: dogProfile.weight_kg,
            date: new Date().toISOString().split('T')[0]
          });

        if (weightError) throw weightError;
      }

      toast({
        title: "Onboarding valmis!",
        description: "Profiili luotu onnistuneesti. Tervetuloa!",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Virhe profiilin luomisessa",
        description: "Yritä uudelleen tai ota yhteyttä tukeen.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDogProfile = (profile: DogProfile) => {
    setDogProfile(profile);
  };

  const nextStep = (stepData?: Record<string, any>, updatedDogProfile?: DogProfile) => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    saveProgress(newStep, stepData, updatedDogProfile);
  };

  const previousStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    saveProgress(newStep);
  };

  return {
    currentStep,
    dogProfile,
    isLoading,
    updateDogProfile,
    nextStep,
    previousStep,
    saveProgress,
    completeOnboarding,
    setCurrentStep
  };
};