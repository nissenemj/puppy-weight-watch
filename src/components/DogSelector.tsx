import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeUtils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  const [isEditingDog, setIsEditingDog] = useState(false)
  const [newDogName, setNewDogName] = useState('')
  const [newDogBreed, setNewDogBreed] = useState('')
  const [editDogName, setEditDogName] = useState('')
  const [editDogBreed, setEditDogBreed] = useState('')
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadDogs = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      setDogs(dbToAppTypes.dog(data) as Dog[] || [])

      // Auto-select first dog if none selected and dogs exist
      if (data && data.length > 0 && !selectedDogId) {
        // Small delay to ensure parent component is ready
        setTimeout(() => {
          onDogSelect(data[0].id, dbToAppTypes.dog(data[0]) as Dog)
        }, 100)
      }
    } catch (error) {
      console.error('Error loading dogs:', error)
      toast({
        title: "Virhe koirien lataamisessa",
        description: "Tarkista internetyhteytesi ja yritä uudelleen",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user.id, selectedDogId, onDogSelect, toast])

  useEffect(() => {
    loadDogs()
  }, [loadDogs])

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

  const openEditDialog = () => {
    const selectedDog = dogs.find(d => d.id === selectedDogId)
    if (selectedDog) {
      setEditDogName(selectedDog.name)
      setEditDogBreed(selectedDog.breed || '')
      setIsEditingDog(true)
    }
  }

  const updateDog = async () => {
    if (!selectedDogId || !editDogName.trim()) return

    try {
      const { error } = await supabase
        .from('dogs')
        .update({
          name: editDogName,
          breed: editDogBreed || null
        })
        .eq('id', selectedDogId)

      if (error) throw error

      await loadDogs()

      // Update parent component with new dog data
      const updatedDog: Dog = {
        id: selectedDogId,
        name: editDogName,
        breed: editDogBreed || undefined
      }
      onDogSelect(selectedDogId, updatedDog)

      setIsEditingDog(false)

      toast({
        title: "Koira päivitetty!",
        description: `${editDogName} tiedot on päivitetty.`
      })
    } catch (error) {
      console.error('Error updating dog:', error)
      toast({
        title: "Virhe",
        description: "Koiran päivittäminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const deleteDog = async () => {
    if (!selectedDogId || !deleteConfirmed) {
      return
    }

    try {
      // Delete feeding_plans first (no CASCADE on foreign key)
      const { error: feedingError } = await supabase
        .from('feeding_plans')
        .delete()
        .eq('dog_id', selectedDogId)

      if (feedingError) {
        console.error('Error deleting feeding plans:', feedingError)
        // Continue anyway - might not have any feeding plans
      }

      // Now delete the dog
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', selectedDogId)

      if (error) {
        throw error
      }

      const remainingDogs = dogs.filter(d => d.id !== selectedDogId)
      setDogs(remainingDogs)

      // Select first remaining dog or clear selection
      if (remainingDogs.length > 0) {
        onDogSelect(remainingDogs[0].id, remainingDogs[0])
      } else {
        onDogSelect('', {} as Dog)
      }

      setShowDeleteAlert(false)
      setDeleteConfirmed(false)
      setIsEditingDog(false)

      toast({
        title: "Koira poistettu",
        description: "Kaikki koiraan liittyvät tiedot on poistettu pysyvästi."
      })
    } catch (error) {
      console.error('Error deleting dog:', error)
      toast({
        title: "Virhe",
        description: "Koiran poistaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-muted h-10 rounded-md"></div>
  }

  const selectedDog = dogs.find(d => d.id === selectedDogId)

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Select
        value={selectedDogId || ''}
        onValueChange={(value) => {
          const dog = dogs.find(d => d.id === value)
          if (dog) onDogSelect(value, dog)
        }}
      >
        <SelectTrigger className="w-[160px] sm:w-[200px] shrink-0">
          <SelectValue placeholder="Valitse koira" />
        </SelectTrigger>
        <SelectContent className="z-[1300] min-w-[200px] w-auto">
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

      {/* Settings button - only show if a dog is selected */}
      {selectedDogId && (
        <Button variant="outline" size="icon" onClick={openEditDialog}>
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {/* Add dog button */}
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

      {/* Edit/Delete dialog */}
      <Dialog open={isEditingDog} onOpenChange={setIsEditingDog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Muokkaa koiran tietoja</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editDogName" className="text-gray-900 dark:text-white">Nimi *</Label>
              <Input
                id="editDogName"
                value={editDogName}
                onChange={(e) => setEditDogName(e.target.value)}
                placeholder="Koiran nimi"
              />
            </div>
            <div>
              <Label htmlFor="editDogBreed" className="text-gray-900 dark:text-white">Rotu</Label>
              <Input
                id="editDogBreed"
                value={editDogBreed}
                onChange={(e) => setEditDogBreed(e.target.value)}
                placeholder="Koiran rotu (valinnainen)"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={updateDog}
                disabled={!editDogName.trim()}
                className="flex-1 text-white"
              >
                Tallenna muutokset
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteAlert(true)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Poista
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation AlertDialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poista {selectedDog?.name} pysyvästi?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Tämä poistaa kaikki {selectedDog?.name}:n tiedot PYSYVÄSTI:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Kaikki painomittaukset</li>
                <li>Pentukirjamerkinnät</li>
                <li>Terveysmerkinnät</li>
                <li>Muut tallennetut tiedot</li>
              </ul>
              <p className="font-semibold text-destructive">Tätä toimintoa EI VOI perua!</p>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="confirmDelete"
                  checked={deleteConfirmed}
                  onCheckedChange={(checked) => setDeleteConfirmed(checked as boolean)}
                />
                <Label
                  htmlFor="confirmDelete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ymmärrän että tämä on lopullista
                </Label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmed(false)}>
              Peruuta
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDog}
              disabled={!deleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Poista pysyvästi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}