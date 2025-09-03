import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversationalStep } from '@/components/ui/conversational-step';
import { Dog, Scale, Heart, CheckCircle, Calculator, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import AdvancedFoodCalculator from '@/components/AdvancedFoodCalculator';

interface OnboardingWizardProps {
  user: User;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
  const {
    currentStep,
    dogProfile,
    isLoading,
    updateDogProfile,
    nextStep,
    previousStep,
    completeOnboarding,
    setCurrentStep
  } = useOnboardingState(user);

  const steps = [
    { 
      title: 'Tervetuloa!', 
      icon: Heart, 
      description: 'Aloitetaan pennun profiilin luominen' 
    },
    { 
      title: 'Pennun tiedot', 
      icon: Dog, 
      description: 'Kerro meille pennustasi' 
    },
    { 
      title: 'Ensimmäinen mittaus', 
      icon: Scale, 
      description: 'Tallenna pennun nykyinen paino' 
    },
    { 
      title: 'Ruokalaskuri', 
      icon: Calculator, 
      description: 'Tutustu ruokamäärien laskemiseen' 
    },
    { 
      title: 'Valmista!', 
      icon: CheckCircle, 
      description: 'Profiili on luotu onnistuneesti' 
    }
  ];

  const handleNext = async () => {
    if (currentStep === 3) {
      // Complete onboarding after food calculator step
      const success = await completeOnboarding();
      if (success) {
        setCurrentStep(4); // Move to completion step
      }
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tervetuloa Pentusovellukseen!
              </h2>
              <p className="text-muted-foreground">
                Luodaan pennullesi henkilökohtainen profiili, jossa voit seurata kasvua ja huolehtia oikeasta ravitsemuksesta.
              </p>
            </div>
          </motion.div>
        );

        case 1: {
          const dogQuestions = [
          {
            id: 'name',
            message: 'Mikä on pennun nimi?',
            type: 'text' as const,
            placeholder: 'esim. Musti',
            required: true
          },
          {
            id: 'breed',
            message: 'Mikä rotu pentu on?',
            type: 'text' as const,
            placeholder: 'esim. Labradori'
          },
          {
            id: 'age_years',
            message: 'Kuinka vanha pentu on? (vuosina)',
            type: 'number' as const,
            placeholder: 'esim. 0.5'
          },
          {
            id: 'activity_level',
            message: 'Minkälainen on pennun aktiivisuustaso?',
            type: 'select' as const,
            options: [
              { value: 'low', label: 'Matala - Vähän liikuntaa' },
              { value: 'medium', label: 'Keskitaso - Normaali liikunta' },
              { value: 'high', label: 'Korkea - Paljon liikuntaa' }
            ]
          }
        ];

        return (
          <ConversationalStep
            questions={dogQuestions}
            onComplete={(answers) => {
              updateDogProfile('name', answers.name || '');
              updateDogProfile('breed', answers.breed || '');
              updateDogProfile('age_years', answers.age_years ? Number(answers.age_years) : null);
              updateDogProfile('activity_level', answers.activity_level || 'medium');
              nextStep();
            }}
            initialAnswers={{
              name: dogProfile.name,
              breed: dogProfile.breed,
              age_years: dogProfile.age_years || '',
              activity_level: dogProfile.activity_level
            }}
            isLoading={isLoading}
          />
          );
        }

        case 2: {
          const weightQuestions = [
          {
            id: 'weight_kg',
            message: 'Mikä on pennun nykyinen paino kilogrammoina?',
            type: 'number' as const,
            placeholder: 'esim. 3.5',
            required: true
          }
        ];

        return (
          <ConversationalStep
            questions={weightQuestions}
            onComplete={(answers) => {
              updateDogProfile('weight_kg', answers.weight_kg ? Number(answers.weight_kg) : null);
              nextStep();
            }}
            initialAnswers={{
              weight_kg: dogProfile.weight_kg || ''
            }}
            isLoading={isLoading}
          />
          );
        }

        case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Calculator className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-xl font-semibold">Tutustu ruokalaskuriin</h2>
              <p className="text-muted-foreground mt-2">
                Tässä näet, kuinka paljon ruokaa {dogProfile.name || 'pennun'} tarvitsee päivittäin
              </p>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50">
              <AdvancedFoodCalculator user={null as any} />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Valmista!
              </h2>
              <p className="text-muted-foreground">
                {dogProfile.name || 'Pennun'} profiili on luotu onnistuneesti. Voit nyt aloittaa painonseurannan ja käyttää sovelluksen ominaisuuksia.
              </p>
            </div>
            <Button 
              onClick={onComplete}
              size="lg"
              className="mt-6"
            >
              Aloita sovelluksen käyttö
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return true; // ConversationalStep handles validation
      case 2:
        return true; // ConversationalStep handles validation
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 300 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-primary" })}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-medium text-foreground">
                {steps[currentStep].title}
              </h1>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} / {steps.length}
              </span>
            </div>
            
            <Progress 
              value={(currentStep / (steps.length - 1)) * 100} 
              className="h-2"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep < steps.length - 1 && (currentStep === 0 || currentStep === 3) && (
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Takaisin
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? 'Tallentaa...' : currentStep === steps.length - 2 ? 'Valmis' : 'Seuraava'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;