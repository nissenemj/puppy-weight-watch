import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin, Heart, AlertTriangle } from '@/utils/iconImports';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';

interface SocializationItem {
  id: string;
  name: string;
  description: string;
  tips: string[];
}

interface AddExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  item: SocializationItem;
  onSuccess: () => void;
}

export const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({
  open,
  onOpenChange,
  bookId,
  item,
  onSuccess
}) => {
  const [experienceDate, setExperienceDate] = useState<Date>(new Date());
  const [experienceTime, setExperienceTime] = useState('');
  const [puppyReaction, setPuppyReaction] = useState<'relaxed' | 'hesitant' | 'fearful'>('relaxed');
  const [distanceMeters, setDistanceMeters] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [treatsGiven, setTreatsGiven] = useState(false);
  const [restAfter, setRestAfter] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const getReactionColor = (reaction: string) => {
    switch (reaction) {
      case 'relaxed': return 'text-green-600 bg-green-50';
      case 'hesitant': return 'text-yellow-600 bg-yellow-50';
      case 'fearful': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case 'relaxed': return '😊';
      case 'hesitant': return '😐';
      case 'fearful': return '😰';
      default: return '❓';
    }
  };

  const getReactionLabel = (reaction: string) => {
    switch (reaction) {
      case 'relaxed': return 'Rento ja utelias';
      case 'hesitant': return 'Epäröivä, mutta rohkea';
      case 'fearful': return 'Pelokas tai stressaantunut';
      default: return 'Tuntematon';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('socialization_experiences')
        .insert({
          book_id: bookId,
          item_id: item.id,
          experience_date: format(experienceDate, 'yyyy-MM-dd'),
          experience_time: experienceTime || null,
          puppy_reaction: puppyReaction,
          distance_meters: distanceMeters ? parseFloat(distanceMeters) : null,
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
          notes: notes || null,
          treats_given: treatsGiven,
          rest_after: restAfter,
        });

      if (error) throw error;

      toast({
        title: 'Kokemus tallennettu!',
        description: `${item.name} -kokemus on lisätty pentukirjaan`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast({
        title: 'Virhe',
        description: 'Kokemuksen tallentaminen epäonnistui',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getNextStepSuggestion = () => {
    switch (puppyReaction) {
      case 'relaxed':
        return '🎉 Mahtavaa! Voit kokeilla lähempää tai pidempään seuraavalla kerralla.';
      case 'hesitant':
        return '👍 Hyvä alku! Toista samalla etäisyydellä muutaman kerran ennen lähestymistä.';
      case 'fearful':
        return '⚠️ Seuraavalla kerralla kokeile kauempaa, lyhyempään tai rauhallisemmassa ympäristössä.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lisää kokemus: {item.name}</DialogTitle>
          <DialogDescription>
            Tallenna pennun kokemus ja tunnereaktio sosiaalistamiskohteesta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Päivämäärä</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(experienceDate, 'dd.MM.yyyy', { locale: fi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={experienceDate}
                    onSelect={(date) => date && setExperienceDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Kellonaika (valinnainen)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={experienceTime}
                  onChange={(e) => setExperienceTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Puppy Reaction */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pennun reaktio</Label>
            <RadioGroup value={puppyReaction} onValueChange={(value: any) => setPuppyReaction(value)}>
              {['relaxed', 'hesitant', 'fearful'].map((reaction) => (
                <motion.div
                  key={reaction}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                    puppyReaction === reaction ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={reaction} id={reaction} />
                  <Label htmlFor={reaction} className="flex items-center gap-3 cursor-pointer flex-1">
                    <span className="text-2xl">{getReactionIcon(reaction)}</span>
                    <div>
                      <div className="font-medium">{getReactionLabel(reaction)}</div>
                      <div className="text-sm text-muted-foreground">
                        {reaction === 'relaxed' && 'Pentu oli kiinnostunut ja rohkea'}
                        {reaction === 'hesitant' && 'Pentu oli varovainen mutta ei pelokas'}
                        {reaction === 'fearful' && 'Pentu osoitti pelkoa tai stressiä'}
                      </div>
                    </div>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
            
            {puppyReaction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${getReactionColor(puppyReaction)}`}
              >
                <p className="text-sm font-medium">{getNextStepSuggestion()}</p>
              </motion.div>
            )}
          </div>

          {/* Distance and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Etäisyys (metriä)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="esim. 5"
                  value={distanceMeters}
                  onChange={(e) => setDistanceMeters(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kesto (minuuttia)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="esim. 10"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Muistiinpanot</Label>
            <Textarea
              placeholder="Kerro kokemuksesta tarkemmin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="treats"
                checked={treatsGiven}
                onCheckedChange={(checked) => setTreatsGiven(checked as boolean)}
              />
              <Label htmlFor="treats">Annoin herkkuja palkinnoksi</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rest"
                checked={restAfter}
                onCheckedChange={(checked) => setRestAfter(checked as boolean)}
              />
              <Label htmlFor="rest">Pentu sai levätä kokemuksen jälkeen</Label>
            </div>
          </div>

          {/* Tips Reminder */}
          {item.tips && item.tips.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Muista vinkit:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {item.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Peruuta
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Tallennetaan...' : 'Tallenna kokemus'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};