import AxeBuilder from "@axe-core/playwright";
import { test, expect, openPage } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("Navigaation saavutettavuus", () => {
  for (const width of [320, 1280]) {
    test(`pentukirjan esittelyn teksti ja linkit ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await openPage(page, "/puppy-book-landing");
      expect(
        await page.evaluate(
          () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      ).toBe(true);
      const hero = await new AxeBuilder({ page })
        .include('section[aria-label="Pentukirjan esittely"]')
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(hero.violations).toEqual([]);
    });
  }
  for (const width of [320, 768, 1280]) {
    test(`navigaatio ja sivun maamerkit ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openPage(page, "/");
      const navigation = await new AxeBuilder({ page })
        .include("header")
        .include('nav[aria-label="Alapalkin navigaatio"]')
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(navigation.violations).toEqual([]);
      for (const path of [
        "/guides",
        "/login",
        "/privacy",
        "/puppy-book-landing",
        "/guides/puppy-guide",
      ]) {
        await openPage(page, path);
        const landmarks = await new AxeBuilder({ page })
          .withRules([
            "landmark-one-main",
            "landmark-no-duplicate-main",
            "landmark-no-duplicate-banner",
            "landmark-unique",
            "skip-link",
          ])
          .analyze();
        expect(landmarks.violations).toEqual([]);
      }
    });
  }
  test("mobiilivalikko", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await openPage(page, "/");
    await page
      .getByRole("navigation", { name: "Päänavigaatio", exact: true })
      .getByRole("button", { name: "Avaa valikko", exact: true })
      .click();
    const results = await new AxeBuilder({ page })
      .include("#mobile-menu")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
