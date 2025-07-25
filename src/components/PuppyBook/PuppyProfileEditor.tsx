import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, X, Calendar, Type, Image as ImageIcon, Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
    theme?: any;
  };
  onBookUpdated: (updatedData: Partial<{ title: string; birth_date: string; cover_image_url: string; theme: any }>) => void;
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
  const [selectedColor, setSelectedColor] = useState(book.theme?.bannerColor || 'orange');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const colorOptions = [
    { name: 'Oranssi', value: 'orange', class: 'bg-orange-500' },
    { name: 'Sininen', value: 'blue', class: 'bg-blue-500' },
    { name: 'Vihreä', value: 'green', class: 'bg-green-500' },
    { name: 'Pinkki', value: 'pink', class: 'bg-pink-500' },
    { name: 'Vaaleanpunainen', value: 'light-pink', class: 'bg-pink-200' },
    { name: 'Violetti', value: 'purple', class: 'bg-purple-500' },
    { name: 'Punainen', value: 'red', class: 'bg-red-500' }
  ];

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
      const currentTheme = book.theme || {};
      const updates = {
        title: puppyName.trim(),
        birth_date: birthDate || null,
        cover_image_url: profileImages[0] || null,
        theme: {
          ...currentTheme,
          bannerColor: selectedColor
        }
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
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[85vh] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gray-900 text-xl font-semibold">
            <Settings className="w-6 h-6 text-gray-700" />
            Muokkaa pennun tietoja
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[50vh] pr-2">
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div>
              <Label className="flex items-center gap-3 text-gray-900 font-semibold mb-4 text-base">
                <ImageIcon className="w-5 h-5 text-gray-700" />
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
              <Label htmlFor="puppy-name" className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-base">
                <Type className="w-5 h-5 text-gray-700" />
                Pennun nimi *
              </Label>
              <Input
                id="puppy-name"
                value={puppyName}
                onChange={(e) => setPuppyName(e.target.value)}
                placeholder="Syötä pennun nimi..."
                className="w-full py-3 px-4 text-gray-900 bg-white border-2 border-gray-300 focus:border-primary text-base"
              />
            </div>

            {/* Birth Date */}
            <div>
              <Label htmlFor="birth-date" className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-base">
                <Calendar className="w-5 h-5 text-gray-700" />
                Syntymäaika
              </Label>
              <Input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full py-3 px-4 text-gray-900 bg-white border-2 border-gray-300 focus:border-primary text-base"
              />
            </div>

            {/* Banner Color */}
            <div>
              <Label className="flex items-center gap-3 text-gray-900 font-semibold mb-4 text-base">
                <Palette className="w-5 h-5 text-gray-700" />
                Bannerin taustaväri
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedColor === color.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.class}`}></div>
                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="py-3 px-6 text-base font-medium"
          >
            <X className="w-5 h-5 mr-2" />
            Peruuta
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="py-3 px-6 text-base font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PuppyProfileEditor;