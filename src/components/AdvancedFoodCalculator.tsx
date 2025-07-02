
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DogProfile from './DogProfile'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'

interface Dog {
  id: string
  name: string
  breed?: string
  weight_kg?: number
  age_years?: number
  activity_level?: string
  health_conditions?: string[]
}

interface FoodRecommendation {
  dailyAmount: number
  mealsPerDay: number
  amountPerMeal: number
  dailyCalories: number
  method: string
}

interface AdvancedFoodCalculatorProps {
  user: User
}

export default function AdvancedFoodCalculator({ user }: AdvancedFoodCalculatorProps) {
  const [selectedDog, setSelectedDog] = useState<Dog>()
  const [recommendation, setRecommendation] = useState<FoodRecommendation | null>(null)

  const calculateAdvancedRecommendation = () => {
    if (!selectedDog || !selectedDog.weight_kg) {
      toast.error('Valitse koira ja varmista että painotieto on syötetty')
      return
    }

    const weight = selectedDog.weight_kg
    const age = selectedDog.age_years || 3
    const activityLevel = selectedDog.activity_level || 'medium'

    // Lasketaan perusenergia tarpeen mukaan (RER = Resting Energy Requirement)
    const rer = 70 * Math.pow(weight, 0.75)
    
    // Kertoimen määrittäminen aktiivisuuden ja iän mukaan
    let activityMultiplier = 1.6 // Normaali aktiivinen aikuinen koira
    
    if (age < 1) {
      activityMultiplier = 3.0 // Pentu
    } else if (age > 7) {
      activityMultiplier = 1.4 // Vanhempi koira
    } else {
      // Aikuinen koira
      switch (activityLevel) {
        case 'low':
          activityMultiplier = 1.4
          break
        case 'medium':
          activityMultiplier = 1.6
          break
        case 'high':
          activityMultiplier = 2.0
          break
      }
    }

    const dailyCalories = Math.round(rer * activityMultiplier)
    
    // Käytetään keskimääräistä kalorimäärää kuivaruoalle (350 kcal/100g)
    const dailyAmount = Math.round((dailyCalories / 350) * 100)

    // Aterioiden määrä
    let mealsPerDay = 2
    if (age < 0.5) {
      mealsPerDay = 4
    } else if (age < 1) {
      mealsPerDay = 3
    } else if (weight > 25) {
      mealsPerDay = 2 // Isot koirat voivat syödä harvemmin
    }

    const newRecommendation = {
      dailyAmount,
      mealsPerDay,
      amountPerMeal: Math.round(dailyAmount / mealsPerDay),
      dailyCalories,
      method: 'Edistynyt laskenta'
    }

    setRecommendation(newRecommendation)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧮 Edistynyt ruokamäärälaskuri
          </CardTitle>
          <CardDescription>
            Tarkan ruokamäärän laskeminen koiran tietojen perusteella
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DogProfile 
            user={user}
            onDogSelect={setSelectedDog}
            selectedDog={selectedDog}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Laskenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={calculateAdvancedRecommendation}
                disabled={!selectedDog || !selectedDog.weight_kg}
                className="w-full"
              >
                Laske ruokamäärä
              </Button>

              {recommendation && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-blue-800">
                      Ruokintasuositus ({recommendation.method})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {recommendation.dailyAmount}g
                        </div>
                        <div className="text-sm text-gray-600">Päivässä yhteensä</div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {recommendation.mealsPerDay}
                        </div>
                        <div className="text-sm text-gray-600">Ateriaa päivässä</div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {recommendation.amountPerMeal}g
                        </div>
                        <div className="text-sm text-gray-600">Per ateria</div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {recommendation.dailyCalories}
                        </div>
                        <div className="text-sm text-gray-600">Kcal päivässä</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <p><strong>Huom:</strong> Tämä on arvio perustuen koiran painoon, ikään ja aktiivisuuteen. 
                    Tarkista aina ruokapakkauksen ohjeet ja keskustele tarvittaessa eläinlääkärin kanssa.</p>
                    {selectedDog && selectedDog.health_conditions && selectedDog.health_conditions.length > 0 && (
                      <p className="mt-2 text-orange-600">
                        <strong>Huomio:</strong> Koiralla on terveysongelmia. Ota yhteyttä eläinlääkäriin ruokinnan suunnittelussa.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
