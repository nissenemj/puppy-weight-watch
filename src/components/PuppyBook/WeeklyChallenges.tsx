import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Star,
  Trophy,
  Users,
  Gift,
  Camera,
  Heart,
  PawPrint
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays } from 'date-fns';
import { fi } from 'date-fns/locale';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'memory' | 'social' | 'milestone' | 'health' | 'community';
  target: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: string;
  endDate: string;
  progress?: number;
  completed?: boolean;
  participantCount?: number;
}

const WEEKLY_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'endDate'>[] = [
  {
    title: '📸 Viikon valokuvaaja',
    description: 'Ota 5 kuvaa pennustasi eri tilanteissa',
    icon: '📸',
    category: 'memory',
    target: 5,
    points: 30,
    difficulty: 'easy'
  },
  {
    title: '❤️ Sydämien saaja',
    description: 'Saa 10 reaktiota muistoihisi',
    icon: '❤️',
    category: 'social',
    target: 10,
    points: 40,
    difficulty: 'medium'
  },
  {
    title: '🎯 Virstanpylväsmetsästäjä',
    description: 'Saavuta 3 uutta virstanpylvästä',
    icon: '🎯',
    category: 'milestone',
    target: 3,
    points: 60,
    difficulty: 'hard'
  },
  {
    title: '🏥 Terveysvalvoja',
    description: 'Tallenna 2 terveystietoa',
    icon: '🏥',
    category: 'health',
    target: 2,
    points: 25,
    difficulty: 'easy'
  },
  {
    title: '💬 Yhteisön tuki',
    description: 'Kommentoi 8 muiden muistoa',
    icon: '💬',
    category: 'community',
    target: 8,
    points: 35,
    difficulty: 'medium'
  },
  {
    title: '🌟 Jokapäiväinen dokumentoija',
    description: 'Lisää muisto joka päivä viikon ajan',
    icon: '🌟',
    category: 'memory',
    target: 7,
    points: 80,
    difficulty: 'hard'
  }
];

const WeeklyChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    generateWeeklyChallenges();
    loadUserProgress();
  }, []);

  const generateWeeklyChallenges = () => {
    const currentDate = new Date();
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    // Select 4 random challenges for this week
    const shuffled = [...WEEKLY_CHALLENGES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    const weeklyChallenge = selected.map((challenge, index) => ({
      ...challenge,
      id: `week-${format(weekStart, 'yyyy-MM-dd')}-${index}`,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      participantCount: Math.floor(Math.random() * 50) + 10 // Mock participant count
    }));

    setChallenges(weeklyChallenge);
  };

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentDate = new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

      // Get user's puppy book
      const { data: books } = await supabase
        .from('puppy_books')
        .select('id')
        .eq('owner_id', user.id);

      if (!books || books.length === 0) return;

      const bookId = books[0].id;

      // Calculate progress for each challenge type
      const progress: {[key: string]: number} = {};

      // Memory challenges - count memories this week
      const { count: memoriesCount } = await supabase
        .from('memories')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      // Social challenges - count reactions this week
      const { count: reactionsCount } = await supabase
        .from('memory_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      // Milestone challenges - count completed milestones this week
      const { count: milestonesCount } = await supabase
        .from('puppy_milestones')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId)
        .eq('completed', true)
        .gte('completed_at', weekStart.toISOString())
        .lte('completed_at', weekEnd.toISOString());

      // Health challenges - count health records this week
      const { count: healthCount } = await supabase
        .from('health_records')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      // Community challenges - count comments this week
      const { count: commentsCount } = await supabase
        .from('memory_comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      // Map progress to challenge categories
      challenges.forEach((challenge) => {
        switch (challenge.category) {
          case 'memory':
            progress[challenge.id] = memoriesCount || 0;
            break;
          case 'social':
            progress[challenge.id] = reactionsCount || 0;
            break;
          case 'milestone':
            progress[challenge.id] = milestonesCount || 0;
            break;
          case 'health':
            progress[challenge.id] = healthCount || 0;
            break;
          case 'community':
            progress[challenge.id] = commentsCount || 0;
            break;
        }
      });

      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return <Camera className="w-4 h-4" />;
      case 'social': return <Heart className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'health': return <PawPrint className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const categories = ['all', 'memory', 'social', 'milestone', 'health', 'community'];
  const categoryLabels = {
    all: 'Kaikki',
    memory: 'Muistot',
    social: 'Sosiaalinen',
    milestone: 'Virstanpylväät',
    health: 'Terveys',
    community: 'Yhteisö'
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const daysRemaining = Math.ceil((endOfWeek(new Date(), { weekStartsOn: 1 }).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Viikon haasteet
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {daysRemaining} päivää jäljellä
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            {format(currentWeekStart, 'dd.MM.yyyy', { locale: fi })} - {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy', { locale: fi })}
          </p>
        </CardHeader>
        <CardContent>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-1"
              >
                {category !== 'all' && getCategoryIcon(category)}
                {categoryLabels[category as keyof typeof categoryLabels]}
              </Button>
            ))}
          </div>

          {/* Challenges grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {filteredChallenges.map((challenge, index) => {
                const progress = userProgress[challenge.id] || 0;
                const progressPercentage = Math.min((progress / challenge.target) * 100, 100);
                const isCompleted = progress >= challenge.target;

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isCompleted 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-chart-milestone/50'
                    }`}
                  >
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{challenge.icon}</div>
                        <div>
                          <h3 className="font-semibold text-sm">{challenge.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty === 'easy' && 'Helppo'}
                              {challenge.difficulty === 'medium' && 'Keskitaso'}
                              {challenge.difficulty === 'hard' && 'Vaikea'}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {challenge.points}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Edistyminen</span>
                        <span className="font-medium">
                          {progress}/{challenge.target}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {challenge.participantCount} osallistujaa
                      </div>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(challenge.category)}
                        {categoryLabels[challenge.category as keyof typeof categoryLabels]}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ei haasteita valitussa kategoriassa</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyChallenges;