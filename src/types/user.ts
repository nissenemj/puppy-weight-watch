import type { User as SupabaseUser } from '@supabase/supabase-js';

// Re-export Supabase User type
export type User = SupabaseUser;

// User preferences and settings
export interface UserPreferences {
    language?: 'fi' | 'en';
    theme?: 'light' | 'dark' | 'auto';
    notifications?: {
        email?: boolean;
        push?: boolean;
    };
}

// User profile data
export interface UserProfile {
    id: string;
    email: string;
    created_at: string;
    preferences?: UserPreferences;
}
