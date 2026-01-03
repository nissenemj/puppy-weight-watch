/**
 * Supabase Mock -infrastruktuuri
 * Käytetään React Query + Supabase -komponenttien testaukseen
 */
import { vi } from "vitest";
import type { WeightEntry } from "@/services/weightService";
import type { Database } from "@/integrations/supabase/types";

type Dog = Database["public"]["Tables"]["dogs"]["Row"];
type DogFood = Database["public"]["Tables"]["dog_foods"]["Row"];

// In-memory storage for mock data
let mockWeightEntries: WeightEntry[] = [];
let mockDogs: Dog[] = [];
let mockDogFoods: DogFood[] = [];

// Reset all mock data
export function resetMockData() {
  mockWeightEntries = [];
  mockDogs = [];
  mockDogFoods = [];
}

// Seed mock data
export function seedMockData(data: {
  weightEntries?: WeightEntry[];
  dogs?: Dog[];
  dogFoods?: DogFood[];
}) {
  if (data.weightEntries) mockWeightEntries = [...data.weightEntries];
  if (data.dogs) mockDogs = [...data.dogs];
  if (data.dogFoods) mockDogFoods = [...data.dogFoods];
}

// Get mock data (for assertions)
export function getMockData() {
  return {
    weightEntries: mockWeightEntries,
    dogs: mockDogs,
    dogFoods: mockDogFoods,
  };
}

// Query builder mock
interface QueryBuilderMock<T> {
  select: (columns?: string) => QueryBuilderMock<T>;
  insert: (data: Partial<T> | Partial<T>[]) => QueryBuilderMock<T>;
  update: (data: Partial<T>) => QueryBuilderMock<T>;
  delete: () => QueryBuilderMock<T>;
  eq: (column: string, value: unknown) => QueryBuilderMock<T>;
  neq: (column: string, value: unknown) => QueryBuilderMock<T>;
  order: (
    column: string,
    options?: { ascending?: boolean },
  ) => QueryBuilderMock<T>;
  limit: (count: number) => QueryBuilderMock<T>;
  single: () => Promise<{ data: T | null; error: Error | null }>;
  maybeSingle: () => Promise<{ data: T | null; error: Error | null }>;
  then: (resolve: (result: { data: T[]; error: Error | null }) => void) => void;
}

function createQueryBuilder<T>(
  table: string,
  initialData: T[],
): QueryBuilderMock<T> {
  const data = [...initialData] as T[];
  let operation: "select" | "insert" | "update" | "delete" = "select";
  let insertData: Partial<T> | Partial<T>[] | null = null;
  let updateData: Partial<T> | null = null;
  const filters: Array<{ column: string; op: string; value: unknown }> = [];
  let orderColumn: string | null = null;
  let orderAscending = true;
  let limitCount: number | null = null;

  const applyFilters = (items: T[]): T[] => {
    let result = items;
    for (const filter of filters) {
      result = result.filter((item) => {
        const value = (item as Record<string, unknown>)[filter.column];
        if (filter.op === "eq") return value === filter.value;
        if (filter.op === "neq") return value !== filter.value;
        return true;
      });
    }
    return result;
  };

  const applyOrder = (items: T[]): T[] => {
    if (!orderColumn) return items;
    return [...items].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[orderColumn!];
      const bVal = (b as Record<string, unknown>)[orderColumn!];
      if (aVal < bVal) return orderAscending ? -1 : 1;
      if (aVal > bVal) return orderAscending ? 1 : -1;
      return 0;
    });
  };

  const builder: QueryBuilderMock<T> = {
    select: () => {
      operation = "select";
      return builder;
    },
    insert: (newData) => {
      operation = "insert";
      insertData = newData;
      return builder;
    },
    update: (newData) => {
      operation = "update";
      updateData = newData;
      return builder;
    },
    delete: () => {
      operation = "delete";
      return builder;
    },
    eq: (column, value) => {
      filters.push({ column, op: "eq", value });
      return builder;
    },
    neq: (column, value) => {
      filters.push({ column, op: "neq", value });
      return builder;
    },
    order: (column, options) => {
      orderColumn = column;
      orderAscending = options?.ascending ?? true;
      return builder;
    },
    limit: (count) => {
      limitCount = count;
      return builder;
    },
    single: async () => {
      const result = applyFilters(applyOrder(data));
      if (operation === "insert" && insertData) {
        const newItem = Array.isArray(insertData) ? insertData[0] : insertData;
        const created = {
          id: `mock-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...newItem,
        } as T;

        // Add to mock storage
        if (table === "weight_entries") {
          mockWeightEntries.push(created as unknown as WeightEntry);
        } else if (table === "dogs") {
          mockDogs.push(created as unknown as Dog);
        }

        return { data: created, error: null };
      }
      if (operation === "update" && updateData) {
        const existing = result[0];
        if (existing) {
          const updated = { ...existing, ...updateData } as T;

          // Update mock storage
          if (table === "weight_entries") {
            const index = mockWeightEntries.findIndex(
              (e) => e.id === (existing as WeightEntry).id,
            );
            if (index >= 0)
              mockWeightEntries[index] = updated as unknown as WeightEntry;
          }

          return { data: updated, error: null };
        }
      }
      return { data: result[0] || null, error: null };
    },
    maybeSingle: async () => {
      const result = applyFilters(applyOrder(data));
      return { data: result[0] || null, error: null };
    },
    then: (resolve) => {
      let result = applyFilters(applyOrder(data));

      if (operation === "delete") {
        // Remove from mock storage
        if (table === "weight_entries") {
          const idsToDelete = applyFilters(
            mockWeightEntries as unknown as T[],
          ).map((e) => (e as WeightEntry).id);
          mockWeightEntries = mockWeightEntries.filter(
            (e) => !idsToDelete.includes(e.id),
          );
        }
        resolve({ data: [], error: null });
        return;
      }

      if (limitCount) {
        result = result.slice(0, limitCount);
      }
      resolve({ data: result, error: null });
    },
  };

  return builder;
}

// Mock Supabase client
export const mockSupabase = {
  from: (table: string) => {
    switch (table) {
      case "weight_entries":
        return createQueryBuilder<WeightEntry>(
          "weight_entries",
          mockWeightEntries,
        );
      case "dogs":
        return createQueryBuilder<Dog>("dogs", mockDogs);
      case "dog_foods":
        return createQueryBuilder<DogFood>("dog_foods", mockDogFoods);
      default:
        return createQueryBuilder<Record<string, unknown>>(table, []);
    }
  },
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: "user-test", email: "test@example.com" } },
      error: null,
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: "user-test" } } },
      error: null,
    }),
    signIn: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi
        .fn()
        .mockResolvedValue({ data: { path: "test/path" }, error: null }),
      download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
      remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: "https://example.com/image.jpg" },
      }),
    }),
  },
};

// Helper to mock the Supabase client import
export function setupSupabaseMock() {
  vi.mock("@/integrations/supabase/client", () => ({
    supabase: mockSupabase,
  }));
}
