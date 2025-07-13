import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Scale, 
  Dog, 
  Heart,
  Activity,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { LoadingSpinner, FeedbackMessage, ProgressiveLoader } from './UXOptimizations';
import { useResponsive } from './UXOptimizations';

interface CalculationStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
}

interface CalculationData {
  dogName: string;
  breed: string;
  currentWeight: number;
  targetWeight: number;
  age: number;
  activityLevel: number;
  foodType: string;
}

export const EnhancedCalculator = () => {
  const { isMobile } = useResponsive();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [calculationData, setCalculationData] = useState<CalculationData>({
    dogName: '',
    breed: '',
    currentWeight: 0,
    targetWeight: 0,
    age: 0,
    activityLevel: 1,
    foodType: 'dry'
  });

  const steps: CalculationStep[] = [
    {
      id: 'basic-info',
      title: 'Perustiedot',
      description: 'Syötä pennusi nimi ja rotu',
      isCompleted: !!(calculationData.dogName && calculationData.breed),
      isRequired: true
    },
    {
      id: 'weight-info',
      title: 'Painotiedot',
      description: 'Nykyinen ja tavoite paino',
      isCompleted: !!(calculationData.currentWeight && calculationData.targetWeight),
      isRequired: true
    },
    {
      id: 'age-activity',
      title: 'Ikä ja aktiivisuus',
      description: 'Pennun ikä ja aktiivisuustaso',
      isCompleted: !!(calculationData.age && calculationData.activityLevel),
      isRequired: true
    },
    {
      id: 'food-preferences',
      title: 'Ruokavalinta',
      description: 'Valitse ruoan tyyppi',
      isCompleted: !!calculationData.foodType,
      isRequired: true
    }
  ];

  const progress = (steps.filter(step => step.isCompleted).length / steps.length) * 100;

  const handleInputChange = (field: keyof CalculationData, value: any) => {
    setCalculationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCalculate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCalculating(false);
    setShowResult(true);
  };

  const handleReset = () => {
    setCalculationData({
      dogName: '',
      breed: '',
      currentWeight: 0,
      targetWeight: 0,
      age: 0,
      activityLevel: 1,
      foodType: 'dry'
    });
    setCurrentStep(0);
    setShowResult(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="dogName">Pennun nimi</Label>
              <Input
                id="dogName"
                placeholder="esim. Nalle"
                value={calculationData.dogName}
                onChange={(e) => handleInputChange('dogName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Rotu</Label>
              <Select
                value={calculationData.breed}
                onValueChange={(value) => handleInputChange('breed', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Valitse rotu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="golden-retriever">Kultainen noutaja</SelectItem>
                  <SelectItem value="labrador">Labradorinnoutaja</SelectItem>
                  <SelectItem value="german-shepherd">Saksanpaimenkoira</SelectItem>
                  <SelectItem value="border-collie">Border collie</SelectItem>
                  <SelectItem value="other">Muu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentWeight">Nykyinen paino (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                placeholder="esim. 5.2"
                value={calculationData.currentWeight || ''}
                onChange={(e) => handleInputChange('currentWeight', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Tavoite paino aikuisena (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                placeholder="esim. 25"
                value={calculationData.targetWeight || ''}
                onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value) || 0)}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="age">Ikä (kuukautta)</Label>
              <Input
                id="age"
                type="number"
                placeholder="esim. 3"
                value={calculationData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-4">
              <Label>Aktiivisuustaso</Label>
              <div className="space-y-2">
                {[
                  { value: 0.8, label: 'Rauhallinen', description: 'Vähän liikuntaa' },
                  { value: 1.0, label: 'Normaali', description: 'Tavallinen aktiivisuus' },
                  { value: 1.2, label: 'Aktiivinen', description: 'Paljon liikuntaa' }
                ].map((level) => (
                  <motion.div
                    key={level.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      calculationData.activityLevel === level.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('activityLevel', level.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                      {calculationData.activityLevel === level.value && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Ruoan tyyppi</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'dry', label: 'Kuivaruoka', description: 'Nappulat' },
                  { value: 'wet', label: 'Märkäruoka', description: 'Säilykkeet' },
                  { value: 'raw', label: 'Raakaruoka', description: 'Luonnonmukainen' },
                  { value: 'mixed', label: 'Sekaruokinta', description: 'Yhdistelmä' }
                ].map((type) => (
                  <motion.div
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      calculationData.foodType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('foodType', type.value)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl">Laskenta valmis!</CardTitle>
            <CardDescription>
              Tässä ovat pennusi optimaaliset ruokamäärät
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Result content would go here */}
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-primary">150g</div>
              <p className="text-muted-foreground">Päivittäinen ruokamäärä</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">Aamulla</div>
                <div className="text-2xl font-bold text-blue-600">75g</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">Illalla</div>
                <div className="text-2xl font-bold text-green-600">75g</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Uusi laskenta
              </Button>
              <Button className="flex-1">
                Tallenna tulokset
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Calculator className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Pentulaskuri</h1>
          <p className="text-muted-foreground">
            Laske pennusi optimaaliset ruokamäärät
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Edistyminen</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </div>
              <Badge variant={steps[currentStep].isCompleted ? "default" : "secondary"}>
                {steps[currentStep].isCompleted ? "Valmis" : "Kesken"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Edellinen
              </Button>

              <Button
                onClick={handleNext}
                disabled={!steps[currentStep].isCompleted || isCalculating}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    {isCalculating ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        Laske
                        <Calculator className="h-4 w-4" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Seuraava
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Vinkki</AlertTitle>
            <AlertDescription>
              Tarkista aina pennusi paino säännöllisesti ja säädä ruokamääriä tarpeen mukaan.
              Jos olet epävarma, ota yhteyttä eläinlääkäriin.
            </AlertDescription>
          </Alert>
        </motion.div>
      </motion.div>
    </div>
  );
};