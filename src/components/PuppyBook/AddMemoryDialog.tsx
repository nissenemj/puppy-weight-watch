import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, MapPin, Tag, Type, Image, Heart, Calendar, Award } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddMemoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  type: 'photo' | 'text' | 'event' | 'milestone';
  onMemoryAdded: () => void;
}

const AddMemoryDialog: React.FC<AddMemoryDialogProps> = ({
  isOpen,
  onClose,
  bookId,
  type,
  onMemoryAdded,
}) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('puppy-books')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('puppy-books')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('AddMemoryDialog: Starting submission', { type, bookId, hasFile: !!selectedFile });
    
    if (type === 'photo' && !selectedFile) {
      toast({
        title: "Virhe",
        description: "Valitse kuva ensin",
        variant: "destructive",
      });
      return;
    }

    if (type === 'text' && !caption.trim()) {
      toast({
        title: "Virhe",
        description: "Kirjoita muisto ensin",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Check authentication first
      const { data: user, error: authError } = await supabase.auth.getUser();
      console.log('AddMemoryDialog: Auth check', { user: user.user?.id, authError });
      
      if (authError || !user.user) {
        throw new Error('Et ole kirjautunut sisään');
      }

      // Check if book belongs to user
      const { data: bookCheck, error: bookError } = await supabase
        .from('puppy_books')
        .select('owner_id')
        .eq('id', bookId)
        .single();

      console.log('AddMemoryDialog: Book check', { bookCheck, bookError });

      if (bookError) {
        throw new Error('Pentukirjaa ei löydy');
      }

      if (bookCheck.owner_id !== user.user.id) {
        throw new Error('Sinulla ei ole oikeutta muokata tätä pentukirjaa');
      }

      let contentUrl = null;
      
      if (selectedFile && type === 'photo') {
        console.log('AddMemoryDialog: Uploading image', { fileName: selectedFile.name });
        contentUrl = await uploadImage(selectedFile);
        if (!contentUrl) {
          throw new Error('Kuvan lataus epäonnistui');
        }
        console.log('AddMemoryDialog: Image uploaded', { contentUrl });
      }

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const locationData = location.trim() ? { name: location.trim() } : null;

      // Map type to correct content_type
      const contentType = type === 'photo' ? 'image' : 
                         type === 'milestone' ? 'milestone' :
                         type === 'event' ? 'event' : 'text';

      const memoryData = {
        book_id: bookId,
        content_type: contentType,
        content_url: contentUrl,
        caption: caption.trim() || null,
        tags: tagsArray,
        location: locationData,
        created_by: user.user.id,
      };

      console.log('AddMemoryDialog: Inserting memory', memoryData);
      
      const { data, error } = await supabase
        .from('memories')
        .insert(memoryData)
        .select();

      if (error) {
        console.error('AddMemoryDialog: Database error', error);
        throw error;
      }

      console.log('AddMemoryDialog: Memory inserted successfully', data);

      toast({
        title: "Onnistui!",
        description: type === 'photo' ? "Kuva lisätty muistoihin" : "Muisto lisätty",
      });

      // Reset form
      setCaption('');
      setTags('');
      setLocation('');
      setSelectedFile(null);
      setPreviewUrl('');
      
      onMemoryAdded();
      onClose();
    } catch (error: any) {
      console.error('AddMemoryDialog: Error adding memory', error);
      
      let errorMessage = "Muiston lisääminen epäonnistui";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '42501') {
        errorMessage = "Sinulla ei ole oikeutta lisätä muistoja tähän pentukirjaan";
      } else if (error.code === 'PGRST116') {
        errorMessage = "Pentukirjaa ei löydy tai sinulla ei ole oikeutta siihen";
      }
      
      toast({
        title: "Virhe",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'photo': return 'Lisää kuva';
      case 'text': return 'Lisää muisto';
      case 'event': return 'Lisää tapahtuma';
      case 'milestone': return 'Lisää virstanpylväs';
      default: return 'Lisää muisto';
    }
  };

  const getDialogIcon = () => {
    switch (type) {
      case 'photo': return Camera;
      case 'text': return Heart;
      case 'event': return Calendar;
      case 'milestone': return Award;
      default: return Camera;
    }
  };

  const Icon = getDialogIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1200] p-4"
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
                <Icon className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">{getDialogTitle()}</h2>
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
              {type === 'photo' && (
                <div>
                  <Label>Valitse kuva</Label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600">Klikkaa vaihtaaksesi kuvan</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Raahaa kuva tähän tai klikkaa valitaksesi</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="caption">
                  {type === 'photo' ? 'Kuvateksti' : 'Muisto'}
                </Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={
                    type === 'photo' 
                      ? 'Kerro kuvan tarina...' 
                      : 'Kirjoita pennun muisto...'
                  }
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Aihetunnisteet
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="esim. ensimmäinen, leikki, ystävät (pilkulla eroteltuna)"
                />
              </div>

              <div>
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Sijainti
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="esim. Koti, Puisto, Eläinlääkäri"
                />
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
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? 'Tallennetaan...' : 'Tallenna'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMemoryDialog;