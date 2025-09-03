import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Clock, Type } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddMilestoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  onMilestoneAdded: () => void;
}

const AddMilestoneDialog: React.FC<AddMilestoneDialogProps> = ({
  isOpen,
  onClose,
  bookId,
  onMilestoneAdded,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAgeWeeks, setTargetAgeWeeks] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const milestonePresets = [
    'Ensimmäinen rokotus',
    'Toinen rokotus',
    'Kolmas rokotus',
    'Peruskomennot (istu, maahan, tule)',
    'Hihnakävely',
    'Sosiaalistaminen muiden koirien kanssa',
    'Ensimmäinen vierailu eläinlääkärillä',
    'Ensimmäinen kylpy',
    'Ensimmäinen automatka',
    'Ensimmäinen ulkoilu',
    'Ruokarutiinin opettelu',
    'Häkkikoulutus',
    'Kissan tapaaminen',
    'Lapsen tapaaminen',
    'Portaiden nousu/lasku'
  ];

  const handlePresetClick = (preset: string) => {
    setTitle(preset);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Virhe",
        description: "Anna virstanpylväälle otsikko",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get the current highest display_order
      const { data: existingMilestones } = await supabase
        .from('puppy_milestones')
        .select('display_order')
        .eq('book_id', bookId)
        .order('display_order', { ascending: false })
        .limit(1);

      const nextDisplayOrder = existingMilestones && existingMilestones.length > 0 
        ? (existingMilestones[0]?.display_order || 0) + 1 
        : 1;

      const { error } = await supabase
        .from('puppy_milestones')
        .insert({
          book_id: bookId,
          title: title.trim(),
          description: description.trim() || null,
          target_age_weeks: targetAgeWeeks ? parseInt(targetAgeWeeks) : null,
          completed: false,
          display_order: nextDisplayOrder
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Onnistui!",
        description: "Virstanpylväs lisätty",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setTargetAgeWeeks('');
      
      onMilestoneAdded();
      onClose();
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: "Virhe",
        description: "Virstanpylvään lisääminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Lisää virstanpylväs</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Virstanpylvään nimi *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="esim. Ensimmäinen rokotus"
                  className="mt-1"
                />
                
                {/* Preset buttons */}
                <div className="mt-3">
                  <Label className="text-sm text-gray-600">Valitse valmis virstanpylväs:</Label>
                  <div className="grid grid-cols-1 gap-1 mt-2 max-h-32 overflow-y-auto">
                    {milestonePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className="text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Kuvaus</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kerro lisää tästä virstanpylväästä..."
                  className="resize-none mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="targetAgeWeeks" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tavoiteikä (viikkoina)
                </Label>
                <Input
                  id="targetAgeWeeks"
                  type="number"
                  min="1"
                  max="52"
                  value={targetAgeWeeks}
                  onChange={(e) => setTargetAgeWeeks(e.target.value)}
                  placeholder="esim. 8"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valinnainen: millä iällä tämä virstanpylväs tulisi saavuttaa
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Peruuta
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Tallennetaan...' : 'Tallenna'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMilestoneDialog;