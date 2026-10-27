import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, Send, Heart, MoreVertical, Trash2 } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fi } from 'date-fns/locale';

interface Comment {
  id: string;
  memory_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at?: string;
}

interface CommentSectionProps {
  memoryId: string;
  initialComments?: Comment[];
  onCommentAdded?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  memoryId, 
  initialComments = [], 
  onCommentAdded 
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isExpanded) {
      loadComments();
    }
  }, [isExpanded, memoryId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('memory_comments')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments((data as any) || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Kirjautuminen vaaditaan",
          description: "Kirjaudu sisään kommentoidaksesi",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('memory_comments')
        .insert({
          memory_id: memoryId,
          user_id: user.id,
          comment_text: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setComments([...comments, data as any]);
      setNewComment('');
      onCommentAdded?.();
      
      toast({
        title: "Kommentti lisätty! 💬",
        description: "Kommenttisi on nyt näkyvissä muille",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Virhe",
        description: "Kommentin lisääminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Haluatko varmasti poistaa kommentin?')) return;

    try {
      const { error } = await supabase
        .from('memory_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== commentId));
      setShowMenu(null);
      
      toast({
        title: "Poistettu",
        description: "Kommentti poistettu onnistuneesti",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Virhe",
        description: "Kommentin poistaminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  const canDeleteComment = async (comment: Comment) => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id === comment.user_id;
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="text-gray-500 hover:text-gray-700 p-2"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {comments.length > 0 ? `${comments.length} kommenttia` : 'Kommentoi'}
      </Button>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="border-t border-gray-100 pt-3 mt-3"
    >
      {/* Comments List */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: 20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="flex gap-3 relative"
            >
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarFallback className="text-xs bg-[#edf3ef] text-[#245246]">
                  {comment.user_id.slice(-2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg pl-3 pr-14 py-2 min-h-12 relative">
                  <p className="text-sm text-gray-800 break-words">{comment.comment_text}</p>
                  
                  <button
                    type="button"
                    aria-label="Kommentin valinnat"
                    aria-expanded={showMenu === comment.id}
                    onClick={() => setShowMenu(showMenu === comment.id ? null : comment.id)}
                    className="absolute top-1 right-1 min-h-11 min-w-11 text-gray-600 hover:text-gray-800 p-1"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>
                  
                  {showMenu === comment.id && (
                    <div className="absolute top-6 right-1 bg-white rounded-lg shadow-lg border z-10 py-1">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="w-3 h-3" />
                        Poista
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.created_at), { 
                    addSuffix: true, 
                    locale: fi 
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Comment Form */}
      <div className="flex gap-2">
        <Input
          aria-label="Kirjoita kommentti"
          name="comment"
          autoComplete="off"
          placeholder="Kirjoita kommentti…"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          className="flex-1 text-sm"
          disabled={loading}
        />
        <Button
          type="button"
          aria-label={loading ? "Lähetetään kommenttia" : "Lähetä kommentti"}
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
          size="sm"
          className="journal-button px-3 min-h-11 min-w-11"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(false)}
        className="text-gray-600 hover:text-gray-800 mt-2 text-sm min-h-11"
      >
        Sulje kommentit
      </Button>
    </motion.div>
  );
};

export default CommentSection;
