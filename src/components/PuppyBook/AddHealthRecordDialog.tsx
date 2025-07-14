import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddHealthRecordDialogProps {
  bookId: string;
  onHealthRecordAdded: () => void;
  children: React.ReactNode;
}

export const AddHealthRecordDialog: React.FC<AddHealthRecordDialogProps> = ({
  bookId,
  onHealthRecordAdded,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !type || !description.trim()) {
      toast({
        title: "Virhe",
        description: "Täytä kaikki pakolliset kentät",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('health_records')
        .insert({
          book_id: bookId,
          entry_date: format(date, 'yyyy-MM-dd'),
          type,
          description: description.trim(),
          notes: notes.trim() || null,
          veterinarian: veterinarian.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Onnistui!",
        description: "Terveysmerkintä lisätty",
      });

      setOpen(false);
      setDate(new Date());
      setType('');
      setDescription('');
      setNotes('');
      setVeterinarian('');
      onHealthRecordAdded();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Virhe",
        description: "Terveysmerkinnän lisääminen epäonnistui",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lisää terveysmerkintä</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Päivämäärä *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd.MM.yyyy') : 'Valitse päivämäärä'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tyyppi *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse tyyppi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Rokotus</SelectItem>
                <SelectItem value="deworming">Madotus</SelectItem>
                <SelectItem value="checkup">Tarkastus</SelectItem>
                <SelectItem value="other">Muu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Kuvaus *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Esim. DHPP-rokotus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian">Eläinlääkäri</Label>
            <Input
              id="veterinarian"
              value={veterinarian}
              onChange={(e) => setVeterinarian(e.target.value)}
              placeholder="Esim. Dr. Virtanen"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Lisätiedot</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mahdolliset sivuvaikutukset, erityishuomiot..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Peruuta
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Lisätään...' : 'Lisää'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};