import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures/navigation";

const previewTag = process.env.VITE_GA4_PREVIEW_ID;
const googleTag = "https://www.googletagmanager.com/gtag/js?*";
const canonical = "https://www.pentulaskuri.com";

async function calculatePuppyPortion(page: Page) {
  await page.getByLabel("Käytössä oleva penturuoka").selectOption("hau-hau-puppy");
  await page.getByLabel("Arvioitu aikuispaino taulukossa").selectOption("20");
  await page.getByLabel("Pennun ikä taulukossa").selectOption("3–4");
  await page.getByLabel("Aterioita päivässä").selectOption("4");
  await page.getByRole("button", { name: "Laske päiväannos" }).click();
}

function completionEvents(page: Page) {
  return page.evaluate(() => {
    const layer = (window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
    return layer
      .map((entry) => Array.from(entry))
      .filter(([command, name]) => command === "event" &&
        (name === "feeding_calculation_complete" || name === "first_weight_saved"));
  });
}

test("consent gates both GA4 milestones and the food result takes a mobile visitor to the first weighing", async ({ page }) => {
  const tagRequests: string[] = [];
  await page.route(googleTag, (route) => {
    tagRequests.push(route.request().url());
    return route.fulfill({ contentType: "application/javascript", body: "// Test intercept." });
  });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/calculator?test=omit-this");
  await calculatePuppyPortion(page);
  const result = page.getByRole("region", { name: "Pennun ruoka-annoksen tulos" });
  await expect(result).toBeFocused();
  await expect(result).toContainText("200 g");
  expect(await completionEvents(page)).toEqual([]);
  expect(tagRequests).toEqual([]);

  await page.getByRole("button", { name: "Salli analytiikka" }).click();
  await page.getByRole("button", { name: "Laske päiväannos" }).click();
  if (previewTag) await expect.poll(() => tagRequests.length).toBe(1);
  const foodEvent = ["event", "feeding_calculation_complete", {
    life_stage: "puppy", calculation_method: "table",
    send_to: previewTag, page_location: canonical + "/calculator", page_referrer: "",
  }];
  expect(await completionEvents(page)).toEqual(previewTag ? [foodEvent] : []);

  await result.getByRole("link", { name: "Tallenna pennun paino" }).click();
  await expect(page).toHaveURL(/\/weight-tracker#uusi-punnitus$/);
  const entry = page.locator("#uusi-punnitus");
  await expect(entry).toBeFocused();
  await expect(entry.getByLabel("Paino (kg)")).toBeInViewport();
  const weight = entry.getByLabel("Paino (kg)");
  await weight.fill("4,2");
  await entry.getByRole("button", { name: "Lisää paino" }).click();
  await expect(entry.getByRole("status")).toContainText("4,2 kg lisätty");
  const firstWeightEvent = ["event", "first_weight_saved", {
    life_stage: "puppy", storage_type: "browser",
    send_to: previewTag, page_location: canonical + "/weight-tracker", page_referrer: "",
  }];
  const expected = previewTag ? [foodEvent, firstWeightEvent] : [];
  expect(await completionEvents(page)).toEqual(expected);

  await weight.fill("4,3");
  await entry.getByRole("button", { name: "Lisää paino" }).click();
  await expect(entry.getByRole("status")).toContainText("4,3 kg lisätty");
  expect(await completionEvents(page)).toEqual(expected);

  await page.getByRole("link", { name: "Evästeet", exact: true }).click();
  await page.getByRole("button", { name: "Peru analytiikkasuostumus" }).click();
  await expect(page.getByText("Analytiikka on pois käytöstä.")).toBeVisible();
  if (previewTag) {
    expect(await page.evaluate((id) => Reflect.get(window, `ga-disable-${id}`), previewTag)).toBe(true);
  }
  await page.getByRole("navigation", { name: "Alatunnisteen linkit" })
    .getByRole("link", { name: "Ruokalaskuri" }).click();
  await calculatePuppyPortion(page);
  expect(await completionEvents(page)).toEqual(expected);
  expect(tagRequests).toHaveLength(previewTag ? 1 : 0);
});

test("a rejected browser save keeps the weight in the form and records no completed weighing", async ({ page }) => {
  await page.route(googleTag, (route) => route.fulfill({ body: "" }));
  await page.addInitScript(() => {
    const save = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "pentulaskuri-guest-data") throw new DOMException("Test storage limit.", "QuotaExceededError");
      save.call(this, key, value);
    };
  });
  await page.goto("/weight-tracker#uusi-punnitus");
  await page.getByRole("button", { name: "Salli analytiikka" }).click();
  await page.getByLabel("Paino (kg)").fill("4,5");
  await page.getByRole("button", { name: "Lisää paino" }).click();
  await expect(page.getByRole("alert")).toContainText("Selain ei voinut tallentaa painoa");
  await expect(page.getByLabel("Paino (kg)")).toHaveValue("4,5");
  expect(await completionEvents(page)).toEqual([]);
});

test("the preparation guide explains the current direct shop links", async ({ page }) => {
  await page.goto("/guides/pennun-hankinnat");
  await expect(page.getByText("Pentulaskuri ei saa niistä palkkiota.", { exact: false })).toBeVisible();
  await expect(page.getByText("Sisältää mainoslinkkejä.", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Peten Koiratarvike/ })).toHaveAttribute(
    "href", "https://www.petenkoiratarvike.com/",
  );
});
