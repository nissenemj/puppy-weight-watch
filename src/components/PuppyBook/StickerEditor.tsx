import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Smile, Award, Zap, Sparkles, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Sticker {
  id: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
}

interface StickerEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onStickerAdded?: (editedImageUrl: string) => void;
}

const AVAILABLE_STICKERS = [
  { id: 'heart', icon: <Heart className="w-6 h-6" />, emoji: '❤️', color: '#EF4444' },
  { id: 'star', icon: <Star className="w-6 h-6" />, emoji: '⭐', color: '#F59E0B' },
  { id: 'smile', icon: <Smile className="w-6 h-6" />, emoji: '😊', color: '#10B981' },
  { id: 'award', icon: <Award className="w-6 h-6" />, emoji: '🏆', color: '#F59E0B' },
  { id: 'zap', icon: <Zap className="w-6 h-6" />, emoji: '⚡', color: '#8B5CF6' },
  { id: 'sparkles', icon: <Sparkles className="w-6 h-6" />, emoji: '✨', color: '#F59E0B' },
  { id: 'paw', icon: '🐾', emoji: '🐾', color: '#8B5CF6' },
  { id: 'bone', icon: '🦴', emoji: '🦴', color: '#6B7280' },
  { id: 'ball', icon: '🎾', emoji: '🎾', color: '#F59E0B' },
  { id: 'fire', icon: '🔥', emoji: '🔥', color: '#EF4444' },
];

const StickerEditor: React.FC<StickerEditorProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onStickerAdded
}) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const addSticker = (stickerType: any, x: number, y: number) => {
    const newSticker: Sticker = {
      id: `${stickerType.id}-${Date.now()}`,
      icon: stickerType.icon,
      emoji: stickerType.emoji,
      color: stickerType.color,
      size: 40,
      x,
      y,
      rotation: Math.random() * 30 - 15, // Random rotation between -15 and 15 degrees
    };
    
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (stickerId: string) => {
    setStickers(stickers.filter(s => s.id !== stickerId));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const stickerType = AVAILABLE_STICKERS.find(s => s.id === selectedSticker);
    if (stickerType) {
      addSticker(stickerType, x, y);
      setSelectedSticker(null);
    }
  };

  const generateEditedImage = async () => {
    try {
      if (!canvasRef.current || !imageRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match image
      const img = imageRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw stickers
      stickers.forEach(sticker => {
        const x = (sticker.x / 100) * canvas.width;
        const y = (sticker.y / 100) * canvas.height;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        ctx.font = `${sticker.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);
        ctx.restore();
      });

      // Convert to blob and create download URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onStickerAdded?.(url);
          
          toast({
            title: "Tarra-kuva valmis! 🎨",
            description: "Kuvasi on nyt muokattu tarroilla",
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating edited image:', error);
      toast({
        title: "Virhe",
        description: "Kuvan muokkaaminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  const downloadEditedImage = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'puppy-memory-with-stickers.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Ladattu! 📱",
          description: "Kuva ladattu laitteellesi",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Koristelutyökalu
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sticker Palette */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-gray-800">Valitse tarra:</h3>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_STICKERS.map((sticker) => (
                <Button
                  key={sticker.id}
                  variant={selectedSticker === sticker.id ? "default" : "outline"}
                  className="p-3 h-auto flex flex-col items-center gap-2"
                  onClick={() => setSelectedSticker(
                    selectedSticker === sticker.id ? null : sticker.id
                  )}
                >
                  <span className="text-2xl">{sticker.emoji}</span>
                </Button>
              ))}
            </div>
            
            {selectedSticker && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg"
              >
                Klikkaa kuvaa lisätäksesi tarra siihen kohtaan!
              </motion.p>
            )}
          </div>

          {/* Image Editor */}
          <div className="lg:col-span-3">
            <div 
              className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ aspectRatio: '16/9' }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Muokattava kuva"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onLoad={() => {
                  // Canvas will be ready after image loads
                }}
              />
              
              {/* Stickers Overlay */}
              {stickers.map((sticker) => (
                <motion.div
                  key={sticker.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                    fontSize: `${sticker.size}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSticker(sticker.id);
                  }}
                >
                  <span>{sticker.emoji}</span>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    <X className="w-2 h-2" />
                  </div>
                </motion.div>
              ))}
              
              {!selectedSticker && stickers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    Valitse tarra ja klikkaa kuvaa<br />
                    lisätäksesi koristelu
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={generateEditedImage}
                disabled={stickers.length === 0}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Valmis!
              </Button>
              
              <Button
                variant="outline"
                onClick={downloadEditedImage}
                disabled={stickers.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Lataa
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setStickers([])}
                disabled={stickers.length === 0}
              >
                Tyhjennä
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default StickerEditor;