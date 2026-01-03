/**
 * Painomerkintä-fikstuurat testaukseen
 */
import type { WeightEntry } from "@/services/weightService";

// Labrador-pennun tyypillinen kasvukäyrä
export const labradorPuppyWeights: WeightEntry[] = [
  {
    id: "w-1",
    dog_id: "dog-1",
    weight: 2.5,
    date: "2024-01-01",
    user_id: "user-1",
    created_at: "2024-01-01T12:00:00Z",
  },
  {
    id: "w-2",
    dog_id: "dog-1",
    weight: 5.0,
    date: "2024-02-14",
    user_id: "user-1",
    created_at: "2024-02-14T12:00:00Z",
  },
  {
    id: "w-3",
    dog_id: "dog-1",
    weight: 9.0,
    date: "2024-03-15",
    user_id: "user-1",
    created_at: "2024-03-15T12:00:00Z",
  },
  {
    id: "w-4",
    dog_id: "dog-1",
    weight: 14.0,
    date: "2024-04-15",
    user_id: "user-1",
    created_at: "2024-04-15T12:00:00Z",
  },
  {
    id: "w-5",
    dog_id: "dog-1",
    weight: 18.0,
    date: "2024-05-15",
    user_id: "user-1",
    created_at: "2024-05-15T12:00:00Z",
  },
  {
    id: "w-6",
    dog_id: "dog-1",
    weight: 22.0,
    date: "2024-06-15",
    user_id: "user-1",
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: "w-7",
    dog_id: "dog-1",
    weight: 25.0,
    date: "2024-08-15",
    user_id: "user-1",
    created_at: "2024-08-15T12:00:00Z",
  },
];

// Chihuahua-pennun kasvukäyrä
export const chihuahuaPuppyWeights: WeightEntry[] = [
  {
    id: "w-10",
    dog_id: "dog-3",
    weight: 0.3,
    date: "2024-01-01",
    user_id: "user-2",
    created_at: "2024-01-01T12:00:00Z",
  },
  {
    id: "w-11",
    dog_id: "dog-3",
    weight: 0.5,
    date: "2024-02-14",
    user_id: "user-2",
    created_at: "2024-02-14T12:00:00Z",
  },
  {
    id: "w-12",
    dog_id: "dog-3",
    weight: 0.9,
    date: "2024-03-15",
    user_id: "user-2",
    created_at: "2024-03-15T12:00:00Z",
  },
  {
    id: "w-13",
    dog_id: "dog-3",
    weight: 1.3,
    date: "2024-04-15",
    user_id: "user-2",
    created_at: "2024-04-15T12:00:00Z",
  },
  {
    id: "w-14",
    dog_id: "dog-3",
    weight: 1.8,
    date: "2024-05-15",
    user_id: "user-2",
    created_at: "2024-05-15T12:00:00Z",
  },
  {
    id: "w-15",
    dog_id: "dog-3",
    weight: 2.2,
    date: "2024-06-15",
    user_id: "user-2",
    created_at: "2024-06-15T12:00:00Z",
  },
];

// Saksanpaimenkoira-pennun kasvukäyrä
export const germanShepherdPuppyWeights: WeightEntry[] = [
  {
    id: "w-20",
    dog_id: "dog-2",
    weight: 4.0,
    date: "2024-01-01",
    user_id: "user-1",
    created_at: "2024-01-01T12:00:00Z",
  },
  {
    id: "w-21",
    dog_id: "dog-2",
    weight: 8.0,
    date: "2024-02-14",
    user_id: "user-1",
    created_at: "2024-02-14T12:00:00Z",
  },
  {
    id: "w-22",
    dog_id: "dog-2",
    weight: 14.0,
    date: "2024-03-15",
    user_id: "user-1",
    created_at: "2024-03-15T12:00:00Z",
  },
  {
    id: "w-23",
    dog_id: "dog-2",
    weight: 20.0,
    date: "2024-04-15",
    user_id: "user-1",
    created_at: "2024-04-15T12:00:00Z",
  },
  {
    id: "w-24",
    dog_id: "dog-2",
    weight: 26.0,
    date: "2024-05-15",
    user_id: "user-1",
    created_at: "2024-05-15T12:00:00Z",
  },
  {
    id: "w-25",
    dog_id: "dog-2",
    weight: 30.0,
    date: "2024-06-15",
    user_id: "user-1",
    created_at: "2024-06-15T12:00:00Z",
  },
];

// Helper: Luo painomerkintä
export function createMockWeightEntry(
  overrides: Partial<WeightEntry> = {},
): WeightEntry {
  return {
    id: `weight-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    dog_id: "dog-test",
    weight: 10.0,
    date: new Date().toISOString().split("T")[0],
    user_id: "user-test",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

// Helper: Luo kasvukäyrä annetuista parametreista
export function createGrowthCurve(
  dogId: string,
  userId: string,
  birthDate: Date,
  weeklyWeights: number[],
): WeightEntry[] {
  return weeklyWeights.map((weight, index) => {
    const date = new Date(birthDate);
    date.setDate(date.getDate() + index * 7);

    return {
      id: `w-${dogId}-${index}`,
      dog_id: dogId,
      weight,
      date: date.toISOString().split("T")[0],
      user_id: userId,
      created_at: date.toISOString(),
    };
  });
}
