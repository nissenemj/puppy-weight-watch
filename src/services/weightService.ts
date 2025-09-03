
import { supabase } from "@/integrations/supabase/client"
import { WeightEntrySchema } from "@/lib/validationSchemas"
import { convertNullToUndefined } from "@/utils/typeConverters"
import { z } from "zod"

export interface WeightEntry {
  id: string
  weight: number
  date: string
  user_id?: string
  dog_id?: string
  created_at?: string
}

export class WeightService {
  static async addWeightEntry(entry: Omit<WeightEntry, 'id' | 'created_at'>): Promise<WeightEntry> {
    // Validate input
    const validatedEntry = WeightEntrySchema.parse({
      weight: entry.weight,
      date: entry.date
    })

    const { data, error } = await supabase
      .from('weight_entries')
      .insert([{
        weight: validatedEntry.weight,
        date: validatedEntry.date,
        user_id: entry.user_id,
        dog_id: entry.dog_id
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding weight entry:', error)
      throw new Error(error.message)
    }
    
    return convertNullToUndefined(data) as WeightEntry
  }

  static async updateWeightEntry(id: string, weight: number): Promise<WeightEntry> {
    // Validate weight
    const validatedWeight = z.number()
      .min(0.1, "Painon tulee olla vähintään 0.1 kg")
      .max(100, "Painon tulee olla alle 100 kg")
      .parse(weight)

    const { data, error } = await supabase
      .from('weight_entries')
      .update({ weight: validatedWeight })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating weight entry:', error)
      throw new Error(error.message)
    }
    
    return convertNullToUndefined(data) as WeightEntry
  }

  static async deleteWeightEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('weight_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting weight entry:', error)
      throw new Error(error.message)
    }
  }

  static async getWeightEntries(userId: string, dogId?: string): Promise<WeightEntry[]> {
    let query = supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', userId)

    if (dogId) {
      query = query.eq('dog_id', dogId)
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) {
      console.error('Error fetching weight entries:', error)
      throw new Error(error.message)
    }
    
    return convertNullToUndefined(data || []) as WeightEntry[]
  }

  static async getLatestWeightEntry(userId: string, dogId?: string): Promise<WeightEntry | null> {
    let query = supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', userId)

    if (dogId) {
      query = query.eq('dog_id', dogId)
    }

    const { data, error } = await query
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching latest weight entry:', error)
      throw new Error(error.message)
    }
    
    return data ? convertNullToUndefined(data) as WeightEntry : null
  }

  static async checkExistingEntry(userId: string, date: string, dogId?: string): Promise<WeightEntry | null> {
    let query = supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)

    if (dogId) {
      query = query.eq('dog_id', dogId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error('Error checking existing entry:', error)
      throw new Error(error.message)
    }
    
    return data ? convertNullToUndefined(data) as WeightEntry : null
  }
}
