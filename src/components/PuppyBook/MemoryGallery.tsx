import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MessageCircle, Plus, Grid, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Memory {
  id: string;
  book_id: string;
  timeline_entry_id?: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  reactions?: MemoryReaction[];
  comments?: MemoryComment[];
}

interface MemoryReaction {
  id: string;
  memory_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

interface MemoryComment {
  id: string;
  memory_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

interface MemoryGalleryProps {
  bookId: string;
}

const MemoryGallery: React.FC<MemoryGalleryProps> = ({ bookId }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  useEffect(() => {
    loadMemories();
  }, [bookId]);

  const loadMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          reactions:memory_reactions(*),
          comments:memory_comments(*)
        `)
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading memories:', error);
        toast({
          title: "Virhe",
          description: "Muistojen lataaminen epäonnistui",
          variant: "destructive",
        });
        return;
      }

      setMemories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-sans font-bold text-gray-800 flex items-center gap-3">
            <Camera className="w-8 h-8 text-orange-500" />
            Muistogalleria 📸
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600">
          Tallenna pennun makeimmat hetket ja muistot
        </p>
      </motion.div>

      {memories.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Ei vielä muistoja
          </h3>
          <p className="text-gray-400 mb-4">
            Aloita pennun muistojen tallentaminen
          </p>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Lisää ensimmäinen muisto
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                viewMode === 'grid' ? 'aspect-square' : 'p-4'
              } bg-gray-100 hover:shadow-xl transition-shadow cursor-pointer`}
            >
              {memory.content_url ? (
                <div className={viewMode === 'grid' ? 'relative h-full' : 'flex gap-4'}>
                  <img
                    src={memory.content_url}
                    alt={memory.caption || 'Pennun muisto'}
                    className={`object-cover ${
                      viewMode === 'grid' ? 'w-full h-full' : 'w-20 h-20 rounded-lg'
                    }`}
                  />
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        {memory.caption && (
                          <p className="text-white text-sm font-medium truncate">
                            {memory.caption}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-white/80 text-xs">
                          <Heart className="w-3 h-3" />
                          <span>{memory.reactions?.length || 0}</span>
                          <MessageCircle className="w-3 h-3 ml-2" />
                          <span>{memory.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`bg-orange-100 flex items-center justify-center ${
                  viewMode === 'grid' ? 'h-full' : 'w-20 h-20 rounded-lg'
                }`}>
                  <Camera className="w-8 h-8 text-orange-500" />
                </div>
              )}
              
              {viewMode === 'list' && (
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {memory.caption || 'Nimetön muisto'}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {new Date(memory.created_at).toLocaleDateString('fi-FI')}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {memory.reactions?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {memory.comments?.length || 0}
                    </span>
                  </div>
                  {memory.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {memory.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGallery;