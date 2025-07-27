import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Star, Type, MapPin, Clock } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AddTimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  onEntryAdded: () => void;
}

const AddTimelineDialog: React.FC<AddTimelineDialogProps> = ({
  isOpen,
  onClose,
  bookId,
  onEntryAdded,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState('general');
  const [isHighlight, setIsHighlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const entryTypes = [
    { value: 'general', label: 'Yleinen merkintä', icon: Type },
    { value: 'milestone', label: 'Virstanpylväs', icon: Star },
    { value: 'health', label: 'Terveys', icon: Calendar },
    { value: 'training', label: 'Koulutus', icon: Clock },
    { value: 'social', label: 'Sosiaalistaminen', icon: MapPin },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Virhe",
        description: "Anna merkinnälle otsikko",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('timeline_entries')
        .insert({
          book_id: bookId,
          title: title.trim(),
          description: description.trim() || null,
          entry_date: entryDate,
          entry_type: entryType,
          is_highlight: isHighlight,
          created_by: user.user?.id || null,
          metadata: { type: entryType }
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Onnistui!",
        description: "Merkintä lisätty aikajanalle",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setEntryDate(new Date().toISOString().split('T')[0]);
      setEntryType('general');
      setIsHighlight(false);
      
      onEntryAdded();
      onClose();
    } catch (error) {
      console.error('Error adding timeline entry:', error);
      toast({
        title: "Virhe",
        description: "Merkinnän lisääminen epäonnistui",
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
                <Calendar className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Lisää aikajanan merkintä</h2>
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
                <Label htmlFor="title">Otsikko *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="esim. Ensimmäinen kävelylenkki"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Kuvaus</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kerro lisää tästä hetkestä..."
                  className="resize-none mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="entryDate">Päivämäärä</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Merkinnän tyyppi</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {entryTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          entryType === type.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="entryType"
                          value={type.value}
                          checked={entryType === type.value}
                          onChange={(e) => setEntryType(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHighlight"
                  checked={isHighlight}
                  onCheckedChange={(checked) => setIsHighlight(checked === true)}
                />
                <Label htmlFor="isHighlight" className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Merkitse tärkeäksi hetkeksi
                </Label>
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

export default AddTimelineDialog;