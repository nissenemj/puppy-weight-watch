import React, { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageAdded: (imageUrl: string) => void;
  images: string[];
  onImageRemoved: (imageUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageAdded,
  images,
  onImageRemoved
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get current user ID for file path
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Käyttäjä ei ole kirjautunut sisään');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/puppy-profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('puppy-books')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('puppy-books')
        .getPublicUrl(filePath);

      onImageAdded(publicUrl);
      toast({
        title: "Kuva lisätty",
        description: "Kuva on onnistuneesti tallennettu"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Virhe",
        description: "Kuvan lataus epäonnistui",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Upload className="w-3 h-3 animate-pulse" />
          ) : (
            <Camera className="w-3 h-3" />
          )}
          {uploading ? 'Lataa...' : 'Lisää kuva'}
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <button
                onClick={() => onImageRemoved(imageUrl)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};