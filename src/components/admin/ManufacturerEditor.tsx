import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FoodManufacturer } from '@/services/dogFoodService'

interface ManufacturerEditorProps {
  manufacturer: FoodManufacturer | null
  onChange: (manufacturer: FoodManufacturer | null) => void
}

const COMMON_COUNTRIES = [
  'Suomi', 'Ruotsi', 'Norja', 'Tanska', 'Saksa', 'Alankomaat',
  'Belgia', 'Ranska', 'Italia', 'Espanja', 'Britannia', 'Tšekki',
  'Kanada', 'Yhdysvallat', 'Australia'
]

export function ManufacturerEditor({ manufacturer, onChange }: ManufacturerEditorProps) {
  const updateManufacturer = (field: keyof FoodManufacturer, value: string) => {
    if (!manufacturer) {
      // Create new manufacturer object
      const newManufacturer: FoodManufacturer = {
        id: `temp_${Date.now()}`,
        dog_food_id: '',
        country_of_origin: null,
        website_url: null,
        feeding_guide_url: null,
        created_at: new Date().toISOString()
      }
      newManufacturer[field] = value || null
      onChange(newManufacturer)
    } else {
      onChange({ ...manufacturer, [field]: value || null })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Valmistajatiedot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm">Alkuperämaa</Label>
          <Input
            placeholder="esim. Suomi"
            value={manufacturer?.country_of_origin || ''}
            onChange={(e) => updateManufacturer('country_of_origin', e.target.value)}
            list="countries"
          />
          <datalist id="countries">
            {COMMON_COUNTRIES.map(country => (
              <option key={country} value={country} />
            ))}
          </datalist>
        </div>

        <div>
          <Label className="text-sm">Valmistajan nettisivut</Label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={manufacturer?.website_url || ''}
            onChange={(e) => updateManufacturer('website_url', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-sm">Ruokinta-oppaan URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/feeding-guide"
            value={manufacturer?.feeding_guide_url || ''}
            onChange={(e) => updateManufacturer('feeding_guide_url', e.target.value)}
          />
        </div>

        {!manufacturer && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Ei valmistajatietoja lisätty
          </div>
        )}
      </CardContent>
    </Card>
  )
}