export interface Dog {
  id: string;
  name: string;
  breed?: string | null;
  weight_kg?: number | null;
  age_years?: number | null;
  activity_level?: string | null;
  health_conditions?: string[] | null;
  user_id: string;
  created_at: string;
}

export interface DogWithDetails extends Dog {
  birth_date?: string | null;
  gender?: 'male' | 'female' | null;
  target_weight_kg?: number | null;
}
