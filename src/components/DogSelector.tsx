import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface Dog {
  id: string
  name: string
  breed?: string
  weight_kg?: number
  age_years?: number
  activity_level?: string
  health_conditions?: string[]
}

interface DogSelectorProps {
  user: User
  selectedDogId?: string
  onDogSelect: (dogId: string, dog: Dog) => void
}

export default function DogSelector({ user, selectedDogId, onDogSelect }: DogSelectorProps) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isAddingDog, setIsAddingDog] = useState(false)
  const [newDogName, setNewDogName] = useState('')
  const [newDogBreed, setNewDogBreed] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDogs()
  }, [user.id])

  const loadDogs = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      setDogs(data || [])
      
      // Auto-select first dog if none selected
      if (data && data.length > 0 && !selectedDogId) {
        onDogSelect(data[0].id, data[0])
      }
    } catch (error) {
      console.error('Error loading dogs:', error)
      toast({
        title: "Virhe",
        description: "Koirien lataaminen epäonnistui",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addDog = async () => {
    if (!newDogName.trim()) return

    try {
      const { data, error } = await supabase
        .from('dogs')
        .insert({
          user_id: user.id,
          name: newDogName,
          breed: newDogBreed || null
        })
        .select()
        .single()

      if (error) throw error

      const newDog = data as Dog
      setDogs([...dogs, newDog])
      onDogSelect(newDog.id, newDog)
      setNewDogName('')
      setNewDogBreed('')
      setIsAddingDog(false)
      
      toast({
        title: "Koira lisätty!",
        description: `${newDog.name} on nyt valittu aktiiviseksi koiraksi.`
      })
    } catch (error) {
      console.error('Error adding dog:', error)
      toast({
        title: "Virhe",
        description: "Koiran lisääminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-muted h-10 rounded-md"></div>
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedDogId || ''} 
        onValueChange={(value) => {
          const dog = dogs.find(d => d.id === value)
          if (dog) onDogSelect(value, dog)
        }}
      >
        <SelectTrigger className="min-w-[180px]">
          <SelectValue placeholder="Valitse koira" />
        </SelectTrigger>
        <SelectContent>
          {dogs.map((dog) => (
            <SelectItem key={dog.id} value={dog.id}>
              <div className="flex flex-col">
                <span>{dog.name}</span>
                {dog.breed && <span className="text-xs text-muted-foreground">{dog.breed}</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddingDog} onOpenChange={setIsAddingDog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Lisää uusi koira</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dogName" className="text-gray-900 dark:text-white">Nimi *</Label>
              <Input
                id="dogName"
                value={newDogName}
                onChange={(e) => setNewDogName(e.target.value)}
                placeholder="Koiran nimi"
              />
            </div>
            <div>
              <Label htmlFor="dogBreed" className="text-gray-900 dark:text-white">Rotu</Label>
              <Input
                id="dogBreed"
                value={newDogBreed}
                onChange={(e) => setNewDogBreed(e.target.value)}
                placeholder="Koiran rotu (valinnainen)"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={addDog} 
                disabled={!newDogName.trim()}
                className="flex-1 text-white"
              >
                Lisää koira
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingDog(false)}
                className="flex-1 text-gray-900 dark:text-white"
              >
                Peruuta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}