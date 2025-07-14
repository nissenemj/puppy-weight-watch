import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddMilestoneDialog from './AddMilestoneDialog';

interface Milestone {
  id: string;
  book_id: string;
  title: string;
  description?: string;
  target_age_weeks?: number;
  completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
}

interface MilestonesProps {
  bookId: string;
}

const Milestones: React.FC<MilestonesProps> = ({ bookId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMilestones();
  }, [bookId]);

  const loadMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('book_id', bookId)
        .order('display_order');

      if (error) {
        console.error('Error loading milestones:', error);
        toast({
          title: "Virhe",
          description: "Virstanpylväiden lataaminen epäonnistui",
          variant: "destructive",
        });
        return;
      }

      setMilestones(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('puppy_milestones')
        .update({
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq('id', milestoneId);

      if (error) {
        console.error('Error updating milestone:', error);
        toast({
          title: "Virhe",
          description: "Virstanpylvään päivittäminen epäonnistui",
          variant: "destructive",
        });
        return;
      }

      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: !completed, completed_at: !completed ? new Date().toISOString() : null }
          : milestone
      ));

      toast({
        title: !completed ? "Hienoa! 🎉" : "Merkitty tekemättömäksi",
        description: !completed ? "Virstanpylväs saavutettu!" : "Virstanpylväs merkitty keskeneräiseksi",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-sans font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Award className="w-8 h-8 text-orange-500" />
              Virstanpylväät 🏆
            </h2>
            <p className="text-gray-600">
              Seuraa pennun kehitystä ja juhli saavutuksia
            </p>
          </div>
          {milestones.length > 0 && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Lisää virstanpylväs
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        {milestones.length > 0 && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Edistyminen</span>
              <span className="text-sm font-bold text-orange-600">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl p-4 border-2 transition-all ${
              milestone.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleMilestone(milestone.id, milestone.completed)}
                className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  milestone.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-orange-500'
                }`}
              >
                {milestone.completed && <Check className="w-5 h-5" />}
              </button>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  milestone.completed ? 'text-green-800 line-through' : 'text-gray-800'
                }`}>
                  {milestone.title}
                </h4>
                {milestone.description && (
                  <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  {milestone.target_age_weeks && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Tavoite: {milestone.target_age_weeks} viikkoa
                    </span>
                  )}
                  {milestone.completed && milestone.completed_at && (
                    <span className="text-green-600 font-medium">
                      ✅ Saavutettu {new Date(milestone.completed_at).toLocaleDateString('fi-FI')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {milestones.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              Ei vielä virstanpylväitä
            </h3>
            <p className="text-gray-400 mb-4">
              Lisää ensimmäinen virstanpylväs pennulle
            </p>
            <button 
              onClick={() => setShowAddDialog(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Lisää virstanpylväs
            </button>
          </div>
        )}
      </div>

      <AddMilestoneDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        bookId={bookId}
        onMilestoneAdded={loadMilestones}
      />
    </div>
  );
};

export default Milestones;