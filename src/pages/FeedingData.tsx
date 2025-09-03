
import React, { useState, useEffect, useMemo } from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Database, AlertCircle, Plus, Edit, Save, X, Trash2, RefreshCw } from 'lucide-react'
import Navigation from '@/components/Navigation'
import DosageImagesSection from '@/components/DosageImagesSection'
import GeneralDosageSection from '@/components/GeneralDosageSection'
import FoodAnalysisView from '@/components/FoodAnalysisView'
import { FoodFilter, type FoodFilters } from '@/components/FoodFilter'
import { FoodCard } from '@/components/FoodCard'
import { DogFoodService, type DogFood } from '@/services/dogFoodService'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import BackToTopButton from '@/components/BackToTopButton'
import heroImage from '@/assets/welcome-illustration.png'
import ScrollPanBackground from '@/components/ScrollPanBackground'

export default function FeedingData() {
  const [dogFoods, setDogFoods] = useState<DogFood[]>([])
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)
  const [editingFood, setEditingFood] = useState<DogFood | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showDetails, setShowDetails] = useState<string[]>([])
  const [filters, setFilters] = useState<FoodFilters>({
    searchTerm: '',
    manufacturer: 'all',
    foodType: 'all',
    nutritionType: 'all',
    dosageMethod: 'all',
    grainFree: false,
    wheatFree: false,
    glutenFree: false,
    proteinSource: 'all',
    countryOrigin: 'all',
    hasDetailedInfo: false
  })
  const [newFood, setNewFood] = useState({
    name: '',
    manufacturer: '',
    product_code: '',
    food_type: 'Kuiva',
    nutrition_type: 'Täysravinto',
    dosage_method: 'Nykyinen_Paino',
    notes: ''
  })
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Check current user for admin privileges
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    checkUser()
  }, [])

  const isAdmin = currentUser?.email === 'nissenemj@gmail.com'

  const loadDogFoods = async () => {
    try {
      setLoading(true)
      const foods = await DogFoodService.getAllDogFoods()
      setDogFoods(foods)
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
    
    // Set up real-time subscription for dog foods updates
    const channel = supabase
      .channel('dog-foods-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dog_foods'
        },
        () => {
          console.log('Dog foods data changed, reloading...')
          loadDogFoods()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Get unique values for filter options
  const manufacturers = useMemo(() => 
    [...new Set(dogFoods.map(food => food.manufacturer))].sort(), 
    [dogFoods]
  )

  const proteinSources = useMemo(() => {
    const sources = new Set<string>()
    dogFoods.forEach(food => {
      food.food_ingredients?.forEach(ingredient => {
        if (ingredient.ingredient_type === 'protein') {
          sources.add(ingredient.ingredient_name)
        }
      })
    })
    return Array.from(sources).sort()
  }, [dogFoods])

  const countries = useMemo(() => {
    const countries = new Set<string>()
    dogFoods.forEach(food => {
      if (food.country_of_origin) countries.add(food.country_of_origin)
    })
    return Array.from(countries).sort()
  }, [dogFoods])

  // Filter foods based on current filters
  const filteredFoods = useMemo(() => {
    let filtered = dogFoods

    // Text search
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchLower) ||
        food.manufacturer.toLowerCase().includes(searchLower) ||
        food.product_code.toLowerCase().includes(searchLower)
      )
    }

    // Manufacturer filter
    if (filters.manufacturer && filters.manufacturer !== 'all') {
      filtered = filtered.filter(food => food.manufacturer === filters.manufacturer)
    }

    // Food type filter
    if (filters.foodType && filters.foodType !== 'all') {
      filtered = filtered.filter(food => food.food_type === filters.foodType)
    }

    // Nutrition type filter
    if (filters.nutritionType && filters.nutritionType !== 'all') {
      filtered = filtered.filter(food => food.nutrition_type === filters.nutritionType)
    }

    // Dosage method filter
    if (filters.dosageMethod && filters.dosageMethod !== 'all') {
      filtered = filtered.filter(food => food.dosage_method === filters.dosageMethod)
    }

    // Allergen filters
    if (filters.grainFree) {
      filtered = filtered.filter(food => food.nutrition?.grain_free === true)
    }

    if (filters.wheatFree) {
      filtered = filtered.filter(food => food.nutrition?.wheat_free === true)
    }

    if (filters.glutenFree) {
      filtered = filtered.filter(food => food.nutrition?.gluten_free === true)
    }

    // Protein source filter
    if (filters.proteinSource && filters.proteinSource !== 'all') {
      filtered = filtered.filter(food => 
        food.food_ingredients?.some(ingredient => 
          ingredient.ingredient_type === 'protein' && 
          ingredient.ingredient_name === filters.proteinSource
        )
      )
    }

    // Country origin filter
    if (filters.countryOrigin && filters.countryOrigin !== 'all') {
      filtered = filtered.filter(food => food.country_of_origin === filters.countryOrigin)
    }

    // Detailed info filter
    if (filters.hasDetailedInfo) {
      filtered = filtered.filter(food => 
        (food.food_ingredients && food.food_ingredients.length > 0) || 
        food.ingredients ||
        food.protein_percentage ||
        (food.special_features && food.special_features.length > 0)
      )
    }

    return filtered
  }, [dogFoods, filters])

  const toggleDetails = (foodId: string) => {
    setShowDetails(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    )
  }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 page-with-navigation">
        <Navigation />
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
    <MobileOptimizedLayout>
    <div className="min-h-screen bg-background page-with-navigation w-full overflow-x-hidden">
      <Navigation />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0">
        {/* Hero Section - Pan background */}
        <div className="mb-12 rounded-2xl overflow-hidden">
          <ScrollPanBackground src={heroImage} alt="Koiranpennun ruokinta-annostelutiedot ja ruokavaliot" panX={40} panY={20} zoom={1.04} minHeightClass="h-96 sm:h-[500px] lg:h-[600px]">
            <div className="absolute bottom-8 left-0 right-0 text-center text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">Annostelutiedot</h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto px-4">
                Kattava tietokanta koiranruokien annostelutiedoista
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </ScrollPanBackground>
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="food-list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="food-list">Ruokalista</TabsTrigger>
            <TabsTrigger value="analysis">Analyysi</TabsTrigger>
            <TabsTrigger value="dosage-images">Annostelukuvat</TabsTrigger>
            <TabsTrigger value="general-dosage">Yleiset ohjeet</TabsTrigger>
          </TabsList>

          <TabsContent value="food-list" className="space-y-6">
            {/* Enhanced Food Filter */}
            <FoodFilter
              filters={filters}
              onFiltersChange={setFilters}
              manufacturers={manufacturers}
              proteinSources={proteinSources}
              countries={countries}
            />

            {/* Refresh Button */}
            <div className="flex justify-center mb-4">
              <Button 
                onClick={loadDogFoods} 
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Päivitetään...' : 'Päivitä tiedot'}
              </Button>
            </div>

            <div className="mb-6 text-sm text-muted-foreground text-center">
              Näytetään {filteredFoods.length} / {dogFoods.length} tuotetta
            </div>

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
            <div key={food.id}>
                <FoodCard
                food={food}
                showDetails={showDetails.includes(food.id)}
                isAdmin={isAdmin}
                onEdit={isAdmin ? setEditingFood : undefined}
                onDelete={isAdmin ? deleteFood : undefined}
                onUpdate={isAdmin ? updateFood : undefined}
                editingFood={editingFood}
              />
              
              <div className="flex justify-center mt-4 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleDetails(food.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showDetails.includes(food.id) ? 'Piilota yksityiskohdat' : 'Näytä ainesosatiedot'}
                </Button>
              </div>
            </div>
          ))}

          {filteredFoods.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ei tuloksia</p>
                  <p>Muuta hakuehtoja nähdäksesi tuotteita.</p>
                </div>
              </CardContent>
            </Card>
          )}
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
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <FoodAnalysisView />
          </TabsContent>

          <TabsContent value="dosage-images" className="space-y-6">
            <DosageImagesSection />
          </TabsContent>

          <TabsContent value="general-dosage" className="space-y-6">
            <GeneralDosageSection />
          </TabsContent>
        </Tabs>
        
        <BackToTopButton />
      </div>
    </div>
    </MobileOptimizedLayout>
  )
}
