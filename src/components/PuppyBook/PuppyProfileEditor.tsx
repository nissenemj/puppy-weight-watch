import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, X, Calendar, Type, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploader } from './ImageUploader';

interface PuppyProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    birth_date?: string;
    cover_image_url?: string;
  };
  onBookUpdated: (updatedData: Partial<{ title: string; birth_date: string; cover_image_url: string }>) => void;
}

const PuppyProfileEditor: React.FC<PuppyProfileEditorProps> = ({
  isOpen,
  onClose,
  book,
  onBookUpdated
}) => {
  const [puppyName, setPuppyName] = useState(book.title);
  const [birthDate, setBirthDate] = useState(book.birth_date || '');
  const [profileImages, setProfileImages] = useState<string[]>(
    book.cover_image_url ? [book.cover_image_url] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageAdded = (imageUrl: string) => {
    setProfileImages([imageUrl]); // Only one profile image allowed
  };

  const handleImageRemoved = (imageUrl: string) => {
    setProfileImages([]);
  };

  const handleSave = async () => {
    if (!puppyName.trim()) {
      toast({
        title: "Virhe",
        description: "Pennun nimi on pakollinen",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        title: puppyName.trim(),
        birth_date: birthDate || null,
        cover_image_url: profileImages[0] || null
      };

      const { error } = await supabase
        .from('puppy_books')
        .update(updates)
        .eq('id', book.id);

      if (error) throw error;

      onBookUpdated(updates);
      toast({
        title: "Tallennettu!",
        description: "Pennun tiedot päivitettiin onnistuneesti"
      });
      onClose();
    } catch (error) {
      console.error('Error updating puppy profile:', error);
      toast({
        title: "Virhe",
        description: "Tietojen tallentaminen epäonnistui",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Muokkaa pennun tietoja
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Image Section */}
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-3">
              <ImageIcon className="w-4 h-4" />
              Pennun kuva
            </Label>
            <ImageUploader
              onImageAdded={handleImageAdded}
              images={profileImages}
              onImageRemoved={handleImageRemoved}
            />
          </div>

          {/* Puppy Name */}
          <div>
            <Label htmlFor="puppy-name" className="flex items-center gap-2 text-sm font-medium mb-2">
              <Type className="w-4 h-4" />
              Pennun nimi *
            </Label>
            <Input
              id="puppy-name"
              value={puppyName}
              onChange={(e) => setPuppyName(e.target.value)}
              placeholder="Syötä pennun nimi..."
              className="w-full"
            />
          </div>

          {/* Birth Date */}
          <div>
            <Label htmlFor="birth-date" className="flex items-center gap-2 text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />
              Syntymäaika
            </Label>
            <Input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            Peruuta
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PuppyProfileEditor;