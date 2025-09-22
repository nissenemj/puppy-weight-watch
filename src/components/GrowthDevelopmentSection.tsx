import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Baby, 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Activity,
  Calendar,
  TrendingUp,
  Info
} from 'lucide-react'
import type { WeightEntry } from '@/services/weightService'

interface GrowthDevelopmentSectionProps {
  weightData: WeightEntry[]
  birthDate?: string
}

interface DevelopmentStage {
  ageWeeks: [number, number]
  title: string
  icon: React.ReactNode
  description: string
  milestones: string[]
  tips: string[]
  color: string
}

const DEVELOPMENT_STAGES: DevelopmentStage[] = [
  {
    ageWeeks: [0, 8],
    title: "Varhaisvaihe",
    icon: <Baby className="h-5 w-5" />,
    description: "Pentu on riippuvainen äidistään ja oppii perustaitoja",
    milestones: ["Silmät avautuvat", "Ensimmäiset askelet", "Maidon juonti"],
    tips: ["Seuraa painonnousua tarkasti", "Varmista lämmin ympäristö"],
    color: "from-pink-400 to-pink-600"
  },
  {
    ageWeeks: [8, 16],
    title: "Sosialisaatiovaihe",
    icon: <Heart className="h-5 w-5" />,
    description: "Kriittinen vaihe oppimiselle ja sosialisaatiolle",
    milestones: ["Ensimmäiset rokotukset", "Sosialisaatio alkaa", "Leikki kehittyy"],
    tips: ["Tutustuta uusiin ääniin ja näkyihin", "Aloita hihnakoulutus"],
    color: "from-blue-400 to-blue-600"
  },
  {
    ageWeeks: [16, 24],
    title: "Nuoruusvaihe",
    icon: <Brain className="h-5 w-5" />,
    description: "Nopea kasvu ja oppiminen jatkuu",
    milestones: ["Kaikki hampaat", "Peruskomennot", "Itsenäisyys kasvaa"],
    tips: ["Jatkuva koulutus", "Riittävästi liikuntaa", "Tasapainoinen ruokinta"],
    color: "from-green-400 to-green-600"
  },
  {
    ageWeeks: [24, 52],
    title: "Aikuistuminen",
    icon: <Bone className="h-5 w-5" />,
    description: "Kasvu hidastuu ja luonne vakiintuu",
    milestones: ["Täysi koko", "Vakaa temperamentti", "Aikuisen ruoka"],
    tips: ["Säännöllinen liikunta", "Ylläpidä koulutusta", "Terveystarkastukset"],
    color: "from-purple-400 to-purple-600"
  }
]

const calculateAgeInWeeks = (birthDate: string): number => {
  const birth = new Date(birthDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - birth.getTime())
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
  return diffWeeks
}

const getCurrentStage = (ageWeeks: number): DevelopmentStage | null => {
  return DEVELOPMENT_STAGES.find(stage => 
    ageWeeks >= stage.ageWeeks[0] && ageWeeks <= stage.ageWeeks[1]
  ) || DEVELOPMENT_STAGES[DEVELOPMENT_STAGES.length - 1]
}

const getGrowthPrediction = (weightData: WeightEntry[], ageWeeks: number): number => {
  if (weightData.length < 2) return 0
  
  const sortedData = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const latestWeight = sortedData[sortedData.length - 1].weight
  
  // Simple prediction based on breed size estimates
  if (ageWeeks < 16) {
    return latestWeight * 3.5 // Small breeds
  } else if (ageWeeks < 24) {
    return latestWeight * 2.5 // Medium breeds  
  } else {
    return latestWeight * 1.5 // Large breeds
  }
}

export default function GrowthDevelopmentSection({ weightData, birthDate }: GrowthDevelopmentSectionProps) {
  const ageWeeks = birthDate ? calculateAgeInWeeks(birthDate) : 0
  const currentStage = getCurrentStage(ageWeeks)
  const predictedAdultWeight = getGrowthPrediction(weightData, ageWeeks)
  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0
  const growthProgress = predictedAdultWeight > 0 ? (currentWeight / predictedAdultWeight) * 100 : 0

  if (!birthDate) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Kehitysvaiheet
          </CardTitle>
          <CardDescription>
            Lisää pennun syntymäaika nähdäksesi kehitysvaiheen tiedot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted" />
            <p>Syntymäaika puuttuu</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Stage Card */}
      {currentStage && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${currentStage.color}`} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${currentStage.color} text-white`}>
                  {currentStage.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{currentStage.title}</CardTitle>
                  <CardDescription>
                    Ikä: {ageWeeks} viikkoa • {Math.floor(ageWeeks / 4.33)} kuukautta
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                Aktiivinen vaihe
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentStage.description}</p>
            
            {/* Development Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kehitysvaihe</span>
                <span className="font-medium">
                  {Math.round(((ageWeeks - currentStage.ageWeeks[0]) / (currentStage.ageWeeks[1] - currentStage.ageWeeks[0])) * 100)}%
                </span>
              </div>
              <Progress 
                value={((ageWeeks - currentStage.ageWeeks[0]) / (currentStage.ageWeeks[1] - currentStage.ageWeeks[0])) * 100}
                className="h-2"
              />
            </div>

            {/* Milestones */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Virstanpylväät tässä vaiheessa
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentStage.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {milestone}
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-secondary" />
                Vinkkejä omistajalle
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentStage.tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Prediction Card */}
      {weightData.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Kasvuennuste
            </CardTitle>
            <CardDescription>
              Arvio aikuispainosta nykyisen kasvun perusteella
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                <div className="text-2xl font-bold text-primary">{currentWeight.toFixed(1)} kg</div>
                <div className="text-sm text-muted-foreground">Nykypaino</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl">
                <div className="text-2xl font-bold text-secondary">{predictedAdultWeight.toFixed(1)} kg</div>
                <div className="text-sm text-muted-foreground">Ennustettu aikuispaino</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl">
                <div className="text-2xl font-bold text-accent">{growthProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Kasvusta valmiina</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kasvun edistyminen</span>
                <span className="font-medium">{growthProgress.toFixed(1)}%</span>
              </div>
              <Progress value={growthProgress} className="h-3" />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Huomio:</p>
                  <p>Tämä on arvio perustuen nykyiseen kasvutahtiin. Todellinen aikuispaino voi vaihdella rodun, ruokinnan ja yksilöllisten tekijöiden mukaan.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Stages Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Kaikki kehitysvaiheet
          </CardTitle>
          <CardDescription>
            Pennun kehityksen eri vaiheet ensimmäisestä vuodesta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DEVELOPMENT_STAGES.map((stage, index) => {
              const isActive = currentStage?.title === stage.title
              const isPassed = ageWeeks > stage.ageWeeks[1]
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive 
                      ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10' 
                      : isPassed
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-muted bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      isActive 
                        ? `bg-gradient-to-r ${stage.color} text-white`
                        : isPassed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.ageWeeks[0]}-{stage.ageWeeks[1]} viikkoa
                      </p>
                    </div>
                    {isActive && (
                      <Badge variant="default">Aktiivinen</Badge>
                    )}
                    {isPassed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Valmis
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}