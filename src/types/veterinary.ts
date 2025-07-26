export type SizeClass = 'toy_small' | 'medium' | 'large_giant';

export interface CentilePoint {
  age_weeks: number;
  p3: number;
  p10: number;
  p50: number;
  p90: number;
  p97: number;
}

export interface VaccinationTemplate {
  id: string;
  name: string;
  type: 'core' | 'non_core';
  description?: string;
  manufacturer?: string;
  recommended_age_weeks?: number[];
}

export interface DewormingTemplate {
  name: string;
  active_ingredient: string;
  dose_calculation: string;
  notes?: string;
}

export const VACCINATION_TEMPLATES: Record<string, VaccinationTemplate> = {
  dhpp_first: {
    id: 'dhpp_first',
    name: 'DHPP - Ensimmäinen',
    type: 'core',
    description: 'Core-rokote: Koiraruttu, Hepatiitti, Parvovirus, Parainfluenza',
    recommended_age_weeks: [8, 12, 16]
  },
  dhpp_booster: {
    id: 'dhpp_booster',
    name: 'DHPP - Tehoste',
    type: 'core',
    description: 'Vuositehoste tai valmisteen mukaan',
  },
  rabies: {
    id: 'rabies',
    name: 'Rabies (Raivotauti)',
    type: 'core',
    description: 'Yleensä ≥16 viikkoa, valmisteen mukaan',
    recommended_age_weeks: [16]
  },
  kennel_cough: {
    id: 'kennel_cough',
    name: 'Kennelyskä',
    type: 'non_core',
    description: 'Riskiperusteinen, sosiaalisten koirien suositus',
    recommended_age_weeks: [12]
  }
};

export const DEWORMING_TEMPLATES: Record<string, DewormingTemplate> = {
  pyrantel: {
    name: 'Pyranteeli',
    active_ingredient: 'Pyrantel pamoaatti',
    dose_calculation: '5-10 mg/kg',
    notes: '2 vk välein 10-12 vk asti, sitten tarpeen mukaan'
  },
  fenbendazole: {
    name: 'Fenbendatsoli',
    active_ingredient: 'Fenbendazole',
    dose_calculation: '50 mg/kg 3 päivää',
    notes: 'Laajakirjoinen, myös Giardia'
  },
  milbemycin: {
    name: 'Milbemysiini',
    active_ingredient: 'Milbemycin oxime',
    dose_calculation: '0.5-2 mg/kg',
    notes: 'Reseptivalmiste, sydänmatojen ehkäisy'
  }
};