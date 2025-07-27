import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculatePuppyAge } from '@/utils/puppyAge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, MapPin, Trophy, Info, CheckCircle, AlertCircle } from '@/utils/iconImports';
import { SocializationDashboard } from './SocializationDashboard';
import { SocializationCard } from './SocializationCard';
import { AddExperienceDialog } from './AddExperienceDialog';
import { WeeklyTasks } from './WeeklyTasks';
import { BodyLanguageGuide } from './BodyLanguageGuide';

interface SocializationSectionProps {
  bookId: string;
  birthDate?: string;
}

interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
}

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

interface SocializationProgress {
  id: string;
  category_id: string;
  positive_experiences: number;
  negative_experiences: number;
  stamp_earned: boolean;
  achievements: string[];
}

export const SocializationSection: React.FC<SocializationSectionProps> = ({
  bookId,
  birthDate
}) => {
  const [categories, setCategories] = useState<SocializationCategory[]>([]);
  const [items, setItems] = useState<SocializationItem[]>([]);
  const [progress, setProgress] = useState<SocializationProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SocializationItem | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const puppyAge = birthDate ? calculatePuppyAge(birthDate) : null;

  useEffect(() => {
    loadSocializationData();
  }, [bookId]);

  const loadSocializationData = async () => {
    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('socialization_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Load items
      const { data: itemsData, error: itemsError } = await supabase
        .from('socialization_items')
        .select('*')
        .order('difficulty_level, min_age_weeks');

      if (itemsError) throw itemsError;

      // Load progress
      const { data: progressData, error: progressError } = await supabase
        .from('socialization_progress')
        .select('*')
        .eq('book_id', bookId);

      if (progressError) throw progressError;

      setCategories(categoriesData || []);
      setItems(itemsData || []);
      setProgress(progressData || []);

      if (categoriesData && categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error loading socialization data:', error);
      toast({
        title: 'Virhe',
        description: 'Sosiaalistamistietojen lataaminen epäonnistui',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getItemsForCategory = (categoryId: string) => {
    const categoryItems = items.filter(item => item.category_id === categoryId);
    
    if (!puppyAge) return categoryItems;

    // Filter by age appropriateness
    return categoryItems.filter(item => {
      const isAgeAppropriate = puppyAge.weeks >= (item.min_age_weeks || 0) && 
                              puppyAge.weeks <= (item.max_age_weeks || 999);
      return isAgeAppropriate;
    });
  };

  const getCategoryProgress = (categoryId: string) => {
    return progress.find(p => p.category_id === categoryId);
  };

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

  const isInCriticalWindow = () => {
    if (!puppyAge) return false;
    return puppyAge.weeks >= 3 && puppyAge.weeks <= 16;
  };

  const getCriticalWindowRemaining = () => {
    if (!puppyAge) return null;
    if (puppyAge.weeks > 16) return 0;
    return Math.max(0, 16 - puppyAge.weeks);
  };

  const handleAddExperience = (item: SocializationItem) => {
    setSelectedItem(item);
    setShowAddDialog(true);
  };

  const handleTaskSelect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      handleAddExperience(item);
    }
  };

  const handleExperienceAdded = () => {
    loadSocializationData();
    setShowAddDialog(false);
    setSelectedItem(null);
    toast({
      title: 'Kokemus tallennettu!',
      description: 'Sosiaalistamiskokemus on lisätty pentukirjaan',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Window Warning */}
      {isInCriticalWindow() && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-500 h-5 w-5" />
            <div>
              <h3 className="font-semibold text-orange-800">Kriittinen sosiaalistamisikkuna auki!</h3>
              <p className="text-sm text-orange-700">
                {getCriticalWindowRemaining()} viikkoa jäljellä optimaaliseen sosiaalistamisaikaan (3-16 viikkoa)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Age Info */}
      {puppyAge && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Pennun ikä</h3>
                <p className="text-2xl font-bold text-primary">{puppyAge.ageString}</p>
                <p className="text-sm text-muted-foreground">{puppyAge.weeks} viikkoa</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Sosiaalistamisikkuna</p>
                <p className="text-lg font-semibold">
                  {puppyAge.weeks < 3 ? 'Ei vielä alkanut' :
                   puppyAge.weeks <= 16 ? 'Auki' : 'Sulkeutunut'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Kokonaisuus</TabsTrigger>
          <TabsTrigger value="categories">Kategoriat</TabsTrigger>
          <TabsTrigger value="guide">Opas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <WeeklyTasks 
            bookId={bookId}
            puppyAge={puppyAge}
            onTaskSelect={handleTaskSelect}
          />
          <SocializationDashboard 
            categories={categories}
            progress={progress}
            puppyAge={puppyAge}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const categoryProgress = getCategoryProgress(category.id);
              const categoryItems = getItemsForCategory(category.id);
              
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  {categoryProgress && categoryProgress.stamp_earned && (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                  <Badge variant="secondary">{categoryItems.length}</Badge>
                </Button>
              );
            })}
          </div>

          {/* Selected Category Items */}
          {selectedCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {(() => {
                const category = categories.find(c => c.id === selectedCategory);
                const categoryItems = getItemsForCategory(selectedCategory);
                const categoryProgress = getCategoryProgress(selectedCategory);

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <span>{category?.icon}</span>
                          {category?.name}
                        </h3>
                        <p className="text-muted-foreground">{category?.description}</p>
                      </div>
                      {categoryProgress && (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="text-green-600">
                              +{categoryProgress.positive_experiences}
                            </div>
                            <div className="text-red-600">
                              -{categoryProgress.negative_experiences}
                            </div>
                            {categoryProgress.stamp_earned && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4">
                      {categoryItems.map(item => (
                        <SocializationCard
                          key={item.id}
                          item={item}
                          puppyAge={puppyAge}
                          onAddExperience={() => handleAddExperience(item)}
                        />
                      ))}
                    </div>

                    {categoryItems.length === 0 && (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <p className="text-muted-foreground">
                            Ei ikään sopivia sosiaalistamiskohteita tässä kategoriassa
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Sosiaalistamisopas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Kriittinen ikkuna (3-16 viikkoa)</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Pennun aivot ovat tänä aikana erityisen muovautuvia. Positiiviset kokemukset 
                  tänä aikana luovat elinikäisen pohjan sosiaaliselle itsevarmuudelle.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Pankkitili-ajattelu</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Jokainen positiivinen kokemus on talletus pennun "pankkitilille". 
                  Negatiiviset kokemukset ovat nostoja. Tavoitteena on positiivinen saldo.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kehonkielen lukeminen</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-medium text-green-800">Rento pentu</h5>
                    <ul className="text-green-700 mt-1 space-y-1">
                      <li>• Rento häntä</li>
                      <li>• Pehmeät kasvot</li>
                      <li>• Utelias katse</li>
                      <li>• Leikkisä asento</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <h5 className="font-medium text-yellow-800">Epäröivä pentu</h5>
                    <ul className="text-yellow-700 mt-1 space-y-1">
                      <li>• Häntä alhaalla</li>
                      <li>• Huulten nuoleminen</li>
                      <li>• Hidastelu</li>
                      <li>• Katselee sivuttain</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <h5 className="font-medium text-red-800">Pelokas pentu</h5>
                    <ul className="text-red-700 mt-1 space-y-1">
                      <li>• Häntä jalkojen välissä</li>
                      <li>• Korvat taakse</li>
                      <li>• Hengitys tihenee</li>
                      <li>• Pakoyritykset</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kultaiset säännöt</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Laatu ennen määrää:</strong> Yksi positiivinen kokemus on parempi kuin kymmenen negatiivista</li>
                  <li>• <strong>Etäisyys ja kesto:</strong> Aloita aina riittävän kaukaa ja pidä altistukset lyhyinä</li>
                  <li>• <strong>Palkitse rohkeutta:</strong> Anna herkkuja ja kehuja hyvästä käyttäytymisestä</li>
                  <li>• <strong>Seuraa kehonkieltä:</strong> Lopeta aina positiiviseen hetkeen</li>
                  <li>• <strong>Lepoa välissä:</strong> Anna pennun käsitellä kokemuksia rauhassa</li>
                </ul>
                
                <div className="mt-4">
                  <BodyLanguageGuide />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Experience Dialog */}
      {selectedItem && (
        <AddExperienceDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          bookId={bookId}
          item={selectedItem}
          onSuccess={handleExperienceAdded}
        />
      )}
    </div>
  );
};