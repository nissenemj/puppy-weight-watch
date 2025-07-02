
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'
import { DogFoodService, DogFood } from '@/services/dogFoodService'
import { User } from '@supabase/supabase-js'

interface AdvancedFoodCalculatorProps {
  user: User
}

export default function AdvancedFoodCalculator({ user }: AdvancedFoodCalculatorProps) {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [selectedFood, setSelectedFood] = useState<DogFood | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  
  // Form inputs
  const [currentWeight, setCurrentWeight] = useState('')
  const [adultWeight, setAdultWeight] = useState('')
  const [ageMonths, setAgeMonths] = useState('')
  const [sizeCategory, setSizeCategory] = useState('')
  
  // Results
  const [recommendation, setRecommendation] = useState<{
    dailyAmount: number
    method: string
  } | null>(null)

  useEffect(() => {
    loadDogFoods()
  }, [])

  const loadDogFoods = async () => {
    setLoading(true)
    try {
      const foods = await DogFoodService.getAllDogFoods()
      setDogFoods(foods)
    } catch (error) {
      console.error('Error loading dog foods:', error)
      toast.error('Virhe koiranruokien lataamisessa')
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    try {
      await DogFoodService.initializeDatabase()
      toast.success('Tietokanta alustettu onnistuneesti!')
      await loadDogFoods()
    } catch (error) {
      console.error('Error initializing database:', error)
      toast.error('Virhe tietokannan alustamisessa')
    } finally {
      setInitializing(false)
    }
  }

  const calculateFeeding = () => {
    if (!selectedFood) {
      toast.error('Valitse ensin koiranruoka')
      return
    }

    const guidelines = selectedFood.feeding_guidelines
    if (!guidelines || guidelines.length === 0) {
      toast.error('Tälle ruoalle ei ole saatavilla annostelutietoja')
      return
    }

    let result: number | null = null
    const method = selectedFood.dosage_method

    try {
      if (method === 'Odotettu_Aikuispaino_Ja_Ikä') {
        const weight = parseFloat(adultWeight)
        const age = ageMonths
        
        if (!weight || !age) {
          toast.error('Syötä sekä odotettu aikuispaino että ikä')
          return
        }

        const guideline = guidelines.find(g => 
          g.adult_weight_kg === weight && g.age_months === age
        )
        
        if (guideline) {
          result = guideline.daily_amount_min || 0
        }
      } else if (method === 'Nykyinen_Paino') {
        const weight = parseFloat(currentWeight)
        
        if (!weight) {
          toast.error('Syötä pennun nykyinen paino')
          return
        }

        const guideline = guidelines.find(g => 
          g.current_weight_kg === weight
        )
        
        if (guideline) {
          result = guideline.daily_amount_min || 0
        }
      } else if (method === 'Kokoluokka') {
        if (!sizeCategory) {
          toast.error('Valitse kokoluokka')
          return
        }

        const guideline = guidelines.find(g => 
          g.size_category === sizeCategory
        )
        
        if (guideline) {
          result = guideline.daily_amount_min || 0
        }
      } else if (method === 'Prosentti_Nykyisestä_Painosta') {
        const weight = parseFloat(currentWeight)
        
        if (!weight) {
          toast.error('Syötä pennun nykyinen paino')
          return
        }

        const guideline = guidelines[0]
        if (guideline && guideline.calculation_formula) {
          // Yksinkertainen 5-10% laskenta
          result = Math.round(weight * 1000 * 0.075) // 7.5% keskiarvo
        }
      }

      if (result) {
        setRecommendation({
          dailyAmount: result,
          method: selectedFood.name
        })
        toast.success(`Suositeltu päivittäinen annos: ${result}g`)
      } else {
        toast.error('Annosta ei voitu laskea annetuilla arvoilla')
      }
    } catch (error) {
      console.error('Error calculating feeding:', error)
      toast.error('Virhe annoksen laskennassa')
    }
  }

  const renderInputs = () => {
    if (!selectedFood) return null

    const method = selectedFood.dosage_method

    switch (method) {
      case 'Odotettu_Aikuispaino_Ja_Ikä':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adult-weight">Odotettu aikuispaino (kg)</Label>
              <Input
                id="adult-weight"
                type="number"
                value={adultWeight}
                onChange={(e) => setAdultWeight(e.target.value)}
                placeholder="esim. 20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age-months">Ikä kuukausina</Label>
              <Input
                id="age-months"
                type="text"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                placeholder="esim. 3-4"
              />
            </div>
          </div>
        )

      case 'Nykyinen_Paino':
      case 'Prosentti_Nykyisestä_Painosta':
        return (
          <div className="space-y-2">
            <Label htmlFor="current-weight">Pennun nykyinen paino (kg)</Label>
            <Input
              id="current-weight"
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="esim. 5.5"
            />
          </div>
        )

      case 'Kokoluokka':
        return (
          <div className="space-y-2">
            <Label>Kokoluokka</Label>
            <Select value={sizeCategory} onValueChange={setSizeCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse kokoluokka" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pieni (1-10 kg)">Pieni (1-10 kg)</SelectItem>
                <SelectItem value="Keski (10-25 kg)">Keski (10-25 kg)</SelectItem>
                <SelectItem value="Suuri (25-50 kg)">Suuri (25-50 kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'Ei_Tietoa':
        return (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              Tälle ruoalle ei ole saatavilla digitaalisia annostelutietoja. 
              Tarkista annostus tuotepakkauksesta.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edistynyt ruokamäärälaskuri</CardTitle>
        <CardDescription>
          Valitse koiranruoka ja laske tarkat annokset valmistajan ohjeiden mukaan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {dogFoods.length === 0 && !loading && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Tietokanta on tyhjä. Alusta se ensin.</p>
            <Button 
              onClick={initializeDatabase} 
              disabled={initializing}
            >
              {initializing ? 'Alustetaan...' : 'Alusta tietokanta'}
            </Button>
          </div>
        )}

        {dogFoods.length > 0 && (
          <>
            <div className="space-y-2">
              <Label>Valitse koiranruoka</Label>
              <Select 
                value={selectedFood?.id || ''} 
                onValueChange={(value) => {
                  const food = dogFoods.find(f => f.id === value)
                  setSelectedFood(food || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Valitse ruoka" />
                </SelectTrigger>
                <SelectContent>
                  {dogFoods.map((food) => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.manufacturer} - {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFood && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedFood.name}</h4>
                <p><strong>Valmistaja:</strong> {selectedFood.manufacturer}</p>
                <p><strong>Tyyppi:</strong> {selectedFood.food_type}</p>
                <p><strong>Ravinto:</strong> {selectedFood.nutrition_type}</p>
                <p><strong>Annostelutapa:</strong> {selectedFood.dosage_method.replace(/_/g, ' ')}</p>
                {selectedFood.notes && (
                  <p><strong>Huomautuksia:</strong> {selectedFood.notes}</p>
                )}
              </div>
            )}

            {renderInputs()}

            {selectedFood && selectedFood.dosage_method !== 'Ei_Tietoa' && (
              <Button onClick={calculateFeeding} className="w-full">
                Laske annos
              </Button>
            )}

            {recommendation && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Suositus:</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {recommendation.dailyAmount}g
                  </div>
                  <p className="text-sm text-gray-600">päivässä yhteensä</p>
                  <p className="text-xs mt-2 text-gray-500">
                    Perustuu tuotteen: {recommendation.method}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
