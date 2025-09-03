import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { FoodNutrition } from '@/services/dogFoodService'

interface NutritionEditorProps {
  nutrition: FoodNutrition | null
  onChange: (nutrition: FoodNutrition | null) => void
}

const COMMON_FEATURES = [
  'Hypoallergeeninen', 'Viljaton', 'Gluteeniton', 'Vehnätön',
  'Omega-3', 'Probiootteja', 'Prebiootteja', 'Nivelten tuki',
  'DHA', 'Luonnolliset antioksidantit', 'Korkea proteiini',
  'Matala rasva', 'Korkea kuitu', 'Helposti sulavaa'
]

export function NutritionEditor({ nutrition, onChange }: NutritionEditorProps) {
  const [newFeature, setNewFeature] = useState('')

  const updateNutrition = (field: keyof FoodNutrition, value: any) => {
    if (!nutrition) {
      // Create new nutrition object
      const newNutrition: FoodNutrition = {
        id: `temp_${Date.now()}`,
        dog_food_id: '',
        protein_percentage: undefined,
        fat_percentage: undefined,
        fiber_percentage: undefined,
        moisture_percentage: undefined,
        grain_free: false,
        wheat_free: false,
        gluten_free: false,
        special_features: [],
        created_at: new Date().toISOString()
      }
      ;(newNutrition as any)[field] = value
      onChange(newNutrition)
    } else {
      onChange({ ...nutrition, [field]: value })
    }
  }

  const addFeature = () => {
    if (!newFeature.trim()) return
    
    const features = nutrition?.special_features || []
    if (features.includes(newFeature)) return
    
    updateNutrition('special_features', [...features, newFeature])
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    const features = nutrition?.special_features || []
    const newFeatures = features.filter((_, i) => i !== index)
    updateNutrition('special_features', newFeatures)
  }

  const addCommonFeature = (feature: string) => {
    const features = nutrition?.special_features || []
    if (features.includes(feature)) return
    
    updateNutrition('special_features', [...features, feature])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ravitsemustiedot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nutritional percentages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs">Proteiini (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="esim. 28"
              value={nutrition?.protein_percentage || ''}
              onChange={(e) => updateNutrition('protein_percentage', 
                e.target.value ? Number(e.target.value) : null
              )}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Rasva (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="esim. 15"
              value={nutrition?.fat_percentage || ''}
              onChange={(e) => updateNutrition('fat_percentage', 
                e.target.value ? Number(e.target.value) : null
              )}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Kuitu (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="esim. 2.5"
              value={nutrition?.fiber_percentage || ''}
              onChange={(e) => updateNutrition('fiber_percentage', 
                e.target.value ? Number(e.target.value) : null
              )}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Kosteus (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="esim. 10"
              value={nutrition?.moisture_percentage || ''}
              onChange={(e) => updateNutrition('moisture_percentage', 
                e.target.value ? Number(e.target.value) : null
              )}
              className="h-8"
            />
          </div>
        </div>

        {/* Dietary flags */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ruokavaliorajoitukset:</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-2 border rounded">
              <Label className="text-sm">Viljaton</Label>
              <Switch
                checked={nutrition?.grain_free || false}
                onCheckedChange={(checked) => updateNutrition('grain_free', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <Label className="text-sm">Vehnätön</Label>
              <Switch
                checked={nutrition?.wheat_free || false}
                onCheckedChange={(checked) => updateNutrition('wheat_free', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <Label className="text-sm">Gluteeniton</Label>
              <Switch
                checked={nutrition?.gluten_free || false}
                onCheckedChange={(checked) => updateNutrition('gluten_free', checked)}
              />
            </div>
          </div>
        </div>

        {/* Special features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Erikoisominaisuudet:</Label>
          
          {/* Add custom feature */}
          <div className="flex gap-2">
            <Input
              placeholder="Lisää erikoisominaisuus"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="h-8"
            />
            <Button
              size="sm"
              onClick={addFeature}
              disabled={!newFeature.trim()}
              className="h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick add common features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_FEATURES.map(feature => (
              <Button
                key={feature}
                size="sm"
                variant="outline"
                onClick={() => addCommonFeature(feature)}
                className="h-7 text-xs"
                disabled={nutrition?.special_features?.includes(feature)}
              >
                {feature}
              </Button>
            ))}
          </div>

          {/* Current features */}
          <div className="flex flex-wrap gap-2">
            {(nutrition?.special_features || []).map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {feature}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFeature(index)}
                  className="h-4 w-4 p-0 text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {!nutrition && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Ei ravitsemustietoja lisätty
          </div>
        )}
      </CardContent>
    </Card>
  )
}