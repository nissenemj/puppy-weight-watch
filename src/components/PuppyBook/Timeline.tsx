import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimelineEntry {
  id: string;
  book_id: string;
  entry_type: string;
  title: string;
  description?: string;
  entry_date: string;
  metadata: any;
  is_highlight: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

interface TimelineProps {
  bookId: string;
}

const Timeline: React.FC<TimelineProps> = ({ bookId }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimelineEntries();
  }, [bookId]);

  const loadTimelineEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_entries')
        .select('*')
        .eq('book_id', bookId)
        .order('entry_date', { ascending: false });

      if (error) {
        console.error('Error loading timeline:', error);
        toast({
          title: "Virhe",
          description: "Aikajanan lataaminen epäonnistui",
          variant: "destructive",
        });
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
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
        <h2 className="text-3xl font-sans font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-500" />
          Pennun aikajana 📚
        </h2>
        <p className="text-gray-600">
          Tallenna pennun tärkeimmät hetket ja muistot
        </p>
      </motion.div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              Ei vielä merkintöjä
            </h3>
            <p className="text-gray-400 mb-4">
              Aloita pennun tarinan tallentaminen
            </p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              Lisää ensimmäinen merkintä
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-orange-50 rounded-xl p-4 border border-orange-100"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    {entry.is_highlight ? (
                      <Star className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                  {entry.description && (
                    <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.entry_date).toLocaleDateString('fi-FI')}
                    </span>
                    <span className="capitalize">{entry.entry_type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;