import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Instagram, Camera, Heart, Sparkles, Mountain, PartyPopper } from 'lucide-react';
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
      <div className="w-[600px] h-[600px] bg-white p-8 shadow-2xl rounded-lg">
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 h-full rounded-lg p-6 relative border-4 border-amber-200">
          {/* Photo */}
          <div className="w-full h-64 bg-white rounded-lg mb-4 overflow-hidden shadow-lg transform rotate-1">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Handwritten style text */}
          <div className="space-y-2 transform -rotate-1">
            <h2 className="text-2xl font-bold text-amber-900 handwriting">{memory.caption}</h2>
            <p className="text-amber-800 font-medium">{memoryDate}</p>
          </div>
          
          {/* Puppy info */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 rounded-full px-3 py-2">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-8 h-8 rounded-full object-cover" />
            )}
            <span className="text-sm text-amber-900 font-medium">{puppyProfile.name}, {age}</span>
          </div>
          
          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-wrap gap-1">
              {memory.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Branding */}
          <div className="absolute bottom-4 left-4 text-xs text-amber-700">
            puppy-weight-watch.com
          </div>
        </div>
      </div>
    ),
    
    modern: (
      <div className="w-[600px] h-[600px] bg-gradient-to-br from-slate-50 to-gray-100 p-0 overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-8 h-8 rounded-full object-cover" />
            )}
            <span className="text-white font-medium">{puppyProfile.name}</span>
          </div>
          <span className="text-slate-300 text-sm">{memoryDate}</span>
        </div>
        
        {/* Main content */}
        <div className="p-8 space-y-6">
          {/* Photo */}
          <div className="w-full h-72 rounded-lg overflow-hidden shadow-lg">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">{memory.caption}</h2>
            <p className="text-slate-600">{puppyProfile.name}, {age}</p>
          </div>
          
          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memory.tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Branding */}
          <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200">
            puppy-weight-watch.com
          </div>
        </div>
      </div>
    ),
    
    playful: (
      <div className="w-[600px] h-[600px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 bg-purple-200 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-blue-200 rounded-full opacity-50"></div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-purple-900 mb-2">{memory.caption}</h2>
            <div className="flex items-center justify-center gap-2">
              {puppyProfile.profileImage && (
                <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-10 h-10 rounded-full object-cover border-2 border-pink-300" />
              )}
              <span className="text-purple-800 font-semibold">{puppyProfile.name}, {age}</span>
            </div>
          </div>
          
          {/* Photo */}
          <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-6">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-medium">{memoryDate}</span>
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex gap-1">
                {memory.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Branding */}
          <div className="text-center text-xs text-purple-600 mt-4">
            ✨ puppy-weight-watch.com ✨
          </div>
        </div>
      </div>
    ),
    
    adventure: (
      <div className="w-[600px] h-[600px] bg-gradient-to-br from-green-50 to-emerald-100 p-8 relative">
        {/* Nature pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Bold title */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-green-900 mb-2 tracking-wide">{memory.caption}</h2>
            <div className="w-16 h-1 bg-emerald-500 rounded"></div>
          </div>
          
          {/* Photo with adventure frame */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-300 mb-6 relative">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
            
            {/* Adventure badge */}
            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              SEIKKAILU
            </div>
          </div>
          
          {/* Info section */}
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-3">
              {puppyProfile.profileImage && (
                <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" />
              )}
              <div>
                <p className="text-green-900 font-bold text-lg">{puppyProfile.name}</p>
                <p className="text-green-700 text-sm">{age} • {memoryDate}</p>
              </div>
            </div>
            
            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-col gap-1">
                {memory.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded text-right">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Branding */}
          <div className="text-center text-xs text-green-600 mt-4 font-semibold">
            🏔️ puppy-weight-watch.com 🐾
          </div>
        </div>
      </div>
    ),
    
    celebration: (
      <div className="w-[600px] h-[600px] bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 p-8 relative overflow-hidden">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-400 to-indigo-400"></div>
        <div className="absolute top-4 right-4">
          <div className="w-16 h-16 border-4 border-violet-300 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-12 h-12 border-2 border-indigo-300 rounded-full opacity-30"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col text-center">
          {/* Elegant header */}
          <div className="mb-6">
            <div className="text-violet-400 text-4xl mb-2">✨</div>
            <h2 className="text-3xl font-elegant text-violet-900 mb-2 tracking-wide">{memory.caption}</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent mx-auto"></div>
          </div>
          
          {/* Elegant photo frame */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-2xl border border-violet-200 mb-6 relative">
            {memory.content_url && (
              <img src={memory.content_url} alt="Memory" className="w-full h-full object-cover" />
            )}
            
            {/* Celebration overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Puppy info */}
          <div className="flex justify-center items-center gap-4 mb-4">
            {puppyProfile.profileImage && (
              <img src={puppyProfile.profileImage} alt={puppyProfile.name} className="w-14 h-14 rounded-full object-cover border-3 border-violet-300 shadow-lg" />
            )}
            <div>
              <p className="text-violet-900 font-bold text-xl">{puppyProfile.name}</p>
              <p className="text-violet-700">{age}</p>
            </div>
          </div>
          
          {/* Date and tags */}
          <div className="space-y-2">
            <p className="text-violet-800 font-medium">{memoryDate}</p>
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {memory.tags.slice(0, 4).map((tag, index) => (
                  <span key={index} className="text-xs bg-violet-200 text-violet-800 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Elegant branding */}
          <div className="text-xs text-violet-600 mt-4 font-light tracking-widest">
            PUPPY-WEIGHT-WATCH.COM
          </div>
        </div>
      </div>
    )
  };
  
  return templateStyles[template];
};

export const SocialShareGenerator: React.FC<SocialShareGeneratorProps> = ({
  memory,
  puppyProfile,
  isOpen,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const shareImageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!shareImageRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareImageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'white'
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${puppyProfile.name}-muisto-${format(new Date(memory.created_at), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Kuva ladattu!",
        description: "Voit nyt jakaa kuvan sosiaalisessa mediassa",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Virhe",
        description: "Kuvan generointi epäonnistui",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrl = `https://puppy-weight-watch.com/memory/${memory.id}`;
  const shareTitle = `${puppyProfile.name}: ${memory.caption}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Jaa muisto sosiaalisessa mediassa</DialogTitle>
          <DialogDescription>
            Valitse mallipohja ja jaa {puppyProfile.name}:n muisto kauniina kuvana
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valitse mallipohja</h3>
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
              <div className="flex gap-2">
                <FacebookShareButton url={shareUrl} hashtag="#pentuelämää">
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Instagram sharing - copy link to clipboard
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Linkki kopioitu!",
                      description: "Voit nyt jakaa linkin Instagramissa",
                    });
                  }}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
              </div>
            </div>

            {/* Download button */}
            <Button 
              onClick={generateImage} 
              disabled={isGenerating}
              className="w-full flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Luodaan kuvaa...' : 'Lataa kuva'}
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Esikatselu</h3>
            <div className="flex justify-center">
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="transform scale-50 origin-top-left"
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