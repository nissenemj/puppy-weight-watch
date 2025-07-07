import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Loader2, Calculator, Utensils } from 'lucide-react'
import { toast } from 'sonner'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import PuppyFeedingCalculator from './PuppyFeeding'
import CameraComponent from '../../../components/CameraComponent'
import { OCRService } from '@/services/ocrService'
import { User } from '@supabase/supabase-js'

interface FoodCalculatorProps {
  currentWeight?: number
  user?: User
}

interface FoodResult {
  dailyAmount: number
  mealsPerDay: number
  amountPerMeal: number
}

const ACTIVITY_MULTIPLIERS = {
  matala: 0.8,
  keskinkertainen: 1.0,
  korkea: 1.2
}

export default function FoodCalculator({ currentWeight = 0, user }: FoodCalculatorProps) {
  const [weight, setWeight] = useState(currentWeight.toString())
  const [age, setAge] = useState<string>('')
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_MULTIPLIERS>('keskinkertainen')
  const [result, setResult] = useState<FoodResult | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (currentWeight > 0) {
      setWeight(currentWeight.toString())
    }
  }, [currentWeight])

  const calculateFood = () => {
    const weightNum = parseFloat(weight)
    const ageNum = parseFloat(age)

    if (!weightNum || weightNum <= 0) {
      toast.error('Anna kelvollinen paino')
      return
    }

    // Basic puppy food calculation (simplified)
    // This is a rough estimate - real calculations would need more factors
    let baseAmount = weightNum * 50 // Base: 50g per kg of body weight per day
    
    // Age adjustment
    if (ageNum > 0) {
      if (ageNum < 0.5) { // Under 6 months - growing rapidly
        baseAmount *= 1.5
      } else if (ageNum < 1) { // 6-12 months - still growing
        baseAmount *= 1.2
      }
    }

    // Activity level adjustment
    const adjustedAmount = baseAmount * ACTIVITY_MULTIPLIERS[activityLevel]

    // Calculate meals per day based on age
    let mealsPerDay = 2
    if (ageNum > 0) {
      if (ageNum < 0.5) {
        mealsPerDay = 4
      } else if (ageNum < 1) {
        mealsPerDay = 3
      }
    }

    const amountPerMeal = adjustedAmount / mealsPerDay

    setResult({
      dailyAmount: Math.round(adjustedAmount),
      mealsPerDay,
      amountPerMeal: Math.round(amountPerMeal)
    })

    toast.success('Ruokamäärä laskettu!')
  }

  const handleImageCapture = async (imageFile: File) => {
    setIsProcessing(true)
    try {
      // OCR functionality temporarily disabled
      const text = ""
      
      // Try to extract weight and age from the text
      const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/i)
      const ageMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kuukautta|kk|months?)/i)
      
      if (weightMatch) {
        setWeight(weightMatch[1])
        toast.success(`Paino tunnistettu: ${weightMatch[1]} kg`)
      }
      
      if (ageMatch) {
        const ageInYears = parseFloat(ageMatch[1]) / 12
        setAge(ageInYears.toString())
        toast.success(`Ikä tunnistettu: ${ageMatch[1]} kuukautta`)
      }
      
      if (!weightMatch && !ageMatch) {
        toast.error('Painoa tai ikää ei löytynyt kuvasta')
      }
    } catch (error) {
      console.error('OCR processing failed:', error)
      toast.error('Kuvan käsittely epäonnistui')
    } finally {
      setIsProcessing(false)
      setShowCamera(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Ruokalaskuri
          </CardTitle>
          <CardDescription className="text-base">
            Laske optimaaliset ruokamäärät pentusi painon ja iän mukaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-secondary/20">
              <TabsTrigger 
                value="basic" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
              >
                <Calculator className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Peruslaskuri</span>
                <span className="sm:hidden">Perus</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
              >
                <Utensils className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Edistynyt</span>
                <span className="sm:hidden">Expert</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base font-medium">Paino (kg)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="esim. 3.5"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCamera(true)}
                      className="h-12 w-12 rounded-xl border-2"
                      title="Tunnista paino kuvasta"
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-medium">Ikä (vuotta)</Label>
                  <Input
                    id="age"
                    type="number"
                    step="0.1"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="esim. 0.5"
                    className="h-12 text-base rounded-xl border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Aktiivisuustaso</Label>
                <Select value={activityLevel} onValueChange={(value: any) => setActivityLevel(value)}>
                  <SelectTrigger className="h-12 text-base rounded-xl border-2 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg rounded-xl z-50">
                    <SelectItem value="matala">Matala - Levokas sisäkoira</SelectItem>
                    <SelectItem value="keskinkertainen">Keskinkertainen - Normaali aktiivisuus</SelectItem>
                    <SelectItem value="korkea">Korkea - Erittäin aktiivinen/työkoira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateFood}
                disabled={!weight || isProcessing}
                className="w-full h-12 text-base rounded-xl bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Käsitellään...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Laske ruokamäärä
                  </>
                )}
              </Button>

              {result && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Suositellut ruokamäärät
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/60 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">{result.dailyAmount}g</div>
                      <div className="text-sm text-green-600">päivässä yhteensä</div>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">{result.mealsPerDay}</div>
                      <div className="text-sm text-green-600">ateriaa päivässä</div>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">{result.amountPerMeal}g</div>
                      <div className="text-sm text-green-600">per ateria</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/60 rounded-xl">
                    <p className="text-sm text-green-700">
                      💡 <strong>Vinkki:</strong> Seuraa pentusi painoa ja säädä ruokamääriä tarpeen mukaan. 
                      Konsultoi eläinlääkäriä merkittävistä muutoksista.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              {user ? (
                <AdvancedFoodCalculator user={user} currentWeight={parseFloat(weight) || 0} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Kirjaudu sisään käyttääksesi edistynyttä laskuria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tunnista paino kuvasta</h3>
            <div className="p-4 text-center text-gray-500">
              Kameratoiminto tulossa pian
              <Button onClick={() => setShowCamera(false)} className="mt-4">
                Sulje
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}