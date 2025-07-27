import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Calendar, Target } from '@/utils/iconImports';
import { PuppyAgeInfo } from '@/utils/puppyAge';

interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
}

interface SocializationProgress {
  id: string;
  category_id: string;
  positive_experiences: number;
  negative_experiences: number;
  stamp_earned: boolean;
  achievements: string[];
}

interface SocializationDashboardProps {
  categories: SocializationCategory[];
  progress: SocializationProgress[];
  puppyAge: PuppyAgeInfo | null;
}

export const SocializationDashboard: React.FC<SocializationDashboardProps> = ({
  categories,
  progress,
  puppyAge
}) => {
  const getTotalExperiences = () => {
    return progress.reduce((total, p) => total + p.positive_experiences + p.negative_experiences, 0);
  };

  const getPositiveExperiences = () => {
    return progress.reduce((total, p) => total + p.positive_experiences, 0);
  };

  const getNegativeExperiences = () => {
    return progress.reduce((total, p) => total + p.negative_experiences, 0);
  };

  const getStampsEarned = () => {
    return progress.filter(p => p.stamp_earned).length;
  };

  const getBankBalance = () => {
    const positive = getPositiveExperiences();
    const negative = getNegativeExperiences();
    return positive - negative;
  };

  const getBankBalanceColor = () => {
    const balance = getBankBalance();
    if (balance >= 10) return 'text-green-600';
    if (balance >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryProgress = (categoryId: string) => {
    return progress.find(p => p.category_id === categoryId);
  };

  const getWeeklyGoal = () => {
    if (!puppyAge) return null;
    
    if (puppyAge.weeks <= 8) {
      return 'Tutustu 2-3 uuteen kohteeseen viikossa';
    } else if (puppyAge.weeks <= 12) {
      return 'Keskity 1-2 haastavampaan kohteeseen viikossa';
    } else if (puppyAge.weeks <= 16) {
      return 'Vahvista aiempia kokemuksia ja kokeile vaativia kohteita';
    } else {
      return 'Jatka ylläpitoa ja syventävää sosiaalistamista';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{getTotalExperiences()}</p>
                  <p className="text-sm text-muted-foreground">Kokemuksia yhteensä</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${getBankBalanceColor()}`}>
                    {getBankBalance() > 0 ? '+' : ''}{getBankBalance()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pankkisaldo</p>
                </div>
                <TrendingUp className={`h-8 w-8 ${getBankBalanceColor()}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{getStampsEarned()}</p>
                  <p className="text-sm text-muted-foreground">Leimoja ansaittu</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Kategorioita</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bank Account Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sosiaalistamispankkitili
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Positiiviset kokemukset</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +{getPositiveExperiences()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Negatiiviset kokemukset</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                -{getNegativeExperiences()}
              </Badge>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Loppusaldo</span>
                <Badge className={getBankBalance() >= 0 ? 'bg-green-500' : 'bg-red-500'}>
                  {getBankBalance() > 0 ? '+' : ''}{getBankBalance()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getBankBalance() >= 10 ? 
                  '🎉 Erinomainen! Pennullasi on vahva sosiaalistamispohja.' :
                  getBankBalance() >= 5 ?
                  '👍 Hyvä alku! Jatka positiivisten kokemusten keräämistä.' :
                  '⚠️ Keskity positiivisiin kokemuksiin ja vältä negatiivisia tilanteita.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Kategorioiden edistyminen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => {
              const categoryProgress = getCategoryProgress(category.id);
              const totalExperiences = categoryProgress ? 
                categoryProgress.positive_experiences + categoryProgress.negative_experiences : 0;
              const positiveRate = totalExperiences > 0 ? 
                (categoryProgress!.positive_experiences / totalExperiences) * 100 : 0;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      {categoryProgress?.stamp_earned && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {categoryProgress && (
                        <>
                          <span className="text-green-600">
                            +{categoryProgress.positive_experiences}
                          </span>
                          <span className="text-red-600">
                            -{categoryProgress.negative_experiences}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(positiveRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalExperiences === 0 ? 
                      'Ei vielä kokemuksia' : 
                      `${positiveRate.toFixed(0)}% positiivisia kokemuksia`
                    }
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      {getWeeklyGoal() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Viikkotavoite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getWeeklyGoal()}</p>
            {puppyAge && puppyAge.weeks <= 16 && (
              <p className="text-sm text-muted-foreground mt-2">
                💡 Muista: Kriittinen sosiaalistamisikkuna on vielä auki!
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};