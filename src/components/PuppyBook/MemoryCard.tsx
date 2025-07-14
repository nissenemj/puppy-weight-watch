import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Calendar, MoreVertical, Edit2, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SocialShareGenerator } from './SocialShareGenerator';

interface Memory {
  id: string;
  book_id: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_at: string;
  reactions?: Array<{ id: string; user_id: string; reaction_type: string }>;
  comments?: Array<{ id: string; user_id: string; comment_text: string; created_at: string }>;
}

interface MemoryCardProps {
  memory: Memory;
  viewMode: 'grid' | 'list';
  onMemoryUpdated: () => void;
  puppyProfile?: {
    name: string;
    birthDate: string;
    profileImage?: string;
  };
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, viewMode, onMemoryUpdated, puppyProfile }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();

  const handleReaction = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      if (isLiked) {
        // Remove reaction
        const { error } = await supabase
          .from('memory_reactions')
          .delete()
          .eq('memory_id', memory.id)
          .eq('user_id', user.user.id);

        if (error) throw error;
        setIsLiked(false);
      } else {
        // Add reaction
        const { error } = await supabase
          .from('memory_reactions')
          .insert({
            memory_id: memory.id,
            user_id: user.user.id,
            reaction_type: 'heart'
          });

        if (error) throw error;
        setIsLiked(true);
      }
      
      onMemoryUpdated();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Virhe",
        description: "Reaktion lisääminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Haluatko varmasti poistaa tämän muiston?')) return;

    try {
      // Delete associated file from storage if exists
      if (memory.content_url) {
        const url = new URL(memory.content_url);
        const filePath = url.pathname.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('puppy-books')
            .remove([`${memory.book_id}/${filePath}`]);
        }
      }

      // Delete memory from database
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memory.id);

      if (error) throw error;

      toast({
        title: "Poistettu",
        description: "Muisto poistettu onnistuneesti",
      });

      onMemoryUpdated();
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: "Virhe",
        description: "Muiston poistaminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        viewMode === 'grid' ? 'aspect-square' : 'p-4'
      } bg-white hover:shadow-xl transition-shadow cursor-pointer relative group`}
    >
      {/* Content */}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                {memory.caption && (
                  <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {memory.caption}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/80 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction();
                      }}
                      className={`flex items-center gap-1 hover:text-pink-300 transition-colors ${
                        isLiked ? 'text-pink-300' : ''
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{memory.reactions?.length || 0}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{memory.comments?.length || 0}</span>
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`bg-orange-100 flex items-center justify-center ${
          viewMode === 'grid' ? 'h-full' : 'w-20 h-20 rounded-lg'
        }`}>
          <div className="text-center">
            <Heart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            {viewMode === 'grid' && memory.caption && (
              <p className="text-orange-700 text-sm px-4">{memory.caption}</p>
            )}
          </div>
        </div>
      )}
      
      {/* List view content */}
      {viewMode === 'list' && (
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-800 line-clamp-1">
              {memory.caption || 'Nimetön muisto'}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <Calendar className="w-3 h-3" />
            <span>{new Date(memory.created_at).toLocaleDateString('fi-FI')}</span>
            {memory.location?.name && (
              <>
                <MapPin className="w-3 h-3 ml-2" />
                <span>{memory.location.name}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReaction();
              }}
              className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${
                isLiked ? 'text-pink-500' : ''
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              {memory.reactions?.length || 0}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {memory.comments?.length || 0}
            </span>
          </div>
          
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {memory.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
              {memory.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{memory.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Menu dropdown */}
      {showMenu && (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg border z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              setShowShareDialog(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
          >
            <Share2 className="w-4 h-4" />
            Jaa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              // TODO: Implement edit functionality
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
          >
            <Edit2 className="w-4 h-4" />
            Muokkaa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              handleDelete();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <Trash2 className="w-4 h-4" />
            Poista
          </button>
        </div>
      )}

      {/* Social Share Dialog */}
      {puppyProfile && (
        <SocialShareGenerator
          memory={memory}
          puppyProfile={puppyProfile}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </motion.div>
  );
};

export default MemoryCard;