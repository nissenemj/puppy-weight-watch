import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Facebook, Twitter, Send, Link2 } from '@/utils/iconImports';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookId: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ 
  isOpen, 
  onClose, 
  bookTitle, 
  bookId 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Create a shareable link (this could be enhanced to create actual shareable links)
  const shareUrl = `${window.location.origin}/puppy-book/${bookId}`;
  const shareText = `Katso ${bookTitle} - Olen luonut ainutlaatuisen pentukirjan! 🐶✨`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Kopioitu! 📋",
        description: "Linkki on kopioitu leikepöydälle",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Virhe",
        description: "Linkin kopiointi epäonnistui",
        variant: "destructive",
      });
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy link
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Jaa pentukirja
          </DialogTitle>
          <DialogDescription>
            Jaa {bookTitle} ystäviesi ja perheen kanssa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share URL Display */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Jakolinkki:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border text-foreground">
                {shareUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Native Share (if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                onClick={shareNative}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Jaa
              </Button>
            )}

            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              Kopioi linkki
            </Button>

            <Button
              variant="outline"
              onClick={shareToWhatsApp}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={shareToFacebook}
              className="flex items-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>

            <Button
              variant="outline"
              onClick={shareToTwitter}
              className="flex items-center gap-2 col-span-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            💡 Huom: Tämä on demo-versio. Oikeassa sovelluksessa jakolinkit toimisivat täysin.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;