import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const width of [320, 1280]) {
  test(`expired OAuth offers an accessible retry at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "/auth/callback#error=server_error&error_description=OAuth+state+has+expired",
    );
    await expect(page.getByRole("alert")).toContainText(
      "Kirjautumispyyntö vanheni",
    );
    await expect(page).toHaveURL(/\/auth\/callback#/);
    await expect(page.getByText(/kirjautuminen onnistui/i)).toHaveCount(0);
    expect(
      (await new AxeBuilder({ page }).include("main").analyze()).violations,
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath("expired-callback.png"),
    });
    await page
      .getByRole("link", { name: "Yritä kirjautumista uudelleen" })
      .click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByLabel("Sähköpostiosoite", { exact: true }),
    ).toBeVisible();
  });

  test(`a missing session stays on an error page at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/auth/callback");
    await expect(page.getByRole("alert")).toContainText(
      "Kirjautuminen ei onnistunut",
    );
    await expect(page).toHaveURL(/\/auth\/callback$/);
    await expect(
      page.getByRole("link", { name: "Yritä kirjautumista uudelleen" }),
    ).toHaveAttribute("href", "/login");
  });
}

test.describe("callback with a session", () => {
  test.use({ userState: "signed-in" });

  test("redirects to the home page only after a session exists", async ({
    page,
  }) => {
    await page.goto("/auth/callback");
    await expect(page).toHaveURL(
      new URL("/", test.info().project.use.baseURL).href,
    );
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Kirjaudu / Luo profiili", exact: true }),
    ).toHaveCount(0);
  });
});
