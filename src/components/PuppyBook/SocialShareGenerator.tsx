import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, Copy, Camera, Heart, Sparkles, Mountain, PartyPopper } from '@/utils/iconImports';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Memory {
  id: string;
  caption?: string;
  content_url?: string;
  created_at: string;
  tags?: string[];
}

interface PuppyProfile {
  name: string;
  birthDate: string;
  profileImage?: string;
}

interface SocialShareGeneratorProps {
  memory: Memory;
  puppyProfile: PuppyProfile;
  isOpen: boolean;
  onClose: () => void;
}

type TemplateType = 'polaroid' | 'modern' | 'playful' | 'adventure' | 'celebration';

interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  textColor: string;
  accent: string;
}

const templates: TemplateConfig[] = [
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Nostalginen ja lämmin',
    icon: Camera,
    gradient: 'from-amber-50 to-orange-100',
    textColor: 'text-amber-900',
    accent: 'border-amber-200'
  },
  {
    id: 'modern',
    name: 'Moderni',
    description: 'Tyylikäs ja minimalistinen',
    icon: Sparkles,
    gradient: 'from-slate-50 to-gray-100',
    textColor: 'text-slate-800',
    accent: 'border-slate-200'
  },
  {
    id: 'playful',
    name: 'Leikkisä',
    description: 'Kirkkaat värit ja hauskat muodot',
    icon: Heart,
    gradient: 'from-pink-50 to-purple-100',
    textColor: 'text-purple-900',
    accent: 'border-pink-200'
  },
  {
    id: 'adventure',
    name: 'Seikkailu',
    description: 'Rohkea ja luontoaiheinen',
    icon: Mountain,
    gradient: 'from-green-50 to-emerald-100',
    textColor: 'text-green-900',
    accent: 'border-green-200'
  },
  {
    id: 'celebration',
    name: 'Juhlava',
    description: 'Elegantti ja juhlahenki',
    icon: PartyPopper,
    gradient: 'from-violet-50 to-indigo-100',
    textColor: 'text-violet-900',
    accent: 'border-violet-200'
  }
];

const calculateAge = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  if (diffWeeks < 52) {
    return `${diffWeeks} viikkoa`;
  } else {
    const years = Math.floor(diffWeeks / 52);
    const remainingWeeks = diffWeeks % 52;
    return remainingWeeks > 0 ? `${years}v ${remainingWeeks}vko` : `${years} vuotta`;
  }
};

const ShareTemplate: React.FC<{
  template: TemplateType;
  memory: Memory;
  puppyProfile: PuppyProfile;
}> = ({ template, memory, puppyProfile }) => {
  const age = calculateAge(puppyProfile.birthDate);
  const memoryDate = format(new Date(memory.created_at), 'dd.MM.yyyy', { locale: fi });
  
  const templateStyles = {
    polaroid: (
      <div className="w-full max-w-[300px] h-[300px] bg-white p-4 shadow-xl rounded-lg">
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 h-full rounded-lg p-3 relative border-2 border-amber-200">
          {/* Photo */}
          <div className="w-full h-32 bg-white rounded-lg mb-2 overflow-hidden shadow-lg transform rotate-1">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-1 transform -rotate-1">
            <h2 className="text-lg font-bold text-amber-900 handwriting">{memory.caption}</h2>
            <p className="text-sm text-amber-800 font-medium">{memoryDate}</p>
          </div>
          
          {/* Puppy info */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-4 h-4 rounded-full object-cover" />
            )}
            <span className="text-xs text-amber-900 font-medium">{puppyProfile.name}, {age}</span>
          </div>
          
          {/* Branding */}
          <div className="absolute bottom-2 left-2 text-xs text-amber-700">
            puppy-weight-watch.com
          </div>
        </div>
      </div>
    ),
    
    modern: (
      <div className="w-full max-w-[300px] h-[300px] bg-gradient-to-br from-slate-50 to-gray-100 p-0 overflow-hidden rounded-lg">
        {/* Header */}
        <div className="h-8 bg-slate-800 flex items-center justify-between px-3">
          <div className="flex items-center gap-1">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-4 h-4 rounded-full object-cover" />
            )}
            <span className="text-white font-medium text-sm">{puppyProfile.name}</span>
          </div>
          <span className="text-slate-300 text-xs">{memoryDate}</span>
        </div>
        
        {/* Main content */}
        <div className="p-4 space-y-3">
          {/* Photo */}
          <div className="w-full h-36 rounded-lg overflow-hidden shadow-lg">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Text */}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800">{memory.caption}</h2>
            <p className="text-slate-600 text-sm">{puppyProfile.name}, {age}</p>
          </div>
          
          {/* Branding */}
          <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
            puppy-weight-watch.com
          </div>
        </div>
      </div>
    ),
    
    playful: (
      <div className="w-full max-w-[300px] h-[300px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden rounded-lg">
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-200 rounded-full opacity-50"></div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-purple-900 mb-1">{memory.caption}</h2>
            <div className="flex items-center justify-center gap-1">
              {puppyProfile.profileImage && (
                <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-5 h-5 rounded-full object-cover border border-pink-300" />
              )}
              <span className="text-purple-800 font-semibold text-sm">{puppyProfile.name}, {age}</span>
            </div>
          </div>
          
          {/* Photo */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border-2 border-white mb-3">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-medium text-sm">{memoryDate}</span>
          </div>
          
          {/* Branding */}
          <div className="text-center text-xs text-purple-600 mt-2">
            ✨ puppy-weight-watch.com ✨
          </div>
        </div>
      </div>
    ),
    
    adventure: (
      <div className="w-full max-w-[300px] h-[300px] bg-gradient-to-br from-green-50 to-emerald-100 p-4 relative rounded-lg">
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Bold title */}
          <div className="mb-3">
            <h2 className="text-xl font-bold text-green-900 mb-1 tracking-wide">{memory.caption}</h2>
            <div className="w-8 h-0.5 bg-emerald-500 rounded"></div>
          </div>
          
          {/* Photo with adventure frame */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-xl border-2 border-emerald-300 mb-3 relative">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
            
            {/* Adventure badge */}
            <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              SEIKKAILU
            </div>
          </div>
          
          {/* Info section */}
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              {puppyProfile.profileImage && (
                <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-6 h-6 rounded-full object-cover border border-emerald-400" />
              )}
              <div>
                <p className="text-green-900 font-bold text-sm">{puppyProfile.name}</p>
                <p className="text-green-700 text-xs">{age} • {memoryDate}</p>
              </div>
            </div>
          </div>
          
          {/* Branding */}
          <div className="text-center text-xs text-green-600 mt-2 font-semibold">
            🏔️ puppy-weight-watch.com 🐾
          </div>
        </div>
      </div>
    ),
    
    celebration: (
      <div className="w-full max-w-[300px] h-[300px] bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 p-4 relative overflow-hidden rounded-lg">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-indigo-400"></div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col text-center">
          {/* Elegant header */}
          <div className="mb-3">
            <div className="text-violet-400 text-2xl mb-1">✨</div>
            <h2 className="text-lg font-elegant text-violet-900 mb-1 tracking-wide">{memory.caption}</h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto"></div>
          </div>
          
          {/* Elegant photo frame */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-xl border border-violet-200 mb-3 relative">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
            
            {/* Celebration overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Puppy info */}
          <div className="flex justify-center items-center gap-2 mb-2">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-7 h-7 rounded-full object-cover border-2 border-violet-300 shadow-lg" />
            )}
            <div>
              <p className="text-violet-900 font-bold text-sm">{puppyProfile.name}</p>
              <p className="text-violet-700 text-xs">{age}</p>
            </div>
          </div>
          
          {/* Date */}
          <p className="text-violet-800 font-medium text-sm mb-2">{memoryDate}</p>
          
          {/* Elegant branding */}
          <div className="text-xs text-violet-600 font-light tracking-widest">
            PUPPY-WEIGHT-WATCH.COM
          </div>
        </div>
      </div>
    )
  };
  
  return templateStyles[template];
};

// Simple native sharing functions
const shareToFacebook = (url: string, title: string) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const shareToTwitter = (url: string, title: string) => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const shareToWhatsApp = (url: string, title: string) => {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
  window.open(shareUrl, '_blank');
};

export const SocialShareGenerator: React.FC<SocialShareGeneratorProps> = ({
  memory,
  puppyProfile,
  isOpen,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const shareImageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const shareUrl = `https://puppy-weight-watch.com/memory/${memory.id}`;
  const shareTitle = `${puppyProfile.name}: ${memory.caption}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Linkki kopioitu!",
        description: "Voit nyt jakaa linkin sosiaalisessa mediassa",
      });
    });
  };

  const downloadImage = () => {
    // For now, just copy the link since we removed html-to-image
    copyToClipboard();
    toast({
      title: "Ominaisuus tulossa!",
      description: "Kuvan lataus toteutetaan pian. Toistaiseksi linkki kopioitu.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Jaa muisto sosiaalisessa mediassa</DialogTitle>
          <DialogDescription>
            Valitse mallipohja ja jaa {puppyProfile.name}:n muisto
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Valitse mallipohja</h3>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${template.gradient}`}>
                        <IconComponent className={`w-6 h-6 ${template.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sharing buttons */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold">Jaa sosiaalisessa mediassa</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => shareToFacebook(shareUrl, shareTitle)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToTwitter(shareUrl, shareTitle)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToWhatsApp(shareUrl, shareTitle)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Kopioi linkki
                </Button>
              </div>
            </div>

            {/* Download button */}
            <Button 
              onClick={downloadImage}
              className="w-full flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Lataa kuva (tulossa)
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Esikatselu</h3>
            <div className="flex justify-center">
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div ref={shareImageRef}>
                  <ShareTemplate 
                    template={selectedTemplate}
                    memory={memory}
                    puppyProfile={puppyProfile}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};