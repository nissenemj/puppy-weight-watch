import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calculator, Dog, Scale } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeUtils'
import { toast } from 'sonner'
import {
  getBreedMultiplier,
  getBreedCategory,
  interpolateAmount,
  findInterpolationBounds,
  BreedCategory
} from '@/utils/breedMultipliers'

// Database types
interface DogFood {
  id: string
  name: string
  manufacturer: string
  food_type: string
  nutrition_type: string
  dosage_method: string
  product_code: string
  notes?: string
}

interface FeedingGuideline {
  id: string
  dog_food_id: string
  adult_weight_kg?: number
  age_months?: string
  current_weight_kg?: number
  daily_amount_min?: number
  daily_amount_max?: number
  size_category?: string
  calculation_formula?: string
}

const ACTIVITY_MULTIPLIERS = {
  'hyvin-matala': 0.9,
  'normaali': 1.0,
  'aktiivinen': 1.1,
  'hyvin-aktiivinen': 1.2
}

interface AdvancedFoodCalculatorProps {
  user: User | null
  currentWeight?: number
}

export default function AdvancedFoodCalculator({ user, currentWeight: propCurrentWeight }: AdvancedFoodCalculatorProps) {
  const [currentWeight, setCurrentWeight] = useState(propCurrentWeight?.toString() || '')
  const [ageMonths, setAgeMonths] = useState('')
  const [expectedAdultWeight, setExpectedAdultWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [feedingGuidelines, setFeedingGuidelines] = useState<FeedingGuideline[]>([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<{
    dailyAmount: number
    mealsPerDay: number
    gramsPerMeal: number
    energyKcal: number
    usedGuidelines: FeedingGuideline[]
    selectedFood: DogFood | null
    activityMultiplier: number
    breedMultiplier: number
    breedCategory: BreedCategory | null
    wasInterpolated: boolean
  } | null>(null)

  useEffect(() => {
    loadDogFoodsAndGuidelines()
  }, [])

  const loadDogFoodsAndGuidelines = async () => {
    setLoading(true)
    try {
      // Load dog foods
      const { data: foodsData, error: foodsError } = await supabase
        .from('dog_foods')
        .select('*')
        .order('manufacturer', { ascending: true })

      if (foodsError) throw foodsError

      // Load feeding guidelines
      const { data: guidelinesData, error: guidelinesError } = await supabase
        .from('feeding_guidelines')
        .select('*')

      if (guidelinesError) throw guidelinesError

      setDogFoods(dbToAppTypes.dogFood(foodsData) as DogFood[] || [])
      setFeedingGuidelines(dbToAppTypes.feedingGuideline(guidelinesData) as FeedingGuideline[] || [])
    } catch (error) {
      console.error('Error loading food data:', error)
      toast.error('Virhe ruokien lataamisessa')
    } finally {
      setLoading(false)
    }
  }

  const getAgeCategory = (months: number): string => {
    if (months >= 2 && months < 3) return '2-3 kk'
    if (months >= 3 && months < 4) return '3-4 kk'
    if (months >= 4 && months < 6) return '4-6 kk'
    if (months >= 6 && months < 9) return '6-9 kk'
    if (months >= 9 && months < 12) return '9-12 kk'
    return '12+ kk'
  }

  const getWeightCategory = (weight: number): string => {
    if (weight >= 1 && weight <= 2) return '1-2 kg'
    if (weight > 2 && weight <= 5) return '2-5 kg'
    if (weight > 5 && weight <= 10) return '5-10 kg'
    if (weight > 10 && weight <= 15) return '10-15 kg'
    if (weight > 15 && weight <= 25) return '15-25 kg'
    if (weight > 25 && weight <= 35) return '25-35 kg'
    if (weight > 35 && weight <= 45) return '35-45 kg'
    if (weight > 45 && weight <= 60) return '45-60 kg'
    return '45-60 kg' // fallback for very large dogs
  }

  const calculateFeeding = () => {
    const weight = parseFloat(currentWeight)
    const months = parseFloat(ageMonths)
    const adultWeight = parseFloat(expectedAdultWeight)

    if (!weight || !months || !selectedFoodId) {
      toast.error('Täytä kaikki pakolliset kentät')
      return
    }

    const selectedFood = dogFoods.find(f => f.id === selectedFoodId)
    if (!selectedFood) return

    const foodGuidelines = feedingGuidelines.filter(g => g.dog_food_id === selectedFoodId)
    const activityMult = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.0

    let dailyAmount = 0
    let usedGuidelines: FeedingGuideline[] = []
    let wasInterpolated = false

    // Get breed multiplier based on expected adult weight
    const breedMult = getBreedMultiplier(adultWeight || weight)
    const breedCat = getBreedCategory(adultWeight || weight)

    // Different calculation methods based on food's dosage method
    switch (selectedFood.dosage_method) {
      case 'Odotettu_Aikuispaino_Ja_Ikä': {
        if (!adultWeight) {
          toast.error('Syötä odotettu aikuispaino')
          return
        }
        const ageCategory = getAgeCategory(months)

        // First try exact match
        const exactMatch = foodGuidelines.filter(g =>
          g.adult_weight_kg === adultWeight && g.age_months === ageCategory
        )

        if (exactMatch.length > 0) {
          const guideline = exactMatch[0]
          dailyAmount = guideline.daily_amount_min || 0
          usedGuidelines = exactMatch
        } else {
          // No exact match - try interpolation based on adult weight
          const ageCategoryGuidelines = foodGuidelines.filter(g =>
            g.age_months === ageCategory &&
            g.adult_weight_kg !== null &&
            g.adult_weight_kg !== undefined &&
            g.daily_amount_min !== null
          )

          if (ageCategoryGuidelines.length >= 2) {
            // Convert to interpolation format
            const guidelinePoints = ageCategoryGuidelines.map(g => ({
              weight: g.adult_weight_kg!,
              amount: g.daily_amount_min!,
              original: g
            }))

            const bounds = findInterpolationBounds(adultWeight, guidelinePoints)

            if (bounds) {
              dailyAmount = interpolateAmount(adultWeight, bounds.lower, bounds.upper)
              usedGuidelines = [bounds.lower.original, bounds.upper.original]
              wasInterpolated = true
            }
          }
        }
        break
      }

      case 'Nykyinen_Paino': {
        // First try exact match
        const exactWeightMatch = foodGuidelines.filter(g =>
          g.current_weight_kg === weight
        )

        if (exactWeightMatch.length > 0) {
          const guideline = exactWeightMatch[0]
          dailyAmount = guideline.daily_amount_min || 0
          usedGuidelines = exactWeightMatch
        } else {
          // No exact match - try interpolation based on current weight
          const validGuidelines = foodGuidelines.filter(g =>
            g.current_weight_kg !== null &&
            g.current_weight_kg !== undefined &&
            g.daily_amount_min !== null
          )

          if (validGuidelines.length >= 2) {
            const guidelinePoints = validGuidelines.map(g => ({
              weight: g.current_weight_kg!,
              amount: g.daily_amount_min!,
              original: g
            }))

            const bounds = findInterpolationBounds(weight, guidelinePoints)

            if (bounds) {
              dailyAmount = interpolateAmount(weight, bounds.lower, bounds.upper)
              usedGuidelines = [bounds.lower.original, bounds.upper.original]
              wasInterpolated = true
            }
          }
        }
        break
      }

      case 'Kokoluokka': {
        const sizeCategory = getSizeCategory(adultWeight || weight)
        const sizeGuidelines = foodGuidelines.filter(g =>
          g.size_category === sizeCategory
        )
        if (sizeGuidelines.length > 0) {
          const guideline = sizeGuidelines[0]
          dailyAmount = guideline.daily_amount_min || 0
          usedGuidelines = sizeGuidelines
        }
        break
      }

      case 'Prosentti_Nykyisestä_Painosta':
        // 5-10% of current weight (use 7.5% as average)
        dailyAmount = Math.round(weight * 1000 * 0.075)
        usedGuidelines = foodGuidelines
        break

      default:
        toast.error('Tälle ruoalle ei ole saatavilla laskentamenetelmää')
        return
    }

    if (dailyAmount === 0) {
      toast.error('Annosta ei voitu laskea annetuilla arvoilla')
      return
    }

    // Apply activity and breed multipliers
    // Breed multiplier adjusts for metabolic differences (toy breeds +15%, giant breeds -10%)
    const combinedMultiplier = activityMult * breedMult
    const adjustedDailyAmount = Math.round(dailyAmount * combinedMultiplier)

    // Calculate meals per day based on age
    let mealsPerDay = 2
    if (months < 6) mealsPerDay = 4
    else if (months < 9) mealsPerDay = 3
    else mealsPerDay = 2

    const gramsPerMeal = Math.round(adjustedDailyAmount / mealsPerDay)
    const energyKcal = Math.round(adjustedDailyAmount * 3.75) // Average 375 kcal/100g

    setResult({
      dailyAmount: adjustedDailyAmount,
      mealsPerDay,
      gramsPerMeal,
      energyKcal,
      usedGuidelines,
      selectedFood,
      activityMultiplier: activityMult,
      breedMultiplier: breedMult,
      breedCategory: breedCat,
      wasInterpolated
    })
  }

  const getSizeCategory = (weight: number): string => {
    if (weight <= 10) return 'Pieni (1-10 kg)'
    if (weight <= 25) return 'Keski (10-25 kg)'
    return 'Suuri (25-50 kg)'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card variant="frosted" className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-white/20" />
            <Skeleton className="h-4 w-1/2 bg-white/20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="h-5 w-5" />
            Ruoka-annoslaskuri
          </CardTitle>
          <CardDescription className="text-white/80">
            Laske pennun päivittäinen ruokamäärä
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form role="form" aria-labelledby="calculator-title" onSubmit={(e) => { e.preventDefault(); calculateFeeding(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-weight" className="text-white">Nykyinen paino (kg) *</Label>
                <Input
                  id="current-weight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="esim. 3.2"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">Ikä kuukausina *</Label>
                <Input
                  id="age"
                  type="number"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  placeholder="esim. 4"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adult-weight" className="text-white">Odotettu aikuispaino (kg)</Label>
                <Input
                  id="adult-weight"
                  type="number"
                  step="0.1"
                  value={expectedAdultWeight}
                  onChange={(e) => setExpectedAdultWeight(e.target.value)}
                  placeholder="esim. 8"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Aktiivisuustaso</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Valitse aktiivisuustaso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyvin-matala">Hyvin matala (sisäkoira)</SelectItem>
                    <SelectItem value="normaali">Normaali (päivittäiset kävelyt)</SelectItem>
                    <SelectItem value="aktiivinen">Aktiivinen (pitkät kävelyt, leikki)</SelectItem>
                    <SelectItem value="hyvin-aktiivinen">Hyvin aktiivinen (urheilu, työkoira)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label className="text-white" id="food-label">Valitse koiranruoka *</Label>
              <Select value={selectedFoodId} onValueChange={setSelectedFoodId} required>
                <SelectTrigger
                  className="bg-white/20 border-white/30 text-white"
                  aria-labelledby="food-label"
                  aria-required="true"
                >
                  <SelectValue placeholder="Valitse ruoka" />
                </SelectTrigger>
                <SelectContent>
                  {dogFoods.map(food => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.manufacturer} - {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-white text-terracotta-600 hover:bg-white/90 font-semibold"
              disabled={!currentWeight || !ageMonths || !selectedFoodId}
            >
              <Dog className="mr-2 h-4 w-4" aria-hidden="true" />
              Laske ruokamäärä
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Card - only shown when result exists */}
      {result && (
      <Card variant="frosted" className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-900">
            <Scale className="h-5 w-5" />
            Laskentatulokset
          </CardTitle>
          <CardDescription>
            Laskenta perustuu valitun ruoan annostelutaulukkoon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result?.selectedFood && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg" role="group" aria-labelledby="selected-food">
              <h3 id="selected-food" className="font-semibold mb-2 text-[var(--color-text-primary)]">Valittu ruoka:</h3>
              <dl className="space-y-1">
                <div><dt className="inline font-medium">Ruoka:</dt> <dd className="inline">{result.selectedFood.manufacturer} - {result.selectedFood.name}</dd></div>
                <div><dt className="inline font-medium">Tyyppi:</dt> <dd className="inline">{result.selectedFood.food_type} - {result.selectedFood.nutrition_type}</dd></div>
                <div><dt className="inline font-medium">Annostelutapa:</dt> <dd className="inline">{result.selectedFood.dosage_method.replace(/_/g, ' ')}</dd></div>
                {result.selectedFood.notes && (
                  <div><dt className="inline font-medium">Huomautuksia:</dt> <dd className="inline">{result.selectedFood.notes}</dd></div>
                )}
              </dl>
            </div>
          )}

          {result?.usedGuidelines && result.usedGuidelines.length > 0 && (
            <div className="overflow-x-auto mobile-table-responsive">
              <h3 className="font-semibold mb-2 text-[var(--color-text-primary)]">Käytetyt annostelutiedot:</h3>
              <table className="w-full text-sm" role="table" aria-labelledby="guidelines-table" summary="Taulukko näyttää laskennassa käytetyt annostelutiedot">
                <thead>
                  <tr className="border-b" role="row">
                    <th className="text-left p-2" role="columnheader" scope="col">Aikuispaino</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Ikä</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Nykyinen paino</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Kokoluokka</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Min annos</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Max annos</th>
                    <th className="text-left p-2" role="columnheader" scope="col">Kaava</th>
                  </tr>
                </thead>
                <tbody>
                  {result.usedGuidelines.map((guideline, index) => (
                    <tr key={guideline.id} className="border-b bg-blue-50" role="row">
                      <td className="p-2" role="cell">{guideline.adult_weight_kg || '-'} kg</td>
                      <td className="p-2" role="cell">{guideline.age_months || '-'}</td>
                      <td className="p-2" role="cell">{guideline.current_weight_kg || '-'} kg</td>
                      <td className="p-2" role="cell">{guideline.size_category || '-'}</td>
                      <td className="p-2" role="cell">{guideline.daily_amount_min || '-'}g</td>
                      <td className="p-2" role="cell">{guideline.daily_amount_max || '-'}g</td>
                      <td className="p-2" role="cell">{guideline.calculation_formula || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg" role="group" aria-labelledby="final-result">
              <h3 id="final-result" className="font-semibold mb-2 text-[var(--color-text-primary)]">Lopputulos:</h3>
              <dl className="space-y-1">
                <div><dt className="inline font-medium">Perusannos:</dt> <dd className="inline">{Math.round(result.dailyAmount / (result.activityMultiplier * result.breedMultiplier))}g päivässä</dd></div>
                {result.wasInterpolated && (
                  <div className="text-blue-600 text-sm">
                    <Badge variant="outline" className="mr-2 text-xs">Interpoloitu</Badge>
                    Annos laskettu kahden painoluokan välistä
                  </div>
                )}
                {result.breedCategory && result.breedMultiplier !== 1.0 && (
                  <div>
                    <dt className="inline font-medium">Rotukoko ({result.breedCategory.name}):</dt>{' '}
                    <dd className="inline">
                      ×{result.breedMultiplier.toFixed(2)}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({result.breedMultiplier > 1 ? 'korkeampi aineenvaihdunta' : 'hitaampi aineenvaihdunta'})
                      </span>
                    </dd>
                  </div>
                )}
                {result.activityMultiplier !== 1.0 && (
                  <div><dt className="inline font-medium">Aktiivisuussäätö:</dt> <dd className="inline">×{result.activityMultiplier}</dd></div>
                )}
                <div className="pt-2 border-t mt-2">
                  <dt className="inline font-medium text-lg">Lopullinen annos:</dt>{' '}
                  <dd className="inline text-lg font-bold text-green-700">{result.dailyAmount}g päivässä</dd>
                </div>
                <div><dt className="inline font-medium">Ruokintakerrat:</dt> <dd className="inline">{result.mealsPerDay} kertaa päivässä</dd></div>
                <div><dt className="inline font-medium">Annos per kerta:</dt> <dd className="inline font-semibold">{result.gramsPerMeal}g</dd></div>
              </dl>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Important Notes */}
      <Card variant="frosted" role="alert" aria-labelledby="important-notes">
        <CardHeader>
          <CardTitle id="important-notes">
            <span aria-label="Varoitus" role="img">⚠️</span>
            Tärkeät huomiot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>Nämä ovat suuntaa-antavia määriä. Seuraa pennun kasvua ja säädä tarvittaessa.</li>
            <li>Jaa päiväannos tasaisesti ruokintakertojen kesken.</li>
            <li>Siirry vähitellen uuteen ruokamäärään 3-5 päivän aikana.</li>
            <li>Ota aina yhteyttä eläinlääkäriin, jos olet huolissasi pennun kasvusta.</li>
            <li>Muista myös herttojen määrä päivittäisessä energiansaannissa!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}