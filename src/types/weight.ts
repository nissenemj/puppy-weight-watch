// Weight tracking and growth related types

export interface WeightEntry {
    id: string;
    dog_id: string;
    weight: number;
    date: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
}

export interface GrowthPrediction {
    predictions: GrowthPredictionPoint[];
    predictedAdultWeight: number;
    currentWeeklyGrowthRate: number;
    growthPhase: 'rapid' | 'steady' | 'slowing' | 'mature';
    r2: number;
    confidenceLevel: 'high' | 'medium' | 'low';
}

export interface GrowthPredictionPoint {
    date: string;
    weight: number;
    isPrediction: boolean;
    ageWeeks: number;
}

export interface BreedCategory {
    category: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
    expectedAdultWeight: {
        min: number;
        max: number;
    };
}

export interface ChartDataPoint {
    date: string;
    timestamp: number;
    dateFormatted: string;
    actualWeight: number;
    avgGrowthLine: number;
    milestone?: string;
    upperBound?: number;
    lowerBound?: number;
}
