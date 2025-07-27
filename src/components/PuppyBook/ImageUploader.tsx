import React, { useState, useRef } from 'react';
import { Camera, X, Upload, AlertCircle } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Vain JPEG, PNG ja WebP kuvat ovat sallittuja';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Tiedosto on liian suuri. Maksimikoko on 5MB';
    }
    return null;
  };

  const processFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Virheellinen tiedosto",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      console.log('Getting user info...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User error:', userError);
        throw new Error('Käyttäjä ei ole kirjautunut sisään');
      }
      console.log('User authenticated:', user.id);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/puppy-profile/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('puppy-books')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      console.log('Upload successful');

      const { data: { publicUrl } } = supabase.storage
        .from('puppy-books')
        .getPublicUrl(filePath);
      
      console.log('Public URL generated:', publicUrl);
      onImageAdded(publicUrl);
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Kuva lisätty",
        description: "Kuva on onnistuneesti tallennettu"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.message || 'Tuntematon virhe';
      toast({
        title: "Virhe kuvan latauksessa",
        description: `${errorMessage}. Tarkista internet-yhteys ja yritä uudelleen.`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 cursor-pointer
          ${dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          {uploading ? (
            <>
              <Upload className="w-8 h-8 text-primary animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Lataa kuvaa...</p>
                <p className="text-xs text-muted-foreground">Odota hetki</p>
              </div>
            </>
          ) : (
            <>
              <Camera className="w-8 h-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Lisää kuva
                </p>
                <p className="text-xs text-muted-foreground">
                  Klikkaa tai vedä kuva tähän
                </p>
                <p className="text-xs text-muted-foreground/75">
                  JPEG, PNG, WebP • Max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alternative Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => !uploading && fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs"
        >
          {uploading ? (
            <>
              <Upload className="w-3 h-3 mr-1 animate-pulse" />
              Lataa...
            </>
          ) : (
            <>
              <Camera className="w-3 h-3 mr-1" />
              Valitse tiedosto
            </>
          )}
        </Button>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Lisätyt kuvat ({images.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Kuva ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                />
                <button
                  onClick={() => onImageRemoved(imageUrl)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};