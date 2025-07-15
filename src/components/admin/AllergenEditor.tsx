import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { FoodAllergen } from '@/services/dogFoodService'

interface AllergenEditorProps {
  allergens: FoodAllergen[]
  onChange: (allergens: FoodAllergen[]) => void
}

const ALLERGEN_TYPES = [
  { value: 'contains', label: 'Sisältää', color: 'bg-red-100 text-red-800' },
  { value: 'free_from', label: 'Ei sisällä', color: 'bg-green-100 text-green-800' }
]

const COMMON_ALLERGENS = [
  'Vehnä', 'Gluteeni', 'Soija', 'Maissi', 'Viljat', 
  'Kana', 'Nauta', 'Lammas', 'Kala', 'Maitotuotteet',
  'Kananmuna', 'Lisäaineet', 'Säilöntäaineet', 'Väriaineet'
]

export function AllergenEditor({ allergens, onChange }: AllergenEditorProps) {
  const [newAllergen, setNewAllergen] = useState({
    allergen_type: 'free_from' as FoodAllergen['allergen_type'],
    allergen_name: ''
  })

  const addAllergen = () => {
    if (!newAllergen.allergen_name.trim()) return

    const allergen: FoodAllergen = {
      id: `temp_${Date.now()}`,
      dog_food_id: '',
      allergen_type: newAllergen.allergen_type,
      allergen_name: newAllergen.allergen_name,
      created_at: new Date().toISOString()
    }

    onChange([...allergens, allergen])
    setNewAllergen({
      allergen_type: 'free_from',
      allergen_name: ''
    })
  }

  const removeAllergen = (index: number) => {
    const newAllergens = allergens.filter((_, i) => i !== index)
    onChange(newAllergens)
  }

  const addCommonAllergen = (allergenName: string, type: FoodAllergen['allergen_type']) => {
    // Check if already exists
    if (allergens.some(a => a.allergen_name === allergenName && a.allergen_type === type)) {
      return
    }

    const allergen: FoodAllergen = {
      id: `temp_${Date.now()}`,
      dog_food_id: '',
      allergen_type: type,
      allergen_name: allergenName,
      created_at: new Date().toISOString()
    }

    onChange([...allergens, allergen])
  }

  const getTypeInfo = (type: string) => 
    ALLERGEN_TYPES.find(t => t.value === type) || ALLERGEN_TYPES[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Allergeenit ja rajoitukset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new allergen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg bg-gray-50">
          <div>
            <Label className="text-xs">Tyyppi</Label>
            <Select
              value={newAllergen.allergen_type}
              onValueChange={(value) => setNewAllergen(prev => ({ 
                ...prev, 
                allergen_type: value as FoodAllergen['allergen_type'] 
              }))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALLERGEN_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Allergeeni</Label>
            <Input
              placeholder="esim. Vehnä"
              value={newAllergen.allergen_name}
              onChange={(e) => setNewAllergen(prev => ({ 
                ...prev, 
                allergen_name: e.target.value 
              }))}
              className="h-8"
            />
          </div>
          <div className="flex items-end">
            <Button
              size="sm"
              onClick={addAllergen}
              disabled={!newAllergen.allergen_name.trim()}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Lisää
            </Button>
          </div>
        </div>

        {/* Quick add common allergens */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Yleisiä allergeeneja:</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_ALLERGENS.map(allergen => (
              <div key={allergen} className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCommonAllergen(allergen, 'free_from')}
                  className="h-7 text-xs flex-1 text-green-700 border-green-200"
                  disabled={allergens.some(a => a.allergen_name === allergen && a.allergen_type === 'free_from')}
                >
                  Ei {allergen}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCommonAllergen(allergen, 'contains')}
                  className="h-7 text-xs flex-1 text-red-700 border-red-200"
                  disabled={allergens.some(a => a.allergen_name === allergen && a.allergen_type === 'contains')}
                >
                  Sisältää
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing allergens */}
        <div className="space-y-2">
          {allergens.map((allergen, index) => {
            const typeInfo = getTypeInfo(allergen.allergen_type)
            return (
              <div key={allergen.id || index} className="flex items-center gap-2 p-2 border rounded-lg">
                <Badge className={`${typeInfo.color} text-xs`}>
                  {typeInfo.label}
                </Badge>
                
                <span className="flex-1">{allergen.allergen_name}</span>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAllergen(index)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>

        {allergens.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Ei allergeeneja lisätty
          </div>
        )}
      </CardContent>
    </Card>
  )
}
