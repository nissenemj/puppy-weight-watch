import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export interface FoodFilters {
  searchTerm: string
  manufacturer: string
  foodType: string
  nutritionType: string
  dosageMethod: string
  grainFree: boolean
  wheatFree: boolean
  glutenFree: boolean
  proteinSource: string
  countryOrigin: string
  hasDetailedInfo: boolean
}

interface FoodFilterProps {
  filters: FoodFilters
  onFiltersChange: (filters: FoodFilters) => void
  manufacturers: string[]
  proteinSources: string[]
  countries: string[]
}

export function FoodFilter({ 
  filters, 
  onFiltersChange, 
  manufacturers, 
  proteinSources,
  countries 
}: FoodFilterProps) {
  const updateFilter = (key: keyof FoodFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
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
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'searchTerm' && value) return true
    if (typeof value === 'boolean' && value) return true
    if (typeof value === 'string' && value && value !== 'all') return true
    return false
  })

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.manufacturer && filters.manufacturer !== 'all') count++
    if (filters.foodType && filters.foodType !== 'all') count++
    if (filters.nutritionType && filters.nutritionType !== 'all') count++
    if (filters.dosageMethod && filters.dosageMethod !== 'all') count++
    if (filters.grainFree) count++
    if (filters.wheatFree) count++
    if (filters.glutenFree) count++
    if (filters.proteinSource && filters.proteinSource !== 'all') count++
    if (filters.countryOrigin && filters.countryOrigin !== 'all') count++
    if (filters.hasDetailedInfo) count++
    return count
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Suodata ruokamerkkejä
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} suodatinta
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              Tyhjennä suodattimet
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="search">Hae nimellä</Label>
            <Input 
              id="search"
              placeholder="Etsi ruokamerkkiä..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Valmistaja</Label>
            <Select value={filters.manufacturer} onValueChange={(value) => updateFilter('manufacturer', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kaikki valmistajat" />
              </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Kaikki valmistajat</SelectItem>
                 {manufacturers.map((manufacturer) => (
                   <SelectItem key={manufacturer} value={manufacturer}>
                     {manufacturer}
                   </SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Ruokatyyppi</Label>
            <Select value={filters.foodType} onValueChange={(value) => updateFilter('foodType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kaikki tyypit" />
              </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Kaikki tyypit</SelectItem>
                 <SelectItem value="Kuiva">Kuivaruoka</SelectItem>
                 <SelectItem value="Märkä">Märkäruoka</SelectItem>
                 <SelectItem value="Raaka">Raakaruoka</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label>Ravintotypi</Label>
            <Select value={filters.nutritionType} onValueChange={(value) => updateFilter('nutritionType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kaikki ravintotyypit" />
              </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Kaikki ravintotyypit</SelectItem>
                 <SelectItem value="Täysravinto">Täysravinto</SelectItem>
                 <SelectItem value="Täydennysravinto">Täydennysravinto</SelectItem>
                 <SelectItem value="Täysravinto/Täydennysravinto">Täysravinto/Täydennysravinto</SelectItem>
               </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Annostelumenetelmä</Label>
            <Select value={filters.dosageMethod} onValueChange={(value) => updateFilter('dosageMethod', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kaikki menetelmät" />
              </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Kaikki menetelmät</SelectItem>
                 <SelectItem value="Odotettu_Aikuispaino_Ja_Ikä">Aikuispaino ja ikä</SelectItem>
                 <SelectItem value="Nykyinen_Paino">Nykyinen paino</SelectItem>
                 <SelectItem value="Prosentti_Nykyisestä_Painosta">Prosentti painosta</SelectItem>
                 <SelectItem value="Kokoluokka">Kokoluokka</SelectItem>
                 <SelectItem value="Ei_Tietoa">Ei tietoa</SelectItem>
               </SelectContent>
            </Select>
          </div>
          
          {proteinSources.length > 0 && (
            <div>
              <Label>Proteiinilähde</Label>
              <Select value={filters.proteinSource} onValueChange={(value) => updateFilter('proteinSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kaikki proteiinit" />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">Kaikki proteiinit</SelectItem>
                   {proteinSources.map((source) => (
                     <SelectItem key={source} value={source}>
                       {source}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          )}

          {countries.length > 0 && (
            <div>
              <Label>Valmistusmaa</Label>
              <Select value={filters.countryOrigin} onValueChange={(value) => updateFilter('countryOrigin', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kaikki maat" />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">Kaikki maat</SelectItem>
                   {countries.map((country) => (
                     <SelectItem key={country} value={country}>
                       {country === 'Suomi' ? '🇫🇮 Suomi' : country}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="grain-free"
              checked={filters.grainFree}
              onCheckedChange={(checked) => updateFilter('grainFree', checked as boolean)}
            />
            <Label htmlFor="grain-free">Viljaton</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wheat-free"
              checked={filters.wheatFree}
              onCheckedChange={(checked) => updateFilter('wheatFree', checked as boolean)}
            />
            <Label htmlFor="wheat-free">Vehnätön</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="gluten-free"
              checked={filters.glutenFree}
              onCheckedChange={(checked) => updateFilter('glutenFree', checked as boolean)}
            />
            <Label htmlFor="gluten-free">Gluteeniton</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="detailed-info"
              checked={filters.hasDetailedInfo}
              onCheckedChange={(checked) => updateFilter('hasDetailedInfo', checked as boolean)}
            />
            <Label htmlFor="detailed-info">Yksityiskohtaiset tiedot</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}