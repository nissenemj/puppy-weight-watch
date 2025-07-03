
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Database, AlertCircle } from 'lucide-react'
import InfoNavigation from '@/components/InfoNavigation'
import DosageImagesSection from '@/components/DosageImagesSection'
import GeneralDosageSection from '@/components/GeneralDosageSection'
import { DogFoodService, type DogFood } from '@/services/dogFoodService'
import { toast } from 'sonner'

export default function FeedingData() {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [filteredFoods, setFilteredFoods] = useState<DogFood[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('all')
  const [selectedFoodType, setSelectedFoodType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)

  const loadDogFoods = async () => {
    try {
      setLoading(true)
      const foods = await DogFoodService.getAllDogFoods()
      setDogFoods(foods)
      setFilteredFoods(foods)
    } catch (error) {
      console.error('Error loading dog foods:', error)
      toast.error('Tietojen lataaminen epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    try {
      setInitializing(true)
      await DogFoodService.initializeDatabase()
      toast.success('Tietokanta alustettu onnistuneesti!')
      await loadDogFoods()
    } catch (error) {
      console.error('Error initializing database:', error)
      toast.error('Tietokannan alustus epäonnistui')
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    loadDogFoods()
  }, [])

  useEffect(() => {
    let filtered = dogFoods

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedManufacturer !== 'all') {
      filtered = filtered.filter(food => food.manufacturer === selectedManufacturer)
    }

    if (selectedFoodType !== 'all') {
      filtered = filtered.filter(food => food.food_type === selectedFoodType)
    }

    setFilteredFoods(filtered)
  }, [searchTerm, selectedManufacturer, selectedFoodType, dogFoods])

  const manufacturers = [...new Set(dogFoods.map(food => food.manufacturer))].sort()
  const foodTypes = ['Kuiva', 'Märkä', 'Raaka']

  const getDosageMethodDescription = (method: string): string => {
    switch (method) {
      case 'Odotettu_Aikuispaino_Ja_Ikä':
        return 'Odotettu aikuispaino + ikä'
      case 'Nykyinen_Paino':
        return 'Nykyinen paino'
      case 'Prosentti_Nykyisestä_Painosta':
        return 'Prosentti nykyisestä painosta'
      case 'Kokoluokka':
        return 'Kokoluokka'
      case 'Ei_Tietoa':
        return 'Ei tietoa'
      default:
        return method
    }
  }

  const getNutritionTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'Täysravinto':
        return 'bg-green-100 text-green-800'
      case 'Täydennysravinto':
        return 'bg-yellow-100 text-yellow-800'
      case 'Täysravinto/Täydennysravinto':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <InfoNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Ladataan annostelutietoja...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <InfoNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📊 Annostelutiedot
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl">
            Yksityiskohtaiset annosteluohjeet Suomessa myytävistä penturuoista. 
            Tiedot kerätty valmistajien ohjeista ja strukturoitu ohjelmistokäyttöön.
          </p>
        </div>

        {dogFoods.length === 0 && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Database className="h-5 w-5" />
                Tietokanta tyhjä
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Tietokantaan ei ole vielä tallennettu koiranruokatietoja. 
                Klikkaa alla olevaa painiketta alustamaan tietokanta tutkimusraportin tiedoilla.
              </p>
              <Button 
                onClick={initializeDatabase} 
                disabled={initializing}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {initializing ? 'Alustetaan...' : 'Alusta tietokanta'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Hakutyökalut */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Haku ja suodattimet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hae tuotetta</label>
                <Input
                  placeholder="Tuotteen nimi tai valmistaja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Valmistaja</label>
                <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse valmistaja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Kaikki valmistajat</SelectItem>
                    {manufacturers.map(manufacturer => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ruokatyyppi</label>
                <Select value={selectedFoodType} onValueChange={setSelectedFoodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse ruokatyyppi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Kaikki tyypit</SelectItem>
                    {foodTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Näytetään {filteredFoods.length} / {dogFoods.length} tuotetta
            </div>
          </CardContent>
        </Card>

        {/* Annostelukuvat */}
        <DosageImagesSection />

        {/* Yleiset annostelutaulut */}
        <GeneralDosageSection />

        {/* Tuotteet */}
        <div className="grid gap-6">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{food.name}</CardTitle>
                    <CardDescription className="text-base">
                      {food.manufacturer} • {food.food_type}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getNutritionTypeBadgeColor(food.nutrition_type)}>
                      {food.nutrition_type}
                    </Badge>
                    <Badge variant="outline">
                      {getDosageMethodDescription(food.dosage_method)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {food.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{food.notes}</p>
                  </div>
                )}
                
                {food.feeding_guidelines && food.feeding_guidelines.length > 0 ? (
                  <div>
                    <h4 className="font-semibold mb-3">Annosteluohjeet:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {food.dosage_method === 'Odotettu_Aikuispaino_Ja_Ikä' && (
                              <>
                                <th className="text-left p-2">Aikuispaino (kg)</th>
                                <th className="text-left p-2">Ikä (kk)</th>
                              </>
                            )}
                            {food.dosage_method === 'Nykyinen_Paino' && (
                              <th className="text-left p-2">Nykypaino (kg)</th>
                            )}
                            {food.dosage_method === 'Kokoluokka' && (
                              <th className="text-left p-2">Kokoluokka</th>
                            )}
                            <th className="text-left p-2">Päiväannos (g)</th>
                            {food.feeding_guidelines.some(g => g.calculation_formula) && (
                              <th className="text-left p-2">Laskentakaava</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {food.feeding_guidelines.map((guideline, index) => (
                            <tr key={index} className="border-b">
                              {food.dosage_method === 'Odotettu_Aikuispaino_Ja_Ikä' && (
                                <>
                                  <td className="p-2">{guideline.adult_weight_kg}</td>
                                  <td className="p-2">{guideline.age_months}</td>
                                </>
                              )}
                              {food.dosage_method === 'Nykyinen_Paino' && (
                                <td className="p-2">{guideline.current_weight_kg}</td>
                              )}
                              {food.dosage_method === 'Kokoluokka' && (
                                <td className="p-2">{guideline.size_category}</td>
                              )}
                              <td className="p-2">
                                {guideline.daily_amount_min === guideline.daily_amount_max 
                                  ? guideline.daily_amount_min 
                                  : `${guideline.daily_amount_min}-${guideline.daily_amount_max}`}
                              </td>
                              {guideline.calculation_formula && (
                                <td className="p-2 text-xs font-mono">
                                  {guideline.calculation_formula}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : food.dosage_method === 'Ei_Tietoa' ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Annostelutaulukkoa ei ole saatavilla digitaalisessa muodossa. 
                      Tarkista annostus tuotepakkauksesta.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Annosteluohjeita ei ole vielä tallennettu tietokantaan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFoods.length === 0 && dogFoods.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ei tuloksia
              </h3>
              <p className="text-gray-600">
                Muokkaa hakuehtoja löytääksesi tuotteita
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
