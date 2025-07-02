
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, Info, Clock, Scale } from 'lucide-react'

// Penturuokadatan tyyppi
interface PuppyFoodData {
  id: string
  name: string
  brand: string
  type: 'kuiva' | 'märkä' | 'raaka'
  nutritionType: 'täysravinto' | 'täydennysravinto'
  dosageBase: 'odotettu_aikuispaino_ja_ikä' | 'nykyinen_paino' | 'prosentti_nykyisestä_painosta' | 'kokoluokka' | 'ei_tietoa'
  adultWeight?: number
  ageMonths?: string
  dailyAmount?: number
  formula?: string
  notes?: string
  minAmount?: number
  maxAmount?: number
}

// Kattava penturuokadata
const puppyFoodData: PuppyFoodData[] = [
  // Brit Care Puppy Lamb & Rice
  { id: 'BC_PUPPY_LAMB_5_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '1-3', dailyAmount: 50, notes: 'Sopii tiineille ja imettäville' },
  { id: 'BC_PUPPY_LAMB_5_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '3-4', dailyAmount: 75 },
  { id: 'BC_PUPPY_LAMB_5_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '4-6', dailyAmount: 75 },
  { id: 'BC_PUPPY_LAMB_5_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '6-12', dailyAmount: 70 },
  { id: 'BC_PUPPY_LAMB_10_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '1-3', dailyAmount: 85 },
  { id: 'BC_PUPPY_LAMB_10_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '3-4', dailyAmount: 120 },
  { id: 'BC_PUPPY_LAMB_10_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '4-6', dailyAmount: 130 },
  { id: 'BC_PUPPY_LAMB_10_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '6-12', dailyAmount: 120 },
  { id: 'BC_PUPPY_LAMB_15_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '1-3', dailyAmount: 115 },
  { id: 'BC_PUPPY_LAMB_15_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '3-4', dailyAmount: 160 },
  { id: 'BC_PUPPY_LAMB_15_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '4-6', dailyAmount: 175 },
  { id: 'BC_PUPPY_LAMB_15_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '6-12', dailyAmount: 170 },
  { id: 'BC_PUPPY_LAMB_20_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '1-3', dailyAmount: 140 },
  { id: 'BC_PUPPY_LAMB_20_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '3-4', dailyAmount: 180 },
  { id: 'BC_PUPPY_LAMB_20_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '4-6', dailyAmount: 220 },
  { id: 'BC_PUPPY_LAMB_20_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '6-12', dailyAmount: 210 },
  { id: 'BC_PUPPY_LAMB_25_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 25, ageMonths: '1-3', dailyAmount: 150, notes: '>25kg koirille Junior Large Breed' },
  
  // Hau-Hau Champion
  { id: 'HHC_PUPPY_5_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '1-2', dailyAmount: 70, notes: 'Sopii myös emolle' },
  { id: 'HHC_PUPPY_5_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '3-4', dailyAmount: 90 },
  { id: 'HHC_PUPPY_5_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '5-6', dailyAmount: 90 },
  { id: 'HHC_PUPPY_5_7-12', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '7-12', dailyAmount: 80 },
  { id: 'HHC_PUPPY_10_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '1-2', dailyAmount: 100 },
  { id: 'HHC_PUPPY_10_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '3-4', dailyAmount: 140 },
  { id: 'HHC_PUPPY_10_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '5-6', dailyAmount: 140 },
  { id: 'HHC_PUPPY_15_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '1-2', dailyAmount: 130 },
  { id: 'HHC_PUPPY_15_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '3-4', dailyAmount: 170 },
  { id: 'HHC_PUPPY_15_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '5-6', dailyAmount: 190 },
  { id: 'HHC_PUPPY_20_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '1-2', dailyAmount: 160 },
  { id: 'HHC_PUPPY_20_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '3-4', dailyAmount: 200 },
  { id: 'HHC_PUPPY_20_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '5-6', dailyAmount: 230 },
  
  // MUSH Raaka
  { id: 'MUSH_PUPPY_T1_1-2', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', ageMonths: '1-2', formula: 'Aikuispaino_kg × 100' },
  { id: 'MUSH_PUPPY_T1_2-4', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', ageMonths: '2-4', formula: 'Aikuispaino_kg × 75' },
  { id: 'MUSH_PUPPY_T1_4-6', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', ageMonths: '4-6', formula: 'Aikuispaino_kg × 50' },
  { id: 'MUSH_PUPPY_T1_6-9', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', ageMonths: '6-9', formula: 'Aikuispaino_kg × 30' },
  { id: 'MUSH_PUPPY_T1_9+', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', ageMonths: '9+', formula: 'Aikuispaino_kg × 25' },
  { id: 'MUSH_PUPPY_T2', name: 'MUSH Vaisto Puppy (yleisohje)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'prosentti_nykyisestä_painosta', formula: 'Nykyinen_paino_kg × 1000 × (0.05-0.10)', notes: '5-10% pennun nykyisestä painosta' },
  
  // SMAAK
  { id: 'SMAAK_PUPPY_5', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', minAmount: 75, maxAmount: 150 },
  { id: 'SMAAK_PUPPY_10', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', minAmount: 150, maxAmount: 300 },
  { id: 'SMAAK_PUPPY_15', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', minAmount: 225, maxAmount: 450 },
  { id: 'SMAAK_PUPPY_20', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', minAmount: 300, maxAmount: 600 },
  { id: 'SMAAK_PUPPY_25', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', minAmount: 375, maxAmount: 750 },
  
  // Brit Premium märkäruoka
  { id: 'BP_WET_BEEF_FULL_SMALL', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täysravinto', dosageBase: 'kokoluokka', minAmount: 200, maxAmount: 400, notes: 'Pieni (1-10kg)' },
  { id: 'BP_WET_BEEF_FULL_MEDIUM', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täysravinto', dosageBase: 'kokoluokka', minAmount: 400, maxAmount: 800, notes: 'Keski (10-25kg)' },
  { id: 'BP_WET_BEEF_FULL_LARGE', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täysravinto', dosageBase: 'kokoluokka', minAmount: 800, maxAmount: 1200, notes: 'Suuri (25-50kg)' },
  { id: 'BP_WET_BEEF_COMP_SMALL', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täydennysravinto', dosageBase: 'kokoluokka', minAmount: 100, maxAmount: 200, notes: 'Pieni (1-10kg) - 50% täydennysravintona' },
  { id: 'BP_WET_BEEF_COMP_MEDIUM', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täydennysravinto', dosageBase: 'kokoluokka', minAmount: 200, maxAmount: 400, notes: 'Keski (10-25kg) - 50% täydennysravintona' },
  { id: 'BP_WET_BEEF_COMP_LARGE', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täydennysravinto', dosageBase: 'kokoluokka', minAmount: 400, maxAmount: 600, notes: 'Suuri (25-50kg) - 50% täydennysravintona' }
]

// Ruokintakertojen jaottelu iän mukaan
const getMealsPerDay = (ageMonths: number) => {
  if (ageMonths < 2) return { meals: 4-5, interval: '3-4 tuntia', description: 'Jaa päiväannos 4-5 osaan' }
  if (ageMonths < 3) return { meals: 4, interval: '4 tuntia', description: 'Jaa päiväannos 4 osaan' }
  if (ageMonths < 4) return { meals: 3-4, interval: '4-6 tuntia', description: 'Jaa päiväannos 3-4 osaan' }
  if (ageMonths < 6) return { meals: 3, interval: '6-8 tuntia', description: 'Jaa päiväannos 3 osaan' }
  if (ageMonths < 12) return { meals: 2-3, interval: '8-12 tuntia', description: 'Jaa päiväannos 2-3 osaan' }
  return { meals: 2, interval: '12 tuntia', description: 'Jaa päiväannos 2 osaan' }
}

export default function PuppyFeeding() {
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [expectedWeight, setExpectedWeight] = useState<string>('')
  const [currentWeight, setCurrentWeight] = useState<string>('')
  const [ageMonths, setAgeMonths] = useState<string>''
  const [sizeCategory, setSizeCategory] = useState<string>('')
  const [result, setResult] = useState<any>(null)

  const selectedFoodData = puppyFoodData.find(food => food.id === selectedFood)

  const calculateFeeding = () => {
    if (!selectedFoodData) return

    let calculatedAmount = 0
    let warning = ''
    let mealInfo = null

    // Laskentalogiikat eri annosteluperusteiden mukaan
    switch (selectedFoodData.dosageBase) {
      case 'odotettu_aikuispaino_ja_ikä':
        const weightNum = parseFloat(expectedWeight)
        const ageNum = parseFloat(ageMonths)
        
        if (selectedFoodData.formula) {
          // MUSH-tyyppiset kaavapohjaiset laskelmat
          if (selectedFoodData.formula.includes('× 100')) calculatedAmount = weightNum * 100
          else if (selectedFoodData.formula.includes('× 75')) calculatedAmount = weightNum * 75
          else if (selectedFoodData.formula.includes('× 50')) calculatedAmount = weightNum * 50
          else if (selectedFoodData.formula.includes('× 30')) calculatedAmount = weightNum * 30
          else if (selectedFoodData.formula.includes('× 25')) calculatedAmount = weightNum * 25
        } else if (selectedFoodData.dailyAmount) {
          calculatedAmount = selectedFoodData.dailyAmount
        }
        
        mealInfo = getMealsPerDay(ageNum)
        break

      case 'nykyinen_paino':
        const currentWeightNum = parseFloat(currentWeight)
        if (selectedFoodData.minAmount && selectedFoodData.maxAmount) {
          calculatedAmount = selectedFoodData.minAmount
          warning = `Vaihteluväli: ${selectedFoodData.minAmount}-${selectedFoodData.maxAmount}g`
        }
        break

      case 'prosentti_nykyisestä_painosta':
        const currentWeightForPercent = parseFloat(currentWeight)
        // MUSH yleisohje: 5-10% nykyisestä painosta
        calculatedAmount = Math.round(currentWeightForPercent * 1000 * 0.075) // 7.5% keskiarvo
        warning = `Vaihteluväli: ${Math.round(currentWeightForPercent * 1000 * 0.05)}-${Math.round(currentWeightForPercent * 1000 * 0.10)}g (5-10% nykyisestä painosta)`
        break

      case 'kokoluokka':
        if (selectedFoodData.minAmount && selectedFoodData.maxAmount) {
          calculatedAmount = selectedFoodData.minAmount
          warning = `Vaihteluväli: ${selectedFoodData.minAmount}-${selectedFoodData.maxAmount}g kokoluokalle`
        }
        break

      case 'ei_tietoa':
        warning = 'Tarkkaa annosteluohjetta ei ole saatavilla. Tarkista annostus tuotepakkauksesta.'
        break
    }

    setResult({
      amount: calculatedAmount,
      warning,
      mealInfo,
      nutritionType: selectedFoodData.nutritionType,
      notes: selectedFoodData.notes
    })
  }

  const getInputFields = () => {
    if (!selectedFoodData) return null

    switch (selectedFoodData.dosageBase) {
      case 'odotettu_aikuispaino_ja_ikä':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected-weight">Odotettu aikuispaino (kg)</Label>
              <Input
                id="expected-weight"
                type="number"
                step="0.1"
                value={expectedWeight}
                onChange={(e) => setExpectedWeight(e.target.value)}
                placeholder="esim. 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age-months">Pennun ikä (kuukausia)</Label>
              <Input
                id="age-months"
                type="number"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                placeholder="esim. 4"
              />
            </div>
          </div>
        )

      case 'nykyinen_paino':
      case 'prosentti_nykyisestä_painosta':
        return (
          <div className="space-y-2">
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
        )

      case 'kokoluokka':
        return (
          <div className="space-y-2">
            <Label>Koiran kokoluokka</Label>
            <Select value={sizeCategory} onValueChange={setSizeCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse kokoluokka" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pieni">Pieni (1-10kg)</SelectItem>
                <SelectItem value="keski">Keskikokoinen (10-25kg)</SelectItem>
                <SelectItem value="suuri">Suuri (25-50kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  // Ruokatuotteiden ryhmittely merkin mukaan
  const foodsByBrand = puppyFoodData.reduce((acc, food) => {
    if (!acc[food.brand]) acc[food.brand] = []
    acc[food.brand].push(food)
    return acc
  }, {} as Record<string, PuppyFoodData[]>)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🐕 Penturuokintaopas
          </CardTitle>
          <CardDescription>
            Tarkka annostelulaskuri suomalaisille penturuoille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Ruokamäärälaskuri</TabsTrigger>
              <TabsTrigger value="brands">Ruokamerkit</TabsTrigger>
              <TabsTrigger value="feeding-schedule">Ruokinta-aikataulu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Valitse penturuoka</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Valitse ruokatuote" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(foodsByBrand).map(([brand, foods]) => (
                        <div key={brand}>
                          <div className="px-2 py-1 text-sm font-semibold text-gray-600">{brand}</div>
                          {foods.map(food => (
                            <SelectItem key={food.id} value={food.id}>
                              {food.name} ({food.type})
                              {food.nutritionType === 'täydennysravinto' && ' - Täydennysravinto'}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFoodData && (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">{selectedFoodData.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Valmistaja: <Badge variant="secondary">{selectedFoodData.brand}</Badge></span>
                        <span>Tyyppi: <Badge variant="outline">{selectedFoodData.type}</Badge></span>
                        <span>Ravinto: <Badge variant={selectedFoodData.nutritionType === 'täydennysravinto' ? 'destructive' : 'default'}>{selectedFoodData.nutritionType}</Badge></span>
                      </div>
                      {selectedFoodData.notes && (
                        <p className="text-sm text-gray-600 mt-2">{selectedFoodData.notes}</p>
                      )}
                    </div>

                    {getInputFields()}

                    <Button onClick={calculateFeeding} className="w-full">
                      <Scale className="mr-2 h-4 w-4" />
                      Laske ruokamäärä
                    </Button>
                  </>
                )}

                {result && (
                  <div className="space-y-4">
                    {/* Kriittiset varoitukset */}
                    {result.nutritionType === 'täydennysravinto' && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          ⚠️ Tämä on täydennysravinto! Se ei yksinään riitä - käytä vain osana täysravintoa sisältävää ruokavaliota.
                        </AlertDescription>
                      </Alert>
                    )}

                    {selectedFoodData?.dosageBase === 'ei_tietoa' && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          ❌ Tarkkaa annosteluohjetta ei ole saatavilla. Tarkista annostus aina tuotepakkauksesta tai valmistajan sivuilta.
                        </AlertDescription>
                      </Alert>
                    )}

                    {result.warning && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          📏 {result.warning} Aloita pienemmästä määrästä ja seuraa pennun kuntoa.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Ruokintasuositus */}
                    {result.amount > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-green-800">Ruokintasuositus:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {result.amount}g
                            </div>
                            <div className="text-sm text-gray-600">Päivässä yhteensä</div>
                          </div>
                          
                          {result.mealInfo && (
                            <div className="bg-white p-3 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {typeof result.mealInfo.meals === 'number' ? result.mealInfo.meals : result.mealInfo.meals}
                              </div>
                              <div className="text-sm text-gray-600">Ateriaa päivässä</div>
                              <div className="text-xs text-gray-500 mt-1">{result.mealInfo.interval}</div>
                            </div>
                          )}
                        </div>
                        
                        {result.mealInfo && (
                          <div className="mt-4 p-3 bg-white rounded-lg">
                            <Clock className="inline mr-2 h-4 w-4" />
                            <span className="text-sm">{result.mealInfo.description}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Yleinen vastuuvapaus */}
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        ℹ️ Tämä on viitteellinen annostus. Tarkkaile pentusi kuntoa ja sopeuta tarvittaessa. Varmista, että raikasta vettä on aina saatavilla.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="brands" className="space-y-4">
              <div className="grid gap-4">
                {Object.entries(foodsByBrand).map(([brand, foods]) => (
                  <Card key={brand}>
                    <CardHeader>
                      <CardTitle className="text-lg">{brand}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Array.from(new Set(foods.map(f => f.name))).map(name => {
                          const food = foods.find(f => f.name === name)!
                          return (
                            <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-medium">{name}</span>
                              <div className="flex gap-2">
                                <Badge variant="outline">{food.type}</Badge>
                                <Badge variant={food.nutritionType === 'täydennysravinto' ? 'destructive' : 'default'}>
                                  {food.nutritionType}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="feeding-schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ruokintakertojen jakotaulukko</CardTitle>
                  <CardDescription>Ikään perustuva ruokinta-aikataulu</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pennun ikä</TableHead>
                        <TableHead>Aterioita päivässä</TableHead>
                        <TableHead>Ruokintaväli</TableHead>
                        <TableHead>Käytännön toteutus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2-8 viikkoa</TableCell>
                        <TableCell>4-5</TableCell>
                        <TableCell>3-4 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 4-5 osaan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>8-12 viikkoa</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>4 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 4 osaan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>12-16 viikkoa</TableCell>
                        <TableCell>3-4</TableCell>
                        <TableCell>4-6 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 3-4 osaan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>16 viikkoa - 6kk</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>6-8 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 3 osaan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>6-12 kuukautta</TableCell>
                        <TableCell>2-3</TableCell>
                        <TableCell>8-12 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 2-3 osaan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>12+ kuukautta</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>12 tuntia</TableCell>
                        <TableCell>Jaa päiväannos 2 osaan</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
