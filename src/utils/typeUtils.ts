// Comprehensive type utilities for database operations and type conversions
// Consolidated from typeSuppress.ts, typeConverters.ts, and typeFixers.ts

// Type assertion utilities
export function suppressNullErrors<T>(data: unknown): T {
  return data as T;
}

export function assertDefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

export function assertString(value: string | null | undefined): string {
  return value || '';
}

export function assertArray<T>(value: T[] | null | undefined): T[] {
  return value || [];
}

export function assertNumber(value: number | null | undefined): number | undefined {
  return value === null ? undefined : value;
}

export function assertBoolean(value: boolean | null | undefined): boolean | undefined {
  return value === null ? undefined : value;
}

// Null/undefined conversion utilities
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

export function arrayNullToUndefined<T>(arr: (T | null)[]): (T | undefined)[] {
  return arr.map(item => item === null ? undefined : item);
}

// Deep conversion utilities
export function convertNullToUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return undefined as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertNullToUndefined(item)) as T;
  }

  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const objKey = key as keyof T;
        converted[key] = obj[objKey] === null ? undefined : convertNullToUndefined(obj[objKey]);
      }
    }
    return converted as T;
  }

  return obj;
}

export function convertUndefinedToNull<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertUndefinedToNull(item)) as T;
  }

  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const objKey = key as keyof T;
        converted[key] = obj[objKey] === undefined ? null : convertUndefinedToNull(obj[objKey]);
      }
    }
    return converted as T;
  }

  return obj;
}

// Generic data converter for database responses
export function convertDbResponse<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map(item => convertDbItem(item)) as T;
  }
  return convertDbItem(data) as T;
}

function convertDbItem(item: unknown): Record<string, unknown> {
  if (!item || typeof item !== 'object' || item === null) {
    return item as Record<string, unknown>;
  }

  const converted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    converted[key] = value === null ? undefined : value;
  }
  return converted;
}

// Type-safe converters for specific data types
export const dbToAppTypes = {
  dogFood: (dbData: unknown) => convertNullToUndefined(dbData),
  feedingGuideline: (dbData: unknown) => convertNullToUndefined(dbData),
  dog: (dbData: unknown) => convertNullToUndefined(dbData),
  dosageImage: (dbData: unknown) => convertNullToUndefined(dbData),
  foodNutrition: (dbData: unknown) => convertNullToUndefined(dbData),
  foodManufacturer: (dbData: unknown) => convertNullToUndefined(dbData)
} as const;

export const appToDbTypes = {
  dogFood: (appData: unknown) => convertUndefinedToNull(appData),
  feedingGuideline: (appData: unknown) => convertUndefinedToNull(appData),
  dog: (appData: unknown) => convertUndefinedToNull(appData),
  dosageImage: (appData: unknown) => convertUndefinedToNull(appData),
  foodNutrition: (appData: unknown) => convertUndefinedToNull(appData),
  foodManufacturer: (appData: unknown) => convertUndefinedToNull(appData)
} as const;