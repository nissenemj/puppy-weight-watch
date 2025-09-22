import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Tervetuloa Pentulaskuriin! 🐾',
    description: 'Tämä sovellus auttaa sinua seuraamaan pentusi kasvua ja kehitystä.',
  },
  {
    id: 'weight-tracking',
    title: 'Painon seuranta',
    description: 'Kirjaa pentusi paino säännöllisesti ja seuraa kasvukäyrää.',
    target: '[data-onboarding="weight-section"]',
    position: 'bottom'
  },
  {
    id: 'food-calculator',
    title: 'Ruokalaskuri',
    description: 'Laske pentusi päivittäinen ruoan tarve iän ja painon perusteella.',
    target: '[data-onboarding="calculator-section"]',
    position: 'bottom'
  },
  {
    id: 'puppy-book',
    title: 'Pentukirja',
    description: 'Tallenna muistoja ja seuraa pentusi virstanpylväitä.',
    target: '[data-onboarding="puppy-book-section"]',
    position: 'bottom'
  }
];

interface UserOnboardingProps {
  show: boolean;
  onComplete: () => void;
}

export const UserOnboarding: React.FC<UserOnboardingProps> = ({ show, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  if (!isVisible || !show) return null;

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
      
      {/* Onboarding Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-[90vw] max-w-md p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} / {onboardingSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Ohita opastus
              </Button>
              
              <Button onClick={handleNext} size="sm">
                {isLastStep ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Aloitetaan!
                  </>
                ) : (
                  <>
                    Seuraava
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex space-x-2 mt-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 rounded-full flex-1',
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return {
    showOnboarding,
    completeOnboarding
  };
};