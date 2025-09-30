import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, Calendar, Info, Zap, AlertCircle } from 'lucide-react'
import { getGrowthPhaseLabel, getGrowthPhaseColor, type GrowthPredictionResult, type GrowthPhase } from '@/utils/growthPrediction'
import { getBreedCategoryInfo } from '@/data/breedGrowthProfiles'

interface GrowthPredictionPanelProps {
  prediction: GrowthPredictionResult | null
  currentWeight: number
  currentAgeMonths: number
  breedCategory?: 'toy' | 'small' | 'medium' | 'large' | 'giant'
}

export default function GrowthPredictionPanel({
  prediction,
  currentWeight,
  currentAgeMonths,
  breedCategory
}: GrowthPredictionPanelProps) {
  if (!prediction) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Kasvuennuste
          </CardTitle>
          <CardDescription>
            Lisää vähintään 2 painomittausta nähdäksesi ennusteen
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Laske prosentuaalinen kasvu aikuispainoon
  const percentageOfAdultWeight = (currentWeight / prediction.predictedAdultWeight) * 100
  const monthsToMaturity = Math.max(0, prediction.estimatedMaturityAge - currentAgeMonths)

  // Kasvuvaiheen väri ja ikoni
  const phaseColor = getGrowthPhaseColor(prediction.currentGrowthPhase)
  const phaseIcon = getPhaseIcon(prediction.currentGrowthPhase)

  // Mallin tarkkuuden arviointi
  const modelAccuracy = prediction.r2 * 100
  const accuracyLevel = modelAccuracy > 90 ? 'Erinomainen' :
                        modelAccuracy > 75 ? 'Hyvä' :
                        modelAccuracy > 60 ? 'Kohtalainen' : 'Alhainen'
  const accuracyColor = modelAccuracy > 90 ? 'text-green-600' :
                       modelAccuracy > 75 ? 'text-blue-600' :
                       modelAccuracy > 60 ? 'text-amber-600' : 'text-red-600'

  const categoryInfo = breedCategory ? getBreedCategoryInfo(breedCategory) : null

  return (
    <div className="space-y-4">
      {/* Pääennustepaneeli */}
      <Card className="bg-gradient-to-br from-white/90 to-primary/5 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Kasvuennuste
              </CardTitle>
              <CardDescription>
                Polynomiregressio-malli {prediction.coefficients.length - 1}. asteen polynomilla
              </CardDescription>
            </div>
            <Badge variant="outline" className={`${accuracyColor} border-current bg-white/80`}>
              <Info className="h-3 w-3 mr-1" />
              {accuracyLevel} ({modelAccuracy.toFixed(1)}%)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Aikuispainon ennuste */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-muted-foreground">Ennustettu aikuispaino</span>
              <span className="text-2xl font-bold text-primary">
                {prediction.predictedAdultWeight.toFixed(1)} kg
              </span>
            </div>
            <Progress value={percentageOfAdultWeight} className="h-3" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Nykyinen: {currentWeight.toFixed(1)} kg ({percentageOfAdultWeight.toFixed(0)}%)
              </span>
              <span className="text-muted-foreground">
                {monthsToMaturity > 0 ?
                  `~${monthsToMaturity} kk aikuispainoon` :
                  'Aikuispaino saavutettu'}
              </span>
            </div>
          </div>

          {/* Kasvuvaihe */}
          <div className="p-4 bg-white/60 rounded-xl border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {phaseIcon}
                <span className="font-semibold" style={{ color: phaseColor }}>
                  {getGrowthPhaseLabel(prediction.currentGrowthPhase)}
                </span>
              </div>
              <Badge variant="secondary" className="bg-white/80">
                {currentAgeMonths} kk ikäinen
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {getPhaseDescription(prediction.currentGrowthPhase)}
            </p>

            {/* Viikottainen kasvuvauhti */}
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">
                Viikottainen kasvu:
                <span className="font-bold ml-2 text-primary">
                  {prediction.currentWeeklyGrowthRate > 0 ? '+' : ''}
                  {prediction.currentWeeklyGrowthRate.toFixed(2)} kg/vko
                </span>
              </span>
            </div>
          </div>

          {/* Rotukategorian tiedot */}
          {categoryInfo && (
            <div className="p-4 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <div>
                  <div className="font-semibold text-secondary">
                    {categoryInfo.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {categoryInfo.description}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Keskimääräinen aikuisikä: {categoryInfo.averageMaturity} kuukautta
              </div>
            </div>
          )}

          {/* Suositukset */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Suositukset kasvuvaiheeseen
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 ml-6">
              {getGrowthRecommendations(prediction.currentGrowthPhase).map((rec, index) => (
                <li key={index} className="list-disc">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mallin tarkkuustiedot */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Ennusteen luotettavuus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Selitysaste (R²)</div>
              <div className="font-bold text-lg">{(prediction.r2 * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Datapisteitä</div>
              <div className="font-bold text-lg">
                {prediction.predictions.filter(p => !p.isPrediction).length}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Mitä korkeampi selitysaste, sitä paremmin malli sopii dataan.
            Yli 80% on hyvä tulos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions
function getPhaseIcon(phase: GrowthPhase): React.ReactNode {
  const icons = {
    'rapid-growth': <TrendingUp className="h-4 w-4 text-green-500" />,
    'steady-growth': <TrendingUp className="h-4 w-4 text-blue-500" />,
    'slowing-growth': <TrendingUp className="h-4 w-4 text-amber-500" />,
    'approaching-adult': <Target className="h-4 w-4 text-violet-500" />,
    'adult': <Target className="h-4 w-4 text-gray-500" />
  }
  return icons[phase]
}

function getPhaseDescription(phase: GrowthPhase): string {
  const descriptions = {
    'rapid-growth': 'Pennun nopein kasvuvaihe. Ruokinta on erityisen tärkeää.',
    'steady-growth': 'Tasainen kasvuvaihe. Lihakset ja luusto vahvistuvat.',
    'slowing-growth': 'Kasvu alkaa hidastua. Aikuiskoon lähestyminen.',
    'approaching-adult': 'Lähes aikuiskoko saavutettu. Viimeiset kasvukuukaudet.',
    'adult': 'Aikuiskoko saavutettu. Ylläpitoruokintaan siirtyminen.'
  }
  return descriptions[phase]
}

function getGrowthRecommendations(phase: GrowthPhase): string[] {
  const recommendations = {
    'rapid-growth': [
      'Varmista riittävä ja laadukas penturuoka',
      'Useita pieniä aterioita päivässä (3-4 kertaa)',
      'Säännölliset painomittaukset viikoittain',
      'Maltillinen liikunta, ei hyppelyä'
    ],
    'steady-growth': [
      'Jatka penturuokaa rodun mukaan',
      'Siirry vähitellen 2-3 ateriaan päivässä',
      'Lisää liikuntaa asteittain',
      'Aloita koulutus ja sosialisointi'
    ],
    'slowing-growth': [
      'Harkitse siirtymistä aikuisen ruokaan',
      'Tarkkaile painonkehitystä ylipainon välttämiseksi',
      'Normaali liikunta sallittu',
      'Jatka säännöllistä seurantaa'
    ],
    'approaching-adult': [
      'Siirry asteittain aikuisen koiran ruokaan',
      'Kaksi ateriaa päivässä riittää',
      'Täysi liikunta sallittu',
      'Painonseuranta kuukausittain riittää'
    ],
    'adult': [
      'Ylläpitoruokinta painon mukaan',
      '1-2 ateriaa päivässä',
      'Säännöllinen liikunta tärkeää',
      'Painonseuranta 1-3 kuukauden välein'
    ]
  }
  return recommendations[phase]
}