// Type suppression utilities to handle database null/undefined mismatches
// This is a temporary solution while we migrate to proper type definitions

export function suppressNullErrors<T>(data: any): T {
  return data as T;
}

export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

export function arrayNullToUndefined<T>(arr: (T | null)[]): (T | undefined)[] {
  return arr.map(item => item === null ? undefined : item);
}

// Generic data converter for database responses
export function convertDbResponse<T>(data: any): T {
  if (Array.isArray(data)) {
    return data.map(item => convertDbItem(item)) as T;
  }
  return convertDbItem(data) as T;
}

function convertDbItem(item: any): any {
  if (!item || typeof item !== 'object') return item;
  
  const converted: any = {};
  for (const [key, value] of Object.entries(item)) {
    converted[key] = value === null ? undefined : value;
  }
  return converted;
}