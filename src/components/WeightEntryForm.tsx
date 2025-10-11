
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Scale } from 'lucide-react'
import { useAddWeightEntry } from '@/hooks/useWeightEntries'
import { useVirtualKeyboard } from '@/hooks/useVirtualKeyboard'
import { useIsMobile } from '@/hooks/use-mobile'
import type { WeightEntry } from '@/services/weightService'
import { trackWeightEntryStarted, trackWeightEntryCompleted, trackFormValidationError } from '@/utils/analytics'

interface WeightEntryFormProps {
  userId: string
  dogId: string
  previousWeights: WeightEntry[]
}

export default function WeightEntryForm({ userId, dogId, previousWeights }: WeightEntryFormProps) {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<{ weight?: string; date?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStartedEntry, setHasStartedEntry] = useState(false)
  const weightInputRef = useRef<HTMLInputElement>(null)

  const addWeightMutation = useAddWeightEntry()
  const { isKeyboardOpen, keyboardHeight } = useVirtualKeyboard()
  const isMobile = useIsMobile()

  // Auto-focus weight input on mobile
  useEffect(() => {
    if (isMobile && weightInputRef.current) {
      // Delay to ensure the component is fully mounted
      setTimeout(() => {
        weightInputRef.current?.focus()
      }, 300)
    }
  }, [isMobile])

  const validateForm = () => {
    const newErrors: { weight?: string; date?: string } = {}

    const weightNum = parseFloat(weight)
    if (!weight) {
      newErrors.weight = 'Paino on pakollinen'
      trackFormValidationError('WeightEntryForm', 'weight', 'required')
    } else if (isNaN(weightNum)) {
      newErrors.weight = 'Paino tulee olla numero'
      trackFormValidationError('WeightEntryForm', 'weight', 'invalid_number')
    } else if (weightNum < 0.1) {
      newErrors.weight = 'Painon tulee olla vähintään 0.1 kg'
      trackFormValidationError('WeightEntryForm', 'weight', 'min_value')
    } else if (weightNum > 100) {
      newErrors.weight = 'Painon tulee olla alle 100 kg'
      trackFormValidationError('WeightEntryForm', 'weight', 'max_value')
    }

    if (!date) {
      newErrors.date = 'Päivämäärä on pakollinen'
      trackFormValidationError('WeightEntryForm', 'date', 'required')
    } else if (new Date(date) > new Date()) {
      newErrors.date = 'Päivämäärä ei voi olla tulevaisuudessa'
      trackFormValidationError('WeightEntryForm', 'date', 'future_date')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const weightValue = parseFloat(weight)
      await addWeightMutation.mutateAsync({
        weight: weightValue,
        date,
        userId,
        dogId,
        previousWeights
      })

      // Track successful weight entry
      trackWeightEntryCompleted(weightValue, { dogId, date })

      // Reset form on success
      setWeight('')
      setDate(new Date().toISOString().split('T')[0])
      setErrors({})
      setHasStartedEntry(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Weight entry submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)

    // Track when user starts entering weight for the first time
    if (!hasStartedEntry && e.target.value.length > 0) {
      trackWeightEntryStarted({ dogId })
      setHasStartedEntry(true)
    }
  }

  return (
    <Card 
      className="mobile-card-safe"
      style={isKeyboardOpen ? { paddingBottom: `${keyboardHeight}px` } : undefined}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Lisää painomittaus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mobile-form-spacing">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Paino (kg)</Label>
              <Input
                ref={weightInputRef}
                id="weight"
                type="number"
                inputMode="decimal"
                step="0.1"
                value={weight}
                onChange={handleWeightChange}
                placeholder="esim. 3.2"
                className={errors.weight ? 'border-red-500' : ''}
                style={{ fontSize: '16px' }}
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
            className="w-full haptic-medium mobile-touch-optimize"
            disabled={isSubmitting || addWeightMutation.isPending}
          >
            {isSubmitting || addWeightMutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Tallennetaan...
              </>
            ) : (
              'Lisää mittaus'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
