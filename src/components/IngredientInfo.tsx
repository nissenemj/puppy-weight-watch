import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Info, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DogFood } from '@/services/dogFoodService'

interface IngredientInfoProps {
  food: DogFood
}

export function IngredientInfo({ food }: IngredientInfoProps) {
  const primaryIngredients = food.food_ingredients?.filter(i => i.ingredient_type === 'primary') || []
  const proteinSources = food.food_ingredients?.filter(i => i.ingredient_type === 'protein') || []
  const carbSources = food.food_ingredients?.filter(i => i.ingredient_type === 'carb') || []
  const fatSources = food.food_ingredients?.filter(i => i.ingredient_type === 'fat') || []
  
  const containsAllergens = food.allergens?.filter(a => a.allergen_type === 'contains') || []
  const freeFromAllergens = food.allergens?.filter(a => a.allergen_type === 'free_from') || []

  // Check if we have any data to display
  const hasIngredients = food.food_ingredients?.length > 0 || Boolean(food.ingredients)
  const hasAllergens = food.allergens?.length > 0 || food.nutrition
  const hasNutrition = food.nutrition

  // Don't render if no data available at all
  if (!hasIngredients && !hasAllergens && !hasNutrition) {
    return (
      <Card className="mt-4">
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Ainesosatiedot eivät ole saatavilla</p>
            <p className="text-sm">Tälle tuotteelle ei ole vielä lisätty yksityiskohtaisia ainesosa- tai ravintosisältötietoja.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Ainesosatiedot ja ravintosisältö
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ingredients">Ainesosat</TabsTrigger>
            <TabsTrigger value="allergens">Allergeenit</TabsTrigger>
            <TabsTrigger value="nutrition">Ravintosisältö</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients" className="space-y-4">
            {primaryIngredients.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Pääainesosat:</h4>
                <div className="flex flex-wrap gap-2">
                  {primaryIngredients
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((ingredient) => (
                      <Badge key={ingredient.id} variant="outline">
                        {ingredient.ingredient_name}
                        {ingredient.percentage && ` (${ingredient.percentage}%)`}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proteinSources.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground">Proteiinilähteet</h5>
                  <ul className="text-sm mt-1">
                    {proteinSources.map((source) => (
                      <li key={source.id}>• {source.ingredient_name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {carbSources.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground">Hiilihydraatit</h5>
                  <ul className="text-sm mt-1">
                    {carbSources.map((source) => (
                      <li key={source.id}>• {source.ingredient_name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {fatSources.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground">Rasvalähteet</h5>
                  <ul className="text-sm mt-1">
                    {fatSources.map((source) => (
                      <li key={source.id}>• {source.ingredient_name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!hasIngredients && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="bg-gray-50 rounded-lg p-6">
                  <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Ainesosatiedot eivät ole saatavilla</p>
                  <p className="text-sm mt-1">Tälle tuotteelle ei ole vielä lisätty yksityiskohtaisia ainesosatietoja.</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="allergens" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {freeFromAllergens.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">Vapaa allergeeneista:</h4>
                  <div className="flex flex-wrap gap-2">
                    {freeFromAllergens.map((allergen) => (
                      <Badge key={allergen.id} variant="secondary" className="bg-green-100 text-green-800">
                        ✓ {allergen.allergen_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {containsAllergens.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">Sisältää:</h4>
                  <div className="flex flex-wrap gap-2">
                    {containsAllergens.map((allergen) => (
                      <Badge key={allergen.id} variant="destructive">
                        ⚠ {allergen.allergen_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {food.nutrition && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className={`text-2xl ${food.nutrition.grain_free ? 'text-green-600' : 'text-gray-400'}`}>
                    {food.nutrition.grain_free ? '✓' : '✗'}
                  </div>
                  <div className="text-sm font-medium">Viljaton</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl ${food.nutrition.wheat_free ? 'text-green-600' : 'text-gray-400'}`}>
                    {food.nutrition.wheat_free ? '✓' : '✗'}
                  </div>
                  <div className="text-sm font-medium">Vehnätön</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl ${food.nutrition.gluten_free ? 'text-green-600' : 'text-gray-400'}`}>
                    {food.nutrition.gluten_free ? '✓' : '✗'}
                  </div>
                  <div className="text-sm font-medium">Gluteeniton</div>
                </div>
              </div>
            )}

            {!hasAllergens && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="bg-gray-50 rounded-lg p-6">
                  <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Allergeenimerkinnät eivät ole saatavilla</p>
                  <p className="text-sm mt-1">Tälle tuotteelle ei ole vielä lisätty allergeeni- tai ravintoarvoaikoja.</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-4">
            {food.nutrition && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {food.nutrition.protein_percentage && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {food.nutrition.protein_percentage}%
                      </div>
                      <div className="text-sm text-blue-800">Proteiini</div>
                    </div>
                  )}
                  
                  {food.nutrition.fat_percentage && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {food.nutrition.fat_percentage}%
                      </div>
                      <div className="text-sm text-orange-800">Rasva</div>
                    </div>
                  )}
                  
                  {food.nutrition.fiber_percentage && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {food.nutrition.fiber_percentage}%
                      </div>
                      <div className="text-sm text-green-800">Kuitu</div>
                    </div>
                  )}
                  
                  {food.nutrition.moisture_percentage && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {food.nutrition.moisture_percentage}%
                      </div>
                      <div className="text-sm text-purple-800">Kosteus</div>
                    </div>
                  )}
                </div>
                
                {food.nutrition.special_features && food.nutrition.special_features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Erityisominaisuudet:</h4>
                    <div className="flex flex-wrap gap-2">
                      {food.nutrition.special_features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!hasNutrition && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="bg-gray-50 rounded-lg p-6">
                  <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Ravintosisältötiedot eivät ole saatavilla</p>
                  <p className="text-sm mt-1">Tälle tuotteelle ei ole vielä lisätty ravintosisältötietoja.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Manufacturer link */}
        {food.manufacturer_info?.feeding_guide_url && (
          <Alert className="mt-4">
            <ExternalLink className="h-4 w-4" />
            <AlertTitle>Valmistajan virallinen annosteluohje</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Tarkista aina viimeisimmät annosteluohjeet valmistajan sivustolta</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(food.manufacturer_info?.feeding_guide_url, '_blank')}
              >
                Avaa annosteluohje
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}