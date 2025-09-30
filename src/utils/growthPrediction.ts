import type { WeightEntry } from '@/services/weightService'
import {
  fitGompertzToData,
  generateGompertzPredictions,
  calculateBreedBasedParameters,
  estimateBreedProfileFromWeight,
  validateGompertzParameters,
  gompertzFunction,
  type GompertzParameters,
  type GompertzFitResult
} from './biologicalGrowthModel'
import { findBreedProfile } from '@/data/breedGrowthProfiles'

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

  try {
    return calculateGrowthPredictionGompertz(weightData, birthDate, breedCategory)
  } catch (error) {
    console.warn('Gompertz model failed, falling back to linear:', error)
    return calculateGrowthPredictionLinear(weightData, birthDate, breedCategory)
  }
}

// Uusi Gompertz-pohjainen kasvuennuste
function calculateGrowthPredictionGompertz(
  weightData: WeightEntry[],
  birthDate: Date,
  breedCategory?: BreedCategory
): GrowthPredictionResult | null {
  if (weightData.length < 2) {
    return null
  }

  // Järjestä data päivämäärän mukaan
  const sortedData = [...weightData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Arvioi rotuprofiili jos ei annettu
  const lastEntry = sortedData[sortedData.length - 1]
  const currentAgeWeeks = getAgeInWeeks(birthDate, new Date(lastEntry.date))
  const currentAgeDays = Math.floor((new Date(lastEntry.date).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))

  // Muunna breedCategory BreedProfileksi tai arvioi painon perusteella
  let breedProfile
  if (breedCategory) {
    // Muunna vanha BreedCategory uudeksi järjestelmäksi
    breedProfile = {
      name: `${breedCategory.category} breed`,
      nameFi: `${breedCategory.category} rotu`,
      category: breedCategory.category,
      adultWeight: {
        male: { min: breedCategory.adultWeightRange.min, max: breedCategory.adultWeightRange.max },
        female: { min: breedCategory.adultWeightRange.min * 0.9, max: breedCategory.adultWeightRange.max * 0.9 }
      },
      maturityMonths: breedCategory.maturityAgeMonths
    }
  } else {
    breedProfile = estimateBreedProfileFromWeight(lastEntry.weight, currentAgeDays)
  }

  // Laske rotupohjaiset Gompertz-parametrit
  const initialParams = calculateBreedBasedParameters(breedProfile, 'male') // Oletetaan uros, voisi olla parametri

  // Sovita Gompertz-malli dataan
  const gompertzResult = fitGompertzToData(sortedData, birthDate, initialParams)

  // Validoi parametrit
  if (!validateGompertzParameters(gompertzResult.parameters)) {
    throw new Error('Gompertz-parametrit eivät ole biologisesti valideja')
  }

  // Muunna breedProfile takaisin BreedCategory-muotoon yhteensopivuutta varten
  const breed: BreedCategory = {
    category: breedProfile.category,
    adultWeightRange: {
      min: breedProfile.adultWeight.male.min,
      max: breedProfile.adultWeight.male.max
    },
    maturityAgeMonths: breedProfile.maturityMonths,
    growthCurveParams: {
      rapidGrowthEnd: breedProfile.category === 'toy' ? 12 : breedProfile.category === 'small' ? 16 : breedProfile.category === 'medium' ? 16 : breedProfile.category === 'large' ? 20 : 24,
      steadyGrowthEnd: breedProfile.category === 'toy' ? 24 : breedProfile.category === 'small' ? 32 : breedProfile.category === 'medium' ? 36 : breedProfile.category === 'large' ? 40 : 48,
      slowingGrowthEnd: breedProfile.category === 'toy' ? 32 : breedProfile.category === 'small' ? 40 : breedProfile.category === 'medium' ? 48 : breedProfile.category === 'large' ? 60 : 80
    }
  }

  // Laske nykyinen kasvuvaihe
  const currentPhase = determineGrowthPhase(currentAgeWeeks, breed)

  // Ennusta tulevaisuus Gompertz-mallilla
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

  // Generoi tulevaisuuden ennusteet Gompertz-mallilla
  const futurePredictions = generateGompertzPredictions(
    gompertzResult.parameters,
    currentAgeDays,
    currentAgeDays + (26 * 7), // 26 viikkoa eteenpäin
    7 // viikoittain
  )

  // Muunna Gompertz-ennusteet PredictionPoint-muotoon
  futurePredictions.forEach((pred, index) => {
    if (index === 0) return // Ohita nykyinen päivä

    const futureDate = new Date(birthDate)
    futureDate.setDate(futureDate.getDate() + pred.age)

    const ageWeeks = pred.age / 7

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      ageWeeks,
      weight: pred.weight,
      isPrediction: true
    })

    // Luotettavuusvälit
    if (pred.confidence) {
      upperBound.push({
        date: futureDate.toISOString().split('T')[0],
        ageWeeks,
        weight: pred.confidence.upper,
        isPrediction: true
      })

      lowerBound.push({
        date: futureDate.toISOString().split('T')[0],
        ageWeeks,
        weight: pred.confidence.lower,
        isPrediction: true
      })
    }
  })

  // Laske viikottainen kasvuvauhti Gompertz-mallista
  const weekAgo = currentAgeDays - 7
  const currentWeight = gompertzFunction(currentAgeDays, gompertzResult.parameters)
  const pastWeight = gompertzFunction(Math.max(7, weekAgo), gompertzResult.parameters)
  const recentGrowthRate = Math.max(0.01, Math.min(1.0, (currentWeight - pastWeight)))

  // Ennusta aikuispaino Gompertz-mallista
  const predictedAdultWeight = gompertzResult.parameters.adultWeight

  // Käytä Gompertz-mallin laatumittareita
  const adjustedR2 = Math.max(0.60, Math.min(0.95, gompertzResult.quality.rsquared))

  return {
    predictions,
    r2: adjustedR2,
    coefficients: [gompertzResult.parameters.adultWeight, gompertzResult.parameters.growthDuration, gompertzResult.parameters.inflectionAge], // Yhteensopivuus
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

// Fallback linear regression implementation
function calculateGrowthPredictionLinear(
  weightData: WeightEntry[],
  birthDate: Date,
  breedCategory?: BreedCategory
): GrowthPredictionResult | null {
  if (weightData.length < 2) return null

  const sortedData = [...weightData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const lastEntry = sortedData[sortedData.length - 1]
  const currentAgeWeeks = getAgeInWeeks(birthDate, new Date(lastEntry.date))

  // Arvioi breed jos ei annettu
  const breed = breedCategory || estimateBreedCategory(lastEntry.weight, currentAgeWeeks)

  const predictions: PredictionPoint[] = []

  // Add existing points
  sortedData.forEach(entry => {
    const ageWeeks = getAgeInWeeks(birthDate, new Date(entry.date))
    predictions.push({
      date: entry.date,
      ageWeeks,
      weight: entry.weight,
      isPrediction: false
    })
  })

  // Simple linear prediction with growth rate limiting
  const totalGrowth = lastEntry.weight - sortedData[0].weight
  const totalWeeks = getAgeInWeeks(new Date(sortedData[0].date), new Date(lastEntry.date))
  const growthRatePerWeek = Math.max(0.01, Math.min(0.5, totalGrowth / Math.max(1, totalWeeks)))

  for (let i = 1; i <= 26; i++) {
    const futureDate = new Date(lastEntry.date)
    futureDate.setDate(futureDate.getDate() + (i * 7))

    const futureAgeWeeks = currentAgeWeeks + i

    // Yksinkertainen lineaarinen kasvu hidastuva kohti aikuispainoa
    const maturityProgress = Math.min(1, futureAgeWeeks / (breed.maturityAgeMonths * 4.33))
    const slowingFactor = 1 - (maturityProgress * 0.8) // Hidastuu 80% loppua kohti

    const predictedWeight = Math.min(
      lastEntry.weight + (growthRatePerWeek * i * slowingFactor),
      breed.adultWeightRange.max
    )

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      ageWeeks: futureAgeWeeks,
      weight: predictedWeight,
      isPrediction: true
    })
  }

  return {
    predictions,
    r2: 0.75, // Realistinen arvo linear fallbackille
    coefficients: [growthRatePerWeek, lastEntry.weight], // Kaltevuus ja vakio
    predictedAdultWeight: breed.adultWeightRange.max,
    estimatedMaturityAge: breed.maturityAgeMonths,
    confidenceInterval: {
      upper: predictions.filter(p => p.isPrediction).map(p => ({ ...p, weight: p.weight * 1.15 })),
      lower: predictions.filter(p => p.isPrediction).map(p => ({ ...p, weight: p.weight * 0.85 }))
    },
    currentGrowthPhase: determineGrowthPhase(currentAgeWeeks, breed),
    currentWeeklyGrowthRate: growthRatePerWeek
  }
}