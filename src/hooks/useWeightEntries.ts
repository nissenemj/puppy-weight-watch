
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { WeightService, type WeightEntry } from '@/services/weightService'
import { toast } from 'sonner'
import { validateWeightChange } from '@/lib/validationSchemas'

export const useWeightEntries = (userId: string, dogId?: string) => {
  return useQuery({
    queryKey: ['weightEntries', userId, dogId],
    queryFn: () => WeightService.getWeightEntries(userId, dogId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useLatestWeightEntry = (userId: string, dogId?: string) => {
  return useQuery({
    queryKey: ['latestWeightEntry', userId, dogId],
    queryFn: () => WeightService.getLatestWeightEntry(userId, dogId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useAddWeightEntry = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ weight, date, userId, dogId, previousWeights }: {
      weight: number
      date: string
      userId: string
      dogId: string
      previousWeights: WeightEntry[]
    }) => {
      // Validate weight change
      const validation = validateWeightChange(weight, previousWeights)
      if (!validation.isValid && validation.warning) {
        // Show warning but don't prevent entry
        toast.warning(validation.warning)
      }

      // Check if entry already exists for this date and dog
      const existingEntry = await WeightService.checkExistingEntry(userId, date, dogId)
      
      if (existingEntry) {
        // Update existing entry
        return await WeightService.updateWeightEntry(existingEntry.id, weight)
      } else {
        // Create new entry
        return await WeightService.addWeightEntry({
          weight,
          date,
          user_id: userId,
          dog_id: dogId
        })
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch weight entries with dog-specific keys
      queryClient.invalidateQueries({ queryKey: ['weightEntries', variables.userId, variables.dogId] })
      queryClient.invalidateQueries({ queryKey: ['weightEntries', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['latestWeightEntry', variables.userId, variables.dogId] })
      queryClient.invalidateQueries({ queryKey: ['latestWeightEntry', variables.userId] })
      
      console.log('Weight entry saved for dog:', variables.dogId)
      toast.success('Painomittaus tallennettu onnistuneesti!')
    },
    onError: (error) => {
      console.error('Error adding weight entry:', error)
      toast.error('Painomittauksen tallentaminen epäonnistui: ' + error.message)
    }
  })
}

export const useUpdateWeightEntry = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, weight, userId }: { id: string, weight: number, userId: string }) =>
      WeightService.updateWeightEntry(id, weight),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weightEntries', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['latestWeightEntry', variables.userId] })
      toast.success('Painomittaus päivitetty onnistuneesti!')
    },
    onError: (error) => {
      console.error('Error updating weight entry:', error)
      toast.error('Painomittauksen päivittäminen epäonnistui: ' + error.message)
    }
  })
}

export const useDeleteWeightEntry = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string, userId: string }) =>
      WeightService.deleteWeightEntry(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weightEntries', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['latestWeightEntry', variables.userId] })
      toast.success('Painomittaus poistettu onnistuneesti!')
    },
    onError: (error) => {
      console.error('Error deleting weight entry:', error)
      toast.error('Painomittauksen poistaminen epäonnistui: ' + error.message)
    }
  })
}
