import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExternalLink, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { DogFood } from '@/services/dogFoodService'
import { IngredientInfo } from './IngredientInfo'

interface FoodCardProps {
  food: DogFood
  onSelect?: (food: DogFood) => void
  isSelected?: boolean
  showDetails?: boolean
}

export function FoodCard({ food, onSelect, isSelected = false, showDetails = false }: FoodCardProps) {
  const [showDosageTable, setShowDosageTable] = useState(false)
  
  // Check if food has detailed ingredient/nutrition data
  const hasDetailedData = Boolean(
    food.ingredients?.length || 
    food.allergens?.length || 
    (food.nutrition && Object.values(food.nutrition).some(v => v !== null && v !== false)) ||
    food.manufacturer_info
  )

  // Check if food has feeding guidelines
  const hasFeedingGuidelines = Boolean(food.feeding_guidelines?.length)
  
  // Get nutrition summary for quick display
  const getNutritionSummary = () => {
    if (!food.nutrition) return null
    const parts = []
    if (food.nutrition.protein_percentage) parts.push(`${food.nutrition.protein_percentage}% proteiini`)
    if (food.nutrition.fat_percentage) parts.push(`${food.nutrition.fat_percentage}% rasva`)
    return parts.length > 0 ? parts.join(', ') : null
  }

  const getSpecialFeatures = () => {
    const features = []
    if (food.nutrition?.grain_free) features.push("Viljaton")
    if (food.nutrition?.wheat_free) features.push("Vehnätön") 
    if (food.nutrition?.gluten_free) features.push("Gluteeniton")
    if (food.nutrition?.special_features?.includes('Hypoallergeeninen')) features.push("Hypoallergeeninen")
    if (food.nutrition?.special_features?.includes('100% kotimaista kanaa')) features.push("Kotimainen")
    if (food.nutrition?.special_features?.includes('Raakaruoka (B.A.R.F.)')) features.push("B.A.R.F.")
    if (food.nutrition?.special_features?.includes('VAROITUS: Turvallisuusongelmat 2023')) features.push("⚠️ Turvallisuusvaroitus")
    return features
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

  return (
    <Card className={`${isSelected ? 'border-primary bg-primary/5' : ''} transition-colors`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
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
            {getNutritionSummary() && (
              <div className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Ravintosisältö:</span> {getNutritionSummary()}
              </div>
            )}

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
          </div>
          
          {onSelect && (
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(food)}
              className="ml-4"
            >
              {isSelected ? 'Valittu' : 'Valitse'}
            </Button>
          )}
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
    </Card>
  )
}