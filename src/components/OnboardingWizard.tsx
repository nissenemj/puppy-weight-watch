import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Scale, Heart, TrendingUp, Calculator, Check } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Import the generated assets
import heroIllustration from '@/assets/hero-illustration.png'

interface OnboardingWizardProps {
  user: User
  onComplete: () => void
}

interface DogProfile {
  name: string
  breed: string
  age_years: number | null
  weight_kg: number | null
  activity_level: string
}

export default function OnboardingWizard({ user, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dogProfile, setDogProfile] = useState<DogProfile>({
    name: '',
    breed: '',
    age_years: null,
    weight_kg: null,
    activity_level: 'keskinkertainen'
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const steps = [
    {
      title: "Tervetuloa Pentulaskuriin!",
      subtitle: "Miksi seurata pennun kasvua?",
      icon: Heart
    },
    {
      title: "Luo koirasi profiili",
      subtitle: "Kerro meille koirastasi",
      icon: Heart
    },
    {
      title: "Ensimmäinen mittaus",
      subtitle: "Lisää pentusi nykypaino",
      icon: Scale
    },
    {
      title: "Valmista!",
      subtitle: "Olet valmis aloittamaan",
      icon: Check
    }
  ]

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate dog profile
      if (!dogProfile.name || !dogProfile.breed) {
        toast({
          title: "Tiedot puuttuvat",
          description: "Anna koiralle nimi ja rotu",
          variant: "destructive"
        })
        return
      }
    }

    if (currentStep === 2) {
      if (!dogProfile.weight_kg) {
        toast({
          title: "Paino puuttuu",
          description: "Anna pentusi nykypaino",
          variant: "destructive"
        })
        return
      }
      
      // Save dog profile and complete onboarding
      await saveDogProfile()
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveDogProfile = async () => {
    setLoading(true)
    try {
      // Save dog profile
      const { error: dogError } = await supabase
        .from('dogs')
        .insert([{
          ...dogProfile,
          user_id: user.id
        }])

      if (dogError) throw dogError

      // Add first weight entry
      const today = new Date().toISOString().split('T')[0]
      const { error: weightError } = await supabase
        .from('weight_entries')
        .insert([{
          user_id: user.id,
          date: today,
          weight: dogProfile.weight_kg!
        }])

      if (weightError) throw weightError

      toast({
        title: "Profiili luotu!",
        description: "Koirasi profiili ja ensimmäinen mittaus on tallennettu"
      })
    } catch (error: any) {
      toast({
        title: "Virhe",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateDogProfile = (key: keyof DogProfile, value: any) => {
    setDogProfile(prev => ({ ...prev, [key]: value }))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Vaihe {currentStep + 1} / {steps.length}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onComplete}
              className="text-gray-500 hover:text-gray-700"
            >
              Ohita
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-warm rounded-2xl">
                {(() => {
                  const IconComponent = steps[currentStep].icon
                  return <IconComponent className="h-8 w-8 text-white" />
                })()}
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-warm bg-clip-text text-transparent">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {steps[currentStep].subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {currentStep === 0 && (
              <div className="space-y-6 text-center">
                <img 
                  src={heroIllustration} 
                  alt="Pentulaskuri" 
                  className="w-64 h-48 mx-auto object-contain"
                />
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Seuraa kasvua</h4>
                      <p className="text-sm text-gray-600">Pidä kirjaa pennun kehityksestä</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <Calculator className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Laske ruokamäärät</h4>
                      <p className="text-sm text-gray-600">Optimaaliset ruoka-annokset painon mukaan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <Heart className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Terve kasvu</h4>
                      <p className="text-sm text-gray-600">Varmista pennun optimaalinen kehitys</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dogName" className="text-base font-medium">Koiran nimi *</Label>
                    <Input
                      id="dogName"
                      type="text"
                      value={dogProfile.name}
                      onChange={(e) => updateDogProfile('name', e.target.value)}
                      placeholder="esim. Musti"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dogBreed" className="text-base font-medium">Rotu *</Label>
                    <Input
                      id="dogBreed"
                      type="text"
                      value={dogProfile.breed}
                      onChange={(e) => updateDogProfile('breed', e.target.value)}
                      placeholder="esim. Kultainennoutaja"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dogAge" className="text-base font-medium">Ikä (vuotta)</Label>
                    <Input
                      id="dogAge"
                      type="number"
                      step="0.1"
                      value={dogProfile.age_years || ''}
                      onChange={(e) => updateDogProfile('age_years', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="esim. 0.5"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Aktiivisuus</Label>
                    <Select 
                      value={dogProfile.activity_level} 
                      onValueChange={(value) => updateDogProfile('activity_level', value)}
                    >
                      <SelectTrigger className="h-12 text-base rounded-xl border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matala">Matala</SelectItem>
                        <SelectItem value="keskinkertainen">Keskinkertainen</SelectItem>
                        <SelectItem value="korkea">Korkea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Scale className="h-16 w-16 mx-auto text-primary mb-4" />
                  <p className="text-gray-600">
                    Lisää {dogProfile.name}n nykypaino aloittaaksesi kasvun seurannan.
                  </p>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <Label htmlFor="currentWeight" className="text-base font-medium">Nykypaino (kg) *</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    value={dogProfile.weight_kg || ''}
                    onChange={(e) => updateDogProfile('weight_kg', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="esim. 3.2"
                    className="h-16 text-xl text-center rounded-xl border-2 focus:border-primary mt-2"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <Check className="h-16 w-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Valmista! 🎉
                  </h3>
                  <p className="text-gray-600">
                    {dogProfile.name}n profiili on luotu ja ensimmäinen mittaus tallennettu. 
                    Voit nyt seurata kasvua ja laskea ruokamääriä!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Takaisin
              </Button>

              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity"
              >
                {currentStep === steps.length - 1 ? 'Aloita käyttö' : 'Seuraava'}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}