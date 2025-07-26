import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SpotlightStory {
  id: string;
  username: string;
  puppyName: string;
  puppyBreed: string;
  puppyAge: string;
  profileImage?: string;
  coverImage?: string;
  title: string;
  description: string;
  highlights: string[];
  stats: {
    memoriesCount: number;
    milestonesCompleted: number;
    reactionsReceived: number;
    level: number;
  };
  featured: boolean;
  dateSpotlighted: string;
  quote?: string;
}

const SPOTLIGHT_STORIES: SpotlightStory[] = [
  {
    id: '1',
    username: 'MariaK',
    puppyName: 'Luna',
    puppyBreed: 'Golden Retriever',
    puppyAge: '6 kuukautta',
    title: 'Lunan upea matka pennusta nuoreksi koiraksi',
    description: 'Maria on dokumentoinut Lunan kasvun alusta asti uskomattomalla tarkkuudella. Jokainen virstanpylväs, jokainen ensimmäinen kerta on tallennettu kauniisti.',
    highlights: [
      'Saavutti kaikki virstanpylväät ajallaan',
      'Voitti "Kuukauden pentu" -kilpailun kaksi kertaa',
      'Jakoi inspiroimvia vinkkejä pentukoulutuksesta',
      'Auttoi yli 20 muuta pentuvanhempaa'
    ],
    stats: {
      memoriesCount: 89,
      milestonesCompleted: 24,
      reactionsReceived: 456,
      level: 7
    },
    featured: true,
    dateSpotlighted: '2025-01-15',
    quote: 'Pentukirja on auttanut minua ymmärtämään, kuinka nopeasti Luna kehittyy. Jokainen päivä tuo jotain uutta!'
  },
  {
    id: '2',
    username: 'TomiP',
    puppyName: 'Max',
    puppyBreed: 'Labrador',
    puppyAge: '4 kuukautta',
    title: 'Maxin sosiaalistamisseikkailut kaupungissa',
    description: 'Tomi asuu Helsingin keskustassa ja on luovasti käyttänyt kaupunkiympäristöä Maxin sosiaalistamiseen. Heidän tarinansa inspiroi monia kaupunkipentuvanhempia.',
    highlights: [
      'Kehitti kaupunkipennun sosiaalistamisohjelman',
      'Järjesti 5 menestyksellistä pentutreffejä',
      'Jakoi vinkkejä julkisten kulkuvälineiden käytöstä',
      'Sai tunnustuksen yhteisön aktiivisuudesta'
    ],
    stats: {
      memoriesCount: 67,
      milestonesCompleted: 18,
      reactionsReceived: 312,
      level: 5
    },
    featured: false,
    dateSpotlighted: '2025-01-08',
    quote: 'Kaupungissa on niin paljon mahdollisuuksia sosiaalistamiseen - pitää vain olla luova!'
  },
  {
    id: '3',
    username: 'EmmaL',
    puppyName: 'Bella',
    puppyBreed: 'Border Collie',
    puppyAge: '8 kuukautta',
    title: 'Bellan älykkyyden kehittäminen leikkien kautta',
    description: 'Emma on Border Collie -kasvattaja, joka jakaa asiantuntemustaan älykkään rodun pentukasvatuksesta. Bellan kanssa he ovat kokeilleet lukuisia kehitysleikkejä.',
    highlights: [
      'Loi 15 erilaista älypeliä pentuun',
      'Voitti nuorten koirien tottelevaisuuskilpailun',
      'Kirjoitti oppaan älykkäiden rotujen kasvatukseen',
      'Mentoroi 12 uutta Border Collie -omistajaa'
    ],
    stats: {
      memoriesCount: 134,
      milestonesCompleted: 31,
      reactionsReceived: 678,
      level: 9
    },
    featured: false,
    dateSpotlighted: '2025-01-01',
    quote: 'Border Colliet tarvitsevat henkistä stimulaatiota yhtä paljon kuin fyysistä. Bella opettaa minua joka päivä!'
  }
];

const UserSpotlight: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState<SpotlightStory[]>(SPOTLIGHT_STORIES);

  const currentStory = stories[currentIndex];

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'from-purple-500 to-pink-500';
    if (level >= 5) return 'from-blue-500 to-purple-500';
    if (level >= 3) return 'from-green-500 to-blue-500';
    return 'from-yellow-500 to-green-500';
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Viikon tarina
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStory}
                disabled={stories.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {stories.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextStory}
                disabled={stories.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Hero section */}
            <div className="relative">
              {currentStory.coverImage && (
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={currentStory.coverImage} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src={currentStory.profileImage} />
                  <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
                    {currentStory.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{currentStory.puppyName}</h2>
                    <Badge className={`bg-gradient-to-r ${getLevelColor(currentStory.stats.level)} text-white`}>
                      Taso {currentStory.stats.level}
                    </Badge>
                    {currentStory.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        ⭐ Esillä
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {currentStory.puppyBreed} • {currentStory.puppyAge} • @{currentStory.username}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Esillä {new Date(currentStory.dateSpotlighted).toLocaleDateString('fi')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentStory.title}</h3>
              <p className="text-gray-700 leading-relaxed">{currentStory.description}</p>
              
              {currentStory.quote && (
                <blockquote className="border-l-4 border-chart-milestone bg-gray-50 p-4 rounded-r-lg italic text-gray-700">
                  "{currentStory.quote}"
                </blockquote>
              )}
            </div>

            {/* Highlights */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-chart-milestone" />
                Saavutukset
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {currentStory.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="w-2 h-2 bg-chart-milestone rounded-full" />
                    {highlight}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-growth">{currentStory.stats.memoriesCount}</div>
                <div className="text-xs text-gray-600">Muistoja</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-energy">{currentStory.stats.milestonesCompleted}</div>
                <div className="text-xs text-gray-600">Virstanpylvästä</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-health">{currentStory.stats.reactionsReceived}</div>
                <div className="text-xs text-gray-600">Reaktiota</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-milestone">{currentStory.stats.level}</div>
                <div className="text-xs text-gray-600">Taso</div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Katso {currentStory.puppyName}n pentukirjaa
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Other stories preview */}
      <div className="grid gap-4 md:grid-cols-2">
        {stories
          .filter((_, index) => index !== currentIndex)
          .slice(0, 2)
          .map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCurrentIndex(stories.findIndex(s => s.id === story.id))}
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-primary text-white text-sm">
                    {story.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{story.puppyName}</h4>
                  <p className="text-xs text-gray-600">@{story.username}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{story.title}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>{story.puppyBreed}</span>
                <Badge variant="outline">
                  Taso {story.stats.level}
                </Badge>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default UserSpotlight;
