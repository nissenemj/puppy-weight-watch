export interface PuppyFoodData {
  id: string
  name: string
  brand: string
  type: 'kuiva' | 'märkä' | 'raaka'
  nutritionType: 'täysravinto' | 'täydennysravinto'
  dosageBase: 'odotettu_aikuispaino_ja_ikä' | 'nykyinen_paino' | 'prosentti_nykyisestä_painosta' | 'kokoluokka' | 'ei_tietoa'
  adultWeight?: number
  ageMonths?: string
  dailyAmount?: number
  formula?: string
  minAmount?: number
  maxAmount?: number
  notes?: string
}

export const puppyFoodDatabase: PuppyFoodData[] = [
  // Brit Care Puppy Lamb & Rice - tarkat yhdistelmät
  { id: 'BC_PUPPY_LAMB_5_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '1-3', dailyAmount: 50, notes: 'Sopii tiineille ja imettäville' },
  { id: 'BC_PUPPY_LAMB_5_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '3-4', dailyAmount: 75 },
  { id: 'BC_PUPPY_LAMB_5_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '4-6', dailyAmount: 75 },
  { id: 'BC_PUPPY_LAMB_5_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '6-12', dailyAmount: 70 },
  { id: 'BC_PUPPY_LAMB_10_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '1-3', dailyAmount: 85 },
  { id: 'BC_PUPPY_LAMB_10_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '3-4', dailyAmount: 120 },
  { id: 'BC_PUPPY_LAMB_10_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '4-6', dailyAmount: 130 },
  { id: 'BC_PUPPY_LAMB_10_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '6-12', dailyAmount: 120 },
  { id: 'BC_PUPPY_LAMB_15_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '1-3', dailyAmount: 115 },
  { id: 'BC_PUPPY_LAMB_15_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '3-4', dailyAmount: 160 },
  { id: 'BC_PUPPY_LAMB_15_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '4-6', dailyAmount: 175 },
  { id: 'BC_PUPPY_LAMB_15_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '6-12', dailyAmount: 170 },
  { id: 'BC_PUPPY_LAMB_20_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '1-3', dailyAmount: 140 },
  { id: 'BC_PUPPY_LAMB_20_3-4', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '3-4', dailyAmount: 180 },
  { id: 'BC_PUPPY_LAMB_20_4-6', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '4-6', dailyAmount: 220 },
  { id: 'BC_PUPPY_LAMB_20_6-12', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '6-12', dailyAmount: 210 },
  { id: 'BC_PUPPY_LAMB_25_1-3', name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', brand: 'Brit', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 25, ageMonths: '1-3', dailyAmount: 150, notes: '>25kg koirille Junior Large Breed' },
  
  // Hau-Hau Champion
  { id: 'HHC_PUPPY_5_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '1-2', dailyAmount: 70, notes: 'Sopii myös emolle' },
  { id: 'HHC_PUPPY_5_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '3-4', dailyAmount: 90 },
  { id: 'HHC_PUPPY_5_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '5-6', dailyAmount: 90 },
  { id: 'HHC_PUPPY_5_7-12', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 5, ageMonths: '7-12', dailyAmount: 80 },
  { id: 'HHC_PUPPY_10_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '1-2', dailyAmount: 100 },
  { id: 'HHC_PUPPY_10_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '3-4', dailyAmount: 140 },
  { id: 'HHC_PUPPY_10_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 10, ageMonths: '5-6', dailyAmount: 140 },
  { id: 'HHC_PUPPY_15_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '1-2', dailyAmount: 130 },
  { id: 'HHC_PUPPY_15_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '3-4', dailyAmount: 170 },
  { id: 'HHC_PUPPY_15_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 15, ageMonths: '5-6', dailyAmount: 190 },
  { id: 'HHC_PUPPY_20_1-2', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '1-2', dailyAmount: 160 },
  { id: 'HHC_PUPPY_20_3-4', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '3-4', dailyAmount: 200 },
  { id: 'HHC_PUPPY_20_5-6', name: 'Hau-Hau Champion Pentu & Emo', brand: 'Hau-Hau Champion', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'odotettu_aikuispaino_ja_ikä', adultWeight: 20, ageMonths: '5-6', dailyAmount: 230 },
  
  // MUSH Raakaruoat
  { id: 'MUSH_PUPPY', name: 'MUSH Vaisto Puppy (nauta-poro-lohi)', brand: 'MUSH', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino', formula: 'complex' },
  
  // SMAAK
  { id: 'SMAAK_PUPPY', name: 'SMAAK Raaka täysravinto', brand: 'SMAAK', type: 'raaka', nutritionType: 'täysravinto', dosageBase: 'nykyinen_paino' },
  
  // Muut ruoat
  { id: 'RC_MINI_PUPPY', name: 'Royal Canin Mini Puppy', brand: 'Royal Canin', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'ei_tietoa' },
  { id: 'ACANA_PUPPY', name: 'Acana Puppy & Junior', brand: 'Acana', type: 'kuiva', nutritionType: 'täysravinto', dosageBase: 'ei_tietoa' },
  { id: 'BP_WET_BEEF', name: 'Brit Premium by Nature Beef with Tripe', brand: 'Brit', type: 'märkä', nutritionType: 'täysravinto', dosageBase: 'kokoluokka' },
]

// Pre-computed data for better performance
export const uniqueFoodProducts = puppyFoodDatabase.reduce<PuppyFoodData[]>((acc, food) => {
  if (!acc.some(item => item.name === food.name)) {
    const representativeFood = puppyFoodDatabase.find(f => f.name === food.name)!
    acc.push(representativeFood)
  }
  return acc
}, [])

export const foodsByBrand = uniqueFoodProducts.reduce<Record<string, PuppyFoodData[]>>((acc, food) => {
  if (!acc[food.brand]) {
    acc[food.brand] = []
  }
  acc[food.brand].push(food)
  return acc
}, {})