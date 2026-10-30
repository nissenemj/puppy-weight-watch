import React, { useState, useEffect, useId, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Dog,
  Scale,
  ExternalLink,
  BookOpen,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { dbToAppTypes } from "@/utils/typeUtils";
import {
  getBreedMultiplier,
  getBreedCategory,
  interpolateAmount,
  findInterpolationBounds,
  BreedCategory,
} from "@/utils/breedMultipliers";

// Database types
interface DogFood {
  id: string;
  name: string;
  manufacturer: string;
  food_type: string;
  nutrition_type: string;
  dosage_method: string;
  product_code: string;
  notes?: string;
}
interface FeedingGuideline {
  id: string;
  dog_food_id: string;
  adult_weight_kg?: number;
  age_months?: string;
  current_weight_kg?: number;
  daily_amount_min?: number;
  daily_amount_max?: number;
  size_category?: string;
  calculation_formula?: string;
}
const ACTIVITY_MULTIPLIERS = {
  "hyvin-matala": 0.9,
  normaali: 1.0,
  aktiivinen: 1.1,
  "hyvin-aktiivinen": 1.2,
};

// Manufacturer feeding guide URLs
const MANUFACTURER_FEEDING_URLS: Record<string, string> = {
  Brit: "https://brit-petfood.com/en/products/dogs/",
  "Hau-Hau Champion": "https://hauhau.fi/blogs/koiran-ruokinta/",
  "Royal Canin": "https://royalcanin.com/fi/dogs/products/",
  Josera: "https://josera.de/hund/futter/",
  Eukanuba: "https://eukanuba.com/fi/dogs/",
  "Hill's": "https://hillspet.fi/dog-food",
  MUSH: "https://mush.fi/koiranruoka/penturuoka/",
  SMAAK: "https://smaak.fi/koiranruoka/",
  "Best-In": "https://best-in.fi/koiranruokinta/",
  Kennelpakaste: "https://kennelpakaste.fi/",
  Dagsmark: "https://dagsmarkpetfood.fi/blogs/oppaat/",
};
interface AdvancedFoodCalculatorProps {
  user: User | null;
  currentWeight?: number;
}
export default function AdvancedFoodCalculator({
  user,
  currentWeight: propCurrentWeight,
}: AdvancedFoodCalculatorProps) {
  const controlId = useId();
  const foodTrigger = useRef<HTMLButtonElement>(null);
  const [foodSelectionError, setFoodSelectionError] = useState("");
  const resultRegion = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState("");
  const [currentWeight, setCurrentWeight] = useState(
    propCurrentWeight?.toString() || "",
  );
  const [ageMonths, setAgeMonths] = useState("");
  const [expectedAdultWeight, setExpectedAdultWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const inputSignature = JSON.stringify([
    currentWeight,
    ageMonths,
    expectedAdultWeight,
    activityLevel,
    selectedFoodId,
  ]);
  const [resultSignature, setResultSignature] = useState("");
  const [calculationError, setCalculationError] = useState<{
    message: string;
    signature: string;
  } | null>(null);
  const visibleCalculationError =
    calculationError?.signature === inputSignature ? calculationError.message : "";
  const [dogFoods, setDogFoods] = useState<DogFood[]>([]);
  const needsAdultWeight =
    dogFoods.find((food) => food.id === selectedFoodId)?.dosage_method ===
    "Odotettu_Aikuispaino_Ja_Ikä";
  const [feedingGuidelines, setFeedingGuidelines] = useState<
    FeedingGuideline[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<{
    dailyAmount: number;
    mealsPerDay: number;
    gramsPerMeal: number;
    energyKcal: number;
    usedGuidelines: FeedingGuideline[];
    selectedFood: DogFood | null;
    activityMultiplier: number;
    breedMultiplier: number;
    breedCategory: BreedCategory | null;
    wasInterpolated: boolean;
  } | null>(null);
  const resultIsStale = Boolean(result && resultSignature !== inputSignature);
  useEffect(() => {
    if (result) resultRegion.current?.focus();
  }, [result]);
  useEffect(() => {
    loadDogFoodsAndGuidelines();
  }, []);
  const loadDogFoodsAndGuidelines = async () => {
    setLoading(true);
    setLoadError("");
    try {
      // Load dog foods
      const { data: foodsData, error: foodsError } = await supabase
        .from("dog_foods")
        .select("*")
        .order("manufacturer", {
          ascending: true,
        });
      if (foodsError) throw foodsError;

      // Load feeding guidelines
      const { data: guidelinesData, error: guidelinesError } = await supabase
        .from("feeding_guidelines")
        .select("*");
      if (guidelinesError) throw guidelinesError;
      setDogFoods((dbToAppTypes.dogFood(foodsData) as DogFood[]) || []);
      setFeedingGuidelines(
        (dbToAppTypes.feedingGuideline(guidelinesData) as FeedingGuideline[]) ||
          [],
      );
    } catch (error) {
      console.error("Error loading food data:", error);
      setLoadError(
        "Ruokien annostelutietoja ei voitu ladata. Tarkista yhteys ja yritä uudelleen.",
      );
    } finally {
      setLoading(false);
    }
  };
  const getAgeCategory = (months: number): string => {
    if (months >= 2 && months < 3) return "2-3 kk";
    if (months >= 3 && months < 4) return "3-4 kk";
    if (months >= 4 && months < 6) return "4-6 kk";
    if (months >= 6 && months < 9) return "6-9 kk";
    if (months >= 9 && months < 12) return "9-12 kk";
    return "12+ kk";
  };
  const getWeightCategory = (weight: number): string => {
    if (weight >= 1 && weight <= 2) return "1-2 kg";
    if (weight > 2 && weight <= 5) return "2-5 kg";
    if (weight > 5 && weight <= 10) return "5-10 kg";
    if (weight > 10 && weight <= 15) return "10-15 kg";
    if (weight > 15 && weight <= 25) return "15-25 kg";
    if (weight > 25 && weight <= 35) return "25-35 kg";
    if (weight > 35 && weight <= 45) return "35-45 kg";
    if (weight > 45 && weight <= 60) return "45-60 kg";
    return "45-60 kg"; // fallback for very large dogs
  };
  const calculateFeeding = () => {
    setCalculationError(null);
    setResult(null);
    const reportError = (message: string) =>
      setCalculationError({ message, signature: inputSignature });
    if (!selectedFoodId) {
      setFoodSelectionError("Valitse koiranruoka, jotta annos voidaan laskea.");
      foodTrigger.current?.focus();
      return;
    }
    setFoodSelectionError("");
    const weight = parseFloat(currentWeight);
    const months = parseFloat(ageMonths);
    const adultWeight = parseFloat(expectedAdultWeight);
    if (!weight || !months || !selectedFoodId) {
      reportError("Täytä kaikki pakolliset kentät.");
      return;
    }
    const selectedFood = dogFoods.find((f) => f.id === selectedFoodId);
    if (!selectedFood) {
      reportError("Valittua ruokaa ei löytynyt. Valitse ruoka uudelleen.");
      return;
    }
    const foodGuidelines = feedingGuidelines.filter(
      (g) => g.dog_food_id === selectedFoodId,
    );
    const activityMult =
      ACTIVITY_MULTIPLIERS[
        activityLevel as keyof typeof ACTIVITY_MULTIPLIERS
      ] || 1.0;
    let dailyAmount = 0;
    let usedGuidelines: FeedingGuideline[] = [];
    let wasInterpolated = false;

    // Get breed multiplier based on expected adult weight
    const breedMult = getBreedMultiplier(adultWeight || weight);
    const breedCat = getBreedCategory(adultWeight || weight);

    // Different calculation methods based on food's dosage method
    switch (selectedFood.dosage_method) {
      case "Odotettu_Aikuispaino_Ja_Ikä": {
        if (!adultWeight) {
          reportError("Syötä odotettu aikuispaino.");
          return;
        }
        const ageCategory = getAgeCategory(months);

        // First try exact match
        const exactMatch = foodGuidelines.filter(
          (g) =>
            g.adult_weight_kg === adultWeight && g.age_months === ageCategory,
        );
        if (exactMatch.length > 0) {
          const guideline = exactMatch[0];
          dailyAmount = guideline.daily_amount_min || 0;
          usedGuidelines = exactMatch;
        } else {
          // No exact match - try interpolation based on adult weight
          const ageCategoryGuidelines = foodGuidelines.filter(
            (g) =>
              g.age_months === ageCategory &&
              g.adult_weight_kg !== null &&
              g.adult_weight_kg !== undefined &&
              g.daily_amount_min !== null,
          );
          if (ageCategoryGuidelines.length >= 2) {
            // Convert to interpolation format
            const guidelinePoints = ageCategoryGuidelines.map((g) => ({
              weight: g.adult_weight_kg!,
              amount: g.daily_amount_min!,
              original: g,
            }));
            const bounds = findInterpolationBounds(
              adultWeight,
              guidelinePoints,
            );
            if (bounds) {
              dailyAmount = interpolateAmount(
                adultWeight,
                bounds.lower,
                bounds.upper,
              );
              usedGuidelines = [bounds.lower.original, bounds.upper.original];
              wasInterpolated = true;
            }
          }
        }
        break;
      }
      case "Nykyinen_Paino": {
        // First try exact match
        const exactWeightMatch = foodGuidelines.filter(
          (g) => g.current_weight_kg === weight,
        );
        if (exactWeightMatch.length > 0) {
          const guideline = exactWeightMatch[0];
          dailyAmount = guideline.daily_amount_min || 0;
          usedGuidelines = exactWeightMatch;
        } else {
          // No exact match - try interpolation based on current weight
          const validGuidelines = foodGuidelines.filter(
            (g) =>
              g.current_weight_kg !== null &&
              g.current_weight_kg !== undefined &&
              g.daily_amount_min !== null,
          );
          if (validGuidelines.length >= 2) {
            const guidelinePoints = validGuidelines.map((g) => ({
              weight: g.current_weight_kg!,
              amount: g.daily_amount_min!,
              original: g,
            }));
            const bounds = findInterpolationBounds(weight, guidelinePoints);
            if (bounds) {
              dailyAmount = interpolateAmount(
                weight,
                bounds.lower,
                bounds.upper,
              );
              usedGuidelines = [bounds.lower.original, bounds.upper.original];
              wasInterpolated = true;
            }
          }
        }
        break;
      }
      case "Kokoluokka": {
        const sizeCategory = getSizeCategory(adultWeight || weight);
        const sizeGuidelines = foodGuidelines.filter(
          (g) => g.size_category === sizeCategory,
        );
        if (sizeGuidelines.length > 0) {
          const guideline = sizeGuidelines[0];
          dailyAmount = guideline.daily_amount_min || 0;
          usedGuidelines = sizeGuidelines;
        }
        break;
      }
      case "Prosentti_Nykyisestä_Painosta":
        // 5-10% of current weight (use 7.5% as average)
        dailyAmount = Math.round(weight * 1000 * 0.075);
        usedGuidelines = foodGuidelines;
        break;
      default:
        reportError(
          "Valitulle ruoalle ei ole saatavilla laskentamenetelmää. Tarkista annostelu tuotepakkauksesta tai valmistajalta.",
        );
        return;
    }
    if (dailyAmount === 0) {
      reportError(
        "Annosta ei voitu laskea: valitulle ruoalle ei löytynyt annostelutietoa näillä arvoilla. Tarkista annostelu tuotepakkauksesta tai valmistajalta.",
      );
      return;
    }

    // Apply activity and breed multipliers
    // Breed multiplier adjusts for metabolic differences (toy breeds +15%, giant breeds -10%)
    const combinedMultiplier = activityMult * breedMult;
    const adjustedDailyAmount = Math.round(dailyAmount * combinedMultiplier);

    // Calculate meals per day based on age
    let mealsPerDay = 2;
    if (months < 6) mealsPerDay = 4;
    else if (months < 9) mealsPerDay = 3;
    else mealsPerDay = 2;
    const gramsPerMeal = Math.round(adjustedDailyAmount / mealsPerDay);
    const energyKcal = Math.round(adjustedDailyAmount * 3.75); // Average 375 kcal/100g

    setResult({
      dailyAmount: adjustedDailyAmount,
      mealsPerDay,
      gramsPerMeal,
      energyKcal,
      usedGuidelines,
      selectedFood,
      activityMultiplier: activityMult,
      breedMultiplier: breedMult,
      breedCategory: breedCat,
      wasInterpolated,
    });
    setResultSignature(inputSignature);
  };
  const getSizeCategory = (weight: number): string => {
    if (weight <= 10) return "Pieni (1-10 kg)";
    if (weight <= 25) return "Keski (10-25 kg)";
    return "Suuri (25-50 kg)";
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <Card variant="frosted" className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-white/20" />
            <Skeleton className="h-4 w-1/2 bg-white/20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className={`food-calculator-workspace ${result ? "has-result" : ""}`}>
      {/* Input Form */}
      <Card className="food-input-panel">
        <CardHeader>
          <h2
            id={`${controlId}-title`}
            className="food-panel-title flex items-center gap-2"
          >
            <Calculator className="h-5 w-5" aria-hidden="true" />
            Ruoka-annoslaskuri
          </h2>
          <CardDescription className="text-muted-foreground">
            Tähdellä merkityt kentät ovat pakollisia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadError && (
            <div role="alert">
              <p>{loadError}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={loadDogFoodsAndGuidelines}
              >
                Yritä uudelleen
              </Button>
            </div>
          )}
          {!loadError && !dogFoods.length && (
            <p role="status">
              Ruokia ei ole saatavilla. Laskenta edellyttää ruoan
              annostelutietoja.
            </p>
          )}
          <form
            aria-labelledby={`${controlId}-title`}
            onSubmit={(e) => {
              e.preventDefault();
              calculateFeeding();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`${controlId}-current-weight`}
                  className="text-foreground"
                >
                  Nykyinen paino (kg) *
                </Label>
                <Input
                  id={`${controlId}-current-weight`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="esim. 3.2"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${controlId}-age`} className="text-foreground">
                  Ikä kuukausina *
                </Label>
                <Input
                  id={`${controlId}-age`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  placeholder="esim. 4"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${controlId}-adult-weight`}
                  className="text-foreground"
                >
                  Odotettu aikuispaino (kg){needsAdultWeight ? " *" : ""}
                </Label>
                <Input
                  id={`${controlId}-adult-weight`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={expectedAdultWeight}
                  onChange={(e) => setExpectedAdultWeight(e.target.value)}
                  placeholder="esim. 8"
                  required={needsAdultWeight}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${controlId}-activity`}>Aktiivisuustaso</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger
                    id={`${controlId}-activity`}
                    className="bg-white"
                  >
                    <SelectValue placeholder="Valitse aktiivisuustaso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyvin-matala">
                      Hyvin matala (sisäkoira)
                    </SelectItem>
                    <SelectItem value="normaali">
                      Normaali (päivittäiset kävelyt)
                    </SelectItem>
                    <SelectItem value="aktiivinen">
                      Aktiivinen (pitkät kävelyt, leikki)
                    </SelectItem>
                    <SelectItem value="hyvin-aktiivinen">
                      Hyvin aktiivinen (urheilu, työkoira)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="site-field-hint">
                  Ilman valintaa aktiivisuuskertoimena on 1,0.
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label
                htmlFor={`${controlId}-food`}
                id={`${controlId}-food-label`}
              >
                Valitse koiranruoka *
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={foodTrigger}
                    id={`${controlId}-food`}
                    variant="outline"
                    role="combobox"
                    aria-labelledby={`${controlId}-food-label`}
                    aria-required="true"
                    aria-invalid={Boolean(foodSelectionError)}
                    aria-describedby={
                      foodSelectionError ? `${controlId}-food-error` : undefined
                    }
                    aria-expanded={open}
                    className="w-full justify-between bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
                  >
                    {selectedFoodId
                      ? (() => {
                          const food = dogFoods.find(
                            (f) => f.id === selectedFoodId,
                          );
                          return food
                            ? `${food.manufacturer} - ${food.name}`
                            : "Valitse ruoka...";
                        })()
                      : "Valitse ruoka..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      aria-label="Etsi koiranruokaa"
                      placeholder="Etsi ruokaa..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Ruokaa ei löytynyt.</CommandEmpty>
                      <CommandGroup>
                        {dogFoods.map((food) => (
                          <CommandItem
                            key={food.id}
                            value={`${food.manufacturer} ${food.name}`}
                            onSelect={() => {
                              setSelectedFoodId(
                                food.id === selectedFoodId ? "" : food.id,
                              );
                              setFoodSelectionError("");
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedFoodId === food.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {food.manufacturer} - {food.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {foodSelectionError && (
                <p
                  role="alert"
                  id={`${controlId}-food-error`}
                  className="mt-2 text-sm text-red-700"
                >
                  {foodSelectionError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              aria-describedby={
                visibleCalculationError ? `${controlId}-calculation-error` : undefined
              }
              className="w-full mt-6 bg-white text-terracotta-600 hover:bg-white/90 font-semibold"
              disabled={Boolean(loadError) || !dogFoods.length}
            >
              <Dog className="mr-2 h-4 w-4" aria-hidden="true" />
              Laske ruokamäärä
            </Button>
            {visibleCalculationError && (
              <p
                id={`${controlId}-calculation-error`}
                role="alert"
                className="mt-3 text-sm text-red-700"
              >
                {visibleCalculationError}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Card - only shown when result exists */}
      {result && (
        <Card
          ref={resultRegion}
          role="region"
          tabIndex={-1}
          aria-labelledby={`${controlId}-result-title`}
          className="food-result-panel"
        >
          <CardHeader>
            <h2
              id={`${controlId}-result-title`}
              className="food-panel-title flex items-center gap-2"
            >
              <Scale className="h-5 w-5" aria-hidden="true" />
              Laskentatulokset
            </h2>
            <CardDescription>
              {resultIsStale
                ? "Syötetiedot ovat muuttuneet. Aiempi annos ei vastaa nykyisiä valintoja."
                : "Arvio päiväannoksesta. Tarkista vielä tuotepakkauksen ohje."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultIsStale ? (
              <p role="status" className="food-stale-notice">
                Laske ruokamäärä uudelleen nähdäksesi uuden arvion.
              </p>
            ) : (
              <>
                <p className="food-result-total">
                  <strong>{result.dailyAmount} g</strong>päivässä
                </p>
                <dl className="food-result-facts">
                  <div>
                    <dt>Ruokintakerrat</dt>
                    <dd>{result.mealsPerDay} / päivä</dd>
                  </div>
                  <div>
                    <dt>Annos per kerta</dt>
                    <dd>{result.gramsPerMeal} g</dd>
                  </div>
                </dl>
                <p className="my-4 font-medium">
                  {result.selectedFood?.manufacturer} ·{" "}
                  {result.selectedFood?.name}
                </p>
                <details className="food-calculation-details">
                  <summary>Laskennan perusteet</summary>
                  {result?.selectedFood && (
                    <div
                      className="mb-4 p-4 bg-blue-50 rounded-lg"
                      role="group"
                      aria-labelledby="selected-food"
                    >
                      <h3
                        id="selected-food"
                        className="font-semibold mb-2 text-[var(--color-text-primary)]"
                      >
                        Valittu ruoka:
                      </h3>
                      <dl className="space-y-1">
                        <div>
                          <dt className="inline font-medium">Ruoka:</dt>{" "}
                          <dd className="inline">
                            {result.selectedFood.manufacturer} -{" "}
                            {result.selectedFood.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">Tyyppi:</dt>{" "}
                          <dd className="inline">
                            {result.selectedFood.food_type} -{" "}
                            {result.selectedFood.nutrition_type}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">Annostelutapa:</dt>{" "}
                          <dd className="inline">
                            {result.selectedFood.dosage_method.replace(
                              /_/g,
                              " ",
                            )}
                          </dd>
                        </div>
                        {result.selectedFood.notes && (
                          <div>
                            <dt className="inline font-medium">
                              Huomautuksia:
                            </dt>{" "}
                            <dd className="inline">
                              {result.selectedFood.notes}
                            </dd>
                          </div>
                        )}
                      </dl>
                      {/* Manufacturer feeding guide link */}
                      {MANUFACTURER_FEEDING_URLS[
                        result.selectedFood.manufacturer
                      ] && (
                        <a
                          href={
                            MANUFACTURER_FEEDING_URLS[
                              result.selectedFood.manufacturer
                            ]
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          Katso {result.selectedFood.manufacturer}:n virallinen
                          annosohje
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {result?.usedGuidelines &&
                    result.usedGuidelines.length > 0 && (
                      <div className="overflow-x-auto mobile-table-responsive">
                        <h3 className="font-semibold mb-2 text-[var(--color-text-primary)]">
                          Käytetyt annostelutiedot:
                        </h3>
                        <table
                          className="w-full text-sm"
                          role="table"
                          aria-labelledby="guidelines-table"
                          summary="Taulukko näyttää laskennassa käytetyt annostelutiedot"
                        >
                          <thead>
                            <tr className="border-b" role="row">
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Aikuispaino
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Ikä
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Nykyinen paino
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Kokoluokka
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Min annos
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Max annos
                              </th>
                              <th
                                className="text-left p-2"
                                role="columnheader"
                                scope="col"
                              >
                                Kaava
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.usedGuidelines.map((guideline, index) => (
                              <tr
                                key={guideline.id}
                                className="border-b bg-blue-50"
                                role="row"
                              >
                                <td className="p-2" role="cell">
                                  {guideline.adult_weight_kg || "-"} kg
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.age_months || "-"}
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.current_weight_kg || "-"} kg
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.size_category || "-"}
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.daily_amount_min || "-"}g
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.daily_amount_max || "-"}g
                                </td>
                                <td className="p-2" role="cell">
                                  {guideline.calculation_formula || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {result && (
                    <div
                      className="mt-4 p-4 bg-green-50 rounded-lg"
                      role="group"
                      aria-labelledby="final-result"
                    >
                      <h3
                        id="final-result"
                        className="font-semibold mb-2 text-[var(--color-text-primary)]"
                      >
                        Lopputulos:
                      </h3>
                      <dl className="space-y-1">
                        <div>
                          <dt className="inline font-medium">Perusannos:</dt>{" "}
                          <dd className="inline">
                            {Math.round(
                              result.dailyAmount /
                                (result.activityMultiplier *
                                  result.breedMultiplier),
                            )}
                            g päivässä
                          </dd>
                        </div>
                        {result.breedCategory &&
                          result.breedMultiplier !== 1.0 && (
                            <div>
                              <dt className="inline font-medium">
                                Rotukoko ({result.breedCategory.name}):
                              </dt>{" "}
                              <dd className="inline">
                                ×{result.breedMultiplier.toFixed(2)}
                                <span className="text-sm text-muted-foreground ml-2">
                                  (
                                  {result.breedMultiplier > 1
                                    ? "korkeampi aineenvaihdunta"
                                    : "hitaampi aineenvaihdunta"}
                                  )
                                </span>
                              </dd>
                            </div>
                          )}
                        {result.activityMultiplier !== 1.0 && (
                          <div>
                            <dt className="inline font-medium">
                              Aktiivisuussäätö:
                            </dt>{" "}
                            <dd className="inline">
                              ×{result.activityMultiplier}
                            </dd>
                          </div>
                        )}
                        <div className="pt-2 border-t mt-2">
                          <dt className="inline font-medium text-lg">
                            Lopullinen annos:
                          </dt>{" "}
                          <dd className="inline text-lg font-bold text-green-700">
                            {result.dailyAmount}g päivässä
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">
                            Ruokintakerrat:
                          </dt>{" "}
                          <dd className="inline">
                            {result.mealsPerDay} kertaa päivässä
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">
                            Annos per kerta:
                          </dt>{" "}
                          <dd className="inline font-semibold">
                            {result.gramsPerMeal}g
                          </dd>
                        </div>
                      </dl>
                      {result.wasInterpolated && (
                        <p className="mt-2 text-sm text-blue-700">
                          <Badge variant="outline" className="mr-2 text-xs">
                            Interpoloitu
                          </Badge>
                          Annos laskettu kahden painoluokan välistä
                        </p>
                      )}
                    </div>
                  )}
                </details>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <Card className="food-notes-panel" aria-labelledby={`${controlId}-notes`}>
        <CardHeader>
          <h2 className="food-panel-title" id={`${controlId}-notes`}>
            Näin luet tulosta
          </h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              Nämä ovat suuntaa-antavia määriä. Seuraa pennun kasvua ja säädä
              tarvittaessa.
            </li>
            <li>Jaa päiväannos tasaisesti ruokintakertojen kesken.</li>
            <li>Siirry vähitellen uuteen ruokamäärään 3-5 päivän aikana.</li>
            <li>
              Ota aina yhteyttä eläinlääkäriin, jos olet huolissasi pennun
              kasvusta.
            </li>
            <li>
              Muista myös herkkujen määrä päivittäisessä energiansaannissa!
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
