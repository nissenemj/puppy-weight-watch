import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calculator, Dog, Scale } from 'lucide-react'

// Annostelutaulukko
const DOSAGE_TABLE = [
  { mealsPerDay: 4, gramsPerMeal: 18, dailyAmount: 73, energyKcal: 284, weightCategory: '1-2 kg', ageCategory: '2-3 kk', weightRange: [1, 2] },
  { mealsPerDay: 4, gramsPerMeal: 16, dailyAmount: 64, energyKcal: 250, weightCategory: '1-2 kg', ageCategory: '3-4 kk', weightRange: [1, 2] },
  { mealsPerDay: 3, gramsPerMeal: 19, dailyAmount: 58, energyKcal: 226, weightCategory: '1-2 kg', ageCategory: '4-6 kk', weightRange: [1, 2] },
  { mealsPerDay: 3, gramsPerMeal: 17, dailyAmount: 52, energyKcal: 203, weightCategory: '1-2 kg', ageCategory: '6-9 kk', weightRange: [1, 2] },
  { mealsPerDay: 2, gramsPerMeal: 21, dailyAmount: 43, energyKcal: 168, weightCategory: '1-2 kg', ageCategory: '9-12 kk', weightRange: [1, 2] },
  { mealsPerDay: 2, gramsPerMeal: 17, dailyAmount: 35, energyKcal: 136, weightCategory: '1-2 kg', ageCategory: '12+ kk', weightRange: [1, 2] },

  { mealsPerDay: 4, gramsPerMeal: 27, dailyAmount: 109, energyKcal: 425, weightCategory: '2-5 kg', ageCategory: '2-3 kk', weightRange: [2, 5] },
  { mealsPerDay: 4, gramsPerMeal: 24, dailyAmount: 95, energyKcal: 371, weightCategory: '2-5 kg', ageCategory: '3-4 kk', weightRange: [2, 5] },
  { mealsPerDay: 3, gramsPerMeal: 29, dailyAmount: 86, energyKcal: 335, weightCategory: '2-5 kg', ageCategory: '4-6 kk', weightRange: [2, 5] },
  { mealsPerDay: 3, gramsPerMeal: 26, dailyAmount: 77, energyKcal: 300, weightCategory: '2-5 kg', ageCategory: '6-9 kk', weightRange: [2, 5] },
  { mealsPerDay: 2, gramsPerMeal: 32, dailyAmount: 64, energyKcal: 250, weightCategory: '2-5 kg', ageCategory: '9-12 kk', weightRange: [2, 5] },
  { mealsPerDay: 2, gramsPerMeal: 26, dailyAmount: 51, energyKcal: 199, weightCategory: '2-5 kg', ageCategory: '12+ kk', weightRange: [2, 5] },

  { mealsPerDay: 4, gramsPerMeal: 41, dailyAmount: 164, energyKcal: 640, weightCategory: '5-10 kg', ageCategory: '2-3 kk', weightRange: [5, 10] },
  { mealsPerDay: 4, gramsPerMeal: 36, dailyAmount: 144, energyKcal: 562, weightCategory: '5-10 kg', ageCategory: '3-4 kk', weightRange: [5, 10] },
  { mealsPerDay: 3, gramsPerMeal: 43, dailyAmount: 130, energyKcal: 507, weightCategory: '5-10 kg', ageCategory: '4-6 kk', weightRange: [5, 10] },
  { mealsPerDay: 3, gramsPerMeal: 39, dailyAmount: 117, energyKcal: 456, weightCategory: '5-10 kg', ageCategory: '6-9 kk', weightRange: [5, 10] },
  { mealsPerDay: 2, gramsPerMeal: 49, dailyAmount: 97, energyKcal: 378, weightCategory: '5-10 kg', ageCategory: '9-12 kk', weightRange: [5, 10] },
  { mealsPerDay: 2, gramsPerMeal: 39, dailyAmount: 78, energyKcal: 304, weightCategory: '5-10 kg', ageCategory: '12+ kk', weightRange: [5, 10] },

  { mealsPerDay: 4, gramsPerMeal: 61, dailyAmount: 246, energyKcal: 960, weightCategory: '10-15 kg', ageCategory: '2-3 kk', weightRange: [10, 15] },
  { mealsPerDay: 4, gramsPerMeal: 54, dailyAmount: 217, energyKcal: 847, weightCategory: '10-15 kg', ageCategory: '3-4 kk', weightRange: [10, 15] },
  { mealsPerDay: 3, gramsPerMeal: 65, dailyAmount: 195, energyKcal: 761, weightCategory: '10-15 kg', ageCategory: '4-6 kk', weightRange: [10, 15] },
  { mealsPerDay: 3, gramsPerMeal: 58, dailyAmount: 175, energyKcal: 683, weightCategory: '10-15 kg', ageCategory: '6-9 kk', weightRange: [10, 15] },
  { mealsPerDay: 2, gramsPerMeal: 73, dailyAmount: 146, energyKcal: 570, weightCategory: '10-15 kg', ageCategory: '9-12 kk', weightRange: [10, 15] },
  { mealsPerDay: 2, gramsPerMeal: 58, dailyAmount: 117, energyKcal: 456, weightCategory: '10-15 kg', ageCategory: '12+ kk', weightRange: [10, 15] },

  { mealsPerDay: 4, gramsPerMeal: 93, dailyAmount: 371, energyKcal: 1447, weightCategory: '15-25 kg', ageCategory: '2-3 kk', weightRange: [15, 25] },
  { mealsPerDay: 4, gramsPerMeal: 82, dailyAmount: 327, energyKcal: 1275, weightCategory: '15-25 kg', ageCategory: '3-4 kk', weightRange: [15, 25] },
  { mealsPerDay: 3, gramsPerMeal: 98, dailyAmount: 294, energyKcal: 1147, weightCategory: '15-25 kg', ageCategory: '4-6 kk', weightRange: [15, 25] },
  { mealsPerDay: 3, gramsPerMeal: 88, dailyAmount: 265, energyKcal: 1034, weightCategory: '15-25 kg', ageCategory: '6-9 kk', weightRange: [15, 25] },
  { mealsPerDay: 2, gramsPerMeal: 110, dailyAmount: 220, energyKcal: 858, weightCategory: '15-25 kg', ageCategory: '9-12 kk', weightRange: [15, 25] },
  { mealsPerDay: 2, gramsPerMeal: 88, dailyAmount: 176, energyKcal: 686, weightCategory: '15-25 kg', ageCategory: '12+ kk', weightRange: [15, 25] },

  { mealsPerDay: 4, gramsPerMeal: 144, dailyAmount: 575, energyKcal: 2243, weightCategory: '25-35 kg', ageCategory: '2-3 kk', weightRange: [25, 35] },
  { mealsPerDay: 4, gramsPerMeal: 127, dailyAmount: 506, energyKcal: 1974, weightCategory: '25-35 kg', ageCategory: '3-4 kk', weightRange: [25, 35] },
  { mealsPerDay: 3, gramsPerMeal: 153, dailyAmount: 460, energyKcal: 1795, weightCategory: '25-35 kg', ageCategory: '4-6 kk', weightRange: [25, 35] },
  { mealsPerDay: 3, gramsPerMeal: 138, dailyAmount: 414, energyKcal: 1615, weightCategory: '25-35 kg', ageCategory: '6-9 kk', weightRange: [25, 35] },
  { mealsPerDay: 2, gramsPerMeal: 173, dailyAmount: 345, energyKcal: 1346, weightCategory: '25-35 kg', ageCategory: '9-12 kk', weightRange: [25, 35] },
  { mealsPerDay: 2, gramsPerMeal: 138, dailyAmount: 276, energyKcal: 1077, weightCategory: '25-35 kg', ageCategory: '12+ kk', weightRange: [25, 35] },

  { mealsPerDay: 4, gramsPerMeal: 178, dailyAmount: 714, energyKcal: 2783, weightCategory: '35-45 kg', ageCategory: '2-3 kk', weightRange: [35, 45] },
  { mealsPerDay: 4, gramsPerMeal: 157, dailyAmount: 628, energyKcal: 2449, weightCategory: '35-45 kg', ageCategory: '3-4 kk', weightRange: [35, 45] },
  { mealsPerDay: 3, gramsPerMeal: 190, dailyAmount: 571, energyKcal: 2227, weightCategory: '35-45 kg', ageCategory: '4-6 kk', weightRange: [35, 45] },
  { mealsPerDay: 3, gramsPerMeal: 171, dailyAmount: 514, energyKcal: 2004, weightCategory: '35-45 kg', ageCategory: '6-9 kk', weightRange: [35, 45] },
  { mealsPerDay: 2, gramsPerMeal: 214, dailyAmount: 428, energyKcal: 1670, weightCategory: '35-45 kg', ageCategory: '9-12 kk', weightRange: [35, 45] },
  { mealsPerDay: 2, gramsPerMeal: 171, dailyAmount: 343, energyKcal: 1336, weightCategory: '35-45 kg', ageCategory: '12+ kk', weightRange: [35, 45] },

  { mealsPerDay: 4, gramsPerMeal: 219, dailyAmount: 875, energyKcal: 3413, weightCategory: '45-60 kg', ageCategory: '2-3 kk', weightRange: [45, 60] },
  { mealsPerDay: 4, gramsPerMeal: 193, dailyAmount: 770, energyKcal: 3004, weightCategory: '45-60 kg', ageCategory: '3-4 kk', weightRange: [45, 60] },
  { mealsPerDay: 3, gramsPerMeal: 233, dailyAmount: 700, energyKcal: 2731, weightCategory: '45-60 kg', ageCategory: '4-6 kk', weightRange: [45, 60] },
  { mealsPerDay: 3, gramsPerMeal: 210, dailyAmount: 630, energyKcal: 2457, weightCategory: '45-60 kg', ageCategory: '6-9 kk', weightRange: [45, 60] },
  { mealsPerDay: 2, gramsPerMeal: 263, dailyAmount: 525, energyKcal: 2048, weightCategory: '45-60 kg', ageCategory: '9-12 kk', weightRange: [45, 60] },
  { mealsPerDay: 2, gramsPerMeal: 210, dailyAmount: 420, energyKcal: 1638, weightCategory: '45-60 kg', ageCategory: '12+ kk', weightRange: [45, 60] },
]

const ACTIVITY_MULTIPLIERS = {
  'hyvin-matala': 0.9,
  'normaali': 1.0,
  'aktiivinen': 1.1,
  'hyvin-aktiivinen': 1.2
}

const DOG_FOOD_BRANDS = [
  { name: 'Royal Canin', energyPerKg: 4000 },
  { name: 'Brit Care', energyPerKg: 4100 },
  { name: 'Hau-Hau Champion', energyPerKg: 3800 },
  { name: 'Eukanuba', energyPerKg: 4200 },
  { name: 'Acana', energyPerKg: 4000 },
  { name: 'Bozita', energyPerKg: 3900 },
]

interface AdvancedFoodCalculatorProps {
  currentWeight?: number
}

export default function AdvancedFoodCalculator({ currentWeight: propCurrentWeight }: AdvancedFoodCalculatorProps) {
  const [currentWeight, setCurrentWeight] = useState(propCurrentWeight?.toString() || '')
  const [ageMonths, setAgeMonths] = useState('')
  const [expectedAdultWeight, setExpectedAdultWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [foodBrand, setFoodBrand] = useState('')
  const [result, setResult] = useState<{
    dailyAmount: number
    mealsPerDay: number
    gramsPerMeal: number
    energyKcal: number
    usedRow: any
    activityMultiplier: number
    foodMultiplier: number
  } | null>(null)

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
    
    if (!weight || !months) return

    const weightCat = getWeightCategory(weight)
    const ageCat = getAgeCategory(months)
    
    const tableRow = DOSAGE_TABLE.find(row => 
      row.weightCategory === weightCat && row.ageCategory === ageCat
    )
    
    if (!tableRow) return

    const activityMult = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.0
    const selectedBrand = DOG_FOOD_BRANDS.find(brand => brand.name === foodBrand)
    const foodMult = selectedBrand ? selectedBrand.energyPerKg / 3900 : 1.0 // 3900 kcal/kg as standard

    const adjustedDailyAmount = Math.round(tableRow.dailyAmount * activityMult * foodMult)
    const adjustedGramsPerMeal = Math.round(adjustedDailyAmount / tableRow.mealsPerDay)
    const adjustedEnergy = Math.round(tableRow.energyKcal * activityMult * foodMult)

    setResult({
      dailyAmount: adjustedDailyAmount,
      mealsPerDay: tableRow.mealsPerDay,
      gramsPerMeal: adjustedGramsPerMeal,
      energyKcal: adjustedEnergy,
      usedRow: tableRow,
      activityMultiplier: activityMult,
      foodMultiplier: foodMult
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gradient-purple to-gradient-rose border-0 shadow-lg">
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
            <Label className="text-white">Ruokamerkki (valinnainen)</Label>
            <Select value={foodBrand} onValueChange={setFoodBrand}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Valitse ruokamerkki energiasisällön säätöä varten" />
              </SelectTrigger>
              <SelectContent>
                {DOG_FOOD_BRANDS.map(brand => (
                  <SelectItem key={brand.name} value={brand.name}>
                    {brand.name} ({brand.energyPerKg} kcal/kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={calculateFeeding} 
            className="w-full bg-white text-gradient-purple hover:bg-white/90"
            disabled={!currentWeight || !ageMonths}
          >
            <Dog className="mr-2 h-4 w-4" />
            Laske ruokamäärä
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Päiväannos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{result.dailyAmount}g</div>
                <p className="text-sm text-muted-foreground">yhteensä päivässä</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ruokintakerrat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{result.mealsPerDay}</div>
                <p className="text-sm text-muted-foreground">kertaa päivässä</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Annos/kerta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{result.gramsPerMeal}g</div>
                <p className="text-sm text-muted-foreground">per ruokintakerta</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{result.energyKcal}</div>
                <p className="text-sm text-muted-foreground">kcal päivässä</p>
              </CardContent>
            </Card>
          </div>

          {/* Used Table Row */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Käytetty annostelutaulukko
              </CardTitle>
              <CardDescription>
                Laskenta perustuu seuraavaan taulukkoon. Käytetty rivi on korostettu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Painoluokka</th>
                      <th className="text-left p-2">Ikä</th>
                      <th className="text-left p-2">Ruokintakerrat</th>
                      <th className="text-left p-2">g/kerta</th>
                      <th className="text-left p-2">g/päivä</th>
                      <th className="text-left p-2">kcal/päivä</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOSAGE_TABLE
                      .filter(row => 
                        row.weightCategory === result.usedRow.weightCategory
                      )
                      .map((row, index) => (
                        <tr 
                          key={index} 
                          className={`border-b ${
                            row.weightCategory === result.usedRow.weightCategory && 
                            row.ageCategory === result.usedRow.ageCategory
                              ? 'bg-blue-50 font-semibold' 
                              : ''
                          }`}
                        >
                          <td className="p-2">{row.weightCategory}</td>
                          <td className="p-2">{row.ageCategory}</td>
                          <td className="p-2">{row.mealsPerDay}</td>
                          <td className="p-2">{row.gramsPerMeal}</td>
                          <td className="p-2">{row.dailyAmount}</td>
                          <td className="p-2">{row.energyKcal}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Käytetty rivi:</h4>
                <p><strong>Painoluokka:</strong> {result.usedRow.weightCategory}</p>
                <p><strong>Ikäryhmä:</strong> {result.usedRow.ageCategory}</p>
                <p><strong>Perusannos:</strong> {result.usedRow.dailyAmount}g päivässä</p>
                {result.activityMultiplier !== 1.0 && (
                  <p><strong>Aktiivisuussäätö:</strong> ×{result.activityMultiplier}</p>
                )}
                {result.foodMultiplier !== 1.0 && (
                  <p><strong>Ruokamerkkisäätö:</strong> ×{result.foodMultiplier.toFixed(2)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>⚠️ Tärkeät huomiot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Nämä ovat suuntaa-antavia määriä. Seuraa pennun kasvua ja säädä tarvittaessa.</p>
              <p>• Jaa päiväannos tasaisesti ruokintakertojen kesken.</p>
              <p>• Siirry vähitellen uuteen ruokamäärään 3-5 päivän aikana.</p>
              <p>• Ota aina yhteyttä eläinlääkäriin, jos olet huolissaan pennun kasvusta.</p>
              <p>• Muista myös herttojen määrä päivittäisessä energiansaannissa!</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}