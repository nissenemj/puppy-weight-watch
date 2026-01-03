import React, { useState, useRef } from 'react';
import { Share2, Copy, Check, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { WeightEntry } from '@/services/weightService';
import type { Dog } from '@/types/dog';

interface ShareGrowthChartProps {
  dog: Dog;
  weightData: WeightEntry[];
  chartRef?: React.RefObject<HTMLDivElement>;
}

const ShareGrowthChart: React.FC<ShareGrowthChartProps> = ({
  dog,
  weightData,
  chartRef,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate share text
  const generateShareText = (): string => {
    if (weightData.length === 0) {
      return `Seuraan ${dog.name}n kasvua Pentulaskuri.com:ssa!`;
    }

    const latestWeight = weightData[weightData.length - 1]?.weight;
    const firstWeight = weightData[0]?.weight;
    const totalGrowth = latestWeight && firstWeight ? latestWeight - firstWeight : 0;

    let text = `${dog.name}n kasvukäyrä:\n`;
    text += `Nykypaino: ${latestWeight?.toFixed(1)} kg\n`;

    if (weightData.length > 1 && totalGrowth > 0) {
      text += `Kasvanut ${totalGrowth.toFixed(1)} kg\n`;
    }

    text += `\nSeuraa pennun kasvua: pentulaskuri.com`;

    return text;
  };

  // Generate share URL
  const getShareUrl = (): string => {
    return 'https://pentulaskuri.com/weight-tracker';
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    const shareText = generateShareText();

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: 'Kopioitu!',
        description: 'Teksti kopioitiin leikepöydälle',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Virhe',
        description: 'Kopioiminen ei onnistunut',
        variant: 'destructive',
      });
    }
  };

  // Share via Web Share API
  const handleWebShare = async () => {
    const shareText = generateShareText();
    const shareUrl = getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dog.name}n kasvukäyrä`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - silently ignore
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: 'Virhe',
            description: 'Jakaminen ei onnistunut',
            variant: 'destructive',
          });
        }
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  // Share to WhatsApp
  const handleWhatsAppShare = () => {
    const shareText = generateShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Download chart as image (requires html2canvas)
  const handleDownloadImage = async () => {
    if (!chartRef?.current) {
      toast({
        title: 'Virhe',
        description: 'Kaaviota ei voitu ladata',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${dog.name}-kasvukayrä.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: 'Ladattu!',
        description: 'Kaavio tallennettu kuvana',
      });
    } catch {
      toast({
        title: 'Virhe',
        description: 'Kuvan lataaminen ei onnistunut',
        variant: 'destructive',
      });
    }
  };

  // Check if Web Share API is available
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Jaa</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canShare && (
          <DropdownMenuItem onClick={handleWebShare} className="gap-2 cursor-pointer">
            <Share2 className="w-4 h-4" />
            Jaa...
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleWhatsAppShare} className="gap-2 cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Kopioi teksti
        </DropdownMenuItem>

        {chartRef && (
          <DropdownMenuItem onClick={handleDownloadImage} className="gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Lataa kuva
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareGrowthChart;
