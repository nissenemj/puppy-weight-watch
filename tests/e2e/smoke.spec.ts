import { test, expect } from "@playwright/test";

test.describe("App smoke check", () => {
  test("etusivu latautuu ja näyttää hero-osion", async ({ page }) => {
    await page.goto("/");

    // Ota kuvakaappaus
    await page.screenshot({
      path: "tests/e2e/screenshots/homepage.png",
      fullPage: true,
    });

    // Tarkista että sivu latautuu
    await expect(page).toHaveTitle(/Pentulaskuri/i);

    // Tarkista että päänavigaatio näkyy (käytä first() koska on 2 nav-elementtiä)
    const nav = page.getByRole("navigation", { name: "Päänavigaatio" }).first();
    await expect(nav).toBeVisible();
  });

  test("navigaatio toimii", async ({ page }) => {
    await page.goto("/");

    // Etsi ruokalaskuri-linkki navigaatiosta (exact match)
    const calculatorLink = page.getByRole("link", {
      name: "Ruokalaskuri",
      exact: true,
    });

    await calculatorLink.click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "tests/e2e/screenshots/calculator.png",
      fullPage: true,
    });

    // Tarkista että sivu vaihtui
    await expect(page).toHaveURL(/calculator/);
  });

  test("painonseuranta-sivu toimii", async ({ page }) => {
    await page.goto("/weight-tracker");

    await page.screenshot({
      path: "tests/e2e/screenshots/weight-tracker.png",
      fullPage: true,
    });

    // Tarkista että sivu latautuu
    await expect(page.getByText(/paino/i).first()).toBeVisible();
  });

  test("mobiili-näkymä toimii", async ({ page }) => {
    // Aseta mobiili-viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await page.screenshot({
      path: "tests/e2e/screenshots/mobile-homepage.png",
      fullPage: true,
    });

    // Tarkista ettei ole horisontaalista scrollia
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px toleranssi

    // Tarkista että alanavigaatio näkyy mobiilissa
    const bottomNav = page.locator("nav.fixed.bottom-0");
    await expect(bottomNav).toBeVisible();
  });

  test("placeholder passes until real e2e added", async () => {
    expect(true).toBeTruthy();
  });
});
