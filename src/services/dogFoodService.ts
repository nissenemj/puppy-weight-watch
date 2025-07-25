import { supabase } from "@/integrations/supabase/client"

export interface FoodIngredient {
  id: string
  dog_food_id: string
  ingredient_type: 'primary' | 'protein' | 'carb' | 'fat' | 'additive'
  ingredient_name: string
  percentage?: number
  order_index: number
  created_at: string
}

export interface FoodAllergen {
  id: string
  dog_food_id: string
  allergen_type: 'contains' | 'free_from'
  allergen_name: string
  created_at: string
}

export interface FoodNutrition {
  id: string
  dog_food_id: string
  protein_percentage?: number
  fat_percentage?: number
  fiber_percentage?: number
  moisture_percentage?: number
  grain_free: boolean
  wheat_free: boolean
  gluten_free: boolean
  special_features?: string[]
  created_at: string
}

export interface FoodManufacturer {
  id: string
  dog_food_id: string
  country_of_origin?: string
  website_url?: string
  feeding_guide_url?: string
  created_at: string
}

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
  // New expanded fields
  ingredients?: string
  country_of_origin?: string
  ingredient_origin?: string
  protein_percentage?: number
  fat_percentage?: number
  special_features?: string[]
  feeding_schedule?: string
  energy_content?: number
  // Existing detailed data fields
  feeding_guidelines?: FeedingGuideline[]
  food_ingredients?: FoodIngredient[]
  allergens?: FoodAllergen[]
  nutrition?: FoodNutrition
  manufacturer_info?: FoodManufacturer
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
        feeding_guidelines (*),
        food_ingredients (*),
        food_allergens (*),
        food_nutrition (*),
        food_manufacturers (*)
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
      dosage_method: item.dosage_method as DogFood['dosage_method'],
      // Keep detailed ingredients as array for backward compatibility
      food_ingredients: (item.food_ingredients || []).map((ing: any) => ({
        ...ing,
        ingredient_type: ing.ingredient_type as FoodIngredient['ingredient_type']
      })),
      allergens: (item.food_allergens || []).map((all: any) => ({
        ...all,
        allergen_type: all.allergen_type as FoodAllergen['allergen_type']
      })),
      nutrition: item.food_nutrition ? item.food_nutrition[0] : undefined,
      manufacturer_info: item.food_manufacturers ? item.food_manufacturers[0] : undefined
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

    // Insert Brit Care Hypoallergenic Puppy with enhanced data
    const britCareFood = await this.insertDogFoodWithGuidelines({
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

    // Add enhanced data for Brit Care
    await this.addEnhancedFoodData(britCareFood.id, {
      ingredients: [
        { ingredient_type: 'primary', ingredient_name: 'Kuivattu lammas', percentage: 46, order_index: 0 },
        { ingredient_type: 'primary', ingredient_name: 'Riisi', percentage: 30, order_index: 1 },
        { ingredient_type: 'primary', ingredient_name: 'Kananrasva', order_index: 2 },
        { ingredient_type: 'primary', ingredient_name: 'Lohiöljy', percentage: 3, order_index: 3 },
        { ingredient_type: 'primary', ingredient_name: 'Panimohiiva', order_index: 4 },
        { ingredient_type: 'primary', ingredient_name: 'Luonnollinen aromi', order_index: 5 },
        { ingredient_type: 'primary', ingredient_name: 'Kuivattu omenapulppi', order_index: 6 },
        { ingredient_type: 'protein', ingredient_name: 'Kuivattu lammas', order_index: 0 },
        { ingredient_type: 'protein', ingredient_name: 'Hydrolysoitu hiiva', percentage: 0.5, order_index: 1 },
        { ingredient_type: 'carb', ingredient_name: 'Riisi', percentage: 30, order_index: 0 },
        { ingredient_type: 'carb', ingredient_name: 'Hernejauho', order_index: 1 },
        { ingredient_type: 'fat', ingredient_name: 'Kananrasva', order_index: 0 },
        { ingredient_type: 'fat', ingredient_name: 'Lohiöljy', percentage: 3, order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Glukosamiini', order_index: 0 },
        { ingredient_type: 'additive', ingredient_name: 'Kondroitiinisulfaatti', order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Frukto-oligosakkaridit', order_index: 2 },
        { ingredient_type: 'additive', ingredient_name: 'Mannaani-oligosakkaridit', order_index: 3 },
        { ingredient_type: 'additive', ingredient_name: 'Mojave yucca', order_index: 4 },
        { ingredient_type: 'additive', ingredient_name: 'Ohdakkeen siemen', order_index: 5 },
        { ingredient_type: 'additive', ingredient_name: 'β-glukaanit', order_index: 6 },
        { ingredient_type: 'additive', ingredient_name: 'Kuivattu sydänruoho', order_index: 7 },
        { ingredient_type: 'additive', ingredient_name: 'Kuivattu tyrni', order_index: 8 },
        { ingredient_type: 'additive', ingredient_name: 'Probiootit Lactobacillus helveticus', order_index: 9 }
      ],
      allergens: [
        { allergen_type: 'free_from', allergen_name: 'Vehnä' },
        { allergen_type: 'free_from', allergen_name: 'Soija' },
        { allergen_type: 'free_from', allergen_name: 'Maissi' },
        { allergen_type: 'free_from', allergen_name: 'Gluteeni' }
      ],
      nutrition: {
        protein_percentage: 28,
        fat_percentage: 15,
        fiber_percentage: 2.5,
        moisture_percentage: 10,
        grain_free: false,
        wheat_free: true,
        gluten_free: true,
        special_features: ['Hypoallergeeninen', 'Yksi eläinproteiinin lähde', 'Nivelten tuki', 'Probiootteja', 'Prebiootteja', 'Omega-3', 'Luonnolliset antioksidantit']
      },
      manufacturer_info: {
        country_of_origin: 'Tšekki',
        website_url: 'https://brit-petfood.com',
        feeding_guide_url: 'https://brit-petfood.com/en/products/dogs/5001-brit-care-puppy-lamb-and-rice'
      }
    })

    // Insert Hau-Hau Champion with enhanced data
    const hauHauFood = await this.insertDogFoodWithGuidelines({
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

    // Add enhanced data for Hau-Hau Champion
    await this.addEnhancedFoodData(hauHauFood.id, {
      ingredients: [
        { ingredient_type: 'primary', ingredient_name: 'Siipikarjajauho', percentage: 45, order_index: 0 },
        { ingredient_type: 'primary', ingredient_name: 'Riisi', percentage: 16, order_index: 1 },
        { ingredient_type: 'primary', ingredient_name: 'Kaura', percentage: 13, order_index: 2 },
        { ingredient_type: 'primary', ingredient_name: 'Kananrasva', percentage: 11, order_index: 3 },
        { ingredient_type: 'primary', ingredient_name: 'Kuivattu omena', percentage: 4, order_index: 4 },
        { ingredient_type: 'primary', ingredient_name: 'Kuorittu herne', percentage: 4, order_index: 5 },
        { ingredient_type: 'primary', ingredient_name: 'Panimohiiva', order_index: 6 },
        { ingredient_type: 'primary', ingredient_name: 'Camelinaöljy', percentage: 1.5, order_index: 7 },
        { ingredient_type: 'protein', ingredient_name: 'Kana', percentage: 41, order_index: 0 },
        { ingredient_type: 'protein', ingredient_name: 'Hydrolysoitu kananmaksa', percentage: 2, order_index: 1 },
        { ingredient_type: 'carb', ingredient_name: 'Riisi', percentage: 16, order_index: 0 },
        { ingredient_type: 'carb', ingredient_name: 'Kaura', percentage: 13, order_index: 1 },
        { ingredient_type: 'carb', ingredient_name: 'Kuorittu herne', percentage: 4, order_index: 2 },
        { ingredient_type: 'fat', ingredient_name: 'Kananrasva', percentage: 11, order_index: 0 },
        { ingredient_type: 'fat', ingredient_name: 'Camelinaöljy', percentage: 1.5, order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Mannaanioligosakkaridit', order_index: 0 },
        { ingredient_type: 'additive', ingredient_name: 'Frukto-oligosakkaridit', order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Jukkauute', order_index: 2 }
      ],
      allergens: [
        { allergen_type: 'free_from', allergen_name: 'Vehnä' },
        { allergen_type: 'free_from', allergen_name: 'Soija' },
        { allergen_type: 'free_from', allergen_name: 'Gluteeni' }
      ],
      nutrition: {
        protein_percentage: 32,
        fat_percentage: 19,
        fiber_percentage: 2.4,
        moisture_percentage: 10,
        grain_free: false,
        wheat_free: true,
        gluten_free: true,
        special_features: ['100% kotimaista kanaa', 'Valmistettu Suomessa', 'Prebiootteja', 'Omega-rasvahappoja', '85% eläinperäistä proteiinia']
      },
      manufacturer_info: {
        country_of_origin: 'Suomi',
        website_url: 'https://hauhau.fi',
        feeding_guide_url: 'https://www.s-kaupat.fi/tuote/hau-hau-champion-nokian-nappulatehtaan-kanaa-riisia-and-kauraa-taysravinto-pennuille-ja-emoille-12-kg/6430076899088'
      }
    })

    // Insert MUSH Vaisto Puppy with enhanced data
    const mushFood = await this.insertDogFoodWithGuidelines({
      product_code: 'MUSH_PUPPY_RAW_T1',
      name: 'MUSH Vaisto Puppy (nauta-poro-lohi)',
      manufacturer: 'MUSH',
      food_type: 'Raaka',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Odotettu_Aikuispaino_Ja_Ikä',
      notes: 'Taulukko antaa tarkat arvot. Raakaruoka (B.A.R.F.).'
    }, [
      { adult_weight_kg: 20, age_months: '1-2', calculation_formula: 'Aikuispaino_kg * 100' },
      { adult_weight_kg: 20, age_months: '2-4', calculation_formula: 'Aikuispaino_kg * 75' },
      { adult_weight_kg: 20, age_months: '4-6', calculation_formula: 'Aikuispaino_kg * 50' },
      { adult_weight_kg: 20, age_months: '6-9', calculation_formula: 'Aikuispaino_kg * 30' },
      { adult_weight_kg: 20, age_months: '9+', calculation_formula: 'Aikuispaino_kg * 25' }
    ])

    // Add enhanced data for MUSH
    await this.addEnhancedFoodData(mushFood.id, {
      ingredients: [
        { ingredient_type: 'primary', ingredient_name: 'Nauta', percentage: 35, order_index: 0 },
        { ingredient_type: 'primary', ingredient_name: 'Poro', percentage: 35, order_index: 1 },
        { ingredient_type: 'primary', ingredient_name: 'Lohi', percentage: 22, order_index: 2 },
        { ingredient_type: 'primary', ingredient_name: 'Kasvikset, hedelmät ja öljyt', percentage: 8, order_index: 3 },
        { ingredient_type: 'protein', ingredient_name: 'Naudanliha', order_index: 0 },
        { ingredient_type: 'protein', ingredient_name: 'Naudansydän', order_index: 1 },
        { ingredient_type: 'protein', ingredient_name: 'Naudanmaha', order_index: 2 },
        { ingredient_type: 'protein', ingredient_name: 'Naudanmaksa', order_index: 3 },
        { ingredient_type: 'protein', ingredient_name: 'Poronliha', order_index: 4 },
        { ingredient_type: 'protein', ingredient_name: 'Lohi ruotoineen', order_index: 5 },
        { ingredient_type: 'additive', ingredient_name: 'Naudan rusto', order_index: 0 },
        { ingredient_type: 'additive', ingredient_name: 'Poron luu', order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Poron keuhko', order_index: 2 },
        { ingredient_type: 'additive', ingredient_name: 'Poron rusto', order_index: 3 }
      ],
      allergens: [
        { allergen_type: 'free_from', allergen_name: 'Viljat' },
        { allergen_type: 'free_from', allergen_name: 'Lisäaineet' },
        { allergen_type: 'free_from', allergen_name: 'Säilöntäaineet' }
      ],
      nutrition: {
        protein_percentage: 14,
        fat_percentage: 12,
        fiber_percentage: 0.5,
        moisture_percentage: 70,
        grain_free: true,
        wheat_free: true,
        gluten_free: true,
        special_features: ['Raakaruoka (B.A.R.F.)', '100% luonnollinen', 'Viljaton', 'Lisäaineeton', 'Korkea kosteuspitoisuus', 'Monipuolinen proteiinilähde']
      },
      manufacturer_info: {
        country_of_origin: 'Suomi',
        website_url: 'https://mush.fi',
        feeding_guide_url: 'https://mush.fi/koiranruoka/penturuoka/'
      }
    })

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

    // Insert SMAAK with enhanced data and safety warning
    const smaakFood = await this.insertDogFoodWithGuidelines({
      product_code: 'SMAAK_PUPPY_RAW',
      name: 'SMAAK Raaka täysravinto (nauta-kalkkuna-kana)',
      manufacturer: 'SMAAK',
      food_type: 'Raaka',
      nutrition_type: 'Täysravinto',
      dosage_method: 'Nykyinen_Paino',
      notes: 'Soveltuu pennuille. Annos on laaja vaihteluväli. HUOM: Joitakin SMAAK-tuotteita on vedetty markkinoilta turvallisuussyistä (2023).'
    }, [
      { current_weight_kg: 5, daily_amount_min: 75, daily_amount_max: 150 },
      { current_weight_kg: 10, daily_amount_min: 150, daily_amount_max: 300 },
      { current_weight_kg: 15, daily_amount_min: 225, daily_amount_max: 450 },
      { current_weight_kg: 20, daily_amount_min: 300, daily_amount_max: 600 },
      { current_weight_kg: 25, daily_amount_min: 375, daily_amount_max: 750 }
    ])

    // Add enhanced data for SMAAK
    await this.addEnhancedFoodData(smaakFood.id, {
      ingredients: [
        { ingredient_type: 'primary', ingredient_name: 'Broilerinliha ja -luut', order_index: 0 },
        { ingredient_type: 'primary', ingredient_name: 'Broilerinmaksa', order_index: 1 },
        { ingredient_type: 'primary', ingredient_name: 'Jäävuorisalaatti', order_index: 2 },
        { ingredient_type: 'primary', ingredient_name: 'Kurkku', order_index: 3 },
        { ingredient_type: 'primary', ingredient_name: 'Panimohiiva', order_index: 4 },
        { ingredient_type: 'protein', ingredient_name: 'Broilerinliha', order_index: 0 },
        { ingredient_type: 'protein', ingredient_name: 'Broilerinmaksa', order_index: 1 },
        { ingredient_type: 'carb', ingredient_name: 'Jäävuorisalaatti', order_index: 0 },
        { ingredient_type: 'carb', ingredient_name: 'Kurkku', order_index: 1 },
        { ingredient_type: 'fat', ingredient_name: 'Kylmäpuristettu kasvisöljy', order_index: 0 },
        { ingredient_type: 'additive', ingredient_name: 'Pellavansiemenrouhe', order_index: 0 },
        { ingredient_type: 'additive', ingredient_name: 'Merilevä', order_index: 1 },
        { ingredient_type: 'additive', ingredient_name: 'Puolukka', order_index: 2 },
        { ingredient_type: 'additive', ingredient_name: 'Glukosamiini', order_index: 3 }
      ],
      allergens: [
        { allergen_type: 'free_from', allergen_name: 'Viljat' },
        { allergen_type: 'contains', allergen_name: 'Turvallisuusvaroitus' }
      ],
      nutrition: {
        protein_percentage: 15,
        fat_percentage: 10,
        fiber_percentage: 1,
        moisture_percentage: 68,
        grain_free: true,
        wheat_free: true,
        gluten_free: true,
        special_features: ['Raakaruoka', 'Tuore, pakastettu', 'Viljaton', 'Suomalaiset raaka-aineet (osittain)', 'VAROITUS: Turvallisuusongelmat 2023']
      },
      manufacturer_info: {
        country_of_origin: 'Suomi',
        website_url: 'https://smaak.fi',
        feeding_guide_url: 'https://smaak.fi/koiranruoka/'
      }
    })

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

  static async addEnhancedFoodData(foodId: string, data: {
    ingredients?: Array<Omit<FoodIngredient, 'id' | 'dog_food_id' | 'created_at'>>,
    allergens?: Array<Omit<FoodAllergen, 'id' | 'dog_food_id' | 'created_at'>>,
    nutrition?: Omit<FoodNutrition, 'id' | 'dog_food_id' | 'created_at'>,
    manufacturer_info?: Omit<FoodManufacturer, 'id' | 'dog_food_id' | 'created_at'>
  }): Promise<void> {
    // Insert ingredients
    if (data.ingredients && data.ingredients.length > 0) {
      const ingredientsWithFoodId = data.ingredients.map(ingredient => ({
        ...ingredient,
        dog_food_id: foodId
      }))
      
      const { error: ingredientsError } = await supabase
        .from('food_ingredients')
        .insert(ingredientsWithFoodId)
      
      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError)
      }
    }

    // Insert allergens
    if (data.allergens && data.allergens.length > 0) {
      const allergensWithFoodId = data.allergens.map(allergen => ({
        ...allergen,
        dog_food_id: foodId
      }))
      
      const { error: allergensError } = await supabase
        .from('food_allergens')
        .insert(allergensWithFoodId)
      
      if (allergensError) {
        console.error('Error inserting allergens:', allergensError)
      }
    }

    // Insert nutrition
    if (data.nutrition) {
      const { error: nutritionError } = await supabase
        .from('food_nutrition')
        .insert({
          ...data.nutrition,
          dog_food_id: foodId
        })
      
      if (nutritionError) {
        console.error('Error inserting nutrition:', nutritionError)
      }
    }

    // Insert manufacturer info
    if (data.manufacturer_info) {
      const { error: manufacturerError } = await supabase
        .from('food_manufacturers')
        .insert({
          ...data.manufacturer_info,
          dog_food_id: foodId
        })
      
      if (manufacturerError) {
        console.error('Error inserting manufacturer info:', manufacturerError)
      }
    }
  }

  // Update enhanced food data
  static async updateEnhancedFoodData(foodId: string, data: {
    ingredients?: Array<FoodIngredient>,
    allergens?: Array<FoodAllergen>,
    nutrition?: FoodNutrition,
    manufacturer_info?: FoodManufacturer
  }): Promise<void> {
    // Update/replace ingredients
    if (data.ingredients !== undefined) {
      // Delete existing ingredients
      await supabase.from('food_ingredients').delete().eq('dog_food_id', foodId)
      
      // Insert new ingredients
      if (data.ingredients.length > 0) {
        const ingredientsWithFoodId = data.ingredients.map((ingredient, index) => ({
          ingredient_type: ingredient.ingredient_type,
          ingredient_name: ingredient.ingredient_name,
          percentage: ingredient.percentage,
          order_index: index,
          dog_food_id: foodId
        }))
        
        const { error } = await supabase
          .from('food_ingredients')
          .insert(ingredientsWithFoodId)
        
        if (error) throw error
      }
    }

    // Update/replace allergens
    if (data.allergens !== undefined) {
      // Delete existing allergens
      await supabase.from('food_allergens').delete().eq('dog_food_id', foodId)
      
      // Insert new allergens
      if (data.allergens.length > 0) {
        const allergensWithFoodId = data.allergens.map(allergen => ({
          allergen_type: allergen.allergen_type,
          allergen_name: allergen.allergen_name,
          dog_food_id: foodId
        }))
        
        const { error } = await supabase
          .from('food_allergens')
          .insert(allergensWithFoodId)
        
        if (error) throw error
      }
    }

    // Update nutrition
    if (data.nutrition !== undefined) {
      // Check if nutrition exists
      const { data: existing } = await supabase
        .from('food_nutrition')
        .select('id')
        .eq('dog_food_id', foodId)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('food_nutrition')
          .update({
            protein_percentage: data.nutrition.protein_percentage,
            fat_percentage: data.nutrition.fat_percentage,
            fiber_percentage: data.nutrition.fiber_percentage,
            moisture_percentage: data.nutrition.moisture_percentage,
            grain_free: data.nutrition.grain_free,
            wheat_free: data.nutrition.wheat_free,
            gluten_free: data.nutrition.gluten_free,
            special_features: data.nutrition.special_features
          })
          .eq('dog_food_id', foodId)
        
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('food_nutrition')
          .insert({
            ...data.nutrition,
            dog_food_id: foodId
          })
        
        if (error) throw error
      }
    }

    // Update manufacturer info
    if (data.manufacturer_info !== undefined) {
      // Check if manufacturer info exists
      const { data: existing } = await supabase
        .from('food_manufacturers')
        .select('id')
        .eq('dog_food_id', foodId)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('food_manufacturers')
          .update({
            country_of_origin: data.manufacturer_info.country_of_origin,
            website_url: data.manufacturer_info.website_url,
            feeding_guide_url: data.manufacturer_info.feeding_guide_url
          })
          .eq('dog_food_id', foodId)
        
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('food_manufacturers')
          .insert({
            ...data.manufacturer_info,
            dog_food_id: foodId
          })
        
        if (error) throw error
      }
    }
  }

  // Delete ingredient
  static async deleteIngredient(ingredientId: string): Promise<void> {
    const { error } = await supabase
      .from('food_ingredients')
      .delete()
      .eq('id', ingredientId)
    
    if (error) throw error
  }

  // Delete allergen
  static async deleteAllergen(allergenId: string): Promise<void> {
    const { error } = await supabase
      .from('food_allergens')
      .delete()
      .eq('id', allergenId)
    
    if (error) throw error
  }
}
