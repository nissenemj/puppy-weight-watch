import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, AlertTriangle, Info, ChevronDown, ChevronUp, Edit, Trash2, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DogFood, DogFoodService } from '@/services/dogFoodService'
import { IngredientInfo } from './IngredientInfo'
import { IngredientEditor } from './admin/IngredientEditor'
import { AllergenEditor } from './admin/AllergenEditor'
import { NutritionEditor } from './admin/NutritionEditor'
import { ManufacturerEditor } from './admin/ManufacturerEditor'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes, appToDbTypes } from '@/utils/typeConverters'
import { toast } from 'sonner'

// Component to show linked dosage images
function LinkedDosageImages({ foodId }: { foodId: string }) {
  const [dosageImages, setDosageImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinkedImages = async () => {
      try {
        const { data } = await supabase
          .from('dosage_images')
          .select('*')
          .eq('dog_food_id', foodId)
          .order('created_at', { ascending: false })

        setDosageImages(data || [])
      } catch (error) {
        console.error('Error fetching linked dosage images:', error)
      } finally {
        setLoading(false)
      }
    }

    if (foodId) {
      fetchLinkedImages()
    }
  }, [foodId])

  if (loading || dosageImages.length === 0) return null

  return (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
      <h4 className="text-sm font-medium mb-2 text-blue-800">Linkitetyt annostelukuvat:</h4>
      <div className="space-y-2">
        {dosageImages.map((image) => (
          <div key={image.id} className="flex items-center justify-between text-sm">
            <span className="text-blue-700">{image.title}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Scroll to dosage images tab and show this image
                const dosageTab = document.querySelector('[data-value="dosage-images"]') as HTMLElement
                if (dosageTab) {
                  dosageTab.click()
                  setTimeout(() => {
                    const imageCard = document.querySelector(`[data-image-id="${image.id}"]`)
                    if (imageCard) {
                      imageCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }, 100)
                }
              }}
              className="text-xs h-7"
            >
              Näytä kuva
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

interface FoodCardProps {
  food: DogFood
  onSelect?: (food: DogFood) => void
  isSelected?: boolean
  showDetails?: boolean
  isAdmin?: boolean
  onEdit?: (food: DogFood) => void
  onDelete?: (id: string) => void
  onUpdate?: (food: DogFood) => void
  editingFood?: DogFood | null
}

export function FoodCard({ food, onSelect, isSelected = false, showDetails = false, isAdmin = false, onEdit, onDelete, onUpdate, editingFood }: FoodCardProps) {
  const [showDosageTable, setShowDosageTable] = useState(false)
  const [enhancedEditingFood, setEnhancedEditingFood] = useState<DogFood | null>(null)
  const [savingEnhanced, setSavingEnhanced] = useState(false)
  
  // Check if food has detailed ingredient/nutrition data
  const hasDetailedData = Boolean(
    food.food_ingredients?.length || 
    food.allergens?.length || 
    food.ingredients ||
    food.country_of_origin ||
    food.protein_percentage ||
    food.special_features?.length ||
    (food.nutrition && Object.values(food.nutrition).some(v => v !== null && v !== false)) ||
    food.manufacturer_info
  )

  // Check if food has feeding guidelines
  const hasFeedingGuidelines = Boolean(food.feeding_guidelines?.length)
  
  // Get nutrition summary for quick display
  const getNutritionSummary = () => {
    const parts = []
    // Check new direct fields first, then fallback to detailed nutrition
    const proteinPct = food.protein_percentage || food.nutrition?.protein_percentage
    const fatPct = food.fat_percentage || food.nutrition?.fat_percentage
    
    if (proteinPct) parts.push(`${proteinPct}% proteiini`)
    if (fatPct) parts.push(`${fatPct}% rasva`)
    return parts.length > 0 ? parts.join(', ') : null
  }

  const getSpecialFeatures = () => {
    const features = []
    
    // Check new direct special_features field first, then detailed nutrition
    const allFeatures = [
      ...(food.special_features || []),
      ...(food.nutrition?.special_features || [])
    ]
    
    // Add country info if available
    if (food.country_of_origin === 'Suomi') features.push("🇫🇮 Suomalainen")
    else if (food.country_of_origin) features.push(`${food.country_of_origin}`)
    
    // Add nutrition-based features
    if (food.nutrition?.grain_free || allFeatures.includes('Viljaton')) features.push("Viljaton")
    if (food.nutrition?.wheat_free || allFeatures.includes('Vehnätön')) features.push("Vehnätön") 
    if (food.nutrition?.gluten_free || allFeatures.includes('Gluteeniton')) features.push("Gluteeniton")
    if (allFeatures.some(f => f.includes('Hypoallergeeninen'))) features.push("Hypoallergeeninen")
    if (allFeatures.some(f => f.includes('B.A.R.F') || f.includes('Raaka'))) features.push("B.A.R.F.")
    if (allFeatures.some(f => f.includes('DHA') || f.includes('Omega'))) features.push("Omega-3")
    if (allFeatures.some(f => f.includes('Progut') || f.includes('suolistoparanne'))) features.push("Probiootti")
    
    return features.slice(0, 4) // Limit to 4 features for clean display
  }
  
  const getDosageMethodLabel = (method: string) => {
    switch (method) {
      case 'Odotettu_Aikuispaino_Ja_Ikä':
        return 'Aikuispaino ja ikä'
      case 'Nykyinen_Paino':
        return 'Nykyinen paino'
      case 'Prosentti_Nykyisestä_Painosta':
        return 'Prosentti painosta'
      case 'Kokoluokka':
        return 'Kokoluokka'
      case 'Ei_Tietoa':
        return 'Ei tietoa'
      default:
        return method
    }
  }

  const getDosageWarning = () => {
    if (food.dosage_method === 'Ei_Tietoa') {
      return {
        type: 'error' as const,
        message: 'Tarkkaa annosteluohjetta ei ole saatavilla digitaalisessa muodossa. Tarkista annostus AINA tuotepakkauksesta tai valmistajan sivustolta.',
        action: food.manufacturer_info?.feeding_guide_url ? 'Siirry valmistajan annosteluohjeeseen' : null
      }
    }
    
    if (food.food_type === 'Raaka' && !food.feeding_guidelines?.some(g => g.calculation_formula)) {
      return {
        type: 'warning' as const,
        message: 'Raakaruoan annostus perustuu yleisiin suosituksiin. Tarkista aina valmistajan omat ohjeet.',
        action: food.manufacturer_info?.feeding_guide_url ? 'Siirry valmistajan annosteluohjeeseen' : null
      }
    }
    
    return null
  }

  const warning = getDosageWarning()
  const isEditing = editingFood?.id === food.id
  const isEnhancedEditing = enhancedEditingFood?.id === food.id

  const startEnhancedEdit = () => {
    setEnhancedEditingFood({
      ...food,
      food_ingredients: food.food_ingredients || [],
      allergens: food.allergens || [],
      nutrition: dbToAppTypes.foodNutrition(food.nutrition),
      manufacturer_info: dbToAppTypes.foodManufacturer(food.manufacturer_info)
    })
  }

  const saveEnhancedEdit = async () => {
    if (!enhancedEditingFood) return

    try {
      setSavingEnhanced(true)

      // Update basic food data first
      await onUpdate?.(enhancedEditingFood)

      // Update enhanced data
      await DogFoodService.updateEnhancedFoodData(enhancedEditingFood.id, {
        ingredients: enhancedEditingFood.food_ingredients,
        allergens: enhancedEditingFood.allergens,
        nutrition: enhancedEditingFood.nutrition,
        manufacturer_info: enhancedEditingFood.manufacturer_info
      })

      toast.success('Ruokatieto päivitetty onnistuneesti!')
      setEnhancedEditingFood(null)
      
      // Reload data to show changes
      window.location.reload()
    } catch (error) {
      console.error('Error saving enhanced food data:', error)
      toast.error('Tietojen tallentaminen epäonnistui')
    } finally {
      setSavingEnhanced(false)
    }
  }

  return (
    <Card className={`${isSelected ? 'border-primary bg-primary/5' : ''} transition-colors`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>Tuotteen nimi</Label>
                    <Input
                      value={editingFood.name}
                      onChange={(e) => onEdit?.({ ...editingFood, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Valmistaja</Label>
                    <Input
                      value={editingFood.manufacturer}
                      onChange={(e) => onEdit?.({ ...editingFood, manufacturer: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tuotekoodi</Label>
                    <Input
                      value={editingFood.product_code}
                      onChange={(e) => onEdit?.({ ...editingFood, product_code: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ruokatyyppi</Label>
                    <Select value={editingFood.food_type} onValueChange={(value) => onEdit?.({ ...editingFood, food_type: value as any })}>
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
                    <Select value={editingFood.nutrition_type} onValueChange={(value) => onEdit?.({ ...editingFood, nutrition_type: value as any })}>
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
                    <Select value={editingFood.dosage_method} onValueChange={(value) => onEdit?.({ ...editingFood, dosage_method: value as any })}>
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
                      onChange={(e) => onEdit?.({ ...editingFood, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onUpdate?.(editingFood)}>
                    <Save className="h-4 w-4 mr-1" />
                    Tallenna
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(null as any)}>
                    <X className="h-4 w-4 mr-1" />
                    Peruuta
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <CardTitle className="text-lg mb-2">{food.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{food.manufacturer}</Badge>
              <Badge variant="secondary">{food.food_type}</Badge>
              <Badge 
                variant={food.nutrition_type === 'Täysravinto' ? 'default' : 'outline'}
              >
                {food.nutrition_type}
              </Badge>
              {getSpecialFeatures().map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                  {feature}
                </Badge>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Annostelumenetelmä:</span> {getDosageMethodLabel(food.dosage_method)}
            </div>

            {food.nutrition?.special_features?.includes('VAROITUS: Turvallisuusongelmat 2023') && (
              <Alert variant="destructive" className="mb-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  HUOM: Joitakin tämän valmistajan tuotteita on vedetty markkinoilta turvallisuussyistä (2023). 
                  Tarkista tuotteen nykyinen saatavuus ennen käyttöä.
                </AlertDescription>
              </Alert>
            )}

            {/* Nutrition summary */}
            {/* Enhanced nutrition and origin info */}
            <div className="space-y-1 text-sm text-muted-foreground mb-2">
              {getNutritionSummary() && (
                <div>
                  <span className="font-medium">Ravintosisältö:</span> {getNutritionSummary()}
                </div>
              )}
              {(food.country_of_origin || food.ingredient_origin) && (
                <div>
                  <span className="font-medium">Alkuperä:</span>{' '}
                  {food.country_of_origin && `Valmistettu: ${food.country_of_origin}`}
                  {food.country_of_origin && food.ingredient_origin && ' • '}
                  {food.ingredient_origin && `Raaka-aineet: ${food.ingredient_origin}`}
                </div>
              )}
              {food.feeding_schedule && (
                <div>
                  <span className="font-medium">Ruokinta:</span> {food.feeding_schedule}
                </div>
              )}
            </div>

            {food.notes && (
              <p className="text-sm text-muted-foreground">{food.notes}</p>
            )}

            {/* Feeding guidelines button */}
            {hasFeedingGuidelines && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDosageTable(!showDosageTable)}
                  className="text-xs"
                >
                  {showDosageTable ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                  {showDosageTable ? 'Piilota annostustaulukko' : 'Näytä annostustaulukko'}
                </Button>
              </div>
            )}

            {/* Data availability indicator */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${hasDetailedData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-muted-foreground">
                  {hasDetailedData ? 'Yksityiskohtaiset tiedot saatavilla' : 'Perustiedot'}
                </span>
              </div>
              {hasFeedingGuidelines && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-muted-foreground">Annostusohje saatavilla</span>
                </div>
              )}
            </div>

            {/* Linked dosage images indicator */}
            <LinkedDosageImages foodId={food.id} />
            </>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {onSelect && !isEditing && (
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(food)}
              >
                {isSelected ? 'Valittu' : 'Valitse'}
              </Button>
            )}
            
            {isAdmin && !isEditing && !isEnhancedEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(food)}
                  title="Muokkaa perustietoja"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEnhancedEdit}
                  title="Muokkaa yksityiskohtaisia tietoja"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Yksityiskohdat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(food.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {isEnhancedEditing && (
              <>
                <Button
                  size="sm"
                  onClick={saveEnhancedEdit}
                  disabled={savingEnhanced}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {savingEnhanced ? 'Tallennetaan...' : 'Tallenna'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEnhancedEditingFood(null)}
                  disabled={savingEnhanced}
                >
                  <X className="h-4 w-4 mr-1" />
                  Peruuta
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {(warning || showDetails || showDosageTable) && (
        <CardContent>
          {warning && (
            <Alert variant={warning.type === 'error' ? 'destructive' : 'default'} className="mb-4">
              {warning.type === 'error' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
              <AlertDescription className="flex items-center justify-between">
                <span className="flex-1">{warning.message}</span>
                {warning.action && food.manufacturer_info?.feeding_guide_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(food.manufacturer_info?.feeding_guide_url, '_blank')}
                    className="ml-4 shrink-0"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Avaa ohje
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Feeding guidelines table */}
          {showDosageTable && hasFeedingGuidelines && (
            <div className="mb-4">
              <h4 className="font-semibold mb-3 text-sm">Annostusohjeet:</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {food.feeding_guidelines?.some(g => g.age_months) && <TableHead className="text-xs">Ikä</TableHead>}
                      {food.feeding_guidelines?.some(g => g.current_weight_kg) && <TableHead className="text-xs">Nykypaino</TableHead>}
                      {food.feeding_guidelines?.some(g => g.adult_weight_kg) && <TableHead className="text-xs">Aikuispaino</TableHead>}
                      {food.feeding_guidelines?.some(g => g.size_category) && <TableHead className="text-xs">Kokoluokka</TableHead>}
                      <TableHead className="text-xs">Päivittäinen annos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {food.feeding_guidelines?.map((guideline) => (
                      <TableRow key={guideline.id}>
                        {food.feeding_guidelines?.some(g => g.age_months) && (
                          <TableCell className="text-xs">{guideline.age_months || '-'}</TableCell>
                        )}
                        {food.feeding_guidelines?.some(g => g.current_weight_kg) && (
                          <TableCell className="text-xs">{guideline.current_weight_kg ? `${guideline.current_weight_kg} kg` : '-'}</TableCell>
                        )}
                        {food.feeding_guidelines?.some(g => g.adult_weight_kg) && (
                          <TableCell className="text-xs">{guideline.adult_weight_kg ? `${guideline.adult_weight_kg} kg` : '-'}</TableCell>
                        )}
                        {food.feeding_guidelines?.some(g => g.size_category) && (
                          <TableCell className="text-xs">{guideline.size_category || '-'}</TableCell>
                        )}
                        <TableCell className="text-xs font-medium">
                          {guideline.daily_amount_min && guideline.daily_amount_max ? 
                            `${guideline.daily_amount_min}-${guideline.daily_amount_max} g` :
                            guideline.daily_amount_min ? `${guideline.daily_amount_min} g` :
                            guideline.daily_amount_max ? `${guideline.daily_amount_max} g` :
                            '-'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {food.manufacturer_info?.feeding_guide_url && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Tarkista aina viimeisimmät ohjeet{' '}
                  <button 
                    onClick={() => window.open(food.manufacturer_info?.feeding_guide_url, '_blank')}
                    className="text-primary underline"
                  >
                    valmistajan sivustolta
                  </button>
                </div>
              )}
            </div>
          )}

          {showDetails && <IngredientInfo food={food} />}
        </CardContent>
      )}

      {/* Enhanced editing interface */}
      {isEnhancedEditing && enhancedEditingFood && (
        <CardContent className="border-t">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Muokkaa yksityiskohtaisia tietoja</h3>
            <p className="text-sm text-muted-foreground">
              Täydennä ruoan tiedot ainesosilla, allergeeneilla, ravitsemustiedoilla ja valmistajatiedoilla.
            </p>
          </div>

          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ingredients">Ainesosat</TabsTrigger>
              <TabsTrigger value="allergens">Allergeenit</TabsTrigger>
              <TabsTrigger value="nutrition">Ravitsemus</TabsTrigger>
              <TabsTrigger value="manufacturer">Valmistaja</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-4">
              <IngredientEditor
                ingredients={enhancedEditingFood.food_ingredients || []}
                onChange={(ingredients) => 
                  setEnhancedEditingFood(prev => prev ? { ...prev, food_ingredients: ingredients } : null)
                }
              />
            </TabsContent>

            <TabsContent value="allergens" className="mt-4">
              <AllergenEditor
                allergens={enhancedEditingFood.allergens || []}
                onChange={(allergens) => 
                  setEnhancedEditingFood(prev => prev ? { ...prev, allergens } : null)
                }
              />
            </TabsContent>

            <TabsContent value="nutrition" className="mt-4">
              <NutritionEditor
                nutrition={dbToAppTypes.foodNutrition(enhancedEditingFood.nutrition)}
                onChange={(nutrition) => 
                  setEnhancedEditingFood(prev => prev ? { ...prev, nutrition: appToDbTypes.foodNutrition(nutrition) } : null)
                }
              />
            </TabsContent>

            <TabsContent value="manufacturer" className="mt-4">
              <ManufacturerEditor
                manufacturer={dbToAppTypes.foodManufacturer(enhancedEditingFood.manufacturer_info)}
                onChange={(manufacturer_info) => 
                  setEnhancedEditingFood(prev => prev ? { ...prev, manufacturer_info: appToDbTypes.foodManufacturer(manufacturer_info) } : null)
                }
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}