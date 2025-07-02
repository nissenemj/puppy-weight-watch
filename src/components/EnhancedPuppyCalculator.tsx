import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  AlertTriangle, 
  Info, 
  Scale, 
  Dog, 
  Shield, 
  Heart,
  Activity
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface DogFood {
  id: string
  name: string
  manufacturer: string
  dosage_method: string
  nutrition_type: string
  food_type: string
  notes?: string
}

interface FeedingGuideline {
  id: string
  dog_food_id: string
  current_weight_kg?: number
  adult_weight_kg?: number
  age_months?: string
  daily_amount_min?: number
  daily_amount_max?: number
  size_category?: string
  calculation_formula?: string
}

interface CalculationResult {
  amount: number | null
  minAmount?: number
  maxAmount?: number
  warning?: string
  disclaimers: string[]
  activityAdjustment?: string
  mealSchedule?: string
}

const ACTIVITY_LEVELS = [
  { value: 0.8, label: 'Rauhallinen pentu' },
  { value: 1.0, label: 'Normaali pentu' },
  { value: 1.2, label: 'Aktiivinen pentu' }
]

const DISCLAIMERS = {
  general: "Tämä annostus on viitteellinen. Tarkkaile pentusi kuntoluokkaa ja yleisvointia, ja sopeuta annosta tarvittaessa. Varmista aina, että raikasta vettä on saatavilla.",
  mixedFeeding: "Jos korvaat osan tästä täysravinnosta toisella tuotteella, varmista, että myös toinen tuote on ravitsemuksellisesti täydellistä täysravintoa, jotta pentusi saa kaikki tarvitsemansa ravintoaineet.",
  professional: "Jos olet epävarma pennun ruokinnasta tai huomaat muutoksia pennun voinnissa, ota yhteyttä eläinlääkäriin."
}

export default function EnhancedPuppyCalculator() {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [guidelines, setGuidelines] = useState<FeedingGuideline[]>([])
  const [selectedFood, setSelectedFood] = useState<DogFood | null>(null)
  const [currentWeight, setCurrentWeight] = useState('')
  const [adultWeight, setAdultWeight] = useState('')
  const [ageMonths, setAgeMonths] = useState('')
  const [activityLevel, setActivityLevel] = useState([1.0])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDogFoods()
  }, [])

  const fetchDogFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_foods')
        .select('*')
        .order('manufacturer', { ascending: true })

      if (error) throw error
      setDogFoods(data || [])
    } catch (error) {
      console.error('Error fetching dog foods:', error)
      toast.error('Virhe ruokien lataamisessa')
    }
  }

  const fetchGuidelines = async (foodId: string) => {
    try {
      const { data, error } = await supabase
        .from('feeding_guidelines')
        .select('*')
        .eq('dog_food_id', foodId)

      if (error) throw error
      setGuidelines(data || [])
    } catch (error) {
      console.error('Error fetching guidelines:', error)
      setGuidelines([])
    }
  }

  const handleFoodSelection = (foodId: string) => {
    const food = dogFoods.find(f => f.id === foodId)
    setSelectedFood(food || null)
    setResult(null)
    
    if (food) {
      fetchGuidelines(food.id)
    }
  }

  const getRequiredInputs = () => {
    if (!selectedFood) return []
    
    const inputs = []
    
    switch (selectedFood.dosage_method) {
      case 'odotettu_aikuispaino_ja_ikä':
        inputs.push('adultWeight', 'ageMonths', 'activity')
        break
      case 'nykyinen_paino':
        inputs.push('currentWeight', 'ageMonths', 'activity')
        break
      case 'prosentti_nykyisestä_painosta':
        inputs.push('currentWeight', 'ageMonths', 'activity')
        break
      case 'kokoluokka':
        inputs.push('adultWeight', 'activity')
        break
      default:
        return ['none'] // Ei tietoa saatavilla
    }
    
    return inputs
  }

  const calculateFeeding = async () => {
    if (!selectedFood) return
    
    setLoading(true)
    
    try {
      const requiredInputs = getRequiredInputs()
      
      if (requiredInputs.includes('none')) {
        setResult({
          amount: null,
          warning: 'Tarkkaa annosteluohjetta ei ole saatavilla digitaalisessa muodossa.',
          disclaimers: [DISCLAIMERS.general, 'Tarkista annostus tuotepakkauksesta.']
        })
        setLoading(false)
        return
      }
      
      // Validate required inputs
      const validationErrors = []
      if (requiredInputs.includes('currentWeight') && !currentWeight) {
        validationErrors.push('Syötä pennun nykyinen paino')
      }
      if (requiredInputs.includes('adultWeight') && !adultWeight) {
        validationErrors.push('Syötä odotettu aikuispaino')
      }
      if (requiredInputs.includes('ageMonths') && !ageMonths) {
        validationErrors.push('Syötä pennun ikä kuukausina')
      }
      
      if (validationErrors.length > 0) {
        setResult({
          amount: null,
          warning: validationErrors.join(', '),
          disclaimers: [DISCLAIMERS.general]
        })
        setLoading(false)
        return
      }
      
      // Perform calculation based on method
      const calculation = await performCalculation()
      setResult(calculation)
      
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Virhe laskennassa')
    } finally {
      setLoading(false)
    }
  }

  const performCalculation = async (): Promise<CalculationResult> => {
    if (!selectedFood) throw new Error('No food selected')
    
    const currentWeightNum = parseFloat(currentWeight)
    const adultWeightNum = parseFloat(adultWeight)
    const ageMonthsNum = parseFloat(ageMonths)
    const activityMultiplier = activityLevel[0]
    
    let baseAmount: number | null = null
    let minAmount: number | undefined
    let maxAmount: number | undefined
    let warning: string | undefined
    
    // Find matching guideline
    const matchingGuidelines = guidelines.filter(g => {
      if (selectedFood.dosage_method === 'odotettu_aikuispaino_ja_ikä') {
        return g.adult_weight_kg === adultWeightNum && 
               g.age_months && isAgeInRange(ageMonthsNum, g.age_months)
      } else if (selectedFood.dosage_method === 'nykyinen_paino') {
        return g.current_weight_kg && 
               currentWeightNum >= g.current_weight_kg - 1 && 
               currentWeightNum <= g.current_weight_kg + 1
      } else if (selectedFood.dosage_method === 'kokoluokka') {
        return g.adult_weight_kg === adultWeightNum
      }
      return false
    })
    
    if (matchingGuidelines.length > 0) {
      const guideline = matchingGuidelines[0]
      if (guideline.daily_amount_min && guideline.daily_amount_max) {
        baseAmount = Math.round((guideline.daily_amount_min + guideline.daily_amount_max) / 2)
        minAmount = guideline.daily_amount_min
        maxAmount = guideline.daily_amount_max
      } else if (guideline.daily_amount_min) {
        baseAmount = guideline.daily_amount_min
      }
    } else {
      // Fallback calculation if no exact match
      if (selectedFood.dosage_method === 'nykyinen_paino' || 
          selectedFood.dosage_method === 'prosentti_nykyisestä_painosta') {
        // Use percentage of current weight for raw foods
        let percentage = 0.06 // 6% default for puppies
        if (ageMonthsNum <= 2) percentage = 0.09
        else if (ageMonthsNum <= 4) percentage = 0.065
        else if (ageMonthsNum <= 6) percentage = 0.045
        else if (ageMonthsNum <= 9) percentage = 0.03
        else percentage = 0.025
        
        baseAmount = Math.round(currentWeightNum * 1000 * percentage)
        warning = 'Laskettu yleiskaavalla raakaruoalle'
      }
    }
    
    // Apply activity adjustment
    if (baseAmount && activityMultiplier !== 1.0) {
      baseAmount = Math.round(baseAmount * activityMultiplier)
      if (minAmount) minAmount = Math.round(minAmount * activityMultiplier)
      if (maxAmount) maxAmount = Math.round(maxAmount * activityMultiplier)
    }
    
    // Generate meal schedule
    const mealSchedule = generateMealSchedule(ageMonthsNum)
    
    // Activity adjustment description
    const activityAdjustment = activityMultiplier !== 1.0 
      ? `Annostus on säädetty ${ACTIVITY_LEVELS.find(a => a.value === activityMultiplier)?.label.toLowerCase()} mukaan (${activityMultiplier}x)`
      : undefined
    
    // Compile disclaimers
    const disclaimers = [DISCLAIMERS.general]
    if (selectedFood.nutrition_type === 'täysravinto') {
      disclaimers.push(DISCLAIMERS.mixedFeeding)
    }
    disclaimers.push(DISCLAIMERS.professional)
    
    return {
      amount: baseAmount,
      minAmount,
      maxAmount,
      warning,
      disclaimers,
      activityAdjustment,
      mealSchedule
    }
  }

  const isAgeInRange = (age: number, range: string): boolean => {
    const parts = range.split('-')
    if (parts.length !== 2) return false
    
    const min = parseFloat(parts[0])
    const max = parseFloat(parts[1])
    return age >= min && age <= max
  }

  const generateMealSchedule = (ageMonths: number): string => {
    if (ageMonths <= 2) return 'Jaa päiväannos 4-5 osaan. Syötä 3-4 tunnin välein.'
    if (ageMonths <= 4) return 'Jaa päiväannos 3-4 osaan. Syötä säännöllisesti päivän aikana.'
    if (ageMonths <= 6) return 'Jaa päiväannos 3 osaan. Aamulla, keskipäivällä ja illalla.'
    return 'Jaa päiväannos 2 osaan. Aamulla ja illalla.'
  }

  const renderInputs = () => {
    const requiredInputs = getRequiredInputs()
    
    if (requiredInputs.includes('none')) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Ei digitaalista annostelutietoa</AlertTitle>
          <AlertDescription>
            Tarkista annostus tuotepakkauksesta. Sovellus ei pysty laskemaan annosta tälle ruoalle automaattisesti.
          </AlertDescription>
        </Alert>
      )
    }
    
    return (
      <div className="grid gap-4">
        {requiredInputs.includes('currentWeight') && (
          <div className="space-y-2">
            <Label htmlFor="currentWeight">Pennun nykyinen paino (kg)</Label>
            <Input
              id="currentWeight"
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="esim. 3.5"
            />
          </div>
        )}
        
        {requiredInputs.includes('adultWeight') && (
          <div className="space-y-2">
            <Label htmlFor="adultWeight">Odotettu aikuispaino (kg)</Label>
            <Input
              id="adultWeight"
              type="number"
              step="0.5"
              value={adultWeight}
              onChange={(e) => setAdultWeight(e.target.value)}
              placeholder="esim. 15"
            />
          </div>
        )}
        
        {requiredInputs.includes('ageMonths') && (
          <div className="space-y-2">
            <Label htmlFor="ageMonths">Pennun ikä (kuukausia)</Label>
            <Input
              id="ageMonths"
              type="number"
              step="0.5"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              placeholder="esim. 4"
            />
          </div>
        )}
        
        {requiredInputs.includes('activity') && (
          <div className="space-y-3">
            <Label>Aktiivisuustaso</Label>
            <div className="px-2">
              <Slider
                value={activityLevel}
                onValueChange={setActivityLevel}
                min={0.8}
                max={1.2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Rauhallinen</span>
                <span>Normaali</span>
                <span>Aktiivinen</span>
              </div>
              <p className="text-sm text-center mt-2">
                {ACTIVITY_LEVELS.find(a => Math.abs(a.value - activityLevel[0]) < 0.05)?.label || 'Mukautettu'}
                {activityLevel[0] !== 1.0 && ` (${activityLevel[0]}x)`}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dog className="h-5 w-5" />
            Dynaaminen penturuokintlaskuri
          </CardTitle>
          <CardDescription>
            Valitse ruoka ja sovellus pyytää automaattisesti tarvittavat tiedot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="foodSelect">Valitse ruoka</Label>
            <Select onValueChange={handleFoodSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse ruokamerkki ja tuote" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(
                  dogFoods.reduce((acc, food) => {
                    if (!acc[food.manufacturer]) acc[food.manufacturer] = []
                    acc[food.manufacturer].push(food)
                    return acc
                  }, {} as Record<string, DogFood[]>)
                ).map(([manufacturer, foods]) => (
                  <div key={manufacturer}>
                    <div className="px-2 py-1.5 text-sm font-semibold">{manufacturer}</div>
                    {foods.map((food) => (
                      <SelectItem key={food.id} value={food.id}>
                        {food.name}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {food.food_type}
                        </Badge>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFood && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Annosteluperuste</AlertTitle>
                <AlertDescription>
                  {getInstructionText(selectedFood.dosage_method)}
                </AlertDescription>
              </Alert>

              {renderInputs()}

              <Button 
                onClick={calculateFeeding} 
                disabled={loading || !selectedFood}
                className="w-full"
              >
                {loading ? 'Lasketaan...' : 'Laske ruokamäärä'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Laskentatulos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.amount ? (
              <div className="grid gap-4">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {result.minAmount && result.maxAmount 
                      ? `${result.minAmount}-${result.maxAmount}g`
                      : `${result.amount}g`
                    }
                  </div>
                  <p className="text-muted-foreground">päivittäinen ruokamäärä</p>
                </div>

                {result.activityAdjustment && (
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>{result.activityAdjustment}</AlertDescription>
                  </Alert>
                )}

                {result.mealSchedule && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium mb-2">Ruokintaohje:</p>
                    <p className="text-sm">{result.mealSchedule}</p>
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{result.warning}</AlertDescription>
              </Alert>
            )}

            {/* Disclaimers */}
            <div className="space-y-3">
              {result.disclaimers.map((disclaimer, index) => (
                <Alert key={index} variant="default">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {disclaimer}
                  </AlertDescription>
                </Alert>
              ))}
            </div>

            {/* Professional help recommendation */}
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertTitle>Muista</AlertTitle>
              <AlertDescription>
                Pennun terveys ja hyvinvointi ovat aina etusijalla. Epävarmuuden vallitessa ota yhteyttä eläinlääkäriin.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const getInstructionText = (dosageMethod: string) => {
  switch (dosageMethod) {
    case 'odotettu_aikuispaino_ja_ikä':
      return 'Tämä ruoka annostellaan odotetun aikuispainon ja pennun iän perusteella.'
    case 'nykyinen_paino':
      return 'Tämä ruoka annostellaan pennun nykyisen painon perusteella.'
    case 'prosentti_nykyisestä_painosta':
      return 'Tämä ruoka annostellaan prosenttiosuutena pennun nykyisestä painosta.'
    case 'kokoluokka':
      return 'Tämä ruoka annostellaan koiran kokoluokan (odotettu aikuispaino) perusteella.'
    default:
      return 'Annostelutiedot eivät ole saatavilla digitaalisessa muodossa.'
  }
}