import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddFriendDialogProps {
  children: React.ReactNode;
  bookId: string;
  friendType: 'dog' | 'human';
  onFriendAdded: () => void;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  children,
  bookId,
  friendType,
  onFriendAdded
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [description, setDescription] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          book_id: bookId,
          name: name.trim(),
          friend_type: friendType,
          breed: friendType === 'dog' ? breed.trim() || null : null,
          description: description.trim() || null,
          meeting_location: meetingLocation.trim() || null,
          activities: activities.length > 0 ? activities : null,
        });

      if (error) throw error;

      toast({
        title: "Ystävä lisätty!",
        description: `${friendType === 'dog' ? 'Koiraystävä' : 'Ihmisystävä'} ${name} on lisätty ystävärekisteriin.`,
      });

      // Reset form
      setName('');
      setBreed('');
      setDescription('');
      setMeetingLocation('');
      setActivities([]);
      setNewActivity('');
      setOpen(false);
      onFriendAdded();
    } catch (error) {
      toast({
        title: "Virhe",
        description: "Ystävän lisääminen epäonnistui. Yritä uudelleen.",
        variant: "destructive",
      });
      console.error('Error adding friend:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Lisää {friendType === 'dog' ? 'koiraystävä' : 'ihmisystävä'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nimi *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={friendType === 'dog' ? 'Koiran nimi' : 'Henkilön nimi'}
              required
            />
          </div>

          {friendType === 'dog' && (
            <div>
              <Label htmlFor="breed">Rotu</Label>
              <Input
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Esim. Kultainennoutaja"
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Kuvaus</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                friendType === 'dog' 
                  ? 'Kerro koirasta (luonne, ulkonäkö, jne.)'
                  : 'Kerro henkilöstä (suhde, erityispiirteet, jne.)'
              }
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="meeting-location">Tapaamispaikka</Label>
            <Input
              id="meeting-location"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="Missä tavattiin ensimmäisen kerran?"
            />
          </div>

          <div>
            <Label>Aktiviteetit yhdessä</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Lisää aktiviteetti"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddActivity}
                disabled={!newActivity.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {activities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activities.map((activity) => (
                  <Badge key={activity} variant="secondary" className="text-xs">
                    {activity}
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(activity)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Peruuta
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Lisätään...' : 'Lisää ystävä'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;