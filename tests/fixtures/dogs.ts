/**
 * Koira-fikstuurat testaukseen
 */
import type { Database } from "@/integrations/supabase/types";

type Dog = Database["public"]["Tables"]["dogs"]["Row"];

export const mockDogs: Dog[] = [
  {
    id: "dog-1",
    name: "Bella",
    breed: "Labradori",
    weight_kg: 25.5,
    age_years: 2,
    activity_level: "active",
    health_conditions: null,
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "dog-2",
    name: "Max",
    breed: "Saksanpaimenkoira",
    weight_kg: 32.0,
    age_years: 3,
    activity_level: "very_active",
    health_conditions: ["allergies"],
    user_id: "user-1",
    created_at: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "dog-3",
    name: "Luna",
    breed: "Chihuahua",
    weight_kg: 2.5,
    age_years: 1,
    activity_level: "normal",
    health_conditions: null,
    user_id: "user-2",
    created_at: "2024-02-01T00:00:00.000Z",
  },
];

// Helper funktio yksittäisen koiran luomiseen
export function createMockDog(overrides: Partial<Dog> = {}): Dog {
  return {
    id: `dog-${Date.now()}`,
    name: "Testikoira",
    breed: null,
    weight_kg: null,
    age_years: null,
    activity_level: null,
    health_conditions: null,
    user_id: "user-test",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

// Helper funktio pennun luomiseen (kasvutestejä varten)
export function createMockPuppy(
  birthDate: Date,
  breed: string = "Sekarotuinen",
  userId: string = "user-test",
): Dog {
  const now = new Date();
  const ageMonths = Math.floor(
    (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  );
  const ageYears = ageMonths / 12;

  return {
    id: `puppy-${Date.now()}`,
    name: "Pentu",
    breed,
    weight_kg: null,
    age_years: ageYears,
    activity_level: "normal",
    health_conditions: null,
    user_id: userId,
    created_at: birthDate.toISOString(),
  };
}
