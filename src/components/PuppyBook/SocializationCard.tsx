import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Info, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { PuppyAgeInfo } from '@/utils/puppyAge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SocializationItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  why_important: string;
  min_age_weeks: number;
  max_age_weeks: number;
  difficulty_level: number;
  duration_minutes: number;
  distance_guidance: string;
  tips: string[];
}

interface SocializationCardProps {
  item: SocializationItem;
  puppyAge: PuppyAgeInfo | null;
  onAddExperience: () => void;
}

export const SocializationCard: React.FC<SocializationCardProps> = ({
  item,
  puppyAge,
  onAddExperience
}) => {
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Helppo';
      case 2: return 'Kohtalainen';
      case 3: return 'Haastava';
      case 4: return 'Vaikea';
      case 5: return 'Erittäin vaikea';
      default: return 'Tuntematon';
    }
  };

  const getAgeStatus = () => {
    if (!puppyAge) return null;
    
    const currentWeeks = puppyAge.weeks;
    
    if (currentWeeks < item.min_age_weeks) {
      return {
        status: 'too_early',
        label: 'Liian aikainen',
        color: 'text-gray-500',
        icon: Clock
      };
    } else if (currentWeeks <= item.max_age_weeks) {
      return {
        status: 'optimal',
        label: 'Optimaalinen ikä',
        color: 'text-green-600',
        icon: CheckCircle
      };
    } else {
      return {
        status: 'late',
        label: 'Myöhäistä, mutta mahdollista',
        color: 'text-orange-600',
        icon: AlertTriangle
      };
    }
  };

  const ageStatus = getAgeStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${getDifficultyColor(item.difficulty_level)} text-white`}
              >
                {getDifficultyLabel(item.difficulty_level)}
              </Badge>
              {ageStatus && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`flex items-center gap-1 ${ageStatus.color}`}>
                        <ageStatus.icon className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ageStatus.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Why Important */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Miksi tärkeää?</h4>
                <p className="text-blue-700 text-sm">{item.why_important}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{item.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">{item.min_age_weeks}-{item.max_age_weeks} vko</span>
            </div>
          </div>

          {/* Distance Guidance */}
          {item.distance_guidance && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium text-yellow-800 text-sm">Etäisyysohje</h4>
              <p className="text-yellow-700 text-sm">{item.distance_guidance}</p>
            </div>
          )}

          {/* Tips */}
          {item.tips && item.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Vinkkejä</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {item.tips.slice(0, 2).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
                {item.tips.length > 2 && (
                  <li className="text-xs text-muted-foreground">
                    +{item.tips.length - 2} lisävinkkiä...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={onAddExperience}
            className="w-full"
            variant={ageStatus?.status === 'too_early' ? 'outline' : 'default'}
            disabled={ageStatus?.status === 'too_early'}
          >
            <Plus className="h-4 w-4 mr-2" />
            {ageStatus?.status === 'too_early' ? 'Odota sopivaa ikää' : 'Lisää kokemus'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};