import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, Trophy, Users, TrendingUp } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MemoryCard from './MemoryCard';

interface CommunityMemory {
  id: string;
  book_id: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_at: string;
  reactions?: Array<{ id: string; user_id: string; reaction_type: string }>;
  comments?: Array<{ id: string; memory_id: string; user_id: string; comment_text: string; created_at: string }>;
  puppy_profile?: {
    name: string;
    birthDate: string;
    profileImage?: string;
  };
  owner_score?: number;
}

interface UserStats {
  totalMemories: number;
  totalReactions: number;
  totalComments: number;
  score: number;
  level: number;
  rank: string;
}

const CommunityFeed: React.FC = () => {
  const [memories, setMemories] = useState<CommunityMemory[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'recent' | 'popular'>('trending');
  const { toast } = useToast();

  useEffect(() => {
    loadCommunityContent();
    loadUserStats();
  }, [activeFilter]);

  const loadCommunityContent = async () => {
    try {
      setLoading(true);
      
      // Load public memories with puppy profile data
      const { data: memoriesData, error } = await supabase
        .from('memories')
        .select(`
          *,
          puppy_books!inner(title, cover_image_url, privacy_settings),
          memory_reactions(id, user_id, reaction_type),
          memory_comments(id, user_id, comment_text, created_at)
        `)
        .eq('puppy_books.privacy_settings->visibility', 'public')
        .order(activeFilter === 'recent' ? 'created_at' : 'id', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Process and enrich the data
      const enrichedMemories = memoriesData?.map((memory: any) => ({
        ...memory,
        puppy_profile: {
          name: memory.puppy_books?.title?.replace('Pennun elämäntarina', '').replace('Pentukirja', '').trim() || 'Pentu',
          birthDate: new Date().toISOString().split('T')[0], // Default to today since birth_date is not available
          profileImage: memory.puppy_books?.cover_image_url
        },
        owner_score: (memory.memory_reactions?.length || 0) * 2 + (memory.memory_comments?.length || 0) * 3
      })) || [];

      // Sort by engagement if trending
      if (activeFilter === 'trending') {
        enrichedMemories.sort((a, b) => (b.owner_score || 0) - (a.owner_score || 0));
      } else if (activeFilter === 'popular') {
        enrichedMemories.sort((a, b) => (b.memory_reactions?.length || 0) - (a.memory_reactions?.length || 0));
      }

      setMemories(enrichedMemories);
    } catch (error) {
      console.error('Error loading community content:', error);
      toast({
        title: "Virhe",
        description: "Yhteisön sisällön lataaminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate user statistics
      const { data: userMemories } = await supabase
        .from('memories')
        .select('id, memory_reactions(id), memory_comments(id)')
        .eq('created_by', user.id);

      if (userMemories) {
        const totalMemories = userMemories.length;
        const totalReactions = userMemories.reduce((sum, memory) => sum + (memory.memory_reactions?.length || 0), 0);
        const totalComments = userMemories.reduce((sum, memory) => sum + (memory.memory_comments?.length || 0), 0);
        const score = totalMemories * 5 + totalReactions * 2 + totalComments * 3;
        const level = Math.floor(score / 100) + 1;
        
        let rank = 'Pentuamatööri';
        if (level >= 10) rank = 'Pentuexpertti';
        else if (level >= 5) rank = 'Pentuharrastaja';
        else if (level >= 3) rank = 'Pentukasvattaja';

        setUserStats({
          totalMemories,
          totalReactions,
          totalComments,
          score,
          level,
          rank
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleMemoryUpdated = () => {
    loadCommunityContent();
    loadUserStats();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Stats Card */}
      {userStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Sinun tilastosi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.totalMemories}</div>
                  <div className="text-xs opacity-90">Muistoja</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.totalReactions}</div>
                  <div className="text-xs opacity-90">Tykkäyksiä</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Taso {userStats.level}</div>
                  <div className="text-xs opacity-90">{userStats.rank}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.score}</div>
                  <div className="text-xs opacity-90">Pisteitä</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeFilter === 'trending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('trending')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Trendi
        </Button>
        <Button
          variant={activeFilter === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('recent')}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Uusin
        </Button>
        <Button
          variant={activeFilter === 'popular' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('popular')}
          className="flex items-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Suosituin
        </Button>
      </div>

      {/* Community Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-orange-500" />
          Pentuyhteisö
        </h1>
        <p className="text-gray-600">
          Jaa kokemuksia ja inspiroidu muiden pentukokemusten tarinoista!
        </p>
      </motion.div>

      {/* Memory Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <MemoryCard
                memory={memory}
                viewMode="grid"
                onMemoryUpdated={handleMemoryUpdated}
                puppyProfile={memory.puppy_profile}
              />
              
              {/* Engagement Badge */}
              {memory.owner_score && memory.owner_score > 10 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              )}
              
              {/* Puppy Name Overlay */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                {memory.puppy_profile?.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {memories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Ei vielä yhteisön sisältöä
          </h3>
          <p className="text-gray-500">
            Ole ensimmäinen jakamassa pennun muistoja yhteisön kanssa!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CommunityFeed;