// Quick type assertion helpers for database null/undefined issues

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