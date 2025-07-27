import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star, Info } from '@/utils/iconImports';
import { PuppyAgeInfo } from '@/utils/puppyAge';

interface WeeklyTask {
  id: string;
  item_id: string;
  week_number: number;
  priority: number;
  description: string;
  item: {
    name: string;
    description: string;
    why_important: string;
    difficulty_level: number;
    duration_minutes: number;
    tips: string[];
  };
}

interface WeeklyTasksProps {
  bookId: string;
  puppyAge: PuppyAgeInfo | null;
  onTaskSelect?: (itemId: string) => void;
}

export const WeeklyTasks: React.FC<WeeklyTasksProps> = ({
  bookId,
  puppyAge,
  onTaskSelect
}) => {
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (puppyAge) {
      loadWeeklyTasks();
    }
  }, [bookId, puppyAge]);

  const loadWeeklyTasks = async () => {
    if (!puppyAge) return;

    try {
      setLoading(true);

      // Get tasks for current week and adjacent weeks for better context
      const weekRange = [
        Math.max(1, puppyAge.weeks - 1),
        puppyAge.weeks,
        puppyAge.weeks + 1
      ];

      const { data: tasks, error } = await supabase
        .from('socialization_weekly_tasks')
        .select(`
          *,
          item:socialization_items(
            name,
            description,
            why_important,
            difficulty_level,
            duration_minutes,
            tips
          )
        `)
        .in('week_number', weekRange)
        .order('priority')
        .limit(6);

      if (error) throw error;

      setWeeklyTasks(tasks || []);
    } catch (error) {
      console.error('Error loading weekly tasks:', error);
      toast({
        title: 'Virhe',
        description: 'Viikkotehtävien lataaminen epäonnistui',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Helppo';
      case 2: return 'Kohtalainen';
      case 3: return 'Haastava';
      case 4: return 'Vaikea';
      case 5: return 'Erittäin vaikea';
      default: return 'Tuntematon';
    }
  };

  const getWeekLabel = (weekNumber: number) => {
    if (!puppyAge) return '';
    
    if (weekNumber < puppyAge.weeks) return 'Edellinen viikko';
    if (weekNumber === puppyAge.weeks) return 'Tämä viikko';
    return 'Seuraava viikko';
  };

  const getAgeAppropriateMessage = () => {
    if (!puppyAge) return '';

    if (puppyAge.weeks <= 8) {
      return 'Keskity perustuen rakentamiseen ja turvallisiin kokemuksiin';
    } else if (puppyAge.weeks <= 12) {
      return 'Laajenna kokemusmaailmaa hallitusti';
    } else if (puppyAge.weeks <= 16) {
      return 'Kriittisen ikkunan loppuvaihe - hyödynnä se!';
    } else {
      return 'Jatka ylläpitoa ja syventävää sosiaalistamista';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Viikkotehtävät
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeekTasks = weeklyTasks.filter(t => t.week_number === puppyAge?.weeks);
  const upcomingTasks = weeklyTasks.filter(t => t.week_number === (puppyAge?.weeks || 0) + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Viikkotehtävät ({puppyAge?.weeks || 0}. viikko)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getAgeAppropriateMessage()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Week Tasks */}
        {currentWeekTasks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">Tämän viikon suositukset</h4>
            {currentWeekTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <h5 className="font-medium">{task.item.name}</h5>
                    <Badge 
                      variant="outline"
                      className={`text-white ${getDifficultyColor(task.item.difficulty_level)}`}
                    >
                      {getDifficultyLabel(task.item.difficulty_level)}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Prioriteetti {task.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description || task.item.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>⏱️ {task.item.duration_minutes} min</span>
                  {task.item.why_important && (
                    <span className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {task.item.why_important.slice(0, 50)}...
                    </span>
                  )}
                </div>
                
                {onTaskSelect && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => onTaskSelect(task.item_id)}
                  >
                    Aloita harjoitus
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Upcoming Tasks Preview */}
        {upcomingTasks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-muted-foreground">Ensi viikon ennakko</h4>
            {upcomingTasks.slice(0, 2).map((task, index) => (
              <div
                key={task.id}
                className="border rounded-lg p-3 bg-muted/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{task.item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {getDifficultyLabel(task.item.difficulty_level)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {task.description || task.item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Fallback for missing data */}
        {currentWeekTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2">Ei viikkotehtäviä saatavilla</p>
            <p className="text-sm">
              Käy kategorioita läpi ja valitse ikään sopivia harjoituksia
            </p>
          </div>
        )}

        {/* Critical Window Reminder */}
        {puppyAge && puppyAge.weeks <= 16 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-800">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">
                Kriittinen ikkuna auki vielä {16 - puppyAge.weeks} viikkoa!
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Hyödynnä tämä aika maksimaalisen sosiaalistamishyödyn saamiseksi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};