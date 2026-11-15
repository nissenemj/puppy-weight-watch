type FeedingRow = { weightKg: string; gramsPerDay: readonly (number | null)[] };

export interface PuppyDogFood {
  id: string;
  name: string;
  sourceUrl: string;
  chartUrl?: string;
  sourceLocale: string;
  checkedAt: string;
  ages: readonly string[];
  rows: readonly FeedingRow[];
}

export const PUPPY_DOG_FOODS: readonly PuppyDogFood[] = [
  {
    id: "hau-hau-puppy",
    name: "Hau-Hau Champion Pennuille ja emoille, kanaa, riisiä ja kauraa",
    sourceUrl: "https://hauhau.fi/products/kanaa-riisia-ja-kauraa-kotimainen-koiranpennun-kuivaruoka",
    chartUrl: "https://hauhau.fi/cdn/shop/files/5238-5239-hau-hau-champion-nokian-nappulatehtaan-pennuille-ja-emoille-kanaa-riisia-ja-kauraa-kotimainen-koiranpennun-kuivaruoka-3_1200x.jpg?v=1776427963",
    sourceLocale: "Suomen tuotesivun pakkauskuva",
    checkedAt: "2026-11-15",
    ages: ["1–2", "3–4", "5–6", "7–12"],
    rows: [
      { weightKg: "5", gramsPerDay: [70, 90, 90, 80] },
      { weightKg: "10", gramsPerDay: [100, 140, 140, 130] },
      { weightKg: "15", gramsPerDay: [130, 170, 190, 190] },
      { weightKg: "20", gramsPerDay: [160, 200, 230, 220] },
      { weightKg: "25", gramsPerDay: [160, 240, 270, 260] },
      { weightKg: "30", gramsPerDay: [180, 260, 300, 300] },
      { weightKg: "40", gramsPerDay: [190, 280, 360, 370] },
      { weightKg: "50", gramsPerDay: [220, 290, 400, 430] },
      { weightKg: "60", gramsPerDay: [250, 330, 490, 490] },
    ],
  },
  {
    id: "brit-care-hypoallergenic-puppy",
    name: "Brit Care Dog Hypoallergenic Puppy, lammas ja riisi",
    sourceUrl: "https://brit.pet/en/products/brit-care-dog-hypoallergenic-puppy",
    sourceLocale: "Valmistajan englanninkielinen tuotesivu",
    checkedAt: "2026-11-15",
    ages: ["1–3", "3–4", "4–6", "6–12"],
    rows: [
      { weightKg: "5", gramsPerDay: [50, 75, 75, 70] },
      { weightKg: "10", gramsPerDay: [85, 120, 130, 120] },
      { weightKg: "15", gramsPerDay: [115, 160, 175, 170] },
      { weightKg: "20", gramsPerDay: [140, 180, 220, 210] },
      { weightKg: "25", gramsPerDay: [150, null, null, null] },
      { weightKg: "30", gramsPerDay: [170, null, null, null] },
      { weightKg: "40", gramsPerDay: [180, null, null, null] },
      { weightKg: "50", gramsPerDay: [210, null, null, null] },
      { weightKg: "60", gramsPerDay: [240, null, null, null] },
      { weightKg: "70", gramsPerDay: [260, null, null, null] },
      { weightKg: "80", gramsPerDay: [280, null, null, null] },
      { weightKg: "yli 90", gramsPerDay: [310, null, null, null] },
    ],
  },
  {
    id: "royal-canin-labrador-puppy",
    name: "Royal Canin Labrador Retriever Puppy",
    sourceUrl: "https://www.royalcanin.com/fi/dogs/products/retail-products/labrador-retriever-puppy-2491",
    sourceLocale: "Valmistajan Suomen tuotesivu",
    checkedAt: "2026-11-15",
    ages: ["2", "3", "4", "6", "8", "10", "12", "14"],
    rows: [
      { weightKg: "26", gramsPerDay: [214, 265, 287, 328, 303, 290, 292, 289] },
      { weightKg: "32", gramsPerDay: [226, 285, 312, 382, 356, 341, 342, 338] },
      { weightKg: "40", gramsPerDay: [241, 313, 344, 452, 425, 417, 407, 400] },
    ],
  },
];
