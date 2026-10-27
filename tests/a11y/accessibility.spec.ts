import AxeBuilder from "@axe-core/playwright";
import { test, expect, openPage } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("Kirjautumislomakkeen saavutettavuus", () => {
  for (const width of [320, 1280]) {
    for (const google of [false, true]) {
      test(`lomake ja kirjautumislinkki ${width}, Google ${google}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.route("**/auth/v1/settings", (route) =>
          route.fulfill({
            json: { external: { google, apple: false, email: true } },
          }),
        );
        await openPage(page, "/login");
        if (google) {
          await expect(
            page.getByRole("button", { name: "Jatka Google-tilillä" }),
          ).toBeVisible();
        } else {
          await expect(
            page.getByText(
              "Google-kirjautuminen ei ole käytössä. Kirjaudu sähköpostilla.",
            ),
          ).toBeVisible();
        }
        await page.locator("summary").click();
        const result = await new AxeBuilder({ page })
          .include("#auth-card")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations).toEqual([]);
      });
    }
  }
});

test.describe("Navigaation saavutettavuus", () => {
  for (const width of [320, 768, 1024, 1440]) {
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
        .include("main")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(hero.violations).toEqual([]);
      await expect(page.locator("main a button")).toHaveCount(0);
      await expect(
        page.getByRole("link", {
          name: "Luo pentukirja ilmaiseksi",
          exact: true,
        }),
      ).toHaveAttribute("href", "/puppy-book");
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
