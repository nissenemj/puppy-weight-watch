import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import PuppyFeedingCalculator from './PuppyFeeding'
import CameraComponent from './CameraComponent'
import { OCRService, GuideEntry } from '@/services/ocrService'
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
  const [manualFat, setManualFat] = useState('')

  // OCR ja kuvantunnistus
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [parsedGuide, setParsedGuide] = useState<GuideEntry[] | null>(null)
  const [ocrText, setOcrText] = useState('')

  useEffect(() => {
    if (currentWeight > 0) {
      setWeight(currentWeight.toString())
    }
  }, [currentWeight])

  const handlePictureTaken = async (imageDataUrl: string) => {
    setIsCameraOpen(false)
    setOcrLoading(true)
    toast.success("Tunnistetaan ravintotietoja...")

    try {
      const text = await OCRService.recognizeText(imageDataUrl)
      setOcrText(text)
      
      // Yritä ensin parsia annostelutaulukko
      const guide = OCRService.parseFeedingGuide(text)
      
      if (guide && guide.length > 0) {
        setParsedGuide(guide)
        toast.success("Annostelutaulukko tunnistettu! Tarkista tiedot ja syötä pennun paino.")
      } else {
        // Jos taulukkoa ei löydy, yritä parsia yksittäiset arvot
        const nutrition = OCRService.parseNutritionInfo(text)
        
        if (nutrition.calories) setManualCalories(nutrition.calories)
        if (nutrition.protein) setManualProtein(nutrition.protein)
        if (nutrition.fat) setManualFat(nutrition.fat)
        
        if (nutrition.calories || nutrition.protein || nutrition.fat) {
          toast.success(`Ravintotiedot tunnistettu: ${nutrition.calories ? `Kalorit: ${nutrition.calories} kcal/100g` : ''} ${nutrition.protein ? `Proteiini: ${nutrition.protein}%` : ''} ${nutrition.fat ? `Rasva: ${nutrition.fat}%` : ''}`)
        } else {
          toast.warning("Ravintotietoja ei voitu tunnistaa automaattisesti. Syötä tiedot manuaalisesti.")
        }
      }
    } catch (error) {
      console.error('OCR-tunnistus epäonnistui:', error)
      toast.error("Tekstin tunnistus epäonnistui. Yritä ottaa kuva uudelleen paremmassa valaistuksessa.")
    } finally {
      setOcrLoading(false)
    }
  }

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

  const calculateFromGuide = () => {
    const weightNum = parseFloat(weight)
    if (!weightNum || !parsedGuide) return

    const amount = OCRService.calculateFromGuide(parsedGuide, weightNum)
    if (amount) {
      setRecommendation({
        dailyAmount: amount,
        mealsPerDay: 2,
        amountPerMeal: Math.round(amount / 2),
        dailyCalories: Math.round(amount * 3.5), // Arvio kuivaruoalle
        method: 'Tunnistettu annostelutaulukko'
      })
      toast.success(`Päivittäinen ruokamäärä: ${amount}g`)
    } else {
      toast.error("Annosta ei voitu laskea annetulla painolla. Tarkista että paino on taulukon alueella.")
    }
  }

  return (
    <>
      {isCameraOpen && (
        <CameraComponent
          onPictureTaken={handlePictureTaken}
          onCancel={() => setIsCameraOpen(false)}
        />
      )}

      <Tabs defaultValue="puppy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="puppy">Penturuokinta</TabsTrigger>
          <TabsTrigger value="basic">Peruslaskuri</TabsTrigger>
        </TabsList>
        
        
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
                Laske koirallesi sopiva ruokamäärä RER-kaavan avulla tai kuvantunnistuksella
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">RER-laskuri</TabsTrigger>
                  <TabsTrigger value="manual">Käsin syöttö</TabsTrigger>
                  <TabsTrigger value="image">Kuvantunnistus</TabsTrigger>
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

                    <div className="space-y-2">
                      <Label htmlFor="manual-fat">Rasva per 100g (%)</Label>
                      <Input
                        id="manual-fat"
                        type="number"
                        value={manualFat}
                        onChange={(e) => setManualFat(e.target.value)}
                        placeholder="esim. 12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight-manual">Paino (kg)</Label>
                      <Input
                        id="weight-manual"
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Koiran paino"
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
                  <div className="text-center space-y-4">
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Ota kuva ruokapakkauksen ravintotiedoista tai annostelutaulukosta
                      </p>
                      
                      <Button 
                        onClick={() => setIsCameraOpen(true)} 
                        size="lg"
                        disabled={ocrLoading}
                      >
                        {ocrLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Tunnistetaan...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" />
                            Avaa kamera
                          </>
                        )}
                      </Button>
                    </div>

                    {parsedGuide && (
                      <div className="p-4 border-2 border-blue-500 border-dashed rounded-lg text-left">
                        <h4 className="font-bold mb-2 text-blue-800">Tunnistettu annostelutaulukko:</h4>
                        <div className="text-sm space-y-1 mb-4">
                          {parsedGuide.map((entry, i) => (
                            <p key={i} className="bg-blue-50 p-2 rounded">
                              <strong>{entry.weightMin}-{entry.weightMax} kg:</strong> {entry.amountMin}-{entry.amountMax} g/päivä
                            </p>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weight-guide">Pennun paino (kg)</Label>
                          <Input
                            id="weight-guide"
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Syötä pennun nykyinen paino"
                          />
                        </div>
                        
                        <Button onClick={calculateFromGuide} className="w-full mt-4">
                          Laske annos taulukon mukaan
                        </Button>
                        
                        <p className="text-xs mt-2 text-gray-500">
                          Jos taulukko näyttää väärin, voit syöttää tiedot manuaalisesti
                        </p>
                      </div>
                    )}

                    {ocrText && !parsedGuide && (
                      <div className="p-3 bg-gray-50 rounded-lg text-left">
                        <p className="text-sm text-gray-600 mb-2">Tunnistettu teksti:</p>
                        <p className="text-xs font-mono bg-white p-2 rounded border max-h-32 overflow-y-auto">
                          {ocrText}
                        </p>
                      </div>
                    )}
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
                    <p><strong>Huom:</strong> Tarkista aina ruokapakkauksen ohjeet ja keskustele tarvittaessa eläinlääkärin kanssa.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
