import React, { useState, useRef } from 'react';
import { Camera, X, Upload, AlertCircle } from '@/utils/iconImports';
import { PUPPY_IMAGE_ACCEPT, uploadPuppyBookImage, validatePuppyImage } from '@/services/puppyBookStorage';
import { PrivatePuppyImage } from './PrivatePuppyImage';
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

  const processFile = async (file: File) => {
    if (uploading) return;
    const validationError = validatePuppyImage(file);
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
      const filePath = await uploadPuppyBookImage(file);
      onImageAdded(filePath);
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Kuva lisätty",
        description: "Kuva on onnistuneesti tallennettu"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Kuvan tallennus epäonnistui.';
      toast({
        title: "Virhe kuvan latauksessa",
        description: errorMessage,
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
          accept={PUPPY_IMAGE_ACCEPT}
          aria-label="Valitse pennun kuva"
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
                  JPEG, PNG, WebP • enintään 5 Mt
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
                <PrivatePuppyImage
                  src={imageUrl}
                  alt={`Kuva ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  aria-label={`Poista kuva ${index + 1}`}
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
