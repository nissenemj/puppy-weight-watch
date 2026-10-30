import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect, expectHeaderToFit } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

const owner = "11111111-1111-4111-8111-111111111111";
const dogId = "22222222-2222-4222-8222-222222222222";
const food = {
  id: "55555555-5555-4555-8555-555555555555",
  manufacturer: "Esikatselu",
  name: "Esimerkkiruoka (testitiedot)",
  food_type: "Kuivaruoka",
  nutrition_type: "Pentu",
  dosage_method: "Nykyinen_Paino",
  product_code: "local-demo",
};
const weights = [
  { id: "weight-1", date: "2026-06-03", weight: 4.2 },
  { id: "weight-2", date: "2026-07-03", weight: 6.5 },
].map((entry) => ({
  ...entry,
  dog_id: dogId,
  user_id: owner,
  created_at: entry.date + "T12:00:00Z",
}));

async function sourceFixtures(page: Page) {
  const state = {
    failFoods: false,
    emptyFoods: false,
    failDogs: false,
    adultFood: false,
    emptyGuidelines: false,
    unsupportedFood: false,
  };
  const writes: string[] = [];
  page.on("request", (request) => {
    if (
      /\.supabase\.co\/rest\/v1\//.test(request.url()) &&
      !["GET", "OPTIONS"].includes(request.method())
    )
      writes.push(request.url());
  });
  await page.route(
    /https:\/\/[^/]+\.supabase\.co\/rest\/v1\/(dog_foods|feeding_guidelines|dogs|weight_entries|puppy_books)/,
    async (route) => {
      if (route.request().method() !== "GET") return route.abort();
      const url = new URL(route.request().url());
      const table = url.pathname.split("/").pop();
      if (
        (state.failFoods && table === "dog_foods") ||
        (state.failDogs && table === "dogs")
      )
        return route.fulfill({
          status: 503,
          contentType: "application/json",
          body: '{"message":"synthetic failure"}',
        });
      let data: unknown = [];
      if (table === "dog_foods")
        data = state.emptyFoods
          ? []
          : [
              {
                ...food,
                dosage_method: state.unsupportedFood
                  ? "Ei_Tietoa"
                  : state.adultFood
                    ? "Odotettu_Aikuispaino_Ja_Ikä"
                    : food.dosage_method,
              },
            ];
      if (table === "feeding_guidelines")
        data = state.emptyGuidelines
          ? []
          : [4, 8].map((kg, i) => ({
              id: `guideline-${i}`,
              dog_food_id: food.id,
              current_weight_kg: kg,
              daily_amount_min: kg * 25,
              daily_amount_max: kg * 25,
            }));
      if (table === "dogs")
        data = [
          {
            id: dogId,
            user_id: owner,
            name: "Nuppu (testitiedot)",
            breed: "Kultainennoutaja",
            created_at: "2026-04-01T12:00:00Z",
          },
        ];
      if (table === "weight_entries")
        data = url.searchParams.get("limit") === "1" ? [weights[1]] : weights;
      if (table === "puppy_books") {
        const book = {
          id: "33333333-3333-4333-8333-333333333333",
          owner_id: owner,
          dog_id: dogId,
          birth_date: "2026-04-01",
          title: "Nupun pentukirja",
          theme: {},
          privacy_settings: { visibility: "private" },
        };
        data = route.request().headers().accept?.includes("vnd.pgrst.object")
          ? book
          : [book];
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    },
  );
  return { state, writes };
}

async function checkLayout(page: Page) {
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.locator("main h1")).toBeVisible();
  await expectHeaderToFit(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .include("body")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
}

async function screenshot(page: Page, name: string, width: number) {
  if (process.env.SITE_DESIGN_SCREENSHOTS) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `${process.env.SITE_DESIGN_SCREENSHOTS}/${name}-${width}.png`,
    });
    const native =
      name === "etusivu"
        ? { width: 1435, height: 1096 }
        : ["ruokalaskuri", "ruokalaskuri-tulos", "painonseuranta"].includes(
              name,
            )
          ? { width: 1469, height: 1071 }
          : null;
    if (width === 1440 && native) {
      const previous = page.viewportSize()!;
      await page.setViewportSize(native);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `${process.env.SITE_DESIGN_SCREENSHOTS}/${name}-native.png`,
      });
      await page.setViewportSize(previous);
    }
  }
}

async function calculateFood(page: Page) {
  await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("6");
  await page.getByLabel("Ikä kuukausina *", { exact: true }).fill("4");
  await page
    .getByLabel("Odotettu aikuispaino (kg)", { exact: true })
    .fill("20");
  await page
    .getByRole("combobox", { name: "Valitse koiranruoka *", exact: true })
    .click();
  await page
    .getByRole("option", {
      name: "Esikatselu - Esimerkkiruoka (testitiedot)",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Laske ruokamäärä", exact: true })
    .click();
}

for (const width of [320, 768, 1024, 1440]) {
  for (const route of ["/", "/guides"]) {
    test(`${route} uses the shared design and accessible navigation at ${width}`, async ({
      page,
    }) => {
      await sourceFixtures(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await checkLayout(page);
      await expect(page.locator("main video")).toHaveCount(0);
      await screenshot(page, route === "/" ? "etusivu" : "tietopankki", width);
    });
  }
  test(`food calculation keeps its actual result, units and keyboard access at ${width}`, async ({
    page,
  }) => {
    const calls = await sourceFixtures(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/calculator");
    await calculateFood(page);
    const result = page.getByRole("region", {
      name: "Laskentatulokset",
      exact: true,
    });
    await expect(result).toBeFocused();
    await expect(result.locator(".food-result-total strong")).toHaveText(
      "150 g",
    );
    await expect(result.locator(".food-result-facts")).toContainText(
      "4 / päivä",
    );
    await expect(result.locator(".food-result-facts")).toContainText("38 g");
    await screenshot(page, "ruokalaskuri-tulos", width);
    const basis = result.locator("summary");
    await basis.focus();
    await basis.press("Enter");
    await expect(result.getByRole("table")).toBeVisible();
    await expect(result).toContainText("Perusannos:");
    await checkLayout(page);
    // Every form label resolves to its own control, including when reused by weight tracking.
    expect(
      await page.locator("main [id]").evaluateAll((elements) => {
        const ids = elements.map((e) => e.id);
        return ids.length === new Set(ids).size;
      }),
    ).toBe(true);
    await basis.press("Enter");
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, "ruokalaskuri", width);
    expect(calls.writes).toEqual([]);
  });
}

test("UX: login validation identifies each field and explains password-free login", async ({
  page,
}) => {
  const calls = await sourceFixtures(page);
  await page.goto("/login");
  await page.getByRole("button", { name: "Kirjaudu", exact: true }).click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#email")).toHaveAccessibleDescription(
    "Syötä kelvollinen sähköpostiosoite",
  );
  await expect(page.locator("#password")).toHaveAccessibleDescription(
    "Vähintään 8 merkkiä",
  );
  await page
    .getByText("Kirjaudu ilman salasanaa tai palauta salasana", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lähetä kirjautumislinkki", exact: true })
    .click();
  await expect(page.locator("#magic-email")).toBeFocused();
  await expect(page.locator("#magic-email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#magic-email")).toHaveAccessibleDescription(
    "Syötä kelvollinen sähköpostiosoite",
  );
  await checkLayout(page);
  expect(calls.writes).toEqual([]);
});

test("a failed food-data load can be retried and an empty catalogue cannot produce a fake result", async ({
  page,
}) => {
  const calls = await sourceFixtures(page);
  calls.state.failFoods = true;
  await page.goto("/calculator");
  await expect(page.getByRole("alert")).toContainText(
    "Ruokien annostelutietoja ei voitu ladata",
  );
  calls.state.failFoods = false;
  await page
    .getByRole("button", { name: "Yritä uudelleen", exact: true })
    .click();
  await calculateFood(page);
  await expect(
    page.getByRole("region", { name: "Laskentatulokset", exact: true }),
  ).toBeVisible();
  calls.state.emptyFoods = true;
  await page.reload();
  await expect(
    page.getByRole("status").filter({ hasText: "Ruokia ei ole saatavilla" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Laske ruokamäärä", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("region", { name: "Laskentatulokset", exact: true }),
  ).toHaveCount(0);
  expect(calls.writes).toEqual([]);
});

for (const failure of ["emptyGuidelines", "unsupportedFood"] as const) {
  test(`food calculation explains ${failure}, keeps the inputs and can recover`, async ({
    page,
  }) => {
    const calls = await sourceFixtures(page);
    calls.state[failure] = true;
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.goto("/calculator");
    await calculateFood(page);
    const error = page.getByRole("alert");
    await expect(error).toContainText(
      failure === "emptyGuidelines"
        ? "ei löytynyt annostelutietoa"
        : "ei ole saatavilla laskentamenetelmää",
    );
    await expect(error).toContainText("tuotepakkauksesta tai valmistajalta");
    await expect(
      page.getByRole("region", { name: "Laskentatulokset", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByLabel("Nykyinen paino (kg) *", { exact: true }),
    ).toHaveValue("6");
    await expect(
      page.getByLabel("Ikä kuukausina *", { exact: true }),
    ).toHaveValue("4");
    await checkLayout(page);
    await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("7");
    await expect(error).toHaveCount(0);
    calls.state[failure] = false;
    await page.reload();
    await calculateFood(page);
    await expect(
      page.getByRole("region", { name: "Laskentatulokset", exact: true }),
    ).toContainText("150 g");
    expect(calls.writes).toEqual([]);
  });
}

test.describe("the redesigned signed-in workspace", () => {
  test.use({ userState: "signed-in" });
  for (const width of [320, 768, 1024, 1440]) {
    for (const route of ["/", "/weight-tracker"]) {
      test(`${route} displays only real fixture measurements at ${width}`, async ({
        page,
      }) => {
        const calls = await sourceFixtures(page);
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(route);
        if (route === "/")
          await expect(
            page.getByRole("heading", {
              name: "Viimeisin painomittaus",
              exact: true,
            }),
          ).toBeVisible();
        else
          await expect(
            page.getByRole("button", { name: "Lisää paino", exact: true }),
          ).toBeVisible();
        if (route === "/weight-tracker") {
          const measurements = page
            .locator("summary")
            .filter({ hasText: "Näytä painomittaukset taulukkona" });
          await measurements.focus();
          await measurements.press("Enter");
          await expect(page.getByRole("table")).toContainText("6,5");
          await measurements.press("Enter");
        }
        await checkLayout(page);
        await expect(
          page.locator(
            route === "/" ? ".site-dashboard-weight" : ".weight-summary",
          ),
        ).toContainText("6,5 kg");
        await screenshot(
          page,
          route === "/" ? "oma-etusivu" : "painonseuranta",
          width,
        );
        if (route === "/weight-tracker") {
          await page
            .getByRole("tab", { name: "Ruokinta", exact: true })
            .click();
          await calculateFood(page);
          expect(
            await page.locator("main input[id]").evaluateAll((elements) => {
              const ids = elements.map((e) => e.id);
              return ids.length === new Set(ids).size;
            }),
          ).toBe(true);
        }
        expect(calls.writes).toEqual([]);
      });
    }
  }
  test("a failed dashboard read offers a retry instead of pretending that the account is empty", async ({
    page,
  }) => {
    const calls = await sourceFixtures(page);
    calls.state.failDogs = true;
    await page.goto("/");
    await expect(page.getByRole("alert")).toContainText(
      "Pennun tietoja ei voitu hakea",
    );
    calls.state.failDogs = false;
    await page
      .getByRole("button", { name: "Yritä uudelleen", exact: true })
      .click();
    await expect(page.locator(".site-dashboard-weight")).toContainText(
      "6,5 kg",
    );
    expect(calls.writes).toEqual([]);
  });
});

test.describe("local guest measurement", () => {
  test.use({ userState: "guest-with-data" });
  for (const width of [320, 768, 1024, 1440]) {
    test(`the redesigned entry saves only to this browser at ${width}`, async ({
      page,
    }) => {
      const calls = await sourceFixtures(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/weight-tracker");
      await page.getByLabel("Paino (kg)", { exact: true }).fill("7.2");
      await page
        .getByRole("button", { name: "Lisää paino", exact: true })
        .click();
      await expect(page.locator(".weight-summary")).toContainText("7,2 kg");
      expect(
        await page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("pentulaskuri-guest-data") || "[]")
              .length,
        ),
      ).toBe(2);
      await checkLayout(page);
      expect(calls.writes).toEqual([]);
    });
  }
});

test("food fields reject negative weights and identify a required adult weight before calculation", async ({
  page,
}) => {
  const calls = await sourceFixtures(page);
  await page.goto("/calculator");
  await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("-1");
  await page.getByLabel("Ikä kuukausina *", { exact: true }).fill("4");
  await page
    .getByRole("combobox", { name: "Valitse koiranruoka *", exact: true })
    .click();
  await page
    .getByRole("option", {
      name: "Esikatselu - Esimerkkiruoka (testitiedot)",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Laske ruokamäärä", exact: true })
    .click();
  await expect(
    page.getByLabel("Nykyinen paino (kg) *", { exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("region", { name: "Laskentatulokset", exact: true }),
  ).toHaveCount(0);
  calls.state.adultFood = true;
  await page.reload();
  await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("6");
  await page.getByLabel("Ikä kuukausina *", { exact: true }).fill("4");
  await page
    .getByRole("combobox", { name: "Valitse koiranruoka *", exact: true })
    .click();
  await page
    .getByRole("option", {
      name: "Esikatselu - Esimerkkiruoka (testitiedot)",
      exact: true,
    })
    .click();
  const adult = page.getByLabel("Odotettu aikuispaino (kg) *", { exact: true });
  await expect(adult).toHaveAttribute("required", "");
  await page
    .getByRole("button", { name: "Laske ruokamäärä", exact: true })
    .click();
  await expect(adult).toBeFocused();
  expect(calls.writes).toEqual([]);
});

for (const width of [320, 768, 1024, 1440]) {
  test(`UX: changed food inputs cannot display an old portion as current at ${width}`, async ({
    page,
  }) => {
    const calls = await sourceFixtures(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/calculator");
    await calculateFood(page);
    const result = page.getByRole("region", {
      name: "Laskentatulokset",
      exact: true,
    });
    await expect(result.locator(".food-result-total strong")).toHaveText(
      "150 g",
    );
    await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("8");
    await expect(result.locator(".food-result-total")).toHaveCount(0);
    await expect(result.getByRole("status")).toContainText("uudelleen");
    if (process.env.UX_SCREENSHOTS)
      await page.screenshot({
        path: `${process.env.UX_SCREENSHOTS}/ruoka-muuttuneet-tiedot-${width}.png`,
      });
    await page
      .getByRole("button", { name: "Laske ruokamäärä", exact: true })
      .click();
    await expect(result.locator(".food-result-total strong")).toHaveText(
      "200 g",
    );
    await page
      .getByRole("combobox", { name: "Aktiivisuustaso", exact: true })
      .click();
    await page.getByRole("option", { name: /^Aktiivinen / }).click();
    await expect(result.locator(".food-result-total")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Laske ruokamäärä", exact: true })
      .click();
    await expect(result.locator(".food-result-total strong")).toHaveText(
      "220 g",
    );
    await checkLayout(page);
    expect(calls.writes).toEqual([]);
  });
}

test("UX: missing food selection gives a nearby error and focuses the correct control", async ({
  page,
}) => {
  await sourceFixtures(page);
  await page.goto("/calculator");
  await page.getByLabel("Nykyinen paino (kg) *", { exact: true }).fill("6");
  await page.getByLabel("Ikä kuukausina *", { exact: true }).fill("4");
  await page
    .getByRole("button", { name: "Laske ruokamäärä", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Valitse koiranruoka");
  await expect(
    page.getByRole("combobox", { name: "Valitse koiranruoka *", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("region", { name: "Laskentatulokset", exact: true }),
  ).toHaveCount(0);
});

test.describe("UX: the first measurement has a useful outcome", () => {
  test.use({ userState: "guest-with-data" });
  for (const width of [320, 768, 1024, 1440]) {
    test(`a decimal comma and Enter save the measurement and reveal its chart at ${width}`, async ({
      page,
    }) => {
      const calls = await sourceFixtures(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/weight-tracker");
      await page.getByLabel("Paino (kg)", { exact: true }).fill("5,7");
      await page.getByLabel("Paino (kg)", { exact: true }).press("Enter");
      await expect(page.locator(".weight-summary")).toContainText("5,7 kg");
      await expect(
        page
          .getByRole("form", { name: "Uusi painomittaus" })
          .getByRole("status"),
      ).toContainText("lisätty");
      await expect(page.locator(".weight-history-chart svg")).toBeVisible();
      await page.locator(".weight-history-chart summary").click();
      await expect(
        page.getByRole("table", { name: "Painomittaukset", exact: true }),
      ).toContainText("5,7");
      await checkLayout(page);
      if (process.env.UX_SCREENSHOTS) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `${process.env.UX_SCREENSHOTS}/paino-${width}.png`,
        });
      }
      expect(calls.writes).toEqual([]);
    });
  }
  test("invalid weight stays in the field with a focused inline error", async ({
    page,
  }) => {
    const calls = await sourceFixtures(page);
    await page.goto("/weight-tracker");
    for (const value of ["", "koira", "0", "-2", "201"]) {
      await page.getByLabel("Paino (kg)", { exact: true }).fill(value);
      await page
        .getByRole("button", { name: "Lisää paino", exact: true })
        .click();
      await expect(page.locator("#weight-error")).toContainText(
        "Anna paino kilogrammoina",
      );
      await expect(page.getByLabel("Paino (kg)", { exact: true })).toHaveValue(
        value,
      );
      await expect(
        page.getByLabel("Paino (kg)", { exact: true }),
      ).toBeFocused();
    }
    await expect(page.locator(".weight-summary")).toContainText("4,2 kg");
    expect(calls.writes).toEqual([]);
  });
});

test.describe("UX: a failed cloud save keeps the measurement", () => {
  test.use({ userState: "signed-in" });
  test("retry preserves the value and a pending save cannot be submitted twice", async ({
    page,
  }) => {
    await sourceFixtures(page);
    let rows = [...weights];
    let fail = true;
    let attempts = 0;
    let releaseSave: () => void = () => {};
    await page.route(
      /https:\/\/[^/]+\.supabase\.co\/rest\/v1\/weight_entries/,
      async (route) => {
        const request = route.request();
        if (request.method() === "GET")
          return route.fulfill({ status: 200, json: rows });
        attempts++;
        if (fail)
          return route.fulfill({
            status: 503,
            json: { message: "synthetic save failure" },
          });
        await new Promise<void>((resolve) => {
          releaseSave = resolve;
        });
        const payload = request.postDataJSON()[0];
        rows = [
          ...rows,
          {
            ...payload,
            id: "saved-weight",
            created_at: new Date().toISOString(),
          },
        ];
        await route.fulfill({ status: 201, json: [] });
      },
    );
    await page.goto("/weight-tracker");
    await page.getByLabel("Paino (kg)", { exact: true }).fill("7,2");
    await page
      .getByRole("button", { name: "Lisää paino", exact: true })
      .click();
    await expect(page.locator("#weight-error")).toContainText(
      "Kirjoittamasi arvo säilyi",
    );
    await expect(page.getByLabel("Paino (kg)", { exact: true })).toHaveValue(
      "7,2",
    );
    fail = false;
    await page.getByLabel("Paino (kg)", { exact: true }).press("Enter");
    await expect(
      page.getByRole("button", { name: "Tallennetaan…", exact: true }),
    ).toBeDisabled();
    await expect.poll(() => attempts).toBe(2);
    await page.keyboard.press("Enter");
    releaseSave();
    await expect(page.locator(".weight-summary")).toContainText("7,2 kg");
    await expect(page.getByLabel("Paino (kg)", { exact: true })).toHaveValue(
      "",
    );
    expect(attempts).toBe(2);
  });
  test("a same-day measurement updates the existing record", async ({
    page,
  }) => {
    await sourceFixtures(page);
    const today = new Date().toISOString().slice(0, 10);
    const rows = [{ ...weights[1], id: "today-weight", date: today }];
    const methods: string[] = [];
    await page.route(
      /https:\/\/[^/]+\.supabase\.co\/rest\/v1\/weight_entries/,
      async (route) => {
        const request = route.request();
        if (request.method() === "GET")
          return route.fulfill({ status: 200, json: rows });
        methods.push(request.method());
        expect(new URL(request.url()).searchParams.get("id")).toBe(
          "eq.today-weight",
        );
        rows[0].weight = request.postDataJSON().weight;
        await route.fulfill({ status: 204 });
      },
    );
    await page.goto("/weight-tracker");
    await page.getByLabel("Paino (kg)", { exact: true }).fill("7.1");
    await page.getByLabel("Paino (kg)", { exact: true }).press("Enter");
    await expect(page.locator(".weight-summary")).toContainText("7,1 kg");
    await expect(
      page.getByRole("form", { name: "Uusi painomittaus" }).getByRole("status"),
    ).toContainText("päivitetty");
    expect(methods).toEqual(["PATCH"]);
  });
});

for (const width of [320, 1440]) {
  test(`UX: login explains the benefit and offers the guest path at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Kirjaudu sisään", exact: true }),
    ).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(
      page.getByRole("link", {
        name: "Kokeile painonseurantaa ilman tiliä.",
        exact: true,
      }),
    ).toHaveAttribute("href", "/weight-tracker");
    await page
      .getByRole("link", {
        name: "Kokeile painonseurantaa ilman tiliä.",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("form", { name: "Uusi painomittaus" }),
    ).toBeVisible();
  });
}
