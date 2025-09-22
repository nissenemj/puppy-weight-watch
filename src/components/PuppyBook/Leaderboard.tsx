import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Medal, Crown, TrendingUp, Users, Camera, BookOpen, Heart, Target, MessageCircle } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserStats {
  user_id: string;
  username: string;
  total_memories: number;
  total_reactions: number;
  total_comments: number;
  milestones_completed: number;
  score: number;
  level: number;
  rank: number;
  avatar_url?: string;
  puppy_name?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  points: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_memory',
    title: 'Ensimmäinen muisto',
    description: 'Lisää ensimmäinen muisto pentukirjaan',
    icon: 'camera',
    condition: (stats) => stats.total_memories >= 1,
    points: 10
  },
  {
    id: 'memory_collector',
    title: 'Muistojen kerääjä',
    description: 'Lisää 10 muistoa',
    icon: 'book',
    condition: (stats) => stats.total_memories >= 10,
    points: 50
  },
  {
    id: 'social_butterfly',
    title: 'Sosiaalinen perhonen',
    description: 'Saa 25 reaktiota',
    icon: 'heart',
    condition: (stats) => stats.total_reactions >= 25,
    points: 30
  },
  {
    id: 'milestone_master',
    title: 'Virstanpylväsmestari',
    description: 'Saavuta 15 virstanpylvästä',
    icon: 'target',
    condition: (stats) => stats.milestones_completed >= 15,
    points: 75
  },
  {
    id: 'top_scorer',
    title: 'Pistekunkku',
    description: 'Saavuta 500 pistettä',
    icon: 'star',
    condition: (stats) => stats.score >= 500,
    points: 100
  }
];

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');

  useEffect(() => {
    loadLeaderboard();
    loadUserStats();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // This would need to be implemented with proper database views
      // For now, create mock data for demonstration
      const mockLeaderboard: UserStats[] = [
        {
          user_id: '1',
          username: 'PentuFani2024',
          total_memories: 45,
          total_reactions: 234,
          total_comments: 89,
          milestones_completed: 18,
          score: 890,
          level: 5,
          rank: 1,
          puppy_name: 'Max',
          avatar_url: ''
        },
        {
          user_id: '2',
          username: 'KoiraRakkaus',
          total_memories: 38,
          total_reactions: 198,
          total_comments: 76,
          milestones_completed: 15,
          score: 756,
          level: 4,
          rank: 2,
          puppy_name: 'Luna',
          avatar_url: ''
        },
        {
          user_id: '3',
          username: 'PuppyParent',
          total_memories: 32,
          total_reactions: 167,
          total_comments: 54,
          milestones_completed: 12,
          score: 623,
          level: 4,
          rank: 3,
          puppy_name: 'Bella',
          avatar_url: ''
        }
      ];
      
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate user stats from database
      const { data: books } = await supabase
        .from('puppy_books')
        .select('id')
        .eq('owner_id', user.id);

      if (!books || books.length === 0) return;

      const bookId = books[0].id;

      // Get memories count
      const { count: memoriesCount } = await supabase
        .from('memories')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId);

      // Get reactions count
      const { count: reactionsCount } = await supabase
        .from('memory_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('memory_comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get milestones count
      const { count: milestonesCount } = await supabase
        .from('puppy_milestones')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId)
        .eq('completed', true);

      const score = (memoriesCount || 0) * 5 + 
                   (reactionsCount || 0) * 2 + 
                   (commentsCount || 0) * 3 + 
                   (milestonesCount || 0) * 10;

      const level = Math.floor(score / 100) + 1;

      const stats: UserStats = {
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Käyttäjä',
        total_memories: memoriesCount || 0,
        total_reactions: reactionsCount || 0,
        total_comments: commentsCount || 0,
        milestones_completed: milestonesCount || 0,
        score,
        level,
        rank: 0 // Will be calculated when comparing with others
      };

      setUserStats(stats);
      
      // Calculate achieved achievements
      const earnedAchievements = ACHIEVEMENTS.filter(achievement => 
        achievement.condition(stats)
      );
      setAchievements(earnedAchievements);

    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-purple-600 bg-purple-100';
    if (level >= 3) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getAchievementIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      camera: <Camera className="w-6 h-6 text-blue-500" />,
      book: <BookOpen className="w-6 h-6 text-green-500" />,
      heart: <Heart className="w-6 h-6 text-red-500" />,
      target: <Target className="w-6 h-6 text-orange-500" />,
      messageCircle: <MessageCircle className="w-6 h-6 text-purple-500" />,
      star: <Star className="w-6 h-6 text-yellow-500" />
    };
    return iconMap[iconName] || <Star className="w-6 h-6 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Tulostaulukko
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Saavutukset
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tilastot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Pentukirjojen TOP 10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                        <span className="font-bold text-lg">#{user.rank}</span>
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-sm text-gray-600">
                          {user.puppy_name && `${user.puppy_name} • `}
                          <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(user.level)}`}>
                            Taso {user.level}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg text-chart-milestone">{user.score}</div>
                      <div className="text-sm text-gray-600">pistettä</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Saavutukset ({achievements.length}/{ACHIEVEMENTS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {ACHIEVEMENTS.map((achievement) => {
                  const isEarned = achievements.some(a => a.id === achievement.id);
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isEarned 
                          ? 'border-yellow-300 bg-yellow-50' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getAchievementIcon(achievement.icon)}
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2">
                            {achievement.title}
                            {isEarned && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Saavutettu</Badge>}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <div className="text-xs text-chart-milestone font-medium mt-2">
                            +{achievement.points} pistettä
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {userStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Omat tilastot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-chart-growth/10 rounded-xl">
                    <div className="text-2xl font-bold text-chart-growth">{userStats.total_memories}</div>
                    <div className="text-sm text-gray-600">Muistoja</div>
                  </div>
                  <div className="text-center p-4 bg-chart-energy/10 rounded-xl">
                    <div className="text-2xl font-bold text-chart-energy">{userStats.milestones_completed}</div>
                    <div className="text-sm text-gray-600">Virstanpylvästä</div>
                  </div>
                  <div className="text-center p-4 bg-chart-health/10 rounded-xl">
                    <div className="text-2xl font-bold text-chart-health">{userStats.total_reactions}</div>
                    <div className="text-sm text-gray-600">Reaktioita</div>
                  </div>
                  <div className="text-center p-4 bg-chart-milestone/10 rounded-xl">
                    <div className="text-2xl font-bold text-chart-milestone">{userStats.score}</div>
                    <div className="text-sm text-gray-600">Pistettä</div>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 p-4 bg-gradient-primary/10 rounded-xl text-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl font-bold text-primary mb-2">Taso {userStats.level}</div>
                  <div className="text-sm text-gray-600">
                    {Math.max(0, (userStats.level * 100) - userStats.score)} pistettä seuraavaan tasoon
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <motion.div 
                      className="bg-gradient-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.score % 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;