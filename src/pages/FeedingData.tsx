
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Filter, Database, AlertCircle, Plus, Edit, Save, X, Trash2 } from 'lucide-react'
import InfoNavigation from '@/components/InfoNavigation'
import DosageImagesSection from '@/components/DosageImagesSection'
import GeneralDosageSection from '@/components/GeneralDosageSection'
import { DogFoodService, type DogFood } from '@/services/dogFoodService'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function FeedingData() {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [filteredFoods, setFilteredFoods] = useState<DogFood[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('all')
  const [selectedFoodType, setSelectedFoodType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)
  const [editingFood, setEditingFood] = useState<DogFood | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFood, setNewFood] = useState({
    name: '',
    manufacturer: '',
    product_code: '',
    food_type: 'Kuiva',
    nutrition_type: 'Täysravinto',
    dosage_method: 'Nykyinen_Paino',
    notes: ''
  })

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

  const createFood = async () => {
    try {
      if (!newFood.name || !newFood.manufacturer) {
        toast.error('Anna vähintään tuotteen nimi ja valmistaja')
        return
      }

      const { error } = await supabase
        .from('dog_foods')
        .insert({
          name: newFood.name,
          manufacturer: newFood.manufacturer,
          product_code: newFood.product_code,
          food_type: newFood.food_type,
          nutrition_type: newFood.nutrition_type,
          dosage_method: newFood.dosage_method,
          notes: newFood.notes || null
        })

      if (error) throw error

      toast.success('Koiranruoka lisätty onnistuneesti!')
      setNewFood({
        name: '',
        manufacturer: '',
        product_code: '',
        food_type: 'Kuiva',
        nutrition_type: 'Täysravinto',
        dosage_method: 'Nykyinen_Paino',
        notes: ''
      })
      setIsCreateDialogOpen(false)
      loadDogFoods()
    } catch (error) {
      console.error('Error creating food:', error)
      toast.error('Koiranruoan lisääminen epäonnistui')
    }
  }

  const updateFood = async (food: DogFood) => {
    try {
      const { error } = await supabase
        .from('dog_foods')
        .update({
          name: food.name,
          manufacturer: food.manufacturer,
          product_code: food.product_code,
          food_type: food.food_type,
          nutrition_type: food.nutrition_type,
          dosage_method: food.dosage_method,
          notes: food.notes
        })
        .eq('id', food.id)

      if (error) throw error

      toast.success('Koiranruoka päivitetty onnistuneesti!')
      setEditingFood(null)
      loadDogFoods()
    } catch (error) {
      console.error('Error updating food:', error)
      toast.error('Koiranruoan päivittäminen epäonnistui')
    }
  }

  const deleteFood = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dog_foods')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Koiranruoka poistettu onnistuneesti!')
      loadDogFoods()
    } catch (error) {
      console.error('Error deleting food:', error)
      toast.error('Koiranruoan poistaminen epäonnistui')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-14">
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
    <div className="min-h-screen bg-gradient-warm pt-14 w-full overflow-x-hidden">
      <InfoNavigation />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            📊 Annostelutiedot
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl">
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
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5" />
              Haku ja suodattimet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium mb-2">Hae tuotetta</label>
                <Input
                  placeholder="Tuotteen nimi tai valmistaja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium mb-2">Valmistaja</label>
                <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                  <SelectTrigger className="w-full">
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
              
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium mb-2">Ruokatyyppi</label>
                <Select value={selectedFoodType} onValueChange={setSelectedFoodType}>
                  <SelectTrigger className="w-full">
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
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xl">
              <span>Koiranruokatiedot</span>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Lisää uusi tuote
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2">
                  <DialogHeader>
                    <DialogTitle>Lisää uusi koiranruoka</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
                    <div>
                      <Label htmlFor="name">Tuotteen nimi *</Label>
                      <Input
                        id="name"
                        value={newFood.name}
                        onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="esim. Puppy Medium"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manufacturer">Valmistaja *</Label>
                      <Input
                        id="manufacturer"
                        value={newFood.manufacturer}
                        onChange={(e) => setNewFood(prev => ({ ...prev, manufacturer: e.target.value }))}
                        placeholder="esim. Royal Canin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_code">Tuotekoodi</Label>
                      <Input
                        id="product_code"
                        value={newFood.product_code}
                        onChange={(e) => setNewFood(prev => ({ ...prev, product_code: e.target.value }))}
                        placeholder="esim. RC123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="food_type">Ruokatyyppi</Label>
                      <Select value={newFood.food_type} onValueChange={(value) => setNewFood(prev => ({ ...prev, food_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kuiva">Kuiva</SelectItem>
                          <SelectItem value="Märkä">Märkä</SelectItem>
                          <SelectItem value="Raaka">Raaka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nutrition_type">Ravitsemustyyppi</Label>
                      <Select value={newFood.nutrition_type} onValueChange={(value) => setNewFood(prev => ({ ...prev, nutrition_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Täysravinto">Täysravinto</SelectItem>
                          <SelectItem value="Täydennysravinto">Täydennysravinto</SelectItem>
                          <SelectItem value="Täysravinto/Täydennysravinto">Täysravinto/Täydennysravinto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dosage_method">Annostelumenetelmä</Label>
                      <Select value={newFood.dosage_method} onValueChange={(value) => setNewFood(prev => ({ ...prev, dosage_method: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Odotettu_Aikuispaino_Ja_Ikä">Odotettu aikuispaino + ikä</SelectItem>
                          <SelectItem value="Nykyinen_Paino">Nykyinen paino</SelectItem>
                          <SelectItem value="Prosentti_Nykyisestä_Painosta">Prosentti nykyisestä painosta</SelectItem>
                          <SelectItem value="Kokoluokka">Kokoluokka</SelectItem>
                          <SelectItem value="Ei_Tietoa">Ei tietoa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="notes">Huomiot</Label>
                      <Textarea
                        id="notes"
                        value={newFood.notes}
                        onChange={(e) => setNewFood(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Lisätietoja tuotteesta..."
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 min-w-0">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Peruuta
                    </Button>
                    <Button onClick={createFood}>
                      Tallenna tuote
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    {editingFood?.id === food.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
                          <div>
                            <Label>Tuotteen nimi</Label>
                            <Input
                              value={editingFood.name}
                              onChange={(e) => setEditingFood(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <Label>Valmistaja</Label>
                            <Input
                              value={editingFood.manufacturer}
                              onChange={(e) => setEditingFood(prev => prev ? { ...prev, manufacturer: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <Label>Tuotekoodi</Label>
                            <Input
                              value={editingFood.product_code}
                              onChange={(e) => setEditingFood(prev => prev ? { ...prev, product_code: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <Label>Ruokatyyppi</Label>
                            <Select value={editingFood.food_type} onValueChange={(value: "Kuiva" | "Märkä" | "Raaka") => setEditingFood(prev => prev ? { ...prev, food_type: value } : null)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Kuiva">Kuiva</SelectItem>
                                <SelectItem value="Märkä">Märkä</SelectItem>
                                <SelectItem value="Raaka">Raaka</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Ravitsemustyyppi</Label>
                            <Select value={editingFood.nutrition_type} onValueChange={(value: "Täysravinto" | "Täydennysravinto" | "Täysravinto/Täydennysravinto") => setEditingFood(prev => prev ? { ...prev, nutrition_type: value } : null)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Täysravinto">Täysravinto</SelectItem>
                                <SelectItem value="Täydennysravinto">Täydennysravinto</SelectItem>
                                <SelectItem value="Täysravinto/Täydennysravinto">Täysravinto/Täydennysravinto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Annostelumenetelmä</Label>
                            <Select value={editingFood.dosage_method} onValueChange={(value: "Nykyinen_Paino" | "Odotettu_Aikuispaino_Ja_Ikä" | "Prosentti_Nykyisestä_Painosta" | "Kokoluokka" | "Ei_Tietoa") => setEditingFood(prev => prev ? { ...prev, dosage_method: value } : null)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Odotettu_Aikuispaino_Ja_Ikä">Odotettu aikuispaino + ikä</SelectItem>
                                <SelectItem value="Nykyinen_Paino">Nykyinen paino</SelectItem>
                                <SelectItem value="Prosentti_Nykyisestä_Painosta">Prosentti nykyisestä painosta</SelectItem>
                                <SelectItem value="Kokoluokka">Kokoluokka</SelectItem>
                                <SelectItem value="Ei_Tietoa">Ei tietoa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="lg:col-span-2">
                            <Label>Huomiot</Label>
                            <Textarea
                              value={editingFood.notes || ''}
                              onChange={(e) => setEditingFood(prev => prev ? { ...prev, notes: e.target.value } : null)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" onClick={() => updateFood(editingFood)}>
                            <Save className="h-4 w-4 mr-1" />
                            Tallenna
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingFood(null)}>
                            <X className="h-4 w-4 mr-1" />
                            Peruuta
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-lg">{food.name}</CardTitle>
                        <CardDescription className="text-base">
                          {food.manufacturer} • {food.food_type}
                        </CardDescription>
                      </>
                    )}
                  </div>
                  {editingFood?.id !== food.id && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Badge className={getNutritionTypeBadgeColor(food.nutrition_type)}>
                        {food.nutrition_type}
                      </Badge>
                      <Badge variant="outline">
                        {getDosageMethodDescription(food.dosage_method)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFood(food)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFood(food.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {food.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{food.notes}</p>
                  </div>
                )}
                
                {food.feeding_guidelines && food.feeding_guidelines.length > 0 ? (
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-3">Annosteluohjeet:</h4>
                    <div className="overflow-x-auto mobile-table-scroll w-full">
                      <table className="w-full text-sm min-w-full">
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
