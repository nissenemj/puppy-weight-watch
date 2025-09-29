
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeUtils'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'

interface Dog {
  id: string
  name: string
  breed?: string
  weight_kg?: number
  age_years?: number
  activity_level?: string
  health_conditions?: string[]
}

interface DogProfileProps {
  user: User
  onDogSelect: (dog: Dog) => void
  selectedDog?: Dog
}

export default function DogProfile({ user, onDogSelect, selectedDog }: DogProfileProps) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isAddingDog, setIsAddingDog] = useState(false)
  const [newDog, setNewDog] = useState({
    name: '',
    breed: '',
    weight_kg: '',
    age_years: '',
    activity_level: 'medium'
  })

  useEffect(() => {
    loadDogs()
  }, [user])

  const loadDogs = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDogs(dbToAppTypes.dog(data) || [])
      
      // Auto-select first dog if none selected
      if (data?.length && !selectedDog) {
        onDogSelect(dbToAppTypes.dog(data[0]))
      }
    } catch (error) {
      console.error('Error loading dogs:', error)
      toast.error('Virhe koirien lataamisessa')
    }
  }

  const addDog = async () => {
    if (!newDog.name.trim()) {
      toast.error('Koiran nimi on pakollinen')
      return
    }

    try {
      const dogData = {
        user_id: user.id,
        name: newDog.name.trim(),
        breed: newDog.breed.trim() || null,
        weight_kg: newDog.weight_kg ? parseFloat(newDog.weight_kg) : null,
        age_years: newDog.age_years ? parseInt(newDog.age_years) : null,
        activity_level: newDog.activity_level
      }

      const { data, error } = await supabase
        .from('dogs')
        .insert([dogData])
        .select()
        .single()

      if (error) throw error

      await loadDogs()
      setNewDog({
        name: '',
        breed: '',
        weight_kg: '',
        age_years: '',
        activity_level: 'medium'
      })
      setIsAddingDog(false)
      toast.success('Koira lisätty!')
      
      if (data) {
        onDogSelect(dbToAppTypes.dog(data))
      }
    } catch (error) {
      console.error('Error adding dog:', error)
      toast.error('Virhe koiran lisäämisessä')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐕 Koiran tiedot
        </CardTitle>
        <CardDescription>
          Valitse koira tai lisää uusi koira ruokamäärän laskemiseen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dogs.length > 0 && (
          <div className="space-y-2">
            <Label>Valitse koira:</Label>
            <Select
              value={selectedDog?.id || ''}
              onValueChange={(value) => {
                const dog = dogs.find(d => d.id === value)
                if (dog) onDogSelect(dog)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Valitse koira" />
              </SelectTrigger>
              <SelectContent>
                {dogs.map((dog) => (
                  <SelectItem key={dog.id} value={dog.id}>
                    {dog.name} {dog.weight_kg ? `(${dog.weight_kg} kg)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedDog && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">{selectedDog.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              {selectedDog.breed && <div>Rotu: {selectedDog.breed}</div>}
              {selectedDog.weight_kg && <div>Paino: {selectedDog.weight_kg} kg</div>}
              {selectedDog.age_years && <div>Ikä: {selectedDog.age_years} vuotta</div>}
              {selectedDog.activity_level && (
                <div>Aktiivisuus: {
                  selectedDog.activity_level === 'low' ? 'Matala' :
                  selectedDog.activity_level === 'medium' ? 'Kohtalainen' : 'Korkea'
                }</div>
              )}
            </div>
          </div>
        )}

        {!isAddingDog ? (
          <Button 
            onClick={() => setIsAddingDog(true)}
            variant="outline"
            className="w-full"
          >
            + Lisää uusi koira
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dog-name">Nimi *</Label>
                <Input
                  id="dog-name"
                  value={newDog.name}
                  onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
                  placeholder="Koiran nimi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dog-breed">Rotu</Label>
                <Input
                  id="dog-breed"
                  value={newDog.breed}
                  onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })}
                  placeholder="esim. Kultainennoutaja"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dog-weight">Paino (kg)</Label>
                <Input
                  id="dog-weight"
                  type="number"
                  step="0.1"
                  value={newDog.weight_kg}
                  onChange={(e) => setNewDog({ ...newDog, weight_kg: e.target.value })}
                  placeholder="25.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dog-age">Ikä (vuotta)</Label>
                <Input
                  id="dog-age"
                  type="number"
                  value={newDog.age_years}
                  onChange={(e) => setNewDog({ ...newDog, age_years: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Aktiivisuustaso</Label>
                <Select value={newDog.activity_level} onValueChange={(value) => setNewDog({ ...newDog, activity_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Matala (vähän liikuntaa)</SelectItem>
                    <SelectItem value="medium">Kohtalainen (normaali)</SelectItem>
                    <SelectItem value="high">Korkea (paljon liikuntaa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                onClick={() => setIsAddingDog(false)}
                variant="outline"
              >
                Peruuta
              </Button>
              <Button onClick={addDog}>
                Lisää koira
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
