// Dog food and feeding related types

export interface DogFood {
    id: string;
    name: string;
    manufacturer: string;
    food_type: string;
    nutrition_type: string;
    dosage_method: string;
    product_code: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface FeedingGuideline {
    id: string;
    dog_food_id: string;
    adult_weight_kg?: number;
    age_months?: string;
    current_weight_kg?: number;
    daily_amount_min?: number;
    daily_amount_max?: number;
    size_category?: string;
    calculation_formula?: string;
    created_at?: string;
    updated_at?: string;
}

export interface FeedingResult {
    dailyAmount: number;
    mealsPerDay: number;
    gramsPerMeal: number;
    energyKcal: number;
    usedGuidelines: FeedingGuideline[];
    selectedFood: DogFood | null;
    activityMultiplier: number;
}

export const ACTIVITY_MULTIPLIERS = {
    'hyvin-matala': 0.9,
    'normaali': 1.0,
    'aktiivinen': 1.1,
    'hyvin-aktiivinen': 1.2
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIERS;
