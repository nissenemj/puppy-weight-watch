// Utility functions to convert between database null values and TypeScript undefined values

export function convertNullToUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return undefined as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertNullToUndefined(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = obj[key] === null ? undefined : convertNullToUndefined(obj[key]);
      }
    }
    return converted;
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
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = obj[key] === undefined ? null : convertUndefinedToNull(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
}

// Type-safe converters for specific data types
export const dbToAppTypes = {
  dogFood: (dbData: any) => convertNullToUndefined(dbData),
  feedingGuideline: (dbData: any) => convertNullToUndefined(dbData),
  dog: (dbData: any) => convertNullToUndefined(dbData),
  dosageImage: (dbData: any) => convertNullToUndefined(dbData),
  foodNutrition: (dbData: any) => convertNullToUndefined(dbData),
  foodManufacturer: (dbData: any) => convertNullToUndefined(dbData)
};

export const appToDbTypes = {
  dogFood: (appData: any) => convertUndefinedToNull(appData),
  feedingGuideline: (appData: any) => convertUndefinedToNull(appData),
  dog: (appData: any) => convertUndefinedToNull(appData),
  dosageImage: (appData: any) => convertUndefinedToNull(appData),
  foodNutrition: (appData: any) => convertUndefinedToNull(appData),
  foodManufacturer: (appData: any) => convertUndefinedToNull(appData)
};