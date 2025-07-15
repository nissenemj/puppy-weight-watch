import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, GripVertical } from 'lucide-react'
import { FoodIngredient } from '@/services/dogFoodService'

interface IngredientEditorProps {
  ingredients: FoodIngredient[]
  onChange: (ingredients: FoodIngredient[]) => void
}

const INGREDIENT_TYPES = [
  { value: 'primary', label: 'Pääainesosa', color: 'bg-blue-100 text-blue-800' },
  { value: 'protein', label: 'Proteiini', color: 'bg-red-100 text-red-800' },
  { value: 'carb', label: 'Hiilihydraatti', color: 'bg-green-100 text-green-800' },
  { value: 'fat', label: 'Rasva', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'additive', label: 'Lisäaine', color: 'bg-purple-100 text-purple-800' }
]

export function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const [newIngredient, setNewIngredient] = useState({
    ingredient_type: 'primary' as FoodIngredient['ingredient_type'],
    ingredient_name: '',
    percentage: undefined as number | undefined
  })

  const addIngredient = () => {
    if (!newIngredient.ingredient_name.trim()) return

    const ingredient: FoodIngredient = {
      id: `temp_${Date.now()}`,
      dog_food_id: '',
      ingredient_type: newIngredient.ingredient_type,
      ingredient_name: newIngredient.ingredient_name,
      percentage: newIngredient.percentage,
      order_index: ingredients.length,
      created_at: new Date().toISOString()
    }

    onChange([...ingredients, ingredient])
    setNewIngredient({
      ingredient_type: 'primary',
      ingredient_name: '',
      percentage: undefined
    })
  }

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    onChange(newIngredients)
  }

  const updateIngredient = (index: number, field: keyof FoodIngredient, value: any) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    onChange(newIngredients)
  }

  const moveIngredient = (fromIndex: number, toIndex: number) => {
    const newIngredients = [...ingredients]
    const [movedItem] = newIngredients.splice(fromIndex, 1)
    newIngredients.splice(toIndex, 0, movedItem)
    
    // Update order indices
    newIngredients.forEach((ingredient, index) => {
      ingredient.order_index = index
    })
    
    onChange(newIngredients)
  }

  const getTypeInfo = (type: string) => 
    INGREDIENT_TYPES.find(t => t.value === type) || INGREDIENT_TYPES[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ainesosat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new ingredient */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg bg-gray-50">
          <div>
            <Label className="text-xs">Tyyppi</Label>
            <Select
              value={newIngredient.ingredient_type}
              onValueChange={(value) => setNewIngredient(prev => ({ 
                ...prev, 
                ingredient_type: value as FoodIngredient['ingredient_type'] 
              }))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Ainesosan nimi</Label>
            <Input
              placeholder="esim. Kananliha"
              value={newIngredient.ingredient_name}
              onChange={(e) => setNewIngredient(prev => ({ 
                ...prev, 
                ingredient_name: e.target.value 
              }))}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Prosentti (%)</Label>
            <Input
              type="number"
              placeholder="esim. 25"
              value={newIngredient.percentage || ''}
              onChange={(e) => setNewIngredient(prev => ({ 
                ...prev, 
                percentage: e.target.value ? Number(e.target.value) : undefined 
              }))}
              className="h-8"
            />
          </div>
          <div className="flex items-end">
            <Button
              size="sm"
              onClick={addIngredient}
              disabled={!newIngredient.ingredient_name.trim()}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Lisää
            </Button>
          </div>
        </div>

        {/* Existing ingredients */}
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => {
            const typeInfo = getTypeInfo(ingredient.ingredient_type)
            return (
              <div key={ingredient.id || index} className="flex items-center gap-2 p-2 border rounded-lg">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                
                <Badge className={`${typeInfo.color} text-xs`}>
                  {typeInfo.label}
                </Badge>
                
                <Input
                  value={ingredient.ingredient_name}
                  onChange={(e) => updateIngredient(index, 'ingredient_name', e.target.value)}
                  className="h-8 flex-1"
                />
                
                <Input
                  type="number"
                  placeholder="%"
                  value={ingredient.percentage || ''}
                  onChange={(e) => updateIngredient(index, 'percentage', 
                    e.target.value ? Number(e.target.value) : undefined
                  )}
                  className="h-8 w-20"
                />
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeIngredient(index)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>

        {ingredients.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Ei ainesosia lisätty
          </div>
        )}
      </CardContent>
    </Card>
  )
}
