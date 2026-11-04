import { describe, expect, it } from "vitest";
import { ADULT_DOG_FOODS } from "@/data/adultDogFoods";
import { adultFoodAmount, parseAdultWeight } from "./adultFeeding";

describe("adult maintenance feeding", () => {
  it.each(["12,5", "12.5", " 12,5 "])(
    "accepts Finnish and decimal-point weights: %s",
    (value) => expect(parseAdultWeight(value)).toBe(12.5),
  );
  it.each(["", "12kg", "1e2", "1,2,3", "0", "-2", "151", "Infinity"])(
    "rejects partial, non-finite and out-of-range input: %s",
    (value) => expect(parseAdultWeight(value)).toBeNull(),
  );
  it("preserves the manufacturer's amount and changes only the meal split", () => {
    const result = adultFoodAmount(
      10,
      ADULT_DOG_FOODS[0],
      "manufacturer",
      "energetic",
      3,
    )!;
    expect(result).toEqual({
      gramsPerDay: 150,
      gramsPerMeal: 50,
      kcalPerDay: 570,
      coefficient: null,
    });
    expect(
      adultFoodAmount(10, ADULT_DOG_FOODS[0], "manufacturer", "low", 2)!
        .gramsPerDay,
    ).toBe(150);
  });
  it("does not invent missing table values or extrapolate outside the manufacturer's range", () => {
    expect(
      adultFoodAmount(12.5, ADULT_DOG_FOODS[0], "manufacturer", "low", 2),
    ).toBeNull();
    expect(
      adultFoodAmount(2, ADULT_DOG_FOODS[0], "manufacturer", "low", 2),
    ).toBeNull();
  });
  it("uses product-specific ME with the FEDIAF activity equation, without extra age or breed multipliers", () => {
    const result = adultFoodAmount(30, ADULT_DOG_FOODS[0], "energy", "low", 2)!;
    expect(result.kcalPerDay).toBeCloseTo(95 * 30 ** 0.75, 8);
    expect(result.gramsPerDay).toBeCloseTo(result.kcalPerDay / 3.8, 8);
    expect(result.gramsPerMeal * 2).toBeCloseTo(result.gramsPerDay, 8);
    const other = adultFoodAmount(30, ADULT_DOG_FOODS[2], "energy", "low", 2)!;
    expect(other.kcalPerDay).toBe(result.kcalPerDay);
    expect(other.gramsPerDay).toBeGreaterThan(result.gramsPerDay);
  });
  it("keeps products, source pages, units and table ranges distinct", () => {
    expect(
      adultFoodAmount(30, ADULT_DOG_FOODS[0], "manufacturer", "low", 2)!
        .gramsPerDay,
    ).toBe(310);
    expect(
      adultFoodAmount(30, ADULT_DOG_FOODS[1], "manufacturer", "low", 2)!
        .gramsPerDay,
    ).toBe(320);
    for (const food of ADULT_DOG_FOODS) {
      expect(food.sourceUrl).toMatch(/^https:\/\/(hauhau\.fi|brit\.pet)\//);
      expect(food.lifeStage).toBe("adult");
      expect(food.nutritionType).toBe("complete");
      expect(food.checkedAt).toBe("2026-11-04");
      expect(new Set(food.feeding.map((row) => row.weightKg)).size).toBe(
        food.feeding.length,
      );
    }
  });
  it("rejects invalid weights and meal counts at the calculation boundary", () => {
    expect(() =>
      adultFoodAmount(10, ADULT_DOG_FOODS[2], "energy", "low", 2),
    ).toThrow(/suurille/);
    for (const value of [NaN, Infinity, -10, 0, 151])
      expect(() =>
        adultFoodAmount(value, ADULT_DOG_FOODS[0], "energy", "low", 2),
      ).toThrow();
    expect(() =>
      adultFoodAmount(20, ADULT_DOG_FOODS[0], "energy", "low", 0),
    ).toThrow();
  });
});
