import type { AdultDogFood } from "@/data/adultDogFoods";

export const ADULT_ENERGY_SOURCE =
  "https://europeanpetfood.org/wp-content/uploads/2025/09/FEDIAF-Nutritional-Guidelines_2025-ONLINE.pdf#page=55";
export const ADULT_ACTIVITIES = {
  low: {
    coefficient: 95,
    label: "Alle tunti päivässä, esimerkiksi hihnalenkit",
  },
  moderate: {
    coefficient: 110,
    label: "1–3 tuntia päivässä, rauhallista liikkumista",
  },
  energetic: {
    coefficient: 125,
    label: "1–3 tuntia päivässä, reipasta liikkumista",
  },
} as const;
export type AdultActivity = keyof typeof ADULT_ACTIVITIES;

export function parseAdultWeight(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const weight = Number(normalized);
  return Number.isFinite(weight) && weight >= 0.1 && weight <= 150
    ? weight
    : null;
}

export function adultFoodAmount(
  weight: number,
  food: AdultDogFood,
  method: "manufacturer" | "energy",
  activity: AdultActivity,
  meals: number,
) {
  if (
    !Number.isFinite(weight) ||
    weight < 0.1 ||
    weight > 150 ||
    ![1, 2, 3, 4].includes(meals)
  )
    throw new Error("Tarkista paino (0,1–150 kg) ja aterioiden määrä.");
  if (!Number.isFinite(food.energyKcalPerKg) || food.energyKcalPerKg <= 0)
    throw new Error("Ruoan ilmoitettu energiasisältö puuttuu.");
  if (food.minimumWeightKg && weight < food.minimumWeightKg)
    throw new Error(
      `Valmistajan tuote on suurille aikuisille koirille. Sen taulukko alkaa ${food.minimumWeightKg} kg:sta. Valitse koirallesi tarkoitettu ruoka.`,
    );
  if (!Object.prototype.hasOwnProperty.call(ADULT_ACTIVITIES, activity))
    throw new Error("Valitse aktiivisuus.");
  if (method === "manufacturer") {
    const row = food.feeding.find((row) => row.weightKg === weight);
    if (!row) return null; // Do not invent or interpolate a manufacturer's recommendation.
    return {
      gramsPerDay: row.gramsPerDay,
      gramsPerMeal: row.gramsPerDay / meals,
      kcalPerDay: (row.gramsPerDay * food.energyKcalPerKg) / 1000,
      coefficient: null,
    };
  }
  const coefficient = ADULT_ACTIVITIES[activity].coefficient;
  const kcalPerDay = coefficient * weight ** 0.75;
  const gramsPerDay = (kcalPerDay * 1000) / food.energyKcalPerKg;
  return {
    gramsPerDay,
    gramsPerMeal: gramsPerDay / meals,
    kcalPerDay,
    coefficient,
  };
}
