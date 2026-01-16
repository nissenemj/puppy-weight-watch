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

// Puppy Book types
export interface PuppyBook {
  id: string;
  puppy_id?: string;
  owner_id: string;
  title: string;
  birth_date?: string;
  cover_image_url?: string;
  theme?: Record<string, unknown>;
  privacy_settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  book_id: string;
  entry_type: string;
  title: string;
  description?: string;
  entry_date: string;
  metadata?: Record<string, unknown>;
  is_highlight: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface Memory {
  id: string;
  book_id: string;
  timeline_entry_id?: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: Record<string, unknown>;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  reactions?: MemoryReaction[];
  comments?: MemoryComment[];
}

export interface MemoryReaction {
  id: string;
  memory_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface MemoryComment {
  id: string;
  memory_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  book_id: string;
  title: string;
  description?: string;
  target_age_weeks?: number;
  completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
}
