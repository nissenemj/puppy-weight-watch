/**
 * Yksinkertainen, veterinaarisesti perusteltu kasvulaskuri
 * Perustuu todellisiin veterinaarien käyttämiin käytännön sääntöihin
 * Korvaa monimutkaisen Gompertz-mallin luotettavilla kaavilla
 */

import type { WeightEntry } from '@/services/weightService'
import type { BreedProfile } from '@/data/breedGrowthProfiles'
import { getMixedBreedProfile } from '@/data/breedGrowthProfiles'

// Rotukohtaiset maksimipainot (biologiset rajat)
const BREED_MAX_WEIGHTS = {
  toy: 5,      // Toy-rodut: max 5kg
  small: 15,   // Pienet rodut: max 15kg
  medium: 30,  // Keskikokoiset: max 30kg
  large: 50,   // Suuret rodut: max 50kg
  giant: 80    // Jättirodut: max 80kg
} as const

// Veterinaarien käyttämät kasvukaavat
interface VeterinaryEstimate {
  formula: string
  weight: number
  confidence: number // 0-1, kuinka luotettava kaava on tässä iässä
  ageRange: { min: number; max: number } // Viikkoina, milloin kaava on käyttökelpoinen
}

/**
 * Laske aikuispainon arvio veterinaarien käytännön kaavoilla
 */
export function calculateVeterinaryGrowthEstimate(
  weightData: WeightEntry[],
  birthDate: Date
): {
  estimatedAdultWeight: number
  confidence: number
  usedFormulas: VeterinaryEstimate[]
  breedCategory: 'toy' | 'small' | 'medium' | 'large' | 'giant'
} {
  if (weightData.length === 0) {
    throw new Error('Tarvitaan vähintään yksi painomittaus')
  }

  // Järjestä data ja ota viimeisin mittaus
  const sortedData = [...weightData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const latestEntry = sortedData[sortedData.length - 1]
  const currentWeight = latestEntry.weight

  // Laske ikä viikkoina
  const ageInDays = Math.floor((new Date(latestEntry.date).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const ageInWeeks = ageInDays / 7

  // Veterinaarien käytännön kaavat
  const estimates: VeterinaryEstimate[] = []

  // 1. Peruskaava: (Paino / ikä_viikkoina) × 52
  if (ageInWeeks >= 6) { // Vähintään 6 viikkoa vanha
    estimates.push({
      formula: 'Peruskaava: (paino / ikä_viikkoina) × 52',
      weight: (currentWeight / ageInWeeks) * 52,
      confidence: ageInWeeks >= 12 ? 0.8 : 0.6, // Luotettavampi vanhemmilla pennuilla
      ageRange: { min: 6, max: 52 }
    })
  }

  // 2. Prosenttiperustainen kasvu
  if (ageInWeeks >= 6 && ageInWeeks <= 10) {
    // 8 viikkoa ≈ 25-30% aikuispainosta
    estimates.push({
      formula: '8 viikon sääntö: paino ÷ 0.275 (27.5% aikuispainosta)',
      weight: currentWeight / 0.275,
      confidence: Math.abs(ageInWeeks - 8) <= 1 ? 0.75 : 0.6,
      ageRange: { min: 6, max: 10 }
    })
  }

  if (ageInWeeks >= 12 && ageInWeeks <= 20) {
    // 4 kuukautta (16 viikkoa) ≈ 50-60% aikuispainosta
    estimates.push({
      formula: '4 kuukauden sääntö: paino × 2 (50% aikuispainosta)',
      weight: currentWeight * 2,
      confidence: Math.abs(ageInWeeks - 16) <= 2 ? 0.9 : 0.7,
      ageRange: { min: 12, max: 20 }
    })
  }

  if (ageInWeeks >= 20 && ageInWeeks <= 30) {
    // 6 kuukautta (26 viikkoa) ≈ 75% aikuispainosta
    estimates.push({
      formula: '6 kuukauden sääntö: paino ÷ 0.75 (75% aikuispainosta)',
      weight: currentWeight / 0.75,
      confidence: Math.abs(ageInWeeks - 26) <= 2 ? 0.85 : 0.7,
      ageRange: { min: 20, max: 30 }
    })
  }

  if (ageInWeeks >= 10 && ageInWeeks <= 18) {
    // 14 viikon sääntö: paino × 2.5
    estimates.push({
      formula: '14 viikon sääntö: paino × 2.5',
      weight: currentWeight * 2.5,
      confidence: Math.abs(ageInWeeks - 14) <= 2 ? 0.8 : 0.65,
      ageRange: { min: 10, max: 18 }
    })
  }

  // Jos pentu on jo vanha (yli 8 kk), käytä nykyistä painoa + pieni kasvu
  if (ageInWeeks >= 32) {
    estimates.push({
      formula: 'Aikuisikäinen: nykypaino + 10% kasvuvaraa',
      weight: currentWeight * 1.1,
      confidence: ageInWeeks >= 40 ? 0.95 : 0.8,
      ageRange: { min: 32, max: 104 }
    })
  }

  if (estimates.length === 0) {
    // Liian nuori pentu (alle 6 viikkoa)
    estimates.push({
      formula: 'Nuori pentu: arvio peruskaavalla',
      weight: (currentWeight / Math.max(ageInWeeks, 1)) * 52,
      confidence: 0.4,
      ageRange: { min: 1, max: 6 }
    })
  }

  // Laske painotettu keskiarvo
  const totalWeight = estimates.reduce((sum, est) => sum + (est.weight * est.confidence), 0)
  const totalConfidence = estimates.reduce((sum, est) => sum + est.confidence, 0)
  const weightedAverage = totalWeight / totalConfidence

  // Arvioi rotukategoria painon perusteella
  const breedCategory = estimateBreedCategory(weightedAverage)

  // Rajoita tulos rotukohtaisiin biologisiin rajoihin
  const maxWeight = BREED_MAX_WEIGHTS[breedCategory]
  const finalWeight = Math.min(weightedAverage, maxWeight)

  // Varmista että tulos on järkevä (vähintään nykypaino, max 4x nykypaino)
  const validatedWeight = Math.max(
    currentWeight,
    Math.min(finalWeight, currentWeight * 4)
  )

  return {
    estimatedAdultWeight: validatedWeight,
    confidence: totalConfidence / estimates.length, // Keskimääräinen luottamus
    usedFormulas: estimates,
    breedCategory
  }
}

/**
 * Arvioi rotukategoria aikuispainon perusteella
 */
function estimateBreedCategory(estimatedWeight: number): 'toy' | 'small' | 'medium' | 'large' | 'giant' {
  if (estimatedWeight <= 5) return 'toy'
  if (estimatedWeight <= 15) return 'small'
  if (estimatedWeight <= 30) return 'medium'
  if (estimatedWeight <= 50) return 'large'
  return 'giant'
}

/**
 * Luo yksinkertainen kasvuennuste
 */
export function createSimpleGrowthPrediction(
  weightData: WeightEntry[],
  birthDate: Date,
  weeksIntoFuture: number = 26
): Array<{ ageWeeks: number; weight: number; isPrediction: boolean }> {
  const result = calculateVeterinaryGrowthEstimate(weightData, birthDate)
  const latestEntry = weightData[weightData.length - 1]
  const currentAgeWeeks = Math.floor((new Date(latestEntry.date).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

  const predictions = []

  // Lisää nykyiset mittaukset
  for (const entry of weightData) {
    const ageWeeks = Math.floor((new Date(entry.date).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
    predictions.push({
      ageWeeks,
      weight: entry.weight,
      isPrediction: false
    })
  }

  // Luo tulevaisuuden ennusteet
  const targetWeight = result.estimatedAdultWeight
  const currentWeight = latestEntry.weight
  const growthRemaining = Math.max(0, targetWeight - currentWeight)

  // Kasvun hidastuminen ajan myötä (exponentiaalinen)
  for (let week = 1; week <= weeksIntoFuture; week++) {
    const futureAge = currentAgeWeeks + week

    // Kasvun hidastumiskerroin (mitä vanhempi, sitä hitaampi kasvu)
    const maturityAge = getMaturityAge(result.breedCategory)
    const maturityProgress = Math.min(1, futureAge / maturityAge)
    const growthRate = Math.exp(-maturityProgress * 2) // Exponentiaalinen hidastuminen

    // Laske viikottainen kasvu
    const weeklyGrowth = (growthRemaining * growthRate) / weeksIntoFuture
    const previousWeight = predictions[predictions.length - 1].weight
    const newWeight = Math.min(previousWeight + weeklyGrowth, targetWeight)

    predictions.push({
      ageWeeks: futureAge,
      weight: newWeight,
      isPrediction: true
    })
  }

  return predictions
}

/**
 * Rotukohtaiset aikuisiät viikkoina
 */
function getMaturityAge(category: 'toy' | 'small' | 'medium' | 'large' | 'giant'): number {
  const maturityAges = {
    toy: 32,    // 8 kuukautta
    small: 44,  // 11 kuukautta
    medium: 52, // 12 kuukautta
    large: 72,  // 18 kuukautta
    giant: 96   // 24 kuukautta
  }
  return maturityAges[category]
}

/**
 * Validoi että arvio on biologisesti järkevä
 */
export function validateVeterinaryEstimate(
  currentWeight: number,
  estimatedAdultWeight: number,
  ageInWeeks: number
): boolean {
  // Aikuispaino ei voi olla pienempi kuin nykypaino
  if (estimatedAdultWeight < currentWeight) return false

  // Aikuispaino ei voi olla yli 4x nykypaino (biologinen raja)
  if (estimatedAdultWeight > currentWeight * 4) return false

  // Jos pentu on yli 8kk, kasvua ei voi olla paljon jäljellä
  if (ageInWeeks > 32 && estimatedAdultWeight > currentWeight * 1.3) return false

  // Aikuispaino ei voi ylittää 80kg (suurimmatkin rodut)
  if (estimatedAdultWeight > 80) return false

  return true
}