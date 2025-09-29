import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  user: User
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

      setDogFoods(dbToAppTypes.dogFood(foodsData) || [])
      setFeedingGuidelines(dbToAppTypes.feedingGuideline(guidelinesData) || [])
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

      // Different calculation methods based on food's dosage method
      switch (selectedFood.dosage_method) {
        case 'Odotettu_Aikuispaino_Ja_Ikä': {
          if (!adultWeight) {
            toast.error('Syötä odotettu aikuispaino')
            return
          }
          const ageCategory = getAgeCategory(months)
          const matchingGuidelines = foodGuidelines.filter(g =>
            g.adult_weight_kg === adultWeight && g.age_months === ageCategory
          )
          if (matchingGuidelines.length > 0) {
            const guideline = matchingGuidelines[0]
            dailyAmount = guideline.daily_amount_min || 0
            usedGuidelines = matchingGuidelines
          }
          break
        }

        case 'Nykyinen_Paino': {
          const weightGuidelines = foodGuidelines.filter(g =>
            g.current_weight_kg === weight
          )
          if (weightGuidelines.length > 0) {
            const guideline = weightGuidelines[0]
            dailyAmount = guideline.daily_amount_min || 0
            usedGuidelines = weightGuidelines
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

    // Apply activity multiplier
    const adjustedDailyAmount = Math.round(dailyAmount * activityMult)
    
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
      activityMultiplier: activityMult
    })
  }

  const getSizeCategory = (weight: number): string => {
    if (weight <= 10) return 'Pieni (1-10 kg)'
    if (weight <= 25) return 'Keski (10-25 kg)'
    return 'Suuri (25-50 kg)'
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-warm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="h-5 w-5" />
            Edistynyt ruoka-annoslaskuri
          </CardTitle>
          <CardDescription className="text-white/80">
            Tarkat annokset tieteellisen annostelutaulukon mukaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form role="form" aria-labelledby="calculator-title" onSubmit={(e) => { e.preventDefault(); calculateFeeding(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-weight" className="text-white">Nykyinen paino (kg)</Label>
              <Input
                id="current-weight"
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="esim. 3.2"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">Ikä kuukausina</Label>
              <Input
                id="age"
                type="number"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                placeholder="esim. 4"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
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
          
            <div className="space-y-2">
              <Label className="text-white" id="food-label">Valitse koiranruoka *</Label>
              <Select value={selectedFoodId} onValueChange={setSelectedFoodId} required>
                <SelectTrigger 
                  className="bg-white/20 border-white/30 text-white"
                  aria-labelledby="food-label"
                  aria-required="true"
                  aria-describedby="food-desc"
                >
                  <SelectValue placeholder="Valitse ruoka" />
                </SelectTrigger>
                <SelectContent role="listbox">
                  <div id="food-desc" className="sr-only">
                    Valitse lista koiranruoka, jolle haluat laskea annosmäärän. Ruokamerkit perustuvat virallisiin annostelutaulukoihin
                  </div>
                 {loading ? (
                   <SelectItem value="loading" disabled role="option">Ladataan ruokia...</SelectItem>
                 ) : (
                   dogFoods.map(food => (
                     <SelectItem key={food.id} value={food.id} role="option">
                       {food.manufacturer} - {food.name}
                     </SelectItem>
                   ))
                 )}
               </SelectContent>
            </Select>
          </div>
          
            <Button 
              type="submit"
              className="w-full bg-white text-gradient-purple hover:bg-white/90 touch-target"
              disabled={!currentWeight || !ageMonths}
              aria-describedby="calculate-button-desc"
            >
              <Dog className="mr-2 h-4 w-4" aria-hidden="true" />
              Laske ruokamäärä
            </Button>
            <div id="calculate-button-desc" className="sr-only">
              Laskee pennullesi sopivan päivittäisen ruoka-annoksen annettujen tietojen perusteella
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div role="region" aria-labelledby="results-heading" className="space-y-6">
          <h2 id="results-heading" className="sr-only">Laskentatulokset</h2>
          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mobile-grid-1">
            <Card className="text-center" role="article" aria-labelledby="daily-amount">
              <CardHeader className="pb-2">
                <CardTitle id="daily-amount" className="text-lg">Päiväannos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" aria-label={`${result.dailyAmount} grammaa`}>
                  {result.dailyAmount}g
                </div>
                <p className="text-sm text-muted-foreground">yhteensä päivässä</p>
              </CardContent>
            </Card>
            
            <Card className="text-center" role="article" aria-labelledby="meals-per-day">
              <CardHeader className="pb-2">
                <CardTitle id="meals-per-day" className="text-lg">Ruokintakerrat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" aria-label={`${result.mealsPerDay} kertaa päivässä`}>
                  {result.mealsPerDay}
                </div>
                <p className="text-sm text-muted-foreground">kertaa päivässä</p>
              </CardContent>
            </Card>
            
            <Card className="text-center" role="article" aria-labelledby="grams-per-meal">
              <CardHeader className="pb-2">
                <CardTitle id="grams-per-meal" className="text-lg">Annos/kerta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" aria-label={`${result.gramsPerMeal} grammaa per ruokintakerta`}>
                  {result.gramsPerMeal}g
                </div>
                <p className="text-sm text-muted-foreground">per ruokintakerta</p>
              </CardContent>
            </Card>
            
            <Card className="text-center" role="article" aria-labelledby="energy-kcal">
              <CardHeader className="pb-2">
                <CardTitle id="energy-kcal" className="text-lg">Energia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" aria-label={`${result.energyKcal} kilokaloria päivässä`}>
                  {result.energyKcal}
                </div>
                <p className="text-sm text-muted-foreground">kcal päivässä</p>
              </CardContent>
            </Card>
          </div>

          {/* Used Guidelines Display */}
          <Card role="complementary" aria-labelledby="guidelines-title">
            <CardHeader>
              <CardTitle id="guidelines-title" className="flex items-center gap-2">
                <Scale className="h-5 w-5" aria-hidden="true" />
                Käytetyt annostelutiedot
              </CardTitle>
              <CardDescription>
                Laskenta perustuu seuraaviin tietoihin valitusta ruoasta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.selectedFood && (
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

              {result.usedGuidelines.length > 0 && (
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
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg" role="group" aria-labelledby="final-result">
                <h3 id="final-result" className="font-semibold mb-2 text-[var(--color-text-primary)]">Lopputulos:</h3>
                <dl className="space-y-1">
                  <div><dt className="inline font-medium">Perusannos:</dt> <dd className="inline">{Math.round(result.dailyAmount / result.activityMultiplier)}g päivässä</dd></div>
                  {result.activityMultiplier !== 1.0 && (
                    <div><dt className="inline font-medium">Aktiivisuussäätö:</dt> <dd className="inline">×{result.activityMultiplier} = {result.dailyAmount}g</dd></div>
                  )}
                  <div><dt className="inline font-medium">Ruokintakerrat:</dt> <dd className="inline">{result.mealsPerDay} kertaa päivässä</dd></div>
                  <div><dt className="inline font-medium">Annos per kerta:</dt> <dd className="inline">{result.gramsPerMeal}g</dd></div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card role="alert" aria-labelledby="important-notes">
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
                <li>Ota aina yhteyttä eläinlääkäriin, jos olet huolissaan pennun kasvusta.</li>
                <li>Muista myös herttojen määrä päivittäisessä energiansaannissa!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}