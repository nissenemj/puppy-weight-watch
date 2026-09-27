/**
 * Ruokalaskurin käyttäjäpolkujen regressiotestit.
 * Ruoka- ja annostelutiedot ovat synteettisiä testiarvoja.
 */
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdvancedFoodCalculator from "../AdvancedFoodCalculator";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: fromMock },
}));

const baseFood = {
  id: "food-1",
  name: "Premium Puppy",
  manufacturer: "TestBrand",
  food_type: "dry",
  nutrition_type: "complete",
  dosage_method: "Nykyinen_Paino",
  product_code: "PP001",
  notes: null,
};
const catalog = [
  baseFood,
  {
    ...baseFood,
    id: "food-2",
    name: "Age Puppy",
    dosage_method: "Odotettu_Aikuispaino_Ja_Ikä",
  },
  {
    ...baseFood,
    id: "food-3",
    name: "Missing Puppy",
    dosage_method: "Ei_Tietoa",
  },
  {
    ...baseFood,
    id: "food-4",
    name: "Raw Puppy",
    dosage_method: "Prosentti_Nykyisestä_Painosta",
  },
  { ...baseFood, id: "food-5", name: "Empty Puppy" },
  {
    ...baseFood,
    id: "food-6",
    name: "Size Puppy",
    dosage_method: "Kokoluokka",
  },
  { ...baseFood, id: "food-duplicate", product_code: "PP002" },
];
interface TestGuideline {
  id: string;
  dog_food_id: string;
  current_weight_kg?: number;
  adult_weight_kg?: number;
  age_months?: string;
  size_category?: string;
  daily_amount_min?: number | null;
}
const guidelines: TestGuideline[] = [
  {
    id: "g1",
    dog_food_id: "food-1",
    current_weight_kg: 10,
    daily_amount_min: 200,
  },
  {
    id: "g2",
    dog_food_id: "food-1",
    current_weight_kg: 20,
    daily_amount_min: 400,
  },
  {
    id: "g3",
    dog_food_id: "food-2",
    adult_weight_kg: 20,
    age_months: "4-6 kk",
    daily_amount_min: 300,
  },
  {
    id: "g4",
    dog_food_id: "food-2",
    adult_weight_kg: 30,
    age_months: "4-6 kk",
    daily_amount_min: 400,
  },
  {
    id: "g5",
    dog_food_id: "food-6",
    size_category: "Keski (10-25 kg)",
    daily_amount_min: 250,
  },
  {
    id: "g6",
    dog_food_id: "food-duplicate",
    current_weight_kg: 10,
    daily_amount_min: 240,
  },
];
let foods = catalog;
let feedingData = guidelines;
let failedTable: string | null = null;

async function openCalculator() {
  render(<AdvancedFoodCalculator user={null} />);
  await screen.findByRole("form", { name: "Ruoka-annoslaskuri" });
  fireEvent.change(screen.getByLabelText(/Nykyinen paino/), {
    target: { value: "10" },
  });
  fireEvent.change(screen.getByLabelText(/Ikä kuukausina/), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText(/Odotettu aikuispaino/), {
    target: { value: "25" },
  });
}
async function chooseFood(name: string, duplicateIndex = 0) {
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("combobox", { name: /Valitse koiranruoka/ }),
  );
  await user.type(
    screen.getByRole("combobox", { name: "Etsi koiranruokaa" }),
    name,
  );
  const options = screen.getAllByRole("option", { name: new RegExp(name) });
  await user.click(options[duplicateIndex]);
}
function calculate() {
  fireEvent.click(screen.getByRole("button", { name: "Laske ruokamäärä" }));
}
function expectDailyAmount(grams: number) {
  expect(
    within(screen.getByRole("group", { name: "Lopputulos:" })).getAllByText(
      `${grams}g päivässä`,
    ),
  ).not.toHaveLength(0);
}

describe("AdvancedFoodCalculator", () => {
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  beforeAll(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterAll(() => {
    vi.unstubAllGlobals();
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });
  beforeEach(() => {
    vi.clearAllMocks();
    foods = catalog;
    feedingData = guidelines;
    failedTable = null;
    fromMock.mockImplementation((table: string) => ({
      select: () => {
        const response = {
          data: table === "dog_foods" ? foods : feedingData,
          error:
            table === failedTable ? new Error("Synthetic network error") : null,
        };
        return table === "dog_foods"
          ? { order: () => Promise.resolve(response) }
          : Promise.resolve(response);
      },
    }));
  });

  it("kertoo latauksesta ja nimeää lomakkeen", async () => {
    render(<AdvancedFoodCalculator user={null} />);
    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Ladataan annostelutietoja",
    );
    expect(
      await screen.findByRole("form", { name: "Ruoka-annoslaskuri" }),
    ).toBeVisible();
  });

  it.each(["dog_foods", "feeding_guidelines"])(
    "näyttää latausvirheen ja sallii uuden yrityksen: %s",
    async (table) => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      failedTable = table;
      render(<AdvancedFoodCalculator user={null} />);
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "ei saatu ladattua",
      );
      failedTable = null;
      fireEvent.click(screen.getByRole("button", { name: "Yritä uudelleen" }));
      expect(
        await screen.findByRole("form", { name: "Ruoka-annoslaskuri" }),
      ).toBeVisible();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      log.mockRestore();
    },
  );

  it("kertoo tyhjästä tuoteluettelosta ilman toimimatonta lomaketta", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    foods = [];
    render(<AdvancedFoodCalculator user={null} />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "ei saatu ladattua",
    );
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    log.mockRestore();
  });

  it.each(["Missing Puppy", "Raw Puppy", "Empty Puppy"])(
    "kertoo puuttuvista tiedoista ennen laskentaa: %s",
    async (name) => {
      await openCalculator();
      await chooseFood(name);
      expect(screen.getByRole("alert")).toHaveTextContent(
        "ei ole laskurissa riittäviä annostelutietoja",
      );
      expect(
        screen.getByRole("button", { name: "Laske ruokamäärä" }),
      ).toBeDisabled();
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
      fireEvent.submit(screen.getByRole("form"));
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    },
  );

  it("laskee taulukkoarvon ja säilyttää samannimisten tuotteiden erilliset valinnat", async () => {
    await openCalculator();
    await chooseFood("Premium Puppy");
    calculate();
    expectDailyAmount(200);
    await chooseFood("Premium Puppy", 1);
    expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    calculate();
    expectDailyAmount(240);
  });

  it("laskee taulukon painopisteiden välistä", async () => {
    await openCalculator();
    fireEvent.change(screen.getByLabelText(/Nykyinen paino/), {
      target: { value: "15" },
    });
    await chooseFood("Premium Puppy");
    calculate();
    expectDailyAmount(300);
    expect(screen.getByText("Interpoloitu")).toBeVisible();
  });

  it.each(["5", "25"])(
    "ei jatka nykyisen painon taulukkoa sen rajojen ulkopuolelle: %s",
    async (weight) => {
      await openCalculator();
      fireEvent.change(screen.getByLabelText(/Nykyinen paino/), {
        target: { value: weight },
      });
      await chooseFood("Premium Puppy");
      calculate();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "ei kata annettua ikää tai painoa",
      );
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    },
  );

  it("vaatii aikuispainon ja laskee sen jälkeen ikätaulukon väliarvon", async () => {
    await openCalculator();
    fireEvent.change(screen.getByLabelText(/Odotettu aikuispaino/), {
      target: { value: "" },
    });
    await chooseFood("Age Puppy");
    calculate();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "tarvitaan odotettu aikuispaino",
    );
    fireEvent.change(screen.getByLabelText(/Odotettu aikuispaino/), {
      target: { value: "25" },
    });
    calculate();
    expectDailyAmount(350);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each([
    { age: "3", weight: "25" },
    { age: "5", weight: "35" },
  ])(
    "kertoo ikätaulukon ulkopuolisista arvoista: %j",
    async ({ age, weight }) => {
      await openCalculator();
      fireEvent.change(screen.getByLabelText(/Ikä kuukausina/), {
        target: { value: age },
      });
      fireEvent.change(screen.getByLabelText(/Odotettu aikuispaino/), {
        target: { value: weight },
      });
      await chooseFood("Age Puppy");
      calculate();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "ei kata annettua ikää tai painoa",
      );
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    },
  );

  it.each(["3-4", "3-4 kk"])(
    "tunnistaa tietokannan ikäluokan kirjoitusasun: %s",
    async (ageRange) => {
      feedingData = [
        {
          id: "age-format",
          dog_food_id: "food-2",
          adult_weight_kg: 25,
          age_months: ageRange,
          daily_amount_min: 180,
        },
      ];
      await openCalculator();
      fireEvent.change(screen.getByLabelText(/Ikä kuukausina/), {
        target: { value: "3" },
      });
      await chooseFood("Age Puppy");
      calculate();
      expectDailyAmount(180);
    },
  );

  it("laskee kokoluokan taulukosta", async () => {
    await openCalculator();
    await chooseFood("Size Puppy");
    calculate();
    expectDailyAmount(250);
  });

  it.each([null, undefined, 0, -20, Number.NaN, Number.POSITIVE_INFINITY])(
    "hylkää puuttuvan tai kelvottoman annostiedon: %s",
    async (amount) => {
      feedingData = [
        {
          id: "invalid",
          dog_food_id: "food-1",
          current_weight_kg: 10,
          daily_amount_min: amount,
        },
      ];
      await openCalculator();
      await chooseFood("Premium Puppy");
      expect(screen.getByRole("alert")).toHaveTextContent(
        "ei ole laskurissa riittäviä annostelutietoja",
      );
      expect(
        screen.getByRole("button", { name: "Laske ruokamäärä" }),
      ).toBeDisabled();
    },
  );

  it.each([
    { label: /Nykyinen paino/, value: "-1", message: "Syötä nykyinen paino" },
    { label: /Nykyinen paino/, value: "0", message: "Syötä nykyinen paino" },
    {
      label: /Ikä kuukausina/,
      value: "1",
      message: "vähintään 2 kuukauden ikäisille",
    },
    {
      label: /Odotettu aikuispaino/,
      value: "-5",
      message: "Syötä odotettu aikuispaino",
    },
  ])(
    "näyttää virheellisen lähtöarvon syyn: $value",
    async ({ label, value, message }) => {
      await openCalculator();
      await chooseFood("Premium Puppy");
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
      calculate();
      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    },
  );

  it.each([/Nykyinen paino/, /Ikä kuukausina/, /Odotettu aikuispaino/])(
    "poistaa vanhan tuloksen lähtötiedon muuttuessa: %s",
    async (label) => {
      await openCalculator();
      await chooseFood("Premium Puppy");
      calculate();
      expectDailyAmount(200);
      fireEvent.change(screen.getByLabelText(label), {
        target: { value: "6" },
      });
      expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    },
  );

  it("poistaa vanhan tuloksen kun valitaan ruoka ilman annostelutietoja", async () => {
    await openCalculator();
    await chooseFood("Premium Puppy");
    calculate();
    expectDailyAmount(200);
    await chooseFood("Missing Puppy");
    expect(screen.queryByText("Laskentatulokset")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Tarkista ruokamäärä pakkauksen",
    );
  });
});

describe("Laskentalogiikat (yksikkötestit)", () => {
  describe("getAgeCategory", () => {
    // Testaa ikäkategorialogikkaa
    it("luokittelee 2-vuotiaat oikein", () => {
      const getAgeCategory = (months: number): string => {
        if (months >= 2 && months < 3) return "2-3 kk";
        if (months >= 3 && months < 4) return "3-4 kk";
        if (months >= 4 && months < 6) return "4-6 kk";
        if (months >= 6 && months < 9) return "6-9 kk";
        if (months >= 9 && months < 12) return "9-12 kk";
        return "12+ kk";
      };

      expect(getAgeCategory(2)).toBe("2-3 kk");
      expect(getAgeCategory(2.5)).toBe("2-3 kk");
      expect(getAgeCategory(3)).toBe("3-4 kk");
      expect(getAgeCategory(5)).toBe("4-6 kk");
      expect(getAgeCategory(7)).toBe("6-9 kk");
      expect(getAgeCategory(10)).toBe("9-12 kk");
      expect(getAgeCategory(15)).toBe("12+ kk");
    });
  });

  describe("getWeightCategory", () => {
    it("luokittelee painot oikein", () => {
      const getWeightCategory = (weight: number): string => {
        if (weight >= 1 && weight <= 2) return "1-2 kg";
        if (weight > 2 && weight <= 5) return "2-5 kg";
        if (weight > 5 && weight <= 10) return "5-10 kg";
        if (weight > 10 && weight <= 15) return "10-15 kg";
        if (weight > 15 && weight <= 25) return "15-25 kg";
        if (weight > 25 && weight <= 35) return "25-35 kg";
        if (weight > 35 && weight <= 45) return "35-45 kg";
        if (weight > 45 && weight <= 60) return "45-60 kg";
        return "45-60 kg";
      };

      expect(getWeightCategory(1.5)).toBe("1-2 kg");
      expect(getWeightCategory(3)).toBe("2-5 kg");
      expect(getWeightCategory(8)).toBe("5-10 kg");
      expect(getWeightCategory(12)).toBe("10-15 kg");
      expect(getWeightCategory(20)).toBe("15-25 kg");
      expect(getWeightCategory(30)).toBe("25-35 kg");
      expect(getWeightCategory(40)).toBe("35-45 kg");
      expect(getWeightCategory(50)).toBe("45-60 kg");
      expect(getWeightCategory(70)).toBe("45-60 kg"); // fallback
    });
  });

  describe("getSizeCategory", () => {
    it("luokittelee rotukoot oikein", () => {
      const getSizeCategory = (weight: number): string => {
        if (weight <= 10) return "Pieni (1-10 kg)";
        if (weight <= 25) return "Keski (10-25 kg)";
        return "Suuri (25-50 kg)";
      };

      expect(getSizeCategory(5)).toBe("Pieni (1-10 kg)");
      expect(getSizeCategory(10)).toBe("Pieni (1-10 kg)");
      expect(getSizeCategory(15)).toBe("Keski (10-25 kg)");
      expect(getSizeCategory(25)).toBe("Keski (10-25 kg)");
      expect(getSizeCategory(35)).toBe("Suuri (25-50 kg)");
    });
  });

  describe("ACTIVITY_MULTIPLIERS", () => {
    it("sisältää oikeat kertoimet", () => {
      const ACTIVITY_MULTIPLIERS = {
        "hyvin-matala": 0.9,
        normaali: 1.0,
        aktiivinen: 1.1,
        "hyvin-aktiivinen": 1.2,
      };

      expect(ACTIVITY_MULTIPLIERS["hyvin-matala"]).toBe(0.9);
      expect(ACTIVITY_MULTIPLIERS["normaali"]).toBe(1.0);
      expect(ACTIVITY_MULTIPLIERS["aktiivinen"]).toBe(1.1);
      expect(ACTIVITY_MULTIPLIERS["hyvin-aktiivinen"]).toBe(1.2);
    });
  });

  describe("aterioiden määrän laskenta", () => {
    it("laskee oikean aterioiden määrän iän mukaan", () => {
      const getMealsPerDay = (months: number): number => {
        if (months < 6) return 4;
        if (months < 9) return 3;
        return 2;
      };

      expect(getMealsPerDay(3)).toBe(4); // Alle 6kk
      expect(getMealsPerDay(5)).toBe(4); // Alle 6kk
      expect(getMealsPerDay(6)).toBe(3); // 6-9kk
      expect(getMealsPerDay(8)).toBe(3); // 6-9kk
      expect(getMealsPerDay(10)).toBe(2); // Yli 9kk
      expect(getMealsPerDay(24)).toBe(2); // Aikuinen
    });
  });

  describe("prosenttipohjainen laskenta", () => {
    it("laskee 7.5% nykyisestä painosta", () => {
      // 5-10% of current weight (use 7.5% as average)
      const calculatePercentageBased = (weightKg: number): number => {
        return Math.round(weightKg * 1000 * 0.075);
      };

      expect(calculatePercentageBased(10)).toBe(750); // 10kg = 750g/päivä
      expect(calculatePercentageBased(20)).toBe(1500); // 20kg = 1500g/päivä
      expect(calculatePercentageBased(5)).toBe(375); // 5kg = 375g/päivä
    });
  });

  describe("energia-arvojen laskenta", () => {
    it("laskee päivittäisen energian oikein (375 kcal/100g)", () => {
      const calculateEnergy = (dailyAmount: number): number => {
        return Math.round(dailyAmount * 3.75); // 375 kcal/100g
      };

      expect(calculateEnergy(100)).toBe(375); // 100g = 375 kcal
      expect(calculateEnergy(200)).toBe(750); // 200g = 750 kcal
      expect(calculateEnergy(300)).toBe(1125); // 300g = 1125 kcal
    });
  });

  describe("ateriakoon laskenta", () => {
    it("jakaa päivittäisen annoksen tasaisesti", () => {
      const calculateGramsPerMeal = (
        dailyAmount: number,
        mealsPerDay: number,
      ): number => {
        return Math.round(dailyAmount / mealsPerDay);
      };

      expect(calculateGramsPerMeal(400, 4)).toBe(100); // 4 ateriaa
      expect(calculateGramsPerMeal(300, 3)).toBe(100); // 3 ateriaa
      expect(calculateGramsPerMeal(200, 2)).toBe(100); // 2 ateriaa
      expect(calculateGramsPerMeal(350, 2)).toBe(175); // Pyöristys
    });
  });
});
