import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  BarChart3, 
  AlertTriangle, 
  Leaf, 
  Shield, 
  Heart,
  Filter,
  Info
} from 'lucide-react'
import { DogFood, DogFoodService } from '@/services/dogFoodService'

interface FilterState {
  grainFree: boolean
  wheatFree: boolean
  glutenFree: boolean
  hypoallergenic: boolean
  rawFood: boolean
  dryFood: boolean
  wetFood: boolean
}

export default function FoodAnalysisView() {
  const [foods, setFoods] = useState<DogFood[]>([])
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    grainFree: false,
    wheatFree: false,
    glutenFree: false,
    hypoallergenic: false,
    rawFood: false,
    dryFood: false,
    wetFood: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const data = await DogFoodService.getAllDogFoods()
      setFoods(data)
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFoods = foods.filter(food => {
    if (filters.grainFree && !food.nutrition?.grain_free) return false
    if (filters.wheatFree && !food.nutrition?.wheat_free) return false
    if (filters.glutenFree && !food.nutrition?.gluten_free) return false
    if (filters.hypoallergenic && !food.nutrition?.special_features?.includes('Hypoallergeeninen')) return false
    if (filters.rawFood && food.food_type !== 'Raaka') return false
    if (filters.dryFood && food.food_type !== 'Kuiva') return false
    if (filters.wetFood && food.food_type !== 'Märkä') return false
    return true
  })

  const selectedFoodData = foods.filter(food => selectedFoods.includes(food.id))

  const getProteinSources = (food: DogFood) => {
    return food.ingredients?.filter(i => i.ingredient_type === 'protein').map(i => i.ingredient_name) || []
  }

  const getCarbSources = (food: DogFood) => {
    return food.ingredients?.filter(i => i.ingredient_type === 'carb').map(i => i.ingredient_name) || []
  }

  const hasCompleteData = (food: DogFood) => {
    return food.ingredients && food.ingredients.length > 0 && food.nutrition
  }

  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    )
  }

  const clearFilters = () => {
    setFilters({
      grainFree: false,
      wheatFree: false,
      glutenFree: false,
      hypoallergenic: false,
      rawFood: false,
      dryFood: false,
      wetFood: false
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Ladataan ruokatietoja...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ruokien analyysi ja vertailu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="selection" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="selection">Valinta</TabsTrigger>
              <TabsTrigger value="ingredients">Ainesosat</TabsTrigger>
              <TabsTrigger value="allergens">Allergeenit</TabsTrigger>
              <TabsTrigger value="nutrition">Ravintosisältö</TabsTrigger>
            </TabsList>

            <TabsContent value="selection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Suodattimet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="grain-free"
                          checked={filters.grainFree}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, grainFree: checked as boolean }))}
                        />
                        <label htmlFor="grain-free" className="text-sm">Viljaton</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="wheat-free"
                          checked={filters.wheatFree}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, wheatFree: checked as boolean }))}
                        />
                        <label htmlFor="wheat-free" className="text-sm">Vehnätön</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="gluten-free"
                          checked={filters.glutenFree}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, glutenFree: checked as boolean }))}
                        />
                        <label htmlFor="gluten-free" className="text-sm">Gluteeniton</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hypoallergenic"
                          checked={filters.hypoallergenic}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hypoallergenic: checked as boolean }))}
                        />
                        <label htmlFor="hypoallergenic" className="text-sm">Hypoallergeeninen</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="raw-food"
                          checked={filters.rawFood}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, rawFood: checked as boolean }))}
                        />
                        <label htmlFor="raw-food" className="text-sm">Raakaruoka</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dry-food"
                          checked={filters.dryFood}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, dryFood: checked as boolean }))}
                        />
                        <label htmlFor="dry-food" className="text-sm">Kuivaruoka</label>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Tyhjennä suodattimet
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Valitse vertailtavat ruoat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredFoods.map(food => (
                        <div key={food.id} className="flex items-center space-x-2 p-2 border rounded">
                          <Checkbox 
                            checked={selectedFoods.includes(food.id)}
                            onCheckedChange={() => toggleFoodSelection(food.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{food.manufacturer} - {food.name}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{food.food_type}</Badge>
                              {!hasCompleteData(food) && (
                                <Badge variant="destructive" className="text-xs">Puutteelliset tiedot</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedFoodData.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Valittu {selectedFoodData.length} ruokaa vertailuun. Siirry muihin välilehtiin nähdäksesi yksityiskohtaisen analyysin.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-4">
              {selectedFoodData.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Valitse ensin ruokia "Valinta"-välilehdeltä nähdäksesi ainesosien vertailun.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {selectedFoodData.map(food => (
                    <Card key={food.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {food.manufacturer} - {food.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {hasCompleteData(food) ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Proteiinilähteet</h4>
                              <div className="space-y-1">
                                {getProteinSources(food).map((protein, idx) => (
                                  <Badge key={idx} variant="outline" className="mr-1 mb-1">{protein}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Hiilihydraatit</h4>
                              <div className="space-y-1">
                                {getCarbSources(food).map((carb, idx) => (
                                  <Badge key={idx} variant="secondary" className="mr-1 mb-1">{carb}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Erityisominaisuudet</h4>
                              <div className="space-y-1">
                                {food.nutrition?.special_features?.map((feature, idx) => (
                                  <Badge key={idx} variant="default" className="mr-1 mb-1">{feature}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Ainesosatiedot eivät ole saatavilla tälle tuotteelle.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="allergens" className="space-y-4">
              {selectedFoodData.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Valitse ensin ruokia "Valinta"-välilehdeltä nähdäksesi allergeenien vertailun.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFoodData.map(food => (
                    <Card key={food.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {food.manufacturer} - {food.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className={`text-2xl ${food.nutrition?.grain_free ? 'text-green-600' : 'text-gray-400'}`}>
                                {food.nutrition?.grain_free ? '✓' : '✗'}
                              </div>
                              <div className="text-xs">Viljaton</div>
                            </div>
                            <div>
                              <div className={`text-2xl ${food.nutrition?.wheat_free ? 'text-green-600' : 'text-gray-400'}`}>
                                {food.nutrition?.wheat_free ? '✓' : '✗'}
                              </div>
                              <div className="text-xs">Vehnätön</div>
                            </div>
                            <div>
                              <div className={`text-2xl ${food.nutrition?.gluten_free ? 'text-green-600' : 'text-gray-400'}`}>
                                {food.nutrition?.gluten_free ? '✓' : '✗'}
                              </div>
                              <div className="text-xs">Gluteeniton</div>
                            </div>
                          </div>

                          {food.allergens && food.allergens.length > 0 && (
                            <div className="space-y-2">
                              {food.allergens.filter(a => a.allergen_type === 'free_from').length > 0 && (
                                <div>
                                  <h5 className="text-xs font-medium text-green-700 mb-1">Vapaa allergeeneista:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {food.allergens
                                      .filter(a => a.allergen_type === 'free_from')
                                      .map(allergen => (
                                        <Badge key={allergen.id} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                          ✓ {allergen.allergen_name}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {food.allergens.filter(a => a.allergen_type === 'contains').length > 0 && (
                                <div>
                                  <h5 className="text-xs font-medium text-orange-700 mb-1">Sisältää:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {food.allergens
                                      .filter(a => a.allergen_type === 'contains')
                                      .map(allergen => (
                                        <Badge key={allergen.id} variant="destructive" className="text-xs">
                                          ⚠ {allergen.allergen_name}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              {selectedFoodData.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Valitse ensin ruokia "Valinta"-välilehdeltä nähdäksesi ravintosisällön vertailun.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFoodData.map(food => (
                      <Card key={food.id}>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            {food.manufacturer} - {food.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {food.nutrition ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                {food.nutrition.protein_percentage && (
                                  <div className="text-center p-2 bg-blue-50 rounded">
                                    <div className="text-lg font-bold text-blue-600">
                                      {food.nutrition.protein_percentage}%
                                    </div>
                                    <div className="text-xs text-blue-800">Proteiini</div>
                                  </div>
                                )}
                                {food.nutrition.fat_percentage && (
                                  <div className="text-center p-2 bg-orange-50 rounded">
                                    <div className="text-lg font-bold text-orange-600">
                                      {food.nutrition.fat_percentage}%
                                    </div>
                                    <div className="text-xs text-orange-800">Rasva</div>
                                  </div>
                                )}
                                {food.nutrition.fiber_percentage && (
                                  <div className="text-center p-2 bg-green-50 rounded">
                                    <div className="text-lg font-bold text-green-600">
                                      {food.nutrition.fiber_percentage}%
                                    </div>
                                    <div className="text-xs text-green-800">Kuitu</div>
                                  </div>
                                )}
                                {food.nutrition.moisture_percentage && (
                                  <div className="text-center p-2 bg-purple-50 rounded">
                                    <div className="text-lg font-bold text-purple-600">
                                      {food.nutrition.moisture_percentage}%
                                    </div>
                                    <div className="text-xs text-purple-800">Kosteus</div>
                                  </div>
                                )}
                              </div>

                              {food.food_type === 'Raaka' && (
                                <Alert>
                                  <Info className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    Raakaruoan korkea kosteuspitoisuus (n. 70%) tekee siitä energiatiheydeltään erilaisen kuin kuivaruoka.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          ) : (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Ravintosisältötiedot eivät ole saatavilla.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedFoodData.some(food => food.nutrition?.special_features) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Erityisominaisuuksien vertailu</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedFoodData.map(food => (
                            <div key={food.id} className="border-b pb-2 last:border-b-0">
                              <h4 className="font-medium text-sm mb-2">{food.manufacturer} - {food.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                {food.nutrition?.special_features?.map((feature, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}