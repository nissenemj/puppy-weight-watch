
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Camera } from 'lucide-react'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import PuppyFeedingCalculator from './PuppyFeeding'
import { User } from '@supabase/supabase-js'

interface FoodCalculatorProps {
  currentWeight?: number
  user?: User
}

interface FoodRecommendation {
  dailyAmount: number
  mealsPerDay: number
  amountPerMeal: number
  dailyCalories: number
  method: string
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

    // PARANNELTU: Käytetään RER-kaavaa (Resting Energy Requirement)
    const rer = 70 * Math.pow(weightNum, 0.75)
    
    // Kertoimen määrittäminen iän ja aktiivisuuden mukaan
    let activityMultiplier = 1.6 // Oletus: normaali aktiivinen aikuinen koira
    
    if (age === 'puppy') {
      // Pennun energiantarve on suurempi
      if (activityLevel === 'low') activityMultiplier = 2.5
      else if (activityLevel === 'moderate') activityMultiplier = 3.0
      else if (activityLevel === 'high') activityMultiplier = 3.5
    } else if (age === 'adult') {
      // Aikuinen koira
      if (activityLevel === 'low') activityMultiplier = 1.4
      else if (activityLevel === 'moderate') activityMultiplier = 1.6
      else if (activityLevel === 'high') activityMultiplier = 2.0
    } else if (age === 'senior') {
      // Vanhempi koira tarvitsee vähemmän energiaa
      if (activityLevel === 'low') activityMultiplier = 1.2
      else if (activityLevel === 'moderate') activityMultiplier = 1.4
      else if (activityLevel === 'high') activityMultiplier = 1.6
    }

    const dailyCalories = Math.round(rer * activityMultiplier)
    
    // Muunnetaan kalorit ruokamääräksi
    // Kuivaruoka: ~350 kcal/100g, Märkäruoka: ~90 kcal/100g
    const caloriesPerGram = foodType === 'dry' ? 3.5 : 0.9
    const dailyGrams = Math.round(dailyCalories / caloriesPerGram)

    // Aterioiden määrä
    let mealsPerDay = 2
    if (age === 'puppy' && weightNum < 5) {
      mealsPerDay = 4
    } else if (age === 'puppy') {
      mealsPerDay = 3
    } else if (weightNum > 25) {
      mealsPerDay = 2 // Isot koirat voivat syödä harvemmin
    }

    setRecommendation({
      dailyAmount: dailyGrams,
      mealsPerDay,
      amountPerMeal: Math.round(dailyGrams / mealsPerDay),
      dailyCalories,
      method: 'RER-pohjainen laskenta'
    })
  }

  const calculateFromManualData = () => {
    const calories = parseFloat(manualCalories)
    const protein = parseFloat(manualProtein)
    
    if (!calories || !protein) return

    const weightNum = parseFloat(weight)
    if (!weightNum) return

    // PARANNELTU: Käytetään RER-kaavaa myös manuaalisessa laskennassa
    const rer = 70 * Math.pow(weightNum, 0.75)
    let multiplier = 1.6 // Oletus aikuiselle koiralle
    
    // Arvataan aktiviteettitaso proteiinipitoisuuden perusteella
    if (protein > 28) multiplier = 2.0 // Korkea proteiini = aktiivinen koira
    else if (protein < 22) multiplier = 1.4 // Matala proteiini = vähemmän aktiivinen
    
    const targetCalories = Math.round(rer * multiplier)
    const dailyGrams = Math.round(targetCalories / (calories / 100))

    setRecommendation({
      dailyAmount: dailyGrams,
      mealsPerDay: 2,
      amountPerMeal: Math.round(dailyGrams / 2),
      dailyCalories: targetCalories,
      method: 'Manuaalinen laskenta (RER-pohjainen)'
    })
  }

  return (
    <Tabs defaultValue="advanced" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="advanced">Edistynyt laskuri</TabsTrigger>
        <TabsTrigger value="puppy">Penturuokinta</TabsTrigger>
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
      
      <TabsContent value="puppy" className="space-y-6">
        <PuppyFeedingCalculator />
      </TabsContent>
      
      <TabsContent value="basic" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🍽️ Perus ruokamäärälaskuri
            </CardTitle>
            <CardDescription>
              Laske koirallesi sopiva ruokamäärä RER-kaavan avulla (tieteellinen perusta)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">RER-laskuri</TabsTrigger>
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
                        <SelectItem value="dry">Kuivaruoka (~350 kcal/100g)</SelectItem>
                        <SelectItem value="wet">Märkäruoka (~90 kcal/100g)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p><strong>RER-kaava:</strong> 70 × (paino kg)^0.75</p>
                  <p>Tämä on eläinlääketieteessä yleisesti käytetty kaava perusenergiantarpeen laskemiseen.</p>
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

                <div className="p-3 bg-green-50 rounded-lg text-sm">
                  <p><strong>Proteiinipitoisuuden vaikutus:</strong></p>
                  <p>• Yli 28% proteiinia → Oletetaan aktiivinen koira</p>
                  <p>• Alle 22% proteiinia → Oletetaan vähemmän aktiivinen koira</p>
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
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                  Suositus ({recommendation.method}):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
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
                  
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {recommendation.dailyCalories}
                    </div>
                    <div className="text-sm text-gray-600">Kcal päivässä</div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Huom:</strong> Tämä on RER-kaavaan perustuva arvio. Tarkista aina ruokapakkauksen ohjeet ja keskustele tarvittaessa eläinlääkärin kanssa.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
