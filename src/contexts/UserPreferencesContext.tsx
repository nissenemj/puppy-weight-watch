import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  // Display preferences
  theme: 'light' | 'dark' | 'auto';
  language: 'fi' | 'en';
  
  // Weight tracking preferences
  weightUnit: 'kg' | 'lbs';
  defaultWeightReminder: boolean;
  reminderTime: string; // HH:mm format
  
  // Calculator preferences
  defaultFoodType: string;
  favoriteBreeds: string[];
  
  // Dashboard preferences
  dashboardLayout: 'compact' | 'detailed';
  showQuickActions: boolean;
  favoriteFeatures: string[];
  
  // Notification preferences
  enableNotifications: boolean;
  growthMilestoneNotifications: boolean;
  feedingReminders: boolean;
  
  // Data preferences
  exportFormat: 'json' | 'csv' | 'pdf';
  autoBackup: boolean;
  
  // Accessibility preferences
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'fi',
  weightUnit: 'kg',
  defaultWeightReminder: true,
  reminderTime: '18:00',
  defaultFoodType: '',
  favoriteBreeds: [],
  dashboardLayout: 'detailed',
  showQuickActions: true,
  favoriteFeatures: ['weight-tracker', 'calculator'],
  enableNotifications: true,
  growthMilestoneNotifications: true,
  feedingReminders: true,
  exportFormat: 'json',
  autoBackup: true,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium'
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: ReactNode;
  user?: User | null;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({
  children,
  user
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from localStorage and database
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, load from localStorage (immediate)
        const localPrefs = localStorage.getItem('userPreferences');
        if (localPrefs) {
          const parsedPrefs = JSON.parse(localPrefs);
          setPreferences({ ...defaultPreferences, ...parsedPrefs });
        }

        // If user is logged in, load from database
        if (user) {
          const { data, error: dbError } = await supabase
        .from('dogs' as any)
            .select('preferences')
            .eq('user_id', user.id)
            .single();

          if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw dbError;
          }

          if (data && (data as any)?.preferences) {
            const dbPrefs = { ...defaultPreferences, ...(data as any).preferences };
            setPreferences(dbPrefs);
            // Sync to localStorage
            localStorage.setItem('userPreferences', JSON.stringify(dbPrefs));
          }
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Asetusten lataaminen epäonnistui');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Apply system preferences
  useEffect(() => {
    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.setProperty(
      '--base-font-size',
      fontSizeMap[preferences.fontSize]
    );

    // Apply high contrast
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply theme
    const applyTheme = () => {
      let theme = preferences.theme;
      if (theme === 'auto') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    applyTheme();
    
    // Listen for system theme changes if auto theme is selected
    if (preferences.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [preferences]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    // Save to localStorage immediately
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));

    // Save to database if user is logged in
    if (user) {
      try {
        const { error: dbError } = await supabase
        .from('dogs' as any)
        .upsert({
            user_id: user.id,
            preferences: newPreferences
          });

        if (dbError) {
          throw dbError;
        }
      } catch (err) {
        console.error('Failed to save preferences to database:', err);
        // Don't throw error here - local storage update succeeded
      }
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');

    if (user) {
      try {
        const { error: dbError } = await supabase
        .from('dogs' as any)
        .delete()
          .eq('user_id', user.id);

        if (dbError) {
          throw dbError;
        }
      } catch (err) {
        console.error('Failed to reset preferences in database:', err);
      }
    }
  };

  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
    loading,
    error
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export default UserPreferencesProvider;