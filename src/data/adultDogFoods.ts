export interface AdultDogFood {
  id: string;
  name: string;
  lifeStage: "adult";
  nutritionType: "complete";
  energyKcalPerKg: number;
  sourceUrl: string;
  sourceLocale: string;
  checkedAt: string;
  minimumWeightKg?: number;
  feeding: ReadonlyArray<{ weightKg: number; gramsPerDay: number }>;
}

// Product-specific manufacturer pages, checked 2026-11-04. Compare with the
// actual package: regional recipes can differ. These are not food rankings.
export const ADULT_DOG_FOODS: readonly AdultDogFood[] = [
  {
    id: "hauhau-kana-riisi-kaura-adult-fi",
    name: "Hau-Hau Champion Kanaa, riisiä & kauraa, aikuisille",
    lifeStage: "adult",
    nutritionType: "complete",
    energyKcalPerKg: 3800,
    sourceUrl:
      "https://hauhau.fi/products/kanaa-riisia-ja-kauraa-kotimainen-koiran-kuivaruoka",
    sourceLocale: "Suomi",
    checkedAt: "2026-11-04",
    feeding: [
      [5, 100],
      [10, 150],
      [15, 190],
      [20, 230],
      [25, 270],
      [30, 310],
      [40, 380],
      [50, 440],
      [60, 510],
      [70, 570],
      [80, 620],
    ].map(([weightKg, gramsPerDay]) => ({ weightKg, gramsPerDay })),
  },
  {
    id: "hauhau-kana-riisi-kaura-large-fi",
    name: "Hau-Hau Champion Kanaa, riisiä & kauraa, suurille koirille",
    lifeStage: "adult",
    nutritionType: "complete",
    energyKcalPerKg: 3820,
    sourceUrl:
      "https://hauhau.fi/products/kanaa-riisia-ja-kauraa-kotimainen-kuivaruoka-suurille-koirille",
    sourceLocale: "Suomi",
    checkedAt: "2026-11-04",
    feeding: [
      [30, 320],
      [40, 390],
      [50, 450],
      [60, 520],
      [70, 580],
      [80, 640],
      [90, 690],
    ].map(([weightKg, gramsPerDay]) => ({ weightKg, gramsPerDay })),
  },
  {
    id: "brit-care-hypoallergenic-adult-large-en",
    minimumWeightKg: 25,
    name: "Brit Care Dog Hypoallergenic Adult Large Breed",
    lifeStage: "adult",
    nutritionType: "complete",
    energyKcalPerKg: 3690,
    sourceUrl:
      "https://brit.pet/en/products/brit-care-dog-hypoallergenic-adult-large-breed",
    sourceLocale: "Valmistajan englanninkielinen tuotesivu",
    checkedAt: "2026-11-04",
    feeding: [
      [25, 260],
      [30, 300],
      [40, 370],
      [50, 430],
      [60, 500],
      [70, 560],
      [80, 620],
      [90, 680],
    ].map(([weightKg, gramsPerDay]) => ({ weightKg, gramsPerDay })),
  },
];
