import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, Info, Scale, Dog } from 'lucide-react'

// --- TYYPPIEN MÄÄRITTELY ---

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
  minAmount?: number
  maxAmount?: number
  notes?: string
}

interface FeedingResult {
  amount: number | null
  minAmount?: number | null
  maxAmount?: number | null
  warning?: string
  mealInfo?: {
    meals: string
    description: string
  } | null
  nutritionType?: string
  type?: string
  notes?: string
}

// --- DATAN MÄÄRITTELY ---

const puppyFoodDatabase: PuppyFoodData[] = [
  // Brit Care Puppy Lamb & Rice - tarkat yhdistelmät
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
  
  // MUSH Raakaruoat
  { id: 'MUSH_PUPPY', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', formula: 'complex' },
  
  // SMAAK
  { id: 'SMAAK_PUPPY', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino' },
  
  // Muut ruoat
  { id: 'RC_MINI_PUPPY', name: 'Royal Canin Mini Puppy', brand: 'Royal Canin', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'ei_tietoa' },
  { id: 'ACANA_PUPPY', name: 'Acana Puppy & Junior', brand: 'Acana', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'ei_tietoa' },
  { id: 'BP_WET_BEEF', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täysravinto', dosageBase: 'kokoluokka' },
]

// --- APUFUNKTIOT ---

const uniqueFoodProducts = puppyFoodDatabase.reduce<PuppyFoodData[]>((acc, food) => {
  if (!acc.some(item => item.name === food.name)) {
    const representativeFood = puppyFoodDatabase.find(f => f.name === food.name)!
    acc.push(representativeFood)
  }
  return acc
}, [])

const foodsByBrand = uniqueFoodProducts.reduce<Record<string, PuppyFoodData[]>>((acc, food) => {
  if (!acc[food.brand]) {
    acc[food.brand] = []
  }
  acc[food.brand].push(food)
  return acc
}, {})

const getMealsPerDay = (ageInMonths: number) => {
  if (ageInMonths <= 2) return { meals: '4-5', description: 'Jaa päiväannos 4-5 osaan.' }
  if (ageInMonths <= 4) return { meals: '3-4', description: 'Jaa päiväannos 3-4 osaan.' }
  if (ageInMonths <= 6) return { meals: '3', description: 'Jaa päiväannos 3 osaan.' }
  return { meals: '2', description: 'Jaa päiväannos 2 osaan.' }
}

// UUSI: Lineaarinen interpolaatio -funktio
const linearInterpolation = (x1: number, y1: number, x2: number, y2: number, x: number): number => {
  return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1)
}

// --- REACT-KOMPONENTTI ---

export default function PuppyFeedingCalculator() {
  const [selectedFoodName, setSelectedFoodName] = useState<string>('')
  const [expectedWeight, setExpectedWeight] = useState<string>('')
  const [currentWeight, setCurrentWeight] = useState<string>('')
  const [ageMonths, setAgeMonths] = useState<string>('')
  const [result, setResult] = useState<FeedingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const selectedFoodTemplate = uniqueFoodProducts.find(food => food.name === selectedFoodName)

  const getInstructionsForFood = (food: PuppyFoodData) => {
    switch (food.dosageBase) {
      case 'odotettu_aikuispaino_ja_ikä':
        return `Tämä ruoka annostellaan odotetun aikuispainon ja pennun iän perusteella.`
      case 'nykyinen_paino':
      case 'prosentti_nykyisestä_painosta':
        return `Tämä ruoka annostellaan pennun nykyisen painon perusteella.`
      case 'kokoluokka':
        return `Tämä ruoka annostellaan koiran kokoluokan (odotettu aikuispaino) perusteella.`
      case 'ei_tietoa':
        return `Tarkkaa annosteluohjetta ei valitettavasti ole saatavilla digitaalisessa muodossa. Tarkista annostus aina tuotepakkauksesta.`
      default:
        return ''
    }
  }

  const calculateFeeding = async () => {
    if (!selectedFoodTemplate) return

    setIsCalculating(true)
    
    try {
      let calculatedAmount: number | null = null
      let minAmount: number | null = null
      let maxAmount: number | null = null
      let warning = ''
      let mealInfo = null
      let notes = selectedFoodTemplate.notes || ''

      const ageNum = parseFloat(ageMonths)
      if (ageMonths && !isNaN(ageNum)) {
          mealInfo = getMealsPerDay(ageNum)
      }

      switch (selectedFoodTemplate.dosageBase) {
        case 'odotettu_aikuispaino_ja_ikä':
          const weightNum = parseFloat(expectedWeight)
          if (isNaN(weightNum) || isNaN(ageNum)) {
              setResult({ amount: null, warning: 'Syötä kelvolliset arvot painolle ja iälle.' })
              return
          }

          // MUSH-kaavalaskenta
          if (selectedFoodTemplate.formula === 'complex') {
              const currentWeightNum = parseFloat(currentWeight)
              if (isNaN(currentWeightNum)) {
                  setResult({ amount: null, warning: 'Syötä pennun nykyinen paino raakaruokaa varten.' })
                  return
              }
              
              let percentage = 0
              if (ageNum <= 2) percentage = 0.09 // 9%
              else if (ageNum <= 4) percentage = 0.065 // 6.5%
              else if (ageNum <= 6) percentage = 0.045 // 4.5%
              else if (ageNum <= 9) percentage = 0.03 // 3%
              else percentage = 0.025 // 2.5%
              
              calculatedAmount = Math.round(currentWeightNum * 1000 * percentage)
          } else {
            // Taulukkolaskenta (Brit Care, Hau-Hau) - KRIITTINEN KORJAUS
            const foodVariants = puppyFoodDatabase.filter(f => f.name === selectedFoodTemplate.name)
            const availableWeights = [...new Set(foodVariants.map(f => f.adultWeight!))].sort((a, b) => a - b)
            
            // Etsi sopiva ikäryhmä
            const ageGroupVariants = foodVariants.filter(food => {
              const ageRange = food.ageMonths!.split('-')
              const minAge = parseFloat(ageRange[0])
              const maxAge = ageRange.length > 1 ? parseFloat(ageRange[1]) : Infinity
              return ageNum >= minAge && ageNum <= maxAge
            })

            if (ageGroupVariants.length === 0) {
              warning = 'Annosta ei löytynyt annetulle ikäryhmälle. Tarkista, sopiiko ruoka pennun iälle.'
            } else {
              // UUSI LOGIIKKA: Lineaarinen interpolaatio
              if (weightNum <= availableWeights[0]) {
                // Paino on pienin saatavilla oleva
                const matchingFood = ageGroupVariants.find(f => f.adultWeight === availableWeights[0])
                calculatedAmount = matchingFood?.dailyAmount || null
                if (weightNum < availableWeights[0]) {
                  warning = `Annostus laskettu pienimmälle painoluokalle (${availableWeights[0]} kg).`
                }
              } else if (weightNum >= availableWeights[availableWeights.length - 1]) {
                // Paino on suurin saatavilla oleva
                const matchingFood = ageGroupVariants.find(f => f.adultWeight === availableWeights[availableWeights.length - 1])
                calculatedAmount = matchingFood?.dailyAmount || null
                if (weightNum > availableWeights[availableWeights.length - 1]) {
                  warning = `Annostus laskettu suurimmalle painoluokalle (${availableWeights[availableWeights.length - 1]} kg).`
                }
              } else {
                // Paino on kahden painoluokan välissä - käytä interpolaatiota
                let lowerWeight = 0, upperWeight = 0, lowerAmount = 0, upperAmount = 0
                
                for (let i = 0; i < availableWeights.length - 1; i++) {
                  if (weightNum >= availableWeights[i] && weightNum <= availableWeights[i + 1]) {
                    lowerWeight = availableWeights[i]
                    upperWeight = availableWeights[i + 1]
                    
                    const lowerFood = ageGroupVariants.find(f => f.adultWeight === lowerWeight)
                    const upperFood = ageGroupVariants.find(f => f.adultWeight === upperWeight)
                    
                    if (lowerFood && upperFood) {
                      lowerAmount = lowerFood.dailyAmount!
                      upperAmount = upperFood.dailyAmount!
                      break
                    }
                  }
                }
                
                if (lowerWeight && upperWeight && lowerAmount && upperAmount) {
                  calculatedAmount = Math.round(linearInterpolation(lowerWeight, lowerAmount, upperWeight, upperAmount, weightNum))
                  warning = `Annostus laskettu interpoloimalla painoluokkien ${lowerWeight} kg ja ${upperWeight} kg väliltä.`
                }
              }
              
              // Tarkista onko löytynyt matching food notes
              const anyMatchingFood = ageGroupVariants.find(f => Math.abs(f.adultWeight! - weightNum) <= 2.5)
              if (anyMatchingFood?.notes) notes = anyMatchingFood.notes
            }
          }
          break

        case 'nykyinen_paino':
          const currentWeightNum = parseFloat(currentWeight)
           if (isNaN(currentWeightNum)) {
              setResult({ amount: null, warning: 'Syötä kelvollinen nykyinen paino.' })
              return
          }
          
          // KORJATTU SMAAK-logiikka raakaruoalle (esimerkki)
          if (selectedFoodTemplate.type === 'raaka') {
            // Raakaruoka: käytä prosenttiosuutta nykyisestä painosta
            let percentage = 0.08 // 8% oletuksena pennuille
            if (ageNum <= 2) percentage = 0.09 // 9%
            else if (ageNum <= 4) percentage = 0.065 // 6.5%
            else if (ageNum <= 6) percentage = 0.045 // 4.5%
            else if (ageNum <= 9) percentage = 0.03 // 3%
            else percentage = 0.025 // 2.5%
            
            calculatedAmount = Math.round(currentWeightNum * 1000 * percentage)
          } else {
            // Muut ruoat (alkuperäinen logiikka)
            if (currentWeightNum <= 5) { minAmount = 75; maxAmount = 150; }
            else if (currentWeightNum <= 10) { minAmount = 150; maxAmount = 300; }
            else if (currentWeightNum <= 15) { minAmount = 225; maxAmount = 450; }
            else if (currentWeightNum <= 20) { minAmount = 300; maxAmount = 600; }
            else if (currentWeightNum <= 25) { minAmount = 375; maxAmount = 750; }
            else { warning = 'Paino ylittää esimerkkitaulukon. Tarkista annostus pakkauksesta.'; }
          }
          break

        case 'prosentti_nykyisestä_painosta':
          const currentWeightForPercent = parseFloat(currentWeight)
           if (isNaN(currentWeightForPercent)) {
              setResult({ amount: null, warning: 'Syötä kelvollinen nykyinen paino.' })
              return
          }
          minAmount = Math.round(currentWeightForPercent * 1000 * 0.05) // 5%
          maxAmount = Math.round(currentWeightForPercent * 1000 * 0.10) // 10%
          calculatedAmount = Math.round((minAmount + maxAmount) / 2) // Näytetään keskiarvo
          break

        case 'kokoluokka':
           const adultWeightForSize = parseFloat(expectedWeight)
           if (isNaN(adultWeightForSize)) {
              setResult({ amount: null, warning: 'Syötä kelvollinen odotettu aikuispaino.' })
              return
          }
          if (adultWeightForSize <= 10) { minAmount = 200; maxAmount = 400; }
          else if (adultWeightForSize <= 25) { minAmount = 400; maxAmount = 800; }
          else if (adultWeightForSize <= 50) { minAmount = 800; maxAmount = 1200; }
          else { warning = 'Paino ylittää esimerkkitaulukon. Tarkista annostus pakkauksesta.'; }
          
          if(selectedFoodTemplate.nutritionType === 'täydennysravinto') {
              minAmount = minAmount ? Math.round(minAmount / 2) : null;
              maxAmount = maxAmount ? Math.round(maxAmount / 2) : null;
          }
          break
      }

      setResult({
        amount: calculatedAmount,
        minAmount,
        maxAmount,
        warning,
        mealInfo,
        nutritionType: selectedFoodTemplate.nutritionType,
        type: selectedFoodTemplate.type,
        notes
      })
    } catch (error) {
      console.error('Calculation error:', error)
      setResult({ 
        amount: null, 
        warning: 'Laskennassa tapahtui virhe. Yritä uudelleen.' 
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const getInputFields = () => {
    if (!selectedFoodTemplate) return null

    const showExpectedWeight = selectedFoodTemplate.dosageBase === 'odotettu_aikuispaino_ja_ikä' || selectedFoodTemplate.dosageBase === 'kokoluokka'
    const showCurrentWeight = selectedFoodTemplate.dosageBase === 'nykyinen_paino' || selectedFoodTemplate.dosageBase === 'prosentti_nykyisestä_painosta' || (selectedFoodTemplate.dosageBase === 'odotettu_aikuispaino_ja_ikä' && selectedFoodTemplate.formula === 'complex')
    const showAge = selectedFoodTemplate.dosageBase === 'odotettu_aikuispaino_ja_ikä' || selectedFoodTemplate.dosageBase === 'nykyinen_paino'

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showExpectedWeight && (
          <div className="space-y-2">
            <Label htmlFor="expected-weight">Odotettu aikuispaino (kg)</Label>
            <Input 
              id="expected-weight" 
              type="number" 
              step="0.1" 
              value={expectedWeight} 
              onChange={(e) => setExpectedWeight(e.target.value)} 
              placeholder="esim. 15"
              aria-describedby="expected-weight-help"
            />
          </div>
        )}
        {showCurrentWeight && (
          <div className="space-y-2">
            <Label htmlFor="current-weight">Pennun nykyinen paino (kg)</Label>
            <Input 
              id="current-weight" 
              type="number" 
              step="0.1" 
              value={currentWeight} 
              onChange={(e) => setCurrentWeight(e.target.value)} 
              placeholder="esim. 8.5"
              aria-describedby="current-weight-help"
            />
          </div>
        )}
        {showAge && (
          <div className="space-y-2">
            <Label htmlFor="age-months">Pennun ikä (kuukausia)</Label>
            <Input 
              id="age-months" 
              type="number" 
              value={ageMonths} 
              onChange={(e) => setAgeMonths(e.target.value)} 
              placeholder="esim. 4"
              aria-describedby="age-help"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dog className="h-5 w-5" /> 
            Penturuokintaopas
          </CardTitle>
          <CardDescription>Laske viitteellinen päiväannos pennullesi Suomessa myytäville ruoille.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="calculator" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">Ruokamäärälaskuri</span>
                <span className="sm:hidden">Laskuri</span>
              </TabsTrigger>
              <TabsTrigger value="feeding-schedule" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">Ruokinta-aikataulu</span>
                <span className="sm:hidden">Aikataulu</span>
              </TabsTrigger>
              <TabsTrigger value="brands" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">Ruokamerkit</span>
                <span className="sm:hidden">Merkit</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>1. Valitse penturuoka</Label>
                  <Select value={selectedFoodName} onValueChange={setSelectedFoodName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Valitse ruokatuote" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(foodsByBrand).map(([brand, foods]) => (
                        <SelectGroup key={brand}>
                          <SelectLabel>{brand}</SelectLabel>
                          {foods.map(food => (
                            <SelectItem key={food.name} value={food.name}>
                              {food.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFoodTemplate && (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <span>Tyyppi: <Badge variant="outline">{selectedFoodTemplate.type}</Badge></span>
                        <span>Ravinto: <Badge variant={selectedFoodTemplate.nutritionType === 'täydennysravinto' ? 'destructive' : 'default'}>{selectedFoodTemplate.nutritionType}</Badge></span>
                      </div>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>{getInstructionsForFood(selectedFoodTemplate)}</AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>2. Syötä pennun tiedot</Label>
                        {getInputFields()}
                    </div>

                    <Button 
                      onClick={calculateFeeding} 
                      className="w-full" 
                      disabled={selectedFoodTemplate.dosageBase === 'ei_tietoa' || isCalculating}
                      aria-label="Laske pennun päivittäinen ruokamäärä"
                      aria-describedby={result ? "feeding-result" : undefined}
                    >
                      <Scale className="mr-2 h-4 w-4" /> 
                      {isCalculating ? 'Lasketaan...' : 'Laske ruokamäärä'}
                    </Button>
                  </>
                )}

                {result && (
                  <div className="space-y-4 pt-4 border-t" id="feeding-result">
                    <h3 className="font-bold text-xl">Laskennan tulokset:</h3>
                    
                    {result.nutritionType === 'täydennysravinto' && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Varoitus: Täydennysravinto</AlertTitle>
                        <AlertDescription>Tämä tuote ei yksinään riitä kattamaan pennun ravintotarpeita. Käytä sitä vain täysravinnon ohella.</AlertDescription>
                      </Alert>
                    )}

                    {result.warning && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Huomio</AlertTitle>
                        <AlertDescription>{result.warning}</AlertDescription>
                      </Alert>
                    )}
                    
                    {result.type === 'raaka' && (result.amount && result.amount > 1000 || (result.maxAmount && result.maxAmount > 1000)) && (
                       <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Tietoa raakaruoan annoskoosta</AlertTitle>
                        <AlertDescription>
                          Raakaruoan annosmäärä voi vaikuttaa suurelta, koska se sisältää paljon kosteutta (n. 70%). 
                          Kuivaruoka on paljon tiiviimpää energiaa. Esimerkiksi 2000g raakaruokaa vastaa energiasisällöltään 
                          noin 400-500g kuivaruokaa. Tämä on valmistajan suosituksen mukainen ja ravitsemuksellisesti oikea määrä.
                        </AlertDescription>
                      </Alert>
                    )}

                    {result.notes && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Lisätietoja</AlertTitle>
                        <AlertDescription>{result.notes}</AlertDescription>
                      </Alert>
                    )}

                    {(result.amount || result.minAmount) ? (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-bold text-lg mb-3 text-green-800">Viitteellinen ruokintasuositus:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="text-3xl font-bold text-green-700">
                              {result.minAmount && result.maxAmount 
                               ? `${result.minAmount} - ${result.maxAmount}g`
                                : `${result.amount}g`
                              }
                            </div>
                            <div className="text-sm text-gray-600">Päivässä yhteensä</div>
                          </div>
                          
                          {result.mealInfo && (
                            <div className="bg-white p-3 rounded-lg shadow">
                              <div className="text-3xl font-bold text-blue-600">{result.mealInfo.meals}</div>
                              <div className="text-sm text-gray-600">Ateriaa päivässä</div>
                              <div className="text-xs text-gray-500 mt-1">{result.mealInfo.description}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Laskenta epäonnistui</AlertTitle>
                            <AlertDescription>Annosta ei voitu laskea annetuilla tiedoilla. Varmista, että kaikki tarvittavat kentät on täytetty oikein.</AlertDescription>
                        </Alert>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Tämä on viitteellinen annostus. Tarkkaile aina pentusi kuntoluokkaa ja sopeuta annosta tarvittaessa. 
                        Varmista, että raikasta vettä on aina saatavilla.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="feeding-schedule" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yleinen ruokintarytmi</CardTitle>
                  <CardDescription>Päivittäisten ruokintakertojen määrä pennun iän mukaan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pennun ikä</TableHead>
                        <TableHead>Aterioita/päivä</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow><TableCell>Alle 2 kk</TableCell><TableCell>4-5</TableCell></TableRow>
                      <TableRow><TableCell>2-4 kk</TableCell><TableCell>3-4</TableCell></TableRow>
                      <TableRow><TableCell>4-6 kk</TableCell><TableCell>3</TableCell></TableRow>
                      <TableRow><TableCell>Yli 6 kk</TableCell><TableCell>2</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brands" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saatavilla olevat ruokamerkit</CardTitle>
                  <CardDescription>Täydellinen listaus kaikista tuoteista ja niiden varianteista.</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(foodsByBrand).map(([brand, foods]) => (
                    <div key={brand} className="mb-8 first:mt-0 mt-6">
                      <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">{brand}</h3>
                      <div className="space-y-2">
                        {foods.map(food => {
                          const variants = puppyFoodDatabase.filter(f => f.name === food.name)
                          return (
                            <div key={food.name} className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{food.name}</span>
                                <Badge variant="outline">{food.type}</Badge>
                                <Badge variant={food.nutritionType === 'täydennysravinto' ? 'destructive' : 'default'}>
                                  {food.nutritionType}
                                </Badge>
                              </div>
                              {variants.length > 1 && (
                                <div className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">Saatavilla painoluokille: </span>
                                  {[...new Set(variants.map(v => v.adultWeight))].sort((a, b) => (a || 0) - (b || 0)).map(w => w + 'kg').join(', ')}
                                </div>
                              )}
                              {food.notes && (
                                <div className="text-sm text-blue-600 mt-1">
                                  <span className="font-medium">Huom: </span>{food.notes}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
