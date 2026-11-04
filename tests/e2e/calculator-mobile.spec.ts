import { test, expect } from "../fixtures/navigation";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390]) {
  test(`software keyboard must not freeze document scrolling at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/calculator");
    const weight = page.getByRole("spinbutton", {
      name: "Nykyinen paino (kg) *",
      exact: true,
    });
    await weight.fill("12.5");
    // Simulate the viewport resize signal consumed by the real keyboard handler.
    // This checks our lock regression, not an actual iOS/Android keyboard.
    await page.evaluate(() => {
      Object.defineProperty(window.visualViewport, "height", {
        configurable: true,
        value: 400,
      });
      window.visualViewport!.dispatchEvent(new Event("resize"));
    });
    await expect(page.locator("body")).toHaveClass(/keyboard-open/);
    expect(
      await page
        .locator("body")
        .evaluate((element) => getComputedStyle(element).position),
    ).not.toBe("fixed");
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(width - 8, 450);
    await page.mouse.wheel(0, 450);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(before);
    await expect(weight).toHaveValue("12.5");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

for (const width of [320, 768, 1024, 1440]) {
  test(`adult food uses current weight, exact manufacturer data and an explicit energy estimate at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const writes: string[] = [];
    page.on("request", (request) => {
      if (
        /\.supabase\.co\//.test(request.url()) &&
        !["GET", "OPTIONS"].includes(request.method())
      )
        writes.push(request.url());
    });
    await page.goto("/calculator");
    await page
      .getByLabel("Koiran elämänvaihe", { exact: true })
      .selectOption("aikuinen");
    await expect(page).toHaveURL(/vaihe=aikuinen/);
    const form = page.locator(".adult-food-panel");
    await expect(
      page.getByLabel("Ikä kuukausina *", { exact: true }),
    ).toHaveCount(0);
    const weight = form.getByLabel("Nykyinen paino (kg) *", { exact: true });
    await weight.fill("10");
    await form
      .getByLabel("Aikuisen koiran ruoka *", { exact: true })
      .selectOption("hauhau-kana-riisi-kaura-adult-fi");
    await form.getByRole("checkbox").check();
    await form
      .getByRole("button", { name: "Laske aikuisen ruoka-annos", exact: true })
      .click();
    const result = form.getByRole("region", {
      name: "Aikuisen ruoka-annoksen tulos",
      exact: true,
    });
    await expect(result).toBeFocused();
    await expect(result).toContainText("150 g / päivä");
    await expect(result).toContainText("75 g / ateria");
    await expect(result).toContainText("570 kcal / päivä");
    await weight.fill("12,5");
    await expect(result).toHaveCount(0);
    await expect(form.getByRole("status")).toContainText("Laske uusi annos");
    await form
      .getByRole("button", { name: "Laske aikuisen ruoka-annos", exact: true })
      .click();
    await expect(result).toContainText(
      "Valmistajan taulukossa ei ole tätä painoa.",
    );
    await form
      .getByRole("radio", { name: "Yleinen energia-arvio", exact: true })
      .check();
    await form
      .getByRole("button", { name: "Laske aikuisen ruoka-annos", exact: true })
      .click();
    await expect(result).toContainText("Suuntaa antava energia-arvio");
    const grams = new Intl.NumberFormat("fi-FI", {
      maximumFractionDigits: 0,
    }).format((95 * 12.5 ** 0.75) / 3.8);
    await expect(result).toContainText(`${grams} g / päivä`);
    await expect(result).toContainText("3800 kcal/kg");
    expect(
      (
        await new AxeBuilder({ page })
          .include("main")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`aikuislaskuri-${width}.png`),
      fullPage: true,
    });
    expect(writes).toEqual([]);
    await form
      .getByRole("link", { name: "Seuraa aikuisen koiran painoa", exact: true })
      .click();
    await expect(page).toHaveURL(/\/weight-tracker\?vaihe=aikuinen/);
  });
}

test("adult form rejects invalid numbers and requires the maintenance assumptions", async ({
  page,
}) => {
  await page.goto("/calculator?vaihe=aikuinen");
  const form = page.locator(".adult-food-panel"),
    button = form.getByRole("button", {
      name: "Laske aikuisen ruoka-annos",
      exact: true,
    });
  const weight = form.getByLabel("Nykyinen paino (kg) *", { exact: true });
  await weight.fill("12kg");
  await button.click();
  await expect(form.getByRole("alert")).toContainText("Syötä paino");
  await expect(weight).toBeFocused();
  await weight.fill("12,5");
  await button.click();
  await expect(form.getByRole("alert")).toContainText(
    "Valitse käytössä oleva ruoka",
  );
  await form
    .getByLabel("Aikuisen koiran ruoka *", { exact: true })
    .selectOption("hauhau-kana-riisi-kaura-adult-fi");
  await button.click();
  await expect(form.getByRole("alert")).toContainText("ylläpitoruokinnasta");
  await expect(form.getByRole("checkbox")).toBeFocused();
});

test.describe("adult weight tracking", () => {
  test.use({ userState: "guest-with-data" });
  test("records an adult measurement without applying a puppy growth model", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/weight-tracker?vaihe=aikuinen");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Aikuisen koiran painonseuranta.",
    );
    await expect(
      page.getByRole("tab", { name: "Kasvu", exact: true }),
    ).toHaveCount(0);
    await page.getByLabel("Paino (kg)", { exact: true }).fill("25,5");
    await page
      .getByRole("button", { name: "Lisää paino", exact: true })
      .click();
    await expect(page.locator(".weight-summary")).toContainText("25,5 kg");
    await expect(
      page.getByRole("img", {
        name: "Painokäyrä omista mittauksista",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() =>
        JSON.parse(
          localStorage.getItem("pentulaskuri-guest-data") || "[]",
        ).some((row: { weight: number }) => row.weight === 25.5),
      ),
    ).toBe(true);
    await page.getByRole("tab", { name: "Ruokinta", exact: true }).click();
    await expect(
      page.getByLabel("Nykyinen paino (kg) *", { exact: true }),
    ).toHaveValue("25.5");
  });
});
