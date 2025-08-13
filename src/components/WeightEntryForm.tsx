
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Scale } from 'lucide-react'
import { useAddWeightEntry } from '@/hooks/useWeightEntries'
import type { WeightEntry } from '@/services/weightService'

interface WeightEntryFormProps {
  userId: string
  dogId: string
  previousWeights: WeightEntry[]
}

export default function WeightEntryForm({ userId, dogId, previousWeights }: WeightEntryFormProps) {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<{ weight?: string; date?: string }>({})

  const addWeightMutation = useAddWeightEntry()

  const validateForm = () => {
    const newErrors: { weight?: string; date?: string } = {}
    
    const weightNum = parseFloat(weight)
    if (!weight) {
      newErrors.weight = 'Paino on pakollinen'
    } else if (isNaN(weightNum)) {
      newErrors.weight = 'Paino tulee olla numero'
    } else if (weightNum < 0.1) {
      newErrors.weight = 'Painon tulee olla vähintään 0.1 kg'
    } else if (weightNum > 100) {
      newErrors.weight = 'Painon tulee olla alle 100 kg'
    }

    if (!date) {
      newErrors.date = 'Päivämäärä on pakollinen'
    } else if (new Date(date) > new Date()) {
      newErrors.date = 'Päivämäärä ei voi olla tulevaisuudessa'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await addWeightMutation.mutateAsync({
        weight: parseFloat(weight),
        date,
        userId,
        dogId,
        previousWeights
      })
      
      // Reset form on success
      setWeight('')
      setDate(new Date().toISOString().split('T')[0])
      setErrors({})
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Weight entry submission failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Lisää painomittaus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Paino (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="esim. 3.2"
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Päivämäärä</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addWeightMutation.isPending}
          >
            {addWeightMutation.isPending ? 'Tallennetaan...' : 'Lisää mittaus'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
