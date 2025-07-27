import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Trash2, Upload, Palette, Shield, Calendar } from '@/utils/iconImports';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PuppyBookData {
  id: string;
  title: string;
  birth_date?: string;
  cover_image_url?: string;
  theme: any;
  privacy_settings: any;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  book: PuppyBookData;
  onBookUpdated: (updatedBook: PuppyBookData) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  book, 
  onBookUpdated 
}) => {
  const [title, setTitle] = useState(book.title);
  const [birthDate, setBirthDate] = useState(book.birth_date || '');
  const [colorScheme, setColorScheme] = useState(book.theme?.colorScheme || 'warm');
  const [isPrivate, setIsPrivate] = useState(book.privacy_settings?.visibility === 'private');
  const [allowComments, setAllowComments] = useState(book.privacy_settings?.allowComments !== false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const colorSchemes = [
    { id: 'warm', name: 'Lämmin', colors: 'from-orange-200 to-pink-200' },
    { id: 'cool', name: 'Viileä', colors: 'from-blue-200 to-purple-200' },
    { id: 'nature', name: 'Luonto', colors: 'from-green-200 to-emerald-200' },
    { id: 'sunset', name: 'Auringonlasku', colors: 'from-yellow-200 to-red-200' },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedBook = {
        ...book,
        title,
        birth_date: birthDate,
        theme: {
          ...book.theme,
          colorScheme
        },
        privacy_settings: {
          visibility: isPrivate ? 'private' : 'public',
          allowComments
        }
      };

      const { error } = await supabase
        .from('puppy_books')
        .update({
          title,
          birth_date: birthDate,
          theme: updatedBook.theme,
          privacy_settings: updatedBook.privacy_settings
        })
        .eq('id', book.id);

      if (error) {
        throw error;
      }

      onBookUpdated({
        ...book,
        title,
        birth_date: birthDate,
        theme: updatedBook.theme,
        privacy_settings: updatedBook.privacy_settings
      });
      toast({
        title: "Tallennettu! ✅",
        description: "Pentukirjan asetukset päivitetty onnistuneesti",
      });
      onClose();
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: "Virhe",
        description: "Asetusten tallentaminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    try {
      const { error } = await supabase
        .from('puppy_books')
        .delete()
        .eq('id', book.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Poistettu",
        description: "Pentukirja on poistettu onnistuneesti",
      });
      
      // Reload the page to go back to create book prompt
      window.location.reload();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Virhe",
        description: "Pentukirjan poistaminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Pentukirjan asetukset
          </DialogTitle>
          <DialogDescription>
            Muokkaa pentukirjan tietoja ja asetuksia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Perustiedot
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Kirjan nimi</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Esim. Rexin elämäntarina"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Pennun syntymäpäivä</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Theme */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Teema
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {colorSchemes.map((scheme) => (
                <motion.button
                  key={scheme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setColorScheme(scheme.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${colorScheme === scheme.id 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className={`w-full h-8 rounded bg-gradient-to-r ${scheme.colors} mb-2`} />
                  <p className="text-sm font-medium">{scheme.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Privacy */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Yksityisyys
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yksityinen kirja</Label>
                  <p className="text-xs text-muted-foreground">
                    Vain sinä voit nähdä tämän kirjan
                  </p>
                </div>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salli kommentit</Label>
                  <p className="text-xs text-muted-foreground">
                    Muut voivat kommentoida muistoja
                  </p>
                </div>
                <Switch
                  checked={allowComments}
                  onCheckedChange={setAllowComments}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Poista kirja
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Oletko varma?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tämä toiminto poistaa pentukirjan pysyvästi. Kaikki muistot, 
                    virstanpylväät ja tiedot menetetään. Toimintoa ei voi peruuttaa.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Peruuta</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteBook}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Poista pysyvästi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Peruuta
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Tallennetaan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tallenna
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;