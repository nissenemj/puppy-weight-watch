import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, Grid, List } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MemoryCard from './MemoryCard';

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
  onRefresh?: React.MutableRefObject<(() => void) | null>;
  onAddMemory?: () => void;
  puppyProfile?: {
    name: string;
    birthDate: string;
    profileImage?: string;
  };
}

const MemoryGallery: React.FC<MemoryGalleryProps> = ({ bookId, onRefresh, onAddMemory, puppyProfile }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  useEffect(() => {
    loadMemories();
  }, [bookId]);

  // Refresh memories when requested
  const refreshMemories = () => {
    console.log('MemoryGallery: Refreshing memories for bookId:', bookId);
    loadMemories();
  };

  React.useEffect(() => {
    if (onRefresh) {
      onRefresh.current = refreshMemories;
    }
  }, [onRefresh]);

  const loadMemories = async () => {
    try {
      console.log('MemoryGallery: Loading memories for bookId:', bookId);
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

      console.log('MemoryGallery: Loaded memories:', data?.length || 0, 'items');
      setMemories((data as any) || []);
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
            Muistogalleria
          </h2>
          <div className="flex items-center gap-2">
            {memories.length > 0 && onAddMemory && (
              <button
                onClick={onAddMemory}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mr-2"
              >
                <Plus className="w-4 h-4" />
                Lisää muisto
              </button>
            )}
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
          <button 
            onClick={onAddMemory || (() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
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
            >
              <MemoryCard
                memory={memory}
                viewMode={viewMode}
                onMemoryUpdated={refreshMemories}
                puppyProfile={puppyProfile}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGallery;