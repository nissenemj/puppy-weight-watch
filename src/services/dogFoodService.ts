import { supabase } from "@/integrations/supabase/client"

export interface DogFood {
  id: string
  product_code: string
  name: string
  manufacturer: string
  food_type: 'Kuiva' | 'Märkä' | 'Raaka'
  nutrition_type: 'Täysravinto' | 'Täydennysravinto' | 'Täysravinto/Täydennysravinto'
  dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä' | 'Nykyinen_Paino' | 'Prosentti_Nykyisestä_Painosta' | 'Kokoluokka' | 'Ei_Tietoa'
  notes?: string
  created_at: string
  feeding_guidelines?: FeedingGuideline[]
}

export interface FeedingGuideline {
  id: string
  dog_food_id: string
  adult_weight_kg?: number
  age_months?: string
  current_weight_kg?: number
  size_category?: string
  daily_amount_min?: number
  daily_amount_max?: number
  calculation_formula?: string
  created_at: string
}

export class DogFoodService {
  static async getAllDogFoods(): Promise<DogFood[]> {
    const { data, error } = await supabase
      .from('dog_foods')
      .select(`
        *,
        feeding_guidelines (*)
      `)
      .order('manufacturer', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching dog foods:', error)
      throw new Error(error.message)
    }
    
    // Type assertion to handle the Supabase response
    return (data || []).map(item => ({
      ...item,
      food_type: item.food_type as DogFood['food_type'],
      nutrition_type: item.nutrition_type as DogFood['nutrition_type'],
      dosage_method: item.dosage_method as DogFood['dosage_method']
    }))
  }

  static async insertDogFoodWithGuidelines(dogFood: Omit<DogFood, 'id' | 'created_at'>, guidelines: Omit<FeedingGuideline, 'id' | 'dog_food_id' | 'created_at'>[]): Promise<DogFood> {
    // Insert dog food first
    const { data: foodData, error: foodError } = await supabase
      .from('dog_foods')
      .insert([{
        product_code: dogFood.product_code,
        name: dogFood.name,
        manufacturer: dogFood.manufacturer,
        food_type: dogFood.food_type,
        nutrition_type: dogFood.nutrition_type,
        dosage_method: dogFood.dosage_method,
        notes: dogFood.notes
      }])
      .select()
      .single()

    if (foodError) {
      console.error('Error inserting dog food:', foodError)
      throw new Error(foodError.message)
    }

    // Insert feeding guidelines
    if (guidelines.length > 0) {
      const guidelinesWithFoodId = guidelines.map(guideline => ({
        ...guideline,
        dog_food_id: foodData.id
      }))

      const { error: guidelinesError } = await supabase
        .from('feeding_guidelines')
        .insert(guidelinesWithFoodId)

      if (guidelinesError) {
        console.error('Error inserting feeding guidelines:', guidelinesError)
        throw new Error(guidelinesError.message)
      }
    }

    // Type assertion for the return value
    return {
      ...foodData,
      food_type: foodData.food_type as DogFood['food_type'],
      nutrition_type: foodData.nutrition_type as DogFood['nutrition_type'],
      dosage_method: foodData.dosage_method as DogFood['dosage_method']
    }
  }

  static async initializeDatabase(): Promise<void> {
    // Check if data already exists
    const { data: existingFoods } = await supabase
      .from('dog_foods')
      .select('id')
      .limit(1)

    if (existingFoods && existingFoods.length > 0) {
      console.log('Database already has dog food data')
      return
    }

    console.log('Initializing dog food database...')

    // Insert Brit Care Hypoallergenic Puppy
    await this.insertDogFoodWithGuidelines({
      product_code: 'BC_PUPPY_DRY_LAMB',
      name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice',
      manufacturer: 'Brit',
      food_type: 'Kuiva',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä',
      notes: 'Sopii myös tiineille ja imettäville nartuille.'
    }, [
      { adult_weight_kg: 5, age_months: '1-3', daily_amount_min: 50, daily_amount_max: 50 },
      { adult_weight_kg: 5, age_months: '3-4', daily_amount_min: 75, daily_amount_max: 75 },
      { adult_weight_kg: 5, age_months: '4-6', daily_amount_min: 75, daily_amount_max: 75 },
      { adult_weight_kg: 5, age_months: '6-12', daily_amount_min: 70, daily_amount_max: 70 },
      { adult_weight_kg: 10, age_months: '1-3', daily_amount_min: 85, daily_amount_max: 85 },
      { adult_weight_kg: 10, age_months: '3-4', daily_amount_min: 120, daily_amount_max: 120 },
      { adult_weight_kg: 10, age_months: '4-6', daily_amount_min: 130, daily_amount_max: 130 },
      { adult_weight_kg: 10, age_months: '6-12', daily_amount_min: 120, daily_amount_max: 120 },
      { adult_weight_kg: 15, age_months: '1-3', daily_amount_min: 115, daily_amount_max: 115 },
      { adult_weight_kg: 15, age_months: '3-4', daily_amount_min: 160, daily_amount_max: 160 },
      { adult_weight_kg: 15, age_months: '4-6', daily_amount_min: 175, daily_amount_max: 175 },
      { adult_weight_kg: 15, age_months: '6-12', daily_amount_min: 170, daily_amount_max: 170 },
      { adult_weight_kg: 20, age_months: '1-3', daily_amount_min: 140, daily_amount_max: 140 },
      { adult_weight_kg: 20, age_months: '3-4', daily_amount_min: 180, daily_amount_max: 180 },
      { adult_weight_kg: 20, age_months: '4-6', daily_amount_min: 220, daily_amount_max: 220 },
      { adult_weight_kg: 20, age_months: '6-12', daily_amount_min: 210, daily_amount_max: 210 },
      { adult_weight_kg: 25, age_months: '1-3', daily_amount_min: 150, daily_amount_max: 150 }
    ])

    // Insert Hau-Hau Champion
    await this.insertDogFoodWithGuidelines({
      product_code: 'HHC_PUPPY_DRY',
      name: 'Hau-Hau Champion Pentu & Emo',
      manufacturer: 'Hau-Hau Champion',
      food_type: 'Kuiva',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä',
      notes: 'Sopii myös emolle.'
    }, [
      { adult_weight_kg: 5, age_months: '1-2', daily_amount_min: 70, daily_amount_max: 70 },
      { adult_weight_kg: 5, age_months: '3-4', daily_amount_min: 90, daily_amount_max: 90 },
      { adult_weight_kg: 5, age_months: '5-6', daily_amount_min: 90, daily_amount_max: 90 },
      { adult_weight_kg: 5, age_months: '7-12', daily_amount_min: 80, daily_amount_max: 80 },
      { adult_weight_kg: 10, age_months: '1-2', daily_amount_min: 100, daily_amount_max: 100 },
      { adult_weight_kg: 10, age_months: '3-4', daily_amount_min: 140, daily_amount_max: 140 },
      { adult_weight_kg: 10, age_months: '5-6', daily_amount_min: 140, daily_amount_max: 140 },
      { adult_weight_kg: 15, age_months: '1-2', daily_amount_min: 130, daily_amount_max: 130 },
      { adult_weight_kg: 15, age_months: '3-4', daily_amount_min: 170, daily_amount_max: 170 },
      { adult_weight_kg: 15, age_months: '5-6', daily_amount_min: 190, daily_amount_max: 190 },
      { adult_weight_kg: 20, age_months: '1-2', daily_amount_min: 160, daily_amount_max: 160 },
      { adult_weight_kg: 20, age_months: '3-4', daily_amount_min: 200, daily_amount_max: 200 },
      { adult_weight_kg: 20, age_months: '5-6', daily_amount_min: 230, daily_amount_max: 230 }
    ])

    // Insert MUSH Vaisto Puppy
    await this.insertDogFoodWithGuidelines({
      product_code: 'MUSH_PUPPY_RAW_T1',
      name: 'MUSH Vaisto Puppy (nauta-poro-lohi)',
      manufacturer: 'MUSH',
      food_type: 'Raaka',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä',
      notes: 'Taulukko antaa tarkat arvot.'
    }, [
      { adult_weight_kg: 20, age_months: '1-2', calculation_formula: 'Aikuispaino_kg * 100' },
      { adult_weight_kg: 20, age_months: '2-4', calculation_formula: 'Aikuispaino_kg * 75' },
      { adult_weight_kg: 20, age_months: '4-6', calculation_formula: 'Aikuispaino_kg * 50' },
      { adult_weight_kg: 20, age_months: '6-9', calculation_formula: 'Aikuispaino_kg * 30' },
      { adult_weight_kg: 20, age_months: '9+', calculation_formula: 'Aikuispaino_kg * 25' }
    ])

    // Insert MUSH general guideline
    await this.insertDogFoodWithGuidelines({
      product_code: 'MUSH_PUPPY_RAW_T2',
      name: 'MUSH Vaisto Puppy (yleisohje)',
      manufacturer: 'MUSH',
      food_type: 'Raaka',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Prosentti_Nykyisestä_Painosta',
      notes: 'Annos on 5-10% pennun nykyisestä painosta.'
    }, [
      { calculation_formula: 'Nykyinen_paino_kg * 1000 * (0.05... 0.10)' }
    ])

    // Insert SMAAK
    await this.insertDogFoodWithGuidelines({
      product_code: 'SMAAK_PUPPY_RAW',
      name: 'SMAAK Raaka täysravinto (nauta-kalkkuna-kana)',
      manufacturer: 'SMAAK',
      food_type: 'Raaka',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Nykyinen_Paino',
      notes: 'Soveltuu pennuille. Annos on laaja vaihteluväli.'
    }, [
      { current_weight_kg: 5, daily_amount_min: 75, daily_amount_max: 150 },
      { current_weight_kg: 10, daily_amount_min: 150, daily_amount_max: 300 },
      { current_weight_kg: 15, daily_amount_min: 225, daily_amount_max: 450 },
      { current_weight_kg: 20, daily_amount_min: 300, daily_amount_max: 600 },
      { current_weight_kg: 25, daily_amount_min: 375, daily_amount_max: 750 }
    ])

    // Insert Brit Premium by Nature (full nutrition)
    await this.insertDogFoodWithGuidelines({
      product_code: 'BP_WET_BEEF_FULL',
      name: 'Brit Premium by Nature Beef with Tripe (täysravinto)',
      manufacturer: 'Brit',
      food_type: 'Märkä',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Kokoluokka',
      notes: 'Annos täysravintona.'
    }, [
      { size_category: 'Pieni (1-10 kg)', daily_amount_min: 200, daily_amount_max: 400 },
      { size_category: 'Keski (10-25 kg)', daily_amount_min: 400, daily_amount_max: 800 },
      { size_category: 'Suuri (25-50 kg)', daily_amount_min: 800, daily_amount_max: 1200 }
    ])

    // Insert Brit Premium by Nature (complementary)
    await this.insertDogFoodWithGuidelines({
      product_code: 'BP_WET_BEEF_COMP',
      name: 'Brit Premium by Nature Beef with Tripe (täydennysravinto)',
      manufacturer: 'Brit',
      food_type: 'Märkä',
      nutrition_type: 'Täydennysravinto',
      dosage_method: 'Kokoluokka',
      notes: 'Annos 50% täydennysravintona.'
    }, [
      { size_category: 'Pieni (1-10 kg)', daily_amount_min: 100, daily_amount_max: 200 },
      { size_category: 'Keski (10-25 kg)', daily_amount_min: 200, daily_amount_max: 400 },
      { size_category: 'Suuri (25-50 kg)', daily_amount_min: 400, daily_amount_max: 600 }
    ])

    // Insert products without feeding data
    const productsWithoutData = [
      {
        product_code: 'RC_MINI_PUPPY_DRY',
        name: 'Royal Canin Mini Puppy',
        manufacturer: 'Royal Canin',
        food_type: 'Kuiva' as const,
        nutrition_type: 'Täysravinto' as const,
        dosage_method: 'Ei_Tietoa' as const,
        notes: 'Annostelutaulukkoa ei saatavilla tutkituista lähteistä.'
      },
      {
        product_code: 'ACANA_PUPPY_DRY',
        name: 'Acana Puppy & Junior',
        manufacturer: 'Acana',
        food_type: 'Kuiva' as const,
        nutrition_type: 'Täysravinto' as const,
        dosage_method: 'Ei_Tietoa' as const,
        notes: 'Annostelutaulukkoa ei saatavilla tutkituista lähteistä.'
      },
      {
        product_code: 'PN_PUPPY_DRY',
        name: 'Purenatural Puppy (eri maut)',
        manufacturer: 'Purenatural',
        food_type: 'Kuiva' as const,
        nutrition_type: 'Täysravinto' as const,
        dosage_method: 'Ei_Tietoa' as const,
        notes: 'Annostelutaulukkoa ei saatavilla tutkituista lähteistä.'
      },
      {
        product_code: 'RC_MINI_PUPPY_WET',
        name: 'Royal Canin Mini Puppy (märkäruoka)',
        manufacturer: 'Royal Canin',
        food_type: 'Märkä' as const,
        nutrition_type: 'Täysravinto' as const,
        dosage_method: 'Ei_Tietoa' as const,
        notes: 'Annostelutaulukkoa ei saatavilla tutkituista lähteistä.'
      }
    ]

    for (const product of productsWithoutData) {
      await this.insertDogFoodWithGuidelines(product, [])
    }

    console.log('Dog food database initialized successfully!')
  }
}
