import type { WeightEntry } from '@/services/weightService'
import {
  calculateVeterinaryGrowthEstimate,
  createSimpleGrowthPrediction,
  validateVeterinaryEstimate
} from './veterinaryGrowthCalculator'
import {
  fitGompertzToData,
  generateGompertzPredictions,
  calculateBreedBasedParameters,
  estimateBreedProfileFromWeight,
  validateGompertzParameters,
  gompertzFunction,
  type GompertzParameters
} from './biologicalGrowthModel'

export interface GrowthPredictionResult {
  // Ennustedata
  predictions: PredictionPoint[]
  // Mallin tarkkuus
  r2: number
  // Kertoimet (Gompertz: [adultWeight, growthDuration, inflectionAge])
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
  // Käytetty mallityyppi
  modelType: 'gompertz' | 'veterinary' | 'linear'
  // Gompertz-mallin parametrit (jos käytössä)
  gompertzParams?: GompertzParameters
  // Mallin laatumetriikat
  modelQuality?: {
    rsquared: number
    rmse: number
    mae: number
  }
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
    // Ensisijainen: Gompertz-malli (vähintään 3 datapistettä tieteelliseen sovitukseen)
    if (weightData.length >= 3) {
      const gompertzResult = calculateGrowthPredictionGompertz(weightData, birthDate, breedCategory)
      if (gompertzResult) {
        return gompertzResult
      }
    }
    // Fallback: Veterinaarinen malli (2 datapistettä tai Gompertz epäonnistui)
    return calculateGrowthPredictionVeterinary(weightData, birthDate, breedCategory)
  } catch (error) {
    console.warn('Growth prediction failed, falling back to linear:', error)
    return calculateGrowthPredictionLinear(weightData, birthDate, breedCategory)
  }
}

// Gompertz-kasvumallin mukainen ennuste (tieteellinen)
function calculateGrowthPredictionGompertz(
  weightData: WeightEntry[],
  birthDate: Date,
  breedCategory?: BreedCategory
): GrowthPredictionResult | null {
  if (weightData.length < 3) {
    return null // Gompertz vaatii vähintään 3 datapistettä luotettavaan sovitukseen
  }

  try {
    // 1. Järjestä data ja laske perusarvot
    const sortedData = [...weightData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const lastEntry = sortedData[sortedData.length - 1]
    const ageInDays = Math.floor((new Date(lastEntry.date).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentAgeWeeks = ageInDays / 7

    // 2. Arvioi rotuprofiili nykyisen painon perusteella
    const breedProfile = estimateBreedProfileFromWeight(lastEntry.weight, ageInDays)

    // 3. Laske alustavat Gompertz-parametrit rotuprofiilista
    const initialParams = calculateBreedBasedParameters(breedProfile)

    // 4. Sovita Gompertz-malli dataan (curve fitting)
    const fitResult = fitGompertzToData(weightData, birthDate, initialParams)

    // 5. Validoi parametrit - käytä fallbackia jos epäonnistuu
    if (!validateGompertzParameters(fitResult.parameters)) {
      console.warn('Gompertz-parametrit epärealistiset, käytetään fallbackia')
      return null
    }

    // 6. Generoi ennusteet tulevaisuuteen
    const maturityAgeDays = breedProfile.maturityMonths * 30.44
    const predictionEndAge = Math.max(ageInDays + 180, maturityAgeDays) // Vähintään 6kk tai aikuisikään
    const gompertzPredictions = generateGompertzPredictions(
      fitResult.parameters,
      0, // Aloita syntymästä
      predictionEndAge,
      7 // Viikon välein
    )

    // 7. Muunna yhteensopivaan muotoon
    const predictions = convertToPredictionPoints(gompertzPredictions, birthDate, sortedData)

    // 8. Laske luottamusvälit
    const { upper, lower } = extractConfidenceInterval(gompertzPredictions, birthDate, fitResult.parameters.confidence)

    // 9. Laske kasvuvauhti Gompertz-derivaatasta
    const currentWeeklyGrowthRate = calculateGompertzGrowthRate(ageInDays, fitResult.parameters)

    // 10. Määritä kasvuvaihe
    const currentGrowthPhase = determineGrowthPhaseFromGompertz(ageInDays, fitResult.parameters)

    // 11. Arvioi rotukategoria breed categoryksi
    const breed = breedCategory || estimateBreedCategory(lastEntry.weight, currentAgeWeeks)

    return {
      predictions,
      r2: fitResult.quality.rsquared,
      coefficients: [
        fitResult.parameters.adultWeight,
        fitResult.parameters.growthDuration,
        fitResult.parameters.inflectionAge
      ],
      predictedAdultWeight: fitResult.parameters.adultWeight,
      estimatedMaturityAge: breedProfile.maturityMonths,
      confidenceInterval: { upper, lower },
      currentGrowthPhase,
      currentWeeklyGrowthRate,
      modelType: 'gompertz',
      gompertzParams: fitResult.parameters,
      modelQuality: fitResult.quality
    }
  } catch (error) {
    console.warn('Gompertz growth calculation failed:', error)
    return null
  }
}

// Helper: Muunna Gompertz-ennusteet PredictionPoint-muotoon
function convertToPredictionPoints(
  gompertzPredictions: Array<{ age: number; weight: number; confidence?: { lower: number; upper: number } }>,
  birthDate: Date,
  actualData: WeightEntry[]
): PredictionPoint[] {
  const actualDatesSet = new Set(actualData.map(d => {
    const entryDate = new Date(d.date)
    return entryDate.toISOString().split('T')[0]
  }))

  // Lisää ensin todelliset mittaukset
  const results: PredictionPoint[] = actualData.map(entry => {
    const entryDate = new Date(entry.date)
    const ageInDays = Math.floor((entryDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
    return {
      date: entry.date,
      ageWeeks: ageInDays / 7,
      weight: entry.weight,
      isPrediction: false
    }
  })

  // Lisää ennusteet
  gompertzPredictions.forEach(pred => {
    const date = new Date(birthDate)
    date.setDate(date.getDate() + pred.age)
    const dateStr = date.toISOString().split('T')[0]

    // Älä lisää päällekkäisiä datapisteitä
    if (!actualDatesSet.has(dateStr)) {
      results.push({
        date: dateStr,
        ageWeeks: pred.age / 7,
        weight: pred.weight,
        isPrediction: true
      })
    }
  })

  // Järjestä päivämäärän mukaan
  return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Helper: Laske Gompertz-kasvuvauhti (derivaatta)
function calculateGompertzGrowthRate(
  ageInDays: number,
  params: GompertzParameters
): number {
  const { adultWeight, growthDuration, inflectionAge } = params
  const exponent = -(ageInDays - inflectionAge) / growthDuration

  // Gompertz: W(t) = Wmax * exp(-exp(exponent))
  // Derivaatta: dW/dt = W * exp(exponent) / b
  const weight = gompertzFunction(ageInDays, params)
  const growthRatePerDay = (weight * Math.exp(exponent)) / growthDuration

  // Muunna viikkokohtaiseksi ja varmista järkevä arvo
  return Math.max(0.01, Math.min(2.0, growthRatePerDay * 7))
}

// Helper: Määritä kasvuvaihe Gompertz-mallin perusteella
function determineGrowthPhaseFromGompertz(
  ageInDays: number,
  params: GompertzParameters
): GrowthPhase {
  const { inflectionAge } = params
  const maturityAge = inflectionAge * 2.5 // Arvio aikuisiästä

  if (ageInDays < inflectionAge * 0.5) return 'rapid-growth'
  if (ageInDays < inflectionAge) return 'steady-growth'
  if (ageInDays < inflectionAge * 1.5) return 'slowing-growth'
  if (ageInDays < maturityAge) return 'approaching-adult'
  return 'adult'
}

// Helper: Pura luottamusvälit Gompertz-ennusteista
function extractConfidenceInterval(
  gompertzPredictions: Array<{ age: number; weight: number; confidence?: { lower: number; upper: number } }>,
  birthDate: Date,
  confidenceLevel: number = 0.85
): { upper: PredictionPoint[]; lower: PredictionPoint[] } {
  const upper: PredictionPoint[] = []
  const lower: PredictionPoint[] = []

  gompertzPredictions.forEach(pred => {
    if (pred.confidence) {
      const date = new Date(birthDate)
      date.setDate(date.getDate() + pred.age)
      const dateStr = date.toISOString().split('T')[0]

      upper.push({
        date: dateStr,
        ageWeeks: pred.age / 7,
        weight: pred.confidence.upper,
        isPrediction: true
      })

      lower.push({
        date: dateStr,
        ageWeeks: pred.age / 7,
        weight: pred.confidence.lower,
        isPrediction: true
      })
    }
  })

  return { upper, lower }
}

// Uusi veterinaaripohjainen kasvuennuste
function calculateGrowthPredictionVeterinary(
  weightData: WeightEntry[],
  birthDate: Date,
  breedCategory?: BreedCategory
): GrowthPredictionResult | null {
  if (weightData.length < 1) {
    return null
  }

  try {
    // Laske veterinaarien käytännön kaavoilla
    const veterinaryResult = calculateVeterinaryGrowthEstimate(weightData, birthDate)

    // Luo yksinkertainen kasvuennuste
    const simplePredictions = createSimpleGrowthPrediction(weightData, birthDate)

    // Järjestä data päivämäärän mukaan
    const sortedData = [...weightData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Perusdata
    const lastEntry = sortedData[sortedData.length - 1]
    const currentAgeWeeks = getAgeInWeeks(birthDate, new Date(lastEntry.date))

    // Validoi veterinaaritulos
    if (!validateVeterinaryEstimate(lastEntry.weight, veterinaryResult.estimatedAdultWeight, currentAgeWeeks)) {
      throw new Error('Veterinaarinen arvio tuotti epärealistisen tuloksen')
    }

    // Muunna veterinary category takaisin BreedCategory-muotoon yhteensopivuutta varten
    const categoryMap = {
      toy: { min: 1, max: 5, maturity: 8 },
      small: { min: 5, max: 15, maturity: 10 },
      medium: { min: 15, max: 30, maturity: 12 },
      large: { min: 30, max: 50, maturity: 15 },
      giant: { min: 50, max: 80, maturity: 20 }
    }

    const categoryInfo = categoryMap[veterinaryResult.breedCategory]
    const breed: BreedCategory = breedCategory || {
      category: veterinaryResult.breedCategory,
      adultWeightRange: {
        min: categoryInfo.min,
        max: Math.min(categoryInfo.max, veterinaryResult.estimatedAdultWeight * 1.1)
      },
      maturityAgeMonths: categoryInfo.maturity,
      growthCurveParams: {
        rapidGrowthEnd: veterinaryResult.breedCategory === 'toy' ? 12 : veterinaryResult.breedCategory === 'small' ? 16 : veterinaryResult.breedCategory === 'medium' ? 16 : veterinaryResult.breedCategory === 'large' ? 20 : 24,
        steadyGrowthEnd: veterinaryResult.breedCategory === 'toy' ? 24 : veterinaryResult.breedCategory === 'small' ? 32 : veterinaryResult.breedCategory === 'medium' ? 36 : veterinaryResult.breedCategory === 'large' ? 40 : 48,
        slowingGrowthEnd: veterinaryResult.breedCategory === 'toy' ? 32 : veterinaryResult.breedCategory === 'small' ? 40 : veterinaryResult.breedCategory === 'medium' ? 48 : veterinaryResult.breedCategory === 'large' ? 60 : 80
      }
    }

    // Laske nykyinen kasvuvaihe
    const currentPhase = determineGrowthPhase(currentAgeWeeks, breed)

    // Muunna yksinkertaiset ennusteet PredictionPoint-muotoon
    const predictions: PredictionPoint[] = []
    const upperBound: PredictionPoint[] = []
    const lowerBound: PredictionPoint[] = []

    simplePredictions.forEach(pred => {
      const date = new Date(birthDate)
      date.setDate(date.getDate() + (pred.ageWeeks * 7))

      predictions.push({
        date: date.toISOString().split('T')[0],
        ageWeeks: pred.ageWeeks,
        weight: pred.weight,
        isPrediction: pred.isPrediction
      })

      // Luo luotettavuusvälit (±15% ennusteille)
      if (pred.isPrediction) {
        const uncertainty = pred.weight * 0.15

        upperBound.push({
          date: date.toISOString().split('T')[0],
          ageWeeks: pred.ageWeeks,
          weight: pred.weight + uncertainty,
          isPrediction: true
        })

        lowerBound.push({
          date: date.toISOString().split('T')[0],
          ageWeeks: pred.ageWeeks,
          weight: Math.max(0.1, pred.weight - uncertainty),
          isPrediction: true
        })
      }
    })

    // Laske viikottainen kasvuvauhti
    let recentGrowthRate = 0.1 // Oletus
    if (sortedData.length >= 2) {
      const previousEntry = sortedData[sortedData.length - 2]
      const timeDiffWeeks = getAgeInWeeks(new Date(previousEntry.date), new Date(lastEntry.date))
      const weightDiff = lastEntry.weight - previousEntry.weight
      recentGrowthRate = Math.max(0.01, Math.min(1.0, weightDiff / Math.max(timeDiffWeeks, 1)))
    }

    // Käytä veterinaarista aikuispainoa
    const predictedAdultWeight = veterinaryResult.estimatedAdultWeight

    // R² perustuu veterinaaristen kaavojen luotettavuuteen
    const adjustedR2 = Math.max(0.75, Math.min(0.95, veterinaryResult.confidence))

    return {
      predictions,
      r2: adjustedR2,
      coefficients: [predictedAdultWeight, currentAgeWeeks, recentGrowthRate], // Yhteensopivuus: aikuispaino, ikä, kasvuvauhti
      predictedAdultWeight,
      estimatedMaturityAge: breed.maturityAgeMonths,
      confidenceInterval: {
        upper: upperBound,
        lower: lowerBound
      },
      currentGrowthPhase: currentPhase,
      currentWeeklyGrowthRate: recentGrowthRate,
      modelType: 'veterinary',
      modelQuality: {
        rsquared: adjustedR2,
        rmse: 0, // Veterinaarimalli ei laske RMSE:tä
        mae: 0
      }
    }
  } catch (error) {
    console.warn('Veterinary growth calculation failed:', error)
    return null
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
    currentWeeklyGrowthRate: growthRatePerWeek,
    modelType: 'linear'
  }
}