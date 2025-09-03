import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  book_id: string;
  category_id: string;
  name: string;
  description: string;
  earned_at: string;
  created_at: string;
}

interface SocializationProgress {
  id: string;
  category_id: string;
  positive_experiences: number;
  negative_experiences: number;
  stamp_earned: boolean;
  achievements: string[];
}

export const useSocializationAchievements = (bookId: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (bookId) {
      loadAchievements();
    }
  }, [bookId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('socialization_achievements')
        .select('*')
        .eq('book_id', bookId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      
      setAchievements((data || []) as any);
    } catch (error) {
      console.error('Error loading achievements:', error);
      toast({
        title: 'Virhe',
        description: 'Saavutusten lataaminen epäonnistui',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async (progress: SocializationProgress[]) => {
    try {
      // Get current achievements to avoid duplicates
      const existingAchievements = new Set(achievements.map(a => a.category_id));
      
      for (const categoryProgress of progress) {
        // Check if category should earn a stamp (3+ positive experiences)
        if (categoryProgress.positive_experiences >= 3 && 
            !categoryProgress.stamp_earned && 
            !existingAchievements.has(categoryProgress.category_id)) {
          
          // Get category name for achievement
          const { data: category } = await supabase
            .from('socialization_categories')
            .select('name')
            .eq('id', categoryProgress.category_id)
            .single();

          if (category) {
            // Create achievement
            const { error } = await supabase
              .from('socialization_achievements')
              .insert({
                book_id: bookId,
                category_id: categoryProgress.category_id,
                name: `Kategoria suoritettu: ${category.name}`,
                description: `Ansaittu keräämällä vähintään 3 positiivista kokemusta kategoriasta ${category.name}`
              });

            if (!error) {
              // Show achievement notification
              toast({
                title: '🏆 Uusi saavutus!',
                description: `Ansaitsit leiman kategoriasta: ${category.name}`,
              });
              
              // Reload achievements
              loadAchievements();
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const getAchievementsByCategory = (categoryId: string) => {
    return achievements.filter(a => a.category_id === categoryId);
  };

  const getTotalAchievements = () => {
    return achievements.length;
  };

  const getRecentAchievements = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return achievements.filter(a => new Date(a.earned_at) >= cutoffDate);
  };

  return {
    achievements,
    loading,
    loadAchievements,
    checkForNewAchievements,
    getAchievementsByCategory,
    getTotalAchievements,
    getRecentAchievements
  };
};