
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calculator, AlertTriangle, Info } from 'lucide-react'
import { DogFoodService, type DogFood } from '@/services/dogFoodService'
import { toast } from 'sonner'

interface CalculationResult {
  dailyAmount: number
  mealsPerDay: number
  amountPerMeal: number
  foodName: string
  method: string
  warnings?: string[]
}

export default function AdvancedFoodCalculator() {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [selectedFood, setSelectedFood] = useState<DogFood | null>(null)
  const [currentWeight, setCurrentWeight] = useState('')
  const [adultWeight, setAdultWeight] = useState('')
  const [ageMonths, setAgeMonths] = useState('')
  const [sizeCategory, setSizeCategory] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foods = await DogFoodService.getAllDogFoods()
        setDogFoods(foods.filter(food => food.dosage_method !== 'Ei_Tietoa'))
      } catch (error) {
        console.error('Error loading foods:', error)
        toast.error('Ruokatietojen lataaminen epäonnistui')
      } finally {
        setLoading(false)
      }
    }
    loadFoods()
  }, [])

  const calculateFeeding = () => {
    if (!selectedFood || !selectedFood.feeding_guidelines) {
      toast.error('Valitse ensin ruoka')
      return
    }

    const guidelines = selectedFood.feeding_guidelines
    let dailyAmount = 0
    const warnings: string[] = []

    try {
      switch (selectedFood.dosage_method) {
        case 'Odotettu_Aikuispaino_Ja_Ikä':
          if (!adultWeight || !ageMonths) {
            toast.error('Syötä sekä odotettu aikuispaino että ikä')
            return
          }
          
          const weightNum = parseFloat(adultWeight)
          const matchingGuideline = guidelines.find(g => 
            g.adult_weight_kg === weightNum && g.age_months === ageMonths
          )
          
          if (matchingGuideline) {
            dailyAmount = matchingGuideline.daily_amount_min || 0
          } else {
            // Try to find closest match
            const closestWeight = guidelines.find(g => g.adult_weight_kg && g.adult_weight_kg >= weightNum)
            if (closestWeight) {
              const ageMatch = guidelines.find(g => 
                g.adult_weight_kg === closestWeight.adult_weight_kg && g.age_months === ageMonths
              )
              if (ageMatch) {
                dailyAmount = ageMatch.daily_amount_min || 0
                warnings.push(`Käytetty lähintä saatavilla olevaa painoluokkaa: ${closestWeight.adult_weight_kg}kg`)
              }
            }
          }
          break

        case 'Nykyinen_Paino':
          if (!currentWeight) {
            toast.error('Syötä pennun nykyinen paino')
            return
          }
          
          const currentWeightNum = parseFloat(currentWeight)
          const weightGuideline = guidelines.find(g => g.current_weight_kg === currentWeightNum)
          
          if (weightGuideline) {
            if (weightGuideline.daily_amount_min === weightGuideline.daily_amount_max) {
              dailyAmount = weightGuideline.daily_amount_min || 0
            } else {
              dailyAmount = Math.round(((weightGuideline.daily_amount_min || 0) + (weightGuideline.daily_amount_max || 0)) / 2)
              warnings.push(`Annostelualue: ${weightGuideline.daily_amount_min}-${weightGuideline.daily_amount_max}g. Sopeutettu keskiarvoon.`)
            }
          }
          break

        case 'Prosentti_Nykyisestä_Painosta':
          if (!currentWeight) {
            toast.error('Syötä pennun nykyinen paino')
            return
          }
          
          const weightForPercent = parseFloat(currentWeight)
          const percentGuideline = guidelines.find(g => g.calculation_formula?.includes('0.05'))
          
          if (percentGuideline) {
            dailyAmount = Math.round(weightForPercent * 1000 * 0.075) // 7.5% keskiarvo 5-10%
            warnings.push('Laskettu 7.5% painosta (suositus 5-10%). Seuraa koiran kuntoluokkaa ja säädä tarvittaessa.')
          }
          break

        case 'Kokoluokka':
          if (!sizeCategory) {
            toast.error('Valitse koiran kokoluokka')
            return
          }
          
          const sizeGuideline = guidelines.find(g => g.size_category === sizeCategory)
          
          if (sizeGuideline) {
            if (sizeGuideline.daily_amount_min === sizeGuideline.daily_amount_max) {
              dailyAmount = sizeGuideline.daily_amount_min || 0
            } else {
              dailyAmount = Math.round(((sizeGuideline.daily_amount_min || 0) + (sizeGuideline.daily_amount_max || 0)) / 2)
              warnings.push(`Annostelualue: ${sizeGuideline.daily_amount_min}-${sizeGuideline.daily_amount_max}g. Käytetty keskiarvoa.`)
            }
          }
          break
      }

      if (dailyAmount > 0) {
        const mealsPerDay = dailyAmount > 200 ? 3 : 2 // Suuremmat annokset jaetaan useampaan ateriaan
        
        setResult({
          dailyAmount,
          mealsPerDay,
          amountPerMeal: Math.round(dailyAmount / mealsPerDay),
          foodName: selectedFood.name,
          method: selectedFood.dosage_method,
          warnings
        })
      } else {
        toast.error('Annosmäärää ei voitu laskea annetuilla tiedoilla')
      }
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Laskennassa tapahtui virhe')
    }
  }

  const resetForm = () => {
    setSelectedFood(null)
    setCurrentWeight('')
    setAdultWeight('')
    setAgeMonths('')
    setSizeCategory('')
    setResult(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Ladataan ruokatietoja...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tarkka Ruokamäärälaskuri
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ruoan valinta */}
        <div>
          <Label htmlFor="food-select">Valitse ruoka</Label>
          <Select onValueChange={(value) => {
            const food = dogFoods.find(f => f.id === value)
            setSelectedFood(food || null)
            setResult(null)
          }}>
            <SelectTrigger id="food-select">
              <SelectValue placeholder="Valitse penturuoka..." />
            </SelectTrigger>
            <SelectContent>
              {dogFoods.map((food) => (
                <SelectItem key={food.id} value={food.id}>
                  <div className="flex items-center gap-2">
                    <span>{food.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {food.manufacturer}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFood && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Valittu ruoka</span>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              <strong>{selectedFood.name}</strong> ({selectedFood.manufacturer})
            </p>
            <div className="flex gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {selectedFood.nutrition_type}
              </Badge>
              <Badge variant="outline">
                {selectedFood.food_type}
              </Badge>
            </div>
            {selectedFood.notes && (
              <p className="text-xs text-blue-700 mt-2">{selectedFood.notes}</p>
            )}
          </div>
        )}

        {/* Syöttökentät annostelumenetelmän mukaan */}
        {selectedFood && (
          <div className="space-y-4">
            {selectedFood.dosage_method === 'Odotettu_Aikuispaino_Ja_Ikä' && (
              <>
                <div>
                  <Label htmlFor="adult-weight">Odotettu aikuispaino (kg)</Label>
                  <Input
                    id="adult-weight"
                    type="number"
                    value={adultWeight}
                    onChange={(e) => setAdultWeight(e.target.value)}
                    placeholder="esim. 15"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Pennun ikä</Label>
                  <Select onValueChange={setAgeMonths}>
                    <SelectTrigger id="age">
                      <SelectValue placeholder="Valitse ikäluokka" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...new Set(selectedFood.feeding_guidelines?.map(g => g.age_months).filter(Boolean))].map(age => (
                        <SelectItem key={age} value={age!}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {(selectedFood.dosage_method === 'Nykyinen_Paino' || selectedFood.dosage_method === 'Prosentti_Nykyisestä_Painosta') && (
              <div>
                <Label htmlFor="current-weight">Pennun nykyinen paino (kg)</Label>
                <Input
                  id="current-weight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="esim. 8.5"
                />
              </div>
            )}

            {selectedFood.dosage_method === 'Kokoluokka' && (
              <div>
                <Label htmlFor="size">Koiran kokoluokka</Label>
                <Select onValueChange={setSizeCategory}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Valitse kokoluokka" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(selectedFood.feeding_guidelines?.map(g => g.size_category).filter(Boolean))].map(size => (
                      <SelectItem key={size} value={size!}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Laskenta-painike */}
        {selectedFood && (
          <div className="flex gap-2">
            <Button onClick={calculateFeeding} className="flex-1">
              Laske ruokamäärä
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Tyhjennä
            </Button>
          </div>
        )}

        {/* Tulos */}
        {result && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Ruokintasuositus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{result.dailyAmount}g</div>
                <div className="text-sm text-green-600">päivässä</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{result.mealsPerDay}</div>
                <div className="text-sm text-green-600">ateriaa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{result.amountPerMeal}g</div>
                <div className="text-sm text-green-600">per ateria</div>
              </div>
            </div>
            
            {result.warnings && result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{warning}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-xs text-green-700">
              <p>Suositus perustuu tuotteeseen: <strong>{result.foodName}</strong></p>
              <p>Seuraa pentusi kuntoluokkaa ja säädä annosta tarvittaessa. Varmista raikaan veden saatavuus.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
