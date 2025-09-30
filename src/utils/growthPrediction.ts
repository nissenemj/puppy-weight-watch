import regression from 'regression'
import type { WeightEntry } from '@/services/weightService'

export interface GrowthPredictionResult {
  // Ennustedata
  predictions: PredictionPoint[]
  // Mallin tarkkuus
  r2: number
  // Polynomikertoimet
  coefficients: number[]
  // Ennustettu aikuispaino
  predictedAdultWeight: number
  // Arvioitu aikuispainon saavuttamisikä (kuukausina)
  estimatedMaturityAge: number
  // Luotettavuusväli
  confidenceInterval: {
    upper: PredictionPoint[]
    lower: PredictionPoint[]
  }
  // Kasvuvaihe
  currentGrowthPhase: GrowthPhase
  // Viikottainen kasvuvauhti
  currentWeeklyGrowthRate: number
}

export interface PredictionPoint {
  date: string
  ageWeeks: number
  weight: number
  isPrediction: boolean
}

export type GrowthPhase =
  | 'rapid-growth'      // 0-4 kk: Nopea alkukasvu
  | 'steady-growth'     // 4-8 kk: Tasainen kasvu
  | 'slowing-growth'    // 8-12 kk: Hidastuva kasvu
  | 'approaching-adult' // 12+ kk: Lähestymässä aikuispainoa
  | 'adult'            // Saavuttanut aikuispainon

export interface BreedCategory {
  category: 'toy' | 'small' | 'medium' | 'large' | 'giant'
  adultWeightRange: { min: number; max: number }
  maturityAgeMonths: number
  growthCurveParams: {
    rapidGrowthEnd: number    // Viikkoina
    steadyGrowthEnd: number   // Viikkoina
    slowingGrowthEnd: number  // Viikkoina
  }
}

// Rotukohtaiset kasvuparametrit
export const BREED_CATEGORIES: Record<string, BreedCategory> = {
  toy: {
    category: 'toy',
    adultWeightRange: { min: 1, max: 5 },
    maturityAgeMonths: 8,
    growthCurveParams: {
      rapidGrowthEnd: 12,    // 3 kk
      steadyGrowthEnd: 24,   // 6 kk
      slowingGrowthEnd: 32   // 8 kk
    }
  },
  small: {
    category: 'small',
    adultWeightRange: { min: 5, max: 10 },
    maturityAgeMonths: 10,
    growthCurveParams: {
      rapidGrowthEnd: 16,    // 4 kk
      steadyGrowthEnd: 32,   // 8 kk
      slowingGrowthEnd: 40   // 10 kk
    }
  },
  medium: {
    category: 'medium',
    adultWeightRange: { min: 10, max: 25 },
    maturityAgeMonths: 12,
    growthCurveParams: {
      rapidGrowthEnd: 16,    // 4 kk
      steadyGrowthEnd: 36,   // 9 kk
      slowingGrowthEnd: 48   // 12 kk
    }
  },
  large: {
    category: 'large',
    adultWeightRange: { min: 25, max: 40 },
    maturityAgeMonths: 15,
    growthCurveParams: {
      rapidGrowthEnd: 20,    // 5 kk
      steadyGrowthEnd: 40,   // 10 kk
      slowingGrowthEnd: 60   // 15 kk
    }
  },
  giant: {
    category: 'giant',
    adultWeightRange: { min: 40, max: 100 },
    maturityAgeMonths: 20,
    growthCurveParams: {
      rapidGrowthEnd: 24,    // 6 kk
      steadyGrowthEnd: 48,   // 12 kk
      slowingGrowthEnd: 80   // 20 kk
    }
  }
}

// Arvaa rotukategoria painon perusteella
export function estimateBreedCategory(currentWeight: number, ageWeeks: number): BreedCategory {
  // Arvioi aikuispaino nykyisen painon ja iän perusteella
  // Käytetään karkeaa sääntöä: aikuispaino = nykypaino * (52 / ikä_viikkoina) * kasvukerroin
  const growthFactor = Math.max(0.5, Math.min(1.0, 1 - (ageWeeks / 52)))
  const estimatedAdultWeight = currentWeight * (52 / Math.max(ageWeeks, 8)) * (1 + growthFactor)

  if (estimatedAdultWeight < 5) return BREED_CATEGORIES.toy
  if (estimatedAdultWeight < 10) return BREED_CATEGORIES.small
  if (estimatedAdultWeight < 25) return BREED_CATEGORIES.medium
  if (estimatedAdultWeight < 40) return BREED_CATEGORIES.large
  return BREED_CATEGORIES.giant
}

// Laske ikä viikkoina kahden päivämäärän välillä
function getAgeInWeeks(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime()
  return diffMs / (1000 * 60 * 60 * 24 * 7)
}

// Määritä kasvuvaihe iän perusteella
export function determineGrowthPhase(ageWeeks: number, breedCategory: BreedCategory): GrowthPhase {
  const params = breedCategory.growthCurveParams

  if (ageWeeks < params.rapidGrowthEnd) return 'rapid-growth'
  if (ageWeeks < params.steadyGrowthEnd) return 'steady-growth'
  if (ageWeeks < params.slowingGrowthEnd) return 'slowing-growth'
  if (ageWeeks < breedCategory.maturityAgeMonths * 4.33) return 'approaching-adult'
  return 'adult'
}

// Pääfunktio kasvuennusteen laskemiseen
export function calculateGrowthPrediction(
  weightData: WeightEntry[],
  birthDate: Date,
  breedCategory?: BreedCategory
): GrowthPredictionResult | null {
  if (weightData.length < 2) {
    return null // Tarvitaan vähintään 2 pistettä ennustamiseen
  }

  // Järjestä data päivämäärän mukaan
  const sortedData = [...weightData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Muunna data regression-kirjaston muotoon [x, y] missä x = ikä viikkoina, y = paino
  const regressionData: [number, number][] = sortedData.map(entry => {
    const ageWeeks = getAgeInWeeks(birthDate, new Date(entry.date))
    return [ageWeeks, entry.weight]
  })

  // Valitse polynomiregressio asteen mukaan datapisteiden määrän perusteella
  const polynomialDegree = Math.min(3, Math.max(2, Math.floor(regressionData.length / 3)))

  // Suorita polynomiregressio
  const result = regression.polynomial(regressionData, {
    order: polynomialDegree,
    precision: 4
  })

  // Arvioi rotukategoria jos ei annettu
  const lastEntry = sortedData[sortedData.length - 1]
  const currentAgeWeeks = getAgeInWeeks(birthDate, new Date(lastEntry.date))
  const breed = breedCategory || estimateBreedCategory(lastEntry.weight, currentAgeWeeks)

  // Laske nykyinen kasvuvaihe
  const currentPhase = determineGrowthPhase(currentAgeWeeks, breed)

  // Ennusta tulevaisuus (seuraavat 6 kuukautta)
  const predictions: PredictionPoint[] = []
  const upperBound: PredictionPoint[] = []
  const lowerBound: PredictionPoint[] = []

  // Lisää olemassa olevat pisteet
  sortedData.forEach(entry => {
    const ageWeeks = getAgeInWeeks(birthDate, new Date(entry.date))
    predictions.push({
      date: entry.date,
      ageWeeks,
      weight: entry.weight,
      isPrediction: false
    })
  })

  // Laske residuaalien keskihajonta luotettavuusväliä varten
  let sumSquaredResiduals = 0
  regressionData.forEach(([x, y]) => {
    const predicted = result.predict(x)[1]
    sumSquaredResiduals += Math.pow(y - predicted, 2)
  })
  const rmse = Math.sqrt(sumSquaredResiduals / regressionData.length)

  // Ennusta seuraavat 26 viikkoa (6 kk)
  const weeksToPredict = 26
  const lastDate = new Date(lastEntry.date)

  for (let i = 1; i <= weeksToPredict; i++) {
    const futureDate = new Date(lastDate)
    futureDate.setDate(futureDate.getDate() + (i * 7))

    const futureAgeWeeks = currentAgeWeeks + i
    const [, predictedWeight] = result.predict(futureAgeWeeks)

    // Rajoita ennuste realistisiin arvoihin
    const maxWeight = breed.adultWeightRange.max * 1.1
    const boundedWeight = Math.min(Math.max(0.1, predictedWeight), maxWeight)

    // Lasketaan S-käyrä tasoitus aikuispainoon lähestyttäessä
    const maturityWeeks = breed.maturityAgeMonths * 4.33
    const maturityFactor = 1 - Math.exp(-3 * futureAgeWeeks / maturityWeeks)
    const adjustedWeight = boundedWeight * maturityFactor

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      ageWeeks: futureAgeWeeks,
      weight: adjustedWeight,
      isPrediction: true
    })

    // Luotettavuusväli (kasvaa ennusteen edetessä)
    const confidenceFactor = 1.96 * (1 + i * 0.02) // Kasvava epävarmuus
    const interval = rmse * confidenceFactor

    upperBound.push({
      date: futureDate.toISOString().split('T')[0],
      ageWeeks: futureAgeWeeks,
      weight: Math.min(adjustedWeight + interval, maxWeight),
      isPrediction: true
    })

    lowerBound.push({
      date: futureDate.toISOString().split('T')[0],
      ageWeeks: futureAgeWeeks,
      weight: Math.max(adjustedWeight - interval, 0.1),
      isPrediction: true
    })
  }

  // Laske viikottainen kasvuvauhti
  const recentGrowthRate = currentAgeWeeks > 4
    ? (lastEntry.weight - sortedData[sortedData.length - 2].weight) /
      getAgeInWeeks(new Date(sortedData[sortedData.length - 2].date), new Date(lastEntry.date))
    : lastEntry.weight / currentAgeWeeks

  // Ennusta aikuispaino
  const maturityWeeks = breed.maturityAgeMonths * 4.33
  const [, predictedAdult] = result.predict(maturityWeeks)
  const predictedAdultWeight = Math.min(
    Math.max(breed.adultWeightRange.min, predictedAdult),
    breed.adultWeightRange.max
  )

  return {
    predictions,
    r2: result.r2,
    coefficients: result.equation,
    predictedAdultWeight,
    estimatedMaturityAge: breed.maturityAgeMonths,
    confidenceInterval: {
      upper: upperBound,
      lower: lowerBound
    },
    currentGrowthPhase: currentPhase,
    currentWeeklyGrowthRate: recentGrowthRate
  }
}

// Helper: Kasvuvaiheen suomenkielinen nimi
export function getGrowthPhaseLabel(phase: GrowthPhase): string {
  const labels: Record<GrowthPhase, string> = {
    'rapid-growth': 'Nopea alkukasvu',
    'steady-growth': 'Tasainen kasvu',
    'slowing-growth': 'Hidastuva kasvu',
    'approaching-adult': 'Lähestymässä aikuispainoa',
    'adult': 'Aikuispaino saavutettu'
  }
  return labels[phase]
}

// Helper: Kasvuvaiheen väri
export function getGrowthPhaseColor(phase: GrowthPhase): string {
  const colors: Record<GrowthPhase, string> = {
    'rapid-growth': '#10b981',      // green-500
    'steady-growth': '#3b82f6',     // blue-500
    'slowing-growth': '#f59e0b',    // amber-500
    'approaching-adult': '#8b5cf6', // violet-500
    'adult': '#6b7280'              // gray-500
  }
  return colors[phase]
}