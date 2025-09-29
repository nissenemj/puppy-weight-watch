
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeUtils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Plus } from 'lucide-react'

interface FoodRecipe {
  id: string
  name: string
  brand?: string
  calories_per_100g?: number
  protein_percentage?: number
  fat_percentage?: number
  carb_percentage?: number
  source?: string
}

interface FoodRecipeSearchProps {
  onRecipeSelect: (recipe: FoodRecipe) => void
  selectedRecipe?: FoodRecipe
}

export default function FoodRecipeSearch({ onRecipeSelect, selectedRecipe }: FoodRecipeSearchProps) {
  const [recipes, setRecipes] = useState<FoodRecipe[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingRecipe, setIsAddingRecipe] = useState(false)
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    brand: '',
    calories_per_100g: '',
    protein_percentage: '',
    fat_percentage: '',
    carb_percentage: ''
  })

  useEffect(() => {
    loadRecipes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      searchRecipes(searchQuery)
    } else {
      loadRecipes()
    }
  }, [searchQuery])

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('food_recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setRecipes(dbToAppTypes.dogFood(data) || [])
    } catch (error) {
      console.error('Error loading recipes:', error)
    }
  }

  const searchRecipes = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('food_recipes')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setRecipes(dbToAppTypes.dogFood(data) || [])
    } catch (error) {
      console.error('Error searching recipes:', error)
    }
  }

  const addRecipe = async () => {
    if (!newRecipe.name.trim()) {
      return
    }

    try {
      const recipeData = {
        name: newRecipe.name.trim(),
        brand: newRecipe.brand.trim() || null,
        calories_per_100g: newRecipe.calories_per_100g ? parseInt(newRecipe.calories_per_100g) : null,
        protein_percentage: newRecipe.protein_percentage ? parseFloat(newRecipe.protein_percentage) : null,
        fat_percentage: newRecipe.fat_percentage ? parseFloat(newRecipe.fat_percentage) : null,
        carb_percentage: newRecipe.carb_percentage ? parseFloat(newRecipe.carb_percentage) : null,
        source: 'manual'
      }

      const { data, error } = await supabase
        .from('food_recipes')
        .insert([recipeData])
        .select()
        .single()

      if (error) throw error

      await loadRecipes()
      setNewRecipe({
        name: '',
        brand: '',
        calories_per_100g: '',
        protein_percentage: '',
        fat_percentage: '',
        carb_percentage: ''
      })
      setIsAddingRecipe(false)
      
      if (data) {
        onRecipeSelect(dbToAppTypes.dogFood(data))
      }
    } catch (error) {
      console.error('Error adding recipe:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🥘 Ruokaohjeet
        </CardTitle>
        <CardDescription>
          Hae valmiita ruokaohjeita tai lisää uusi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Hae ruokaohjeita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsAddingRecipe(true)}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {selectedRecipe && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              {selectedRecipe.name}
              {selectedRecipe.brand && <span className="text-sm font-normal"> - {selectedRecipe.brand}</span>}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              {selectedRecipe.calories_per_100g && (
                <div>Kalorit: {selectedRecipe.calories_per_100g} kcal/100g</div>
              )}
              {selectedRecipe.protein_percentage && (
                <div>Proteiini: {selectedRecipe.protein_percentage}%</div>
              )}
              {selectedRecipe.fat_percentage && (
                <div>Rasva: {selectedRecipe.fat_percentage}%</div>
              )}
              {selectedRecipe.carb_percentage && (
                <div>Hiilihydraatit: {selectedRecipe.carb_percentage}%</div>
              )}
            </div>
          </div>
        )}

        {isAddingRecipe && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-name">Ruoan nimi *</Label>
                <Input
                  id="recipe-name"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  placeholder="Kuivaruoka Adult"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipe-brand">Merkki</Label>
                <Input
                  id="recipe-brand"
                  value={newRecipe.brand}
                  onChange={(e) => setNewRecipe({ ...newRecipe, brand: e.target.value })}
                  placeholder="Royal Canin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipe-calories">Kalorit/100g</Label>
                <Input
                  id="recipe-calories"
                  type="number"
                  value={newRecipe.calories_per_100g}
                  onChange={(e) => setNewRecipe({ ...newRecipe, calories_per_100g: e.target.value })}
                  placeholder="350"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipe-protein">Proteiini %</Label>
                <Input
                  id="recipe-protein"
                  type="number"
                  step="0.1"
                  value={newRecipe.protein_percentage}
                  onChange={(e) => setNewRecipe({ ...newRecipe, protein_percentage: e.target.value })}
                  placeholder="25.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipe-fat">Rasva %</Label>
                <Input
                  id="recipe-fat"
                  type="number"
                  step="0.1"
                  value={newRecipe.fat_percentage}
                  onChange={(e) => setNewRecipe({ ...newRecipe, fat_percentage: e.target.value })}
                  placeholder="15.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipe-carb">Hiilihydraatit %</Label>
                <Input
                  id="recipe-carb"
                  type="number"
                  step="0.1"
                  value={newRecipe.carb_percentage}
                  onChange={(e) => setNewRecipe({ ...newRecipe, carb_percentage: e.target.value })}
                  placeholder="40.0"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => setIsAddingRecipe(false)}
                variant="outline"
              >
                Peruuta
              </Button>
              <Button onClick={addRecipe}>
                Lisää ruokaohje
              </Button>
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRecipe?.id === recipe.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onRecipeSelect(recipe)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{recipe.name}</h4>
                  {recipe.brand && (
                    <p className="text-sm text-gray-600">{recipe.brand}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  {recipe.calories_per_100g && (
                    <Badge variant="secondary" className="text-xs">
                      {recipe.calories_per_100g} kcal
                    </Badge>
                  )}
                  {recipe.source && (
                    <Badge variant="outline" className="text-xs">
                      {recipe.source}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
