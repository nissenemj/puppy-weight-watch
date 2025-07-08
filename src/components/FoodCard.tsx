import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, AlertTriangle, Info } from 'lucide-react'
import { DogFood } from '@/services/dogFoodService'
import { IngredientInfo } from './IngredientInfo'

interface FoodCardProps {
  food: DogFood
  onSelect?: (food: DogFood) => void
  isSelected?: boolean
  showDetails?: boolean
}

export function FoodCard({ food, onSelect, isSelected = false, showDetails = false }: FoodCardProps) {
  // Check if food has detailed ingredient/nutrition data
  const hasDetailedData = Boolean(
    food.ingredients?.length || 
    food.allergens?.length || 
    (food.nutrition && Object.values(food.nutrition).some(v => v !== null && v !== false)) ||
    food.manufacturer_info
  )
  
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
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Annostelumenetelmä:</span> {getDosageMethodLabel(food.dosage_method)}
            </div>

            {food.nutrition && (
              <div className="flex flex-wrap gap-2 mb-2">
                {food.nutrition.grain_free && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Viljaton
                  </Badge>
                )}
                {food.nutrition.wheat_free && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Vehnätön
                  </Badge>
                )}
                {food.nutrition.gluten_free && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Gluteeniton
                  </Badge>
                )}
              </div>
            )}

            {food.notes && (
              <p className="text-sm text-muted-foreground">{food.notes}</p>
            )}

            {/* Data availability indicator */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${hasDetailedData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-muted-foreground">
                  {hasDetailedData ? 'Yksityiskohtaiset tiedot saatavilla' : 'Perustiedot'}
                </span>
              </div>
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

      {(warning || showDetails) && (
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

          {showDetails && <IngredientInfo food={food} />}
        </CardContent>
      )}
    </Card>
  )
}