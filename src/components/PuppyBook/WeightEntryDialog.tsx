import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Calendar } from '@/utils/iconImports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useAddWeightEntry } from '@/hooks/useWeightEntries';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface WeightEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  dogId: string;
  onSuccess?: () => void;
}

const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  isOpen,
  onClose,
  userId,
  dogId,
  onSuccess
}) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const addWeightEntry = useAddWeightEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight.trim()) {
      toast({
        title: "Virhe",
        description: "Anna painotiedot",
        variant: "destructive",
      });
      return;
    }

    const weightNum = parseFloat(weight.replace(',', '.'));
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Virhe", 
        description: "Anna kelvollinen paino",
        variant: "destructive",
      });
      return;
    }

    try {
      await addWeightEntry.mutateAsync({
        weight: weightNum,
        date: format(date, 'yyyy-MM-dd'),
        userId,
        dogId,
        previousWeights: [] // Will be fetched by the hook
      });
      
      setWeight('');
      setDate(new Date());
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding weight:', error);
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
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Lisää paino</h2>
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
                <Label htmlFor="weight">Paino (kg) *</Label>
                <Input
                  id="weight"
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="esim. 2.5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Päivämäärä *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {format(date, "dd.MM.yyyy", { locale: fi })}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border shadow-lg">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto bg-white dark:bg-gray-800"
                    />
                  </PopoverContent>
                </Popover>
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
                  disabled={addWeightEntry.isPending}
                  className="flex-1"
                >
                  {addWeightEntry.isPending ? 'Tallennetaan...' : 'Tallenna'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeightEntryDialog;