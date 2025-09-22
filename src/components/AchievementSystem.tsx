import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Award, 
  Trophy, 
  Star, 
  Calendar, 
  TrendingUp,
  Target,
  Flame,
  Medal,
  Crown,
  Zap
} from 'lucide-react'
import type { WeightEntry } from '@/services/weightService'

interface AchievementSystemProps {
  weightData: WeightEntry[]
  onCelebration?: () => void
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  progress: number
  maxProgress: number
  isUnlocked: boolean
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
}

const RARITY_LABELS = {
  common: 'Tavallinen',
  rare: 'Harvinainen',
  epic: 'Eeppinen', 
  legendary: 'Legendaarinen'
}

const calculateStreak = (weightData: WeightEntry[]): number => {
  if (weightData.length === 0) return 0
  
  const sortedData = [...weightData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  let currentDate = new Date()
  
  for (const entry of sortedData) {
    const entryDate = new Date(entry.date)
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (streak === 0 && daysDiff <= 7) {
      streak = 1
      currentDate = entryDate
    } else if (daysDiff <= 14) {
      streak++
      currentDate = entryDate
    } else {
      break
    }
  }
  
  return streak
}

const getAchievements = (weightData: WeightEntry[]): Achievement[] => {
  const streak = calculateStreak(weightData)
  const totalEntries = weightData.length
  const totalGrowth = weightData.length > 1 ? 
    weightData[weightData.length - 1].weight - weightData[0].weight : 0
  
  const sortedData = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const consistentWeighing = sortedData.length >= 4 ? 
    sortedData.slice(-4).every((entry, index, arr) => 
      index === 0 || (new Date(entry.date).getTime() - new Date(arr[index - 1].date).getTime()) / (1000 * 60 * 60 * 24) <= 10
    ) : false

  return [
    {
      id: 'first_weigh',
      title: 'Aloittelija',
      description: 'Lisää ensimmäinen painomittaus',
      icon: <Award className="h-5 w-5" />,
      color: 'from-green-400 to-green-600',
      progress: Math.min(totalEntries, 1),
      maxProgress: 1,
      isUnlocked: totalEntries >= 1,
      rarity: 'common'
    },
    {
      id: 'week_streak',
      title: 'Viikoittainen seuranta',
      description: 'Mitata paino 7 viikon ajan säännöllisesti',
      icon: <Calendar className="h-5 w-5" />,
      color: 'from-blue-400 to-blue-600',
      progress: Math.min(streak, 7),
      maxProgress: 7,
      isUnlocked: streak >= 7,
      rarity: 'rare'
    },
    {
      id: 'growth_tracker',
      title: 'Kasvuseuranta',
      description: 'Seuraa 5 kg:n painonnousu',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-purple-400 to-purple-600',
      progress: Math.min(totalGrowth, 5),
      maxProgress: 5,
      isUnlocked: totalGrowth >= 5,
      rarity: 'epic'
    },
    {
      id: 'consistency_master',
      title: 'Johdonmukainen omistaja',
      description: 'Mitaa paino säännöllisesti kuukauden ajan',
      icon: <Target className="h-5 w-5" />,
      color: 'from-orange-400 to-orange-600',
      progress: consistentWeighing ? 1 : 0,
      maxProgress: 1,
      isUnlocked: consistentWeighing,
      rarity: 'rare'
    },
    {
      id: 'dedication',
      title: 'Omistettu hoitaja',
      description: 'Tee 20 painomittausta',
      icon: <Medal className="h-5 w-5" />,
      color: 'from-red-400 to-red-600',
      progress: Math.min(totalEntries, 20),
      maxProgress: 20,
      isUnlocked: totalEntries >= 20,
      rarity: 'epic'
    },
    {
      id: 'streak_master',
      title: 'Seurantamestari',
      description: 'Ylläpidä 12 viikon mittaussarja',
      icon: <Flame className="h-5 w-5" />,
      color: 'from-yellow-400 to-yellow-600',
      progress: Math.min(streak, 12),
      maxProgress: 12,
      isUnlocked: streak >= 12,
      rarity: 'legendary'
    },
    {
      id: 'data_collector',
      title: 'Tiedonkerääjä',
      description: 'Kerää 50 painomittausta',
      icon: <Crown className="h-5 w-5" />,
      color: 'from-purple-400 to-pink-600',
      progress: Math.min(totalEntries, 50),
      maxProgress: 50,
      isUnlocked: totalEntries >= 50,
      rarity: 'legendary'
    },
    {
      id: 'puppy_guardian',
      title: 'Pennun suojelija',
      description: 'Seuraa pennun kehitystä 6 kuukauden ajan',
      icon: <Trophy className="h-5 w-5" />,
      color: 'from-cyan-400 to-blue-600',
      progress: Math.min(Math.floor(totalEntries / 4), 24), // Rough weekly to month conversion
      maxProgress: 24,
      isUnlocked: totalEntries >= 96, // ~24 weeks of bi-weekly weighing
      rarity: 'legendary'
    }
  ]
}

export default function AchievementSystem({ weightData, onCelebration }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const newAchievements = getAchievements(weightData)
    const previouslyUnlocked = achievements.filter(a => a.isUnlocked).length
    const nowUnlocked = newAchievements.filter(a => a.isUnlocked).length
    
    if (nowUnlocked > previouslyUnlocked && onCelebration) {
      onCelebration()
    }
    
    setAchievements(newAchievements)
  }, [weightData])

  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const inProgressAchievements = achievements.filter(a => !a.isUnlocked && a.progress > 0)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked && a.progress === 0)

  const displayedAchievements = showAll ? achievements : [
    ...unlockedAchievements,
    ...inProgressAchievements.slice(0, 3)
  ]

  const totalXP = unlockedAchievements.reduce((sum, achievement) => {
    const xpValues = { common: 100, rare: 250, epic: 500, legendary: 1000 }
    return sum + xpValues[achievement.rarity]
  }, 0)

  const streak = calculateStreak(weightData)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Saavutustilastot
          </CardTitle>
          <CardDescription>Edistymisesi ja saavutuksesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
              <div className="text-xs text-muted-foreground">Saavutusta</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-2xl font-bold text-secondary">{totalXP}</div>
              <div className="text-xs text-muted-foreground">XP pistettä</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-2xl font-bold text-accent">{streak}</div>
              <div className="text-xs text-muted-foreground">Päivää putkeen</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{weightData.length}</div>
              <div className="text-xs text-muted-foreground">Mittausta</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Saavutukset
              </CardTitle>
              <CardDescription>
                {unlockedAchievements.length} / {achievements.length} saavutusta avattu
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Näytä vähemmän' : 'Näytä kaikki'}
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress 
              value={(unlockedAchievements.length / achievements.length) * 100} 
              className="h-2"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {displayedAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.isUnlocked 
                    ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' 
                    : 'border-muted bg-white/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    achievement.isUnlocked 
                      ? `bg-gradient-to-r ${achievement.color} text-white shadow-lg` 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-[var(--color-text-primary)] ${
                        achievement.isUnlocked ? '' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} text-white border-0`}
                      >
                        {RARITY_LABELS[achievement.rarity]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    
                    {!achievement.isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Edistyminen</span>
                          <span className="font-medium">
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    )}
                    
                    {achievement.isUnlocked && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">Avattu!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      {streak > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full text-white shadow-lg">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {streak} viikon sarja!
                </h3>
                <p className="text-orange-600">
                  Loistavaa! Jatka säännöllistä mittaamista pitääksesi sarjan yllä.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}