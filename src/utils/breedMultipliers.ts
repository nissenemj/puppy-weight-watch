/**
 * Breed-based metabolic multipliers for food calculations
 *
 * Smaller breeds have higher metabolic rates per kg body weight,
 * while larger breeds have lower metabolic rates.
 *
 * These multipliers are applied to the base feeding amount.
 */

export interface BreedCategory {
  name: string;
  minWeight: number;
  maxWeight: number;
  multiplier: number;
  description: string;
}

export const BREED_CATEGORIES: BreedCategory[] = [
  {
    name: 'Toy',
    minWeight: 0,
    maxWeight: 5,
    multiplier: 1.15,
    description: 'Pienet koirat (esim. chihuahua, yorkshire) - korkeampi aineenvaihdunta'
  },
  {
    name: 'Small',
    minWeight: 5,
    maxWeight: 15,
    multiplier: 1.05,
    description: 'Pienet rodut (esim. mäyräkoira, beagle)'
  },
  {
    name: 'Medium',
    minWeight: 15,
    maxWeight: 30,
    multiplier: 1.0,
    description: 'Keskikokoiset rodut (esim. border collie, cocker spaniel) - perusarvo'
  },
  {
    name: 'Large',
    minWeight: 30,
    maxWeight: 50,
    multiplier: 0.95,
    description: 'Suuret rodut (esim. labradorinnoutaja, saksanpaimenkoira)'
  },
  {
    name: 'Giant',
    minWeight: 50,
    maxWeight: Infinity,
    multiplier: 0.90,
    description: 'Jättirodut (esim. tanskandoggi, bernardinkoira) - hitaampi aineenvaihdunta'
  }
];

/**
 * Get the metabolic multiplier based on expected adult weight
 * @param expectedAdultWeight - Expected adult weight in kg
 * @returns Multiplier to apply to base feeding amount
 */
export const getBreedMultiplier = (expectedAdultWeight: number): number => {
  if (expectedAdultWeight <= 0) return 1.0;

  const category = BREED_CATEGORIES.find(
    cat => expectedAdultWeight > cat.minWeight && expectedAdultWeight <= cat.maxWeight
  );

  return category?.multiplier ?? 1.0;
};

/**
 * Get breed category information based on expected adult weight
 * @param expectedAdultWeight - Expected adult weight in kg
 * @returns Breed category information or null
 */
export const getBreedCategory = (expectedAdultWeight: number): BreedCategory | null => {
  if (expectedAdultWeight <= 0) return null;

  return BREED_CATEGORIES.find(
    cat => expectedAdultWeight > cat.minWeight && expectedAdultWeight <= cat.maxWeight
  ) ?? null;
};

/**
 * Linear interpolation helper for food amount calculation
 * When weight is between two guideline values, interpolate the amount
 *
 * @param weight - Current weight to calculate for
 * @param lowerBound - Lower guideline (weight and amount)
 * @param upperBound - Upper guideline (weight and amount)
 * @returns Interpolated amount
 */
export const interpolateAmount = (
  weight: number,
  lowerBound: { weight: number; amount: number },
  upperBound: { weight: number; amount: number }
): number => {
  // Prevent division by zero
  if (upperBound.weight === lowerBound.weight) {
    return lowerBound.amount;
  }

  const ratio = (weight - lowerBound.weight) / (upperBound.weight - lowerBound.weight);
  const interpolated = lowerBound.amount + ratio * (upperBound.amount - lowerBound.amount);

  return Math.round(interpolated);
};

/**
 * Find the closest guideline bounds for interpolation
 * @param targetWeight - Weight to find bounds for
 * @param guidelines - Array of guidelines with weight and amount
 * @returns Object with lower and upper bounds, or null if not applicable
 */
export const findInterpolationBounds = <T extends { weight: number; amount: number }>(
  targetWeight: number,
  guidelines: T[]
): { lower: T; upper: T } | null => {
  if (guidelines.length < 2) return null;

  // Sort by weight
  const sorted = [...guidelines].sort((a, b) => a.weight - b.weight);

  // Find lower and upper bounds
  let lower: T | null = null;
  let upper: T | null = null;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].weight <= targetWeight) {
      lower = sorted[i];
    }
    if (sorted[i].weight >= targetWeight && !upper) {
      upper = sorted[i];
    }
  }

  // If we have both bounds and they're different
  if (lower && upper && lower !== upper) {
    return { lower, upper };
  }

  // If weight is below minimum, use first two
  if (!lower && sorted.length >= 2) {
    return { lower: sorted[0], upper: sorted[1] };
  }

  // If weight is above maximum, use last two
  if (!upper && sorted.length >= 2) {
    return { lower: sorted[sorted.length - 2], upper: sorted[sorted.length - 1] };
  }

  return null;
};
