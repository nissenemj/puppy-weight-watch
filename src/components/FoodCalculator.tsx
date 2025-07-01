
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Camera } from 'lucide-react'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import { User } from '@supabase/supabase-js'

interface FoodCalculatorProps {
  currentWeight?: number
  user?: User
}

interface FoodRecommendation {
  dailyAmount: number
  mealsPerDay: number
  amountPerMeal: number
}

export default function FoodCalculator({ currentWeight = 0, user }: FoodCalculatorProps) {
  const [weight, setWeight] = useState(currentWeight.toString())
  const [age, setAge] = useState<string>('')
  const [activityLevel, setActivityLevel] = useState<string>('')
  const [foodType, setFoodType] = useState<string>('dry')
  const [recommendation, setRecommendation] = useState<FoodRecommendation | null>(null)
  
  // Manual calculation inputs
  const [manualCalories, setManualCalories] = useState('')
  const [manualProtein, setManualProtein] = useState('')

  useEffect(() => {
    if (currentWeight > 0) {
      setWeight(currentWeight.toString())
    }
  }, [currentWeight])

  const calculateFoodAmount = () => {
    const weightNum = parseFloat(weight)
    if (!weightNum || !age || !activityLevel) return

    // Base calorie needs per kg (this is a simplified calculation)
    let baseCalories = 0
    
    if (age === 'puppy') {
      baseCalories = weightNum * 100 // Puppies need more calories
    } else if (age === 'adult') {
      baseCalories = weightNum * 60
    } else if (age === 'senior') {
      baseCalories = weightNum * 50
    }

    // Activity level multiplier
    let activityMultiplier = 1
    if (activityLevel === 'low') activityMultiplier = 0.8
    else if (activityLevel === 'moderate') activityMultiplier = 1.0
    else if (activityLevel === 'high') activityMultiplier = 1.4

    const totalCalories = baseCalories * activityMultiplier

    // Convert calories to food amount (approximate)
    // Dry food: ~350-400 kcal/100g, Wet food: ~80-100 kcal/100g
    const caloriesPerGram = foodType === 'dry' ? 3.75 : 0.9
    const dailyGrams = Math.round(totalCalories / caloriesPerGram)

    // Meal recommendations
    let mealsPerDay = 2
    if (age === 'puppy' && weightNum < 5) mealsPerDay = 3
    else if (age === 'puppy') mealsPerDay = 2
    else mealsPerDay = 2

    setRecommendation({
      dailyAmount: dailyGrams,
      mealsPerDay,
      amountPerMeal: Math.round(dailyGrams / mealsPerDay)
    })
  }

  const calculateFromManualData = () => {
    const calories = parseFloat(manualCalories)
    const protein = parseFloat(manualProtein)
    
    if (!calories || !protein) return

    // This is a simplified calculation - in reality you'd need more complex formulas
    const weightNum = parseFloat(weight)
    const targetCalories = weightNum * 60 // Base calculation
    const dailyGrams = Math.round(targetCalories / (calories / 100))

    setRecommendation({
      dailyAmount: dailyGrams,
      mealsPerDay: 2,
      amountPerMeal: Math.round(dailyGrams / 2)
    })
  }

  return (
    <Tabs defaultValue="advanced" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="advanced">Edistynyt laskuri</TabsTrigger>
        <TabsTrigger value="basic">Peruslaskuri</TabsTrigger>
      </TabsList>
      
      <TabsContent value="advanced" className="space-y-6">
        {user ? (
          <AdvancedFoodCalculator user={user} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                Kirjaudu sisään käyttääksesi edistynyttä ruokamäärälaskuria
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="basic" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🍽️ Perus ruokamäärälaskuri
            </CardTitle>
            <CardDescription>
              Laske koirallesi sopiva ruokamäärä painon ja aktiivisuuden perusteella
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Peruslaskuri</TabsTrigger>
                <TabsTrigger value="manual">Käsin syöttö</TabsTrigger>
                <TabsTrigger value="image">Kuva (tulossa)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Paino (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Koiran paino"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ikäryhmä</Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse ikäryhmä" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="puppy">Pentu (alle 1v)</SelectItem>
                        <SelectItem value="adult">Aikuinen (1-7v)</SelectItem>
                        <SelectItem value="senior">Vanhus (yli 7v)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Aktiivisuustaso</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse aktiivisuus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Matala (vähän liikuntaa)</SelectItem>
                        <SelectItem value="moderate">Kohtalainen (normaali liikunta)</SelectItem>
                        <SelectItem value="high">Korkea (paljon liikuntaa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ruoan tyyppi</Label>
                    <Select value={foodType} onValueChange={setFoodType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse ruoan tyyppi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Kuivaruoka</SelectItem>
                        <SelectItem value="wet">Märkäruoka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateFoodAmount} className="w-full">
                  Laske ruokamäärä
                </Button>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-calories">Kalorit per 100g</Label>
                    <Input
                      id="manual-calories"
                      type="number"
                      value={manualCalories}
                      onChange={(e) => setManualCalories(e.target.value)}
                      placeholder="esim. 350"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-protein">Proteiini per 100g (%)</Label>
                    <Input
                      id="manual-protein"
                      type="number"
                      value={manualProtein}
                      onChange={(e) => setManualProtein(e.target.value)}
                      placeholder="esim. 25"
                    />
                  </div>
                </div>

                <Button onClick={calculateFromManualData} className="w-full">
                  Laske käsin syötetyillä tiedoilla
                </Button>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">Kuvan tunnistus tulossa pian!</p>
                  <p className="text-sm text-gray-400">
                    Tällä ominaisuudella voit ottaa kuvan ruokapakkauksesta ja järjestelmä tulkitsee ravintosisällön automaattisesti
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {recommendation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-blue-800">Suositus:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendation.dailyAmount}g
                    </div>
                    <div className="text-sm text-gray-600">Päivässä yhteensä</div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendation.mealsPerDay}
                    </div>
                    <div className="text-sm text-gray-600">Ateriaa päivässä</div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {recommendation.amountPerMeal}g
                    </div>
                    <div className="text-sm text-gray-600">Per ateria</div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Huom:</strong> Tämä on arvio. Tarkista aina ruokapakkauksen ohjeet ja keskustele tarvittaessa eläinlääkärin kanssa.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
