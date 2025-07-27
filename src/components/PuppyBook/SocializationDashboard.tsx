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

      {/* Enhanced Bank Account Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sosiaalistamispankkitili
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visual Balance Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pankkisaldo</span>
                <span className={`font-semibold ${getBankBalanceColor()}`}>
                  {getBankBalance() > 0 ? '+' : ''}{getBankBalance()}
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div className="h-full flex">
                  {/* Positive experiences (green) */}
                  <div 
                    className="bg-green-500 transition-all duration-500"
                    style={{ 
                      width: `${Math.min((getPositiveExperiences() / Math.max(getTotalExperiences(), 1)) * 100, 100)}%` 
                    }}
                  />
                  {/* Negative experiences (red) */}
                  <div 
                    className="bg-red-500 transition-all duration-500"
                    style={{ 
                      width: `${Math.min((getNegativeExperiences() / Math.max(getTotalExperiences(), 1)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Detailed breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  +{getPositiveExperiences()}
                </div>
                <div className="text-sm text-green-700">Positiiviset</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  -{getNegativeExperiences()}
                </div>
                <div className="text-sm text-red-700">Negatiiviset</div>
              </div>
            </div>
            
            {/* Status message with actionable advice */}
            <div className="border-t pt-4">
              <div className={`p-3 rounded-lg ${
                getBankBalance() >= 10 ? 'bg-green-50 border border-green-200' :
                getBankBalance() >= 5 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  getBankBalance() >= 10 ? 'text-green-800' :
                  getBankBalance() >= 5 ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {getBankBalance() >= 10 ? 
                    '🎉 Erinomainen! Pennullasi on vahva sosiaalistamispohja.' :
                    getBankBalance() >= 5 ?
                    '👍 Hyvä alku! Jatka positiivisten kokemusten keräämistä.' :
                    getBankBalance() >= 0 ?
                    '⚠️ Keskity positiivisiin kokemuksiin ja vältä negatiivisia tilanteita.' :
                    '🚨 Negatiivinen saldo! Tee lepotauko ja keskity pelkästään positiivisiin kokemuksiin.'
                  }
                </p>
                
                {/* Actionable tips based on balance */}
                <div className="mt-2 text-xs opacity-75">
                  {getBankBalance() < 0 ? (
                    <>💡 Vinkki: Palaa tuttuihin, positiivisiin kokemuksiin. Vältä uusia haastavia tilanteita.</>
                  ) : getBankBalance() < 5 ? (
                    <>💡 Vinkki: Lisää helppojen kohteiden toistoja ennen haastavampien kokeilemista.</>
                  ) : (
                    <>💡 Vinkki: Voit rohkeasti kokeilla haastavampia sosiaalistamiskohteita!</>
                  )}
                </div>
              </div>
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