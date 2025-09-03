import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calculator, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'

interface DogFood {
  id: string
  name: string
  manufacturer: string
  product_code: string
  food_type: string
  nutrition_type: string
  dosage_method: string
  notes?: string
}

interface FeedingGuideline {
  id: string
  current_weight_kg?: number
  adult_weight_kg?: number
  age_months?: string
  daily_amount_min?: number
  daily_amount_max?: number
  calculation_formula?: string
  size_category?: string
}

interface AdvancedFoodCalculatorProps {
  user: User
  currentWeight?: number
}

export default function AdvancedFoodCalculator({ user, currentWeight: propCurrentWeight }: AdvancedFoodCalculatorProps) {
  const [currentWeight, setCurrentWeight] = useState(propCurrentWeight?.toString() || '')
  const [ageMonths, setAgeMonths] = useState('')
  const [adultWeight, setAdultWeight] = useState('')
  const [sizeCategory, setSizeCategory] = useState('')
  const [activityLevel, setActivityLevel] = useState('keskinkertainen')
  const [selectedFood, setSelectedFood] = useState('')
  
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [feedingGuidelines, setFeedingGuidelines] = useState<FeedingGuideline[]>([])
  const [result, setResult] = useState<any>(null)
  const [selectedGuideline, setSelectedGuideline] = useState<FeedingGuideline | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchDogFoods()
  }, [])

  useEffect(() => {
    if (selectedFood) {
      fetchFeedingGuidelines(selectedFood)
    }
  }, [selectedFood])

  useEffect(() => {
    if (propCurrentWeight && propCurrentWeight > 0) {
      setCurrentWeight(propCurrentWeight.toString())
    }
  }, [propCurrentWeight])

  const fetchDogFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_foods')
        .select('*')
        .order('manufacturer', { ascending: true })

      if (error) throw error
      setDogFoods((data || []) as any)
    } catch (error) {
      console.error('Error fetching dog foods:', error)
      toast({
        title: "Virhe",
        description: "Koiranruokien lataaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const fetchFeedingGuidelines = async (foodId: string) => {
    try {
      const { data, error } = await supabase
        .from('feeding_guidelines')
        .select('*')
        .eq('dog_food_id', foodId)
        .order('current_weight_kg', { ascending: true, nullsFirst: false })

      if (error) throw error
      setFeedingGuidelines((data || []) as any)
    } catch (error) {
      console.error('Error fetching feeding guidelines:', error)
      toast({
        title: "Virhe",
        description: "Ruokintaohjeiden lataaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const calculateAdvancedFeeding = () => {
    const weightNum = parseFloat(currentWeight)
    const ageNum = parseFloat(ageMonths)
    const adultWeightNum = parseFloat(adultWeight)

    if (!weightNum || weightNum <= 0) {
      toast({
        title: "Virhe",
        description: "Anna kelvollinen nykypaino",
        variant: "destructive"
      })
      return
    }

    if (!selectedFood) {
      toast({
        title: "Virhe", 
        description: "Valitse koiranruoka",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    // Find matching feeding guideline
    let matchingGuideline = null
    
    // Try to find best match based on current weight
    if (feedingGuidelines.length > 0) {
      matchingGuideline = feedingGuidelines.find(guideline => {
        if (guideline.current_weight_kg) {
          return weightNum <= guideline.current_weight_kg + 0.5 && weightNum >= guideline.current_weight_kg - 0.5
        }
        return false
      })

      // If no weight match, try to find by size category
      if (!matchingGuideline && sizeCategory) {
        matchingGuideline = feedingGuidelines.find(g => g.size_category === sizeCategory)
      }

      // If still no match, use first available guideline
      if (!matchingGuideline) {
        matchingGuideline = feedingGuidelines[0]
      }
    }

    if (!matchingGuideline) {
      toast({
        title: "Virhe",
        description: "Ei löytynyt sopivia ruokintaohjeita valitulle ruoalle",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    setSelectedGuideline(matchingGuideline)

    // Calculate daily amount based on guideline
    let dailyAmount = 0
    
    if (matchingGuideline.daily_amount_min && matchingGuideline.daily_amount_max) {
      // Use average of min and max
      dailyAmount = (matchingGuideline.daily_amount_min + matchingGuideline.daily_amount_max) / 2
    } else if (matchingGuideline.calculation_formula) {
      // Try to parse and apply formula (simplified)
      const formula = matchingGuideline.calculation_formula.toLowerCase()
      if (formula.includes('weight')) {
        // Extract multiplier from formula (simplified parsing)
        const multiplierMatch = formula.match(/(\d+(?:\.\d+)?)/g)
        if (multiplierMatch) {
          const multiplier = parseFloat(multiplierMatch[0])
          dailyAmount = weightNum * multiplier
        }
      }
    } else {
      // Fallback calculation
      dailyAmount = weightNum * 50 // 50g per kg as baseline
    }

    // Activity level adjustment
    const activityMultipliers = {
      matala: 0.8,
      keskinkertainen: 1.0,
      korkea: 1.2
    }
    
    dailyAmount *= activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.0

    // Age adjustment for puppies
    if (ageNum > 0 && ageNum < 12) {
      if (ageNum < 6) {
        dailyAmount *= 1.5 // Young puppies need more
      } else {
        dailyAmount *= 1.2 // Older puppies still growing
      }
    }

    // Calculate meals per day based on age
    let mealsPerDay = 2
    if (ageNum > 0) {
      if (ageNum < 4) {
        mealsPerDay = 4
      } else if (ageNum < 8) {
        mealsPerDay = 3
      }
    }

    const amountPerMeal = dailyAmount / mealsPerDay

    setResult({
      dailyAmount: Math.round(dailyAmount),
      mealsPerDay,
      amountPerMeal: Math.round(amountPerMeal),
      selectedFood: dogFoods.find(f => f.id === selectedFood),
      guideline: matchingGuideline
    })

    toast({
      title: "Laskenta valmis! 🎯",
      description: "Ruokamäärät laskettu valitun ruoan mukaan"
    })

    setLoading(false)
  }

  const selectedFoodInfo = dogFoods.find(f => f.id === selectedFood)

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Edistynyt ruokalaskuri
          </CardTitle>
          <CardDescription className="text-base">
            Tarkat ruokamäärät valitun ruoan ja tarkkojen tietojen perusteella
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dog Food Selection - Mobile Optimized */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Koiranruoka *</Label>
            <Select value={selectedFood} onValueChange={setSelectedFood}>
              <SelectTrigger className="h-12 text-base rounded-xl border-2 bg-white">
                <SelectValue placeholder="Valitse koiranruoka..." />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg rounded-xl z-50 max-h-60">
                {dogFoods.map((food) => (
                  <SelectItem key={food.id} value={food.id} className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{food.name}</span>
                      <span className="text-sm text-gray-500">{food.manufacturer}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFoodInfo && (
              <div className="mt-2 p-3 bg-blue-50 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white border-blue-500 text-blue-700">
                    {selectedFoodInfo.food_type}
                  </Badge>
                  <Badge variant="outline" className="bg-white border-green-500 text-green-700">
                    {selectedFoodInfo.nutrition_type}
                  </Badge>
                </div>
                {selectedFoodInfo.notes && (
                  <p className="text-sm text-gray-600 mt-2">{selectedFoodInfo.notes}</p>
                )}
              </div>
            )}
          </div>

          {/* Basic Info Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="text-base font-medium">Nykypaino (kg) *</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="esim. 5.2"
                className="h-12 text-base rounded-xl border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageMonths" className="text-base font-medium">Ikä (kuukautta)</Label>
              <Input
                id="ageMonths"
                type="number"
                step="1"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                placeholder="esim. 6"
                className="h-12 text-base rounded-xl border-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adultWeight" className="text-base font-medium">Aikuispainon arvio (kg)</Label>
              <Input
                id="adultWeight"
                type="number"
                step="0.5"
                value={adultWeight}
                onChange={(e) => setAdultWeight(e.target.value)}
                placeholder="esim. 25"
                className="h-12 text-base rounded-xl border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Kokoluokka</Label>
              <Select value={sizeCategory} onValueChange={setSizeCategory}>
                <SelectTrigger className="h-12 text-base rounded-xl border-2 bg-white">
                  <SelectValue placeholder="Valitse kokoluokka..." />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg rounded-xl z-50">
                  <SelectItem value="toy">Toy (alle 4 kg)</SelectItem>
                  <SelectItem value="small">Pieni (4-10 kg)</SelectItem>
                  <SelectItem value="medium">Keskikokoinen (10-25 kg)</SelectItem>
                  <SelectItem value="large">Iso (25-45 kg)</SelectItem>
                  <SelectItem value="giant">Jättimäinen (yli 45 kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Aktiivisuustaso</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
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
            onClick={calculateAdvancedFeeding}
            disabled={!currentWeight || !selectedFood || loading}
            className="w-full h-12 text-base rounded-xl bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Lasketaan...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Laske tarkat ruokamäärät
              </>
            )}
          </Button>

          {/* Results Display - Mobile Optimized */}
          {result && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4 text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {result.selectedFood?.name} - Ruokintasuositus
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
              </div>

              {selectedGuideline && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Käytetty annostelutaulukko
                  </h5>
                  <div className="text-sm text-blue-700 space-y-1">
                    {selectedGuideline.current_weight_kg && (
                      <p>• Painoluokka: {selectedGuideline.current_weight_kg} kg</p>
                    )}
                    {selectedGuideline.age_months && (
                      <p>• Ikäluokka: {selectedGuideline.age_months}</p>
                    )}
                    {selectedGuideline.size_category && (
                      <p>• Kokoluokka: {selectedGuideline.size_category}</p>
                    )}
                    {selectedGuideline.daily_amount_min && selectedGuideline.daily_amount_max && (
                      <p>• Suositeltu vaihteluväli: {selectedGuideline.daily_amount_min}-{selectedGuideline.daily_amount_max}g</p>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  <strong>Huomio:</strong> Nämä ovat suuntaa-antavia ohjeita. Seuraa koirasi painoa ja kuntoa, 
                  ja säädä ruokamääriä tarpeen mukaan. Konsultoi eläinlääkäriä merkittävistä muutoksista.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}