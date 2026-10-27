import { test, expect, openPage } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const width of [320, 1280]) {
  test(`disabled Google login keeps the email form usable at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page, "/login");
    await expect(
      page.getByText(
        "Google-kirjautuminen ei ole käytössä. Kirjaudu sähköpostilla.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Google|Apple/ }),
    ).toHaveCount(0);
    await expect(
      page.getByLabel("Sähköpostiosoite", { exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Kirjaudu", exact: true }),
    ).toBeEnabled();
    // Catch missing compiled background utilities that leave white text on white.
    await expect(
      page.getByRole("button", { name: "Kirjaudu", exact: true }),
    ).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.screenshot({ path: testInfo.outputPath("login.png") });
  });
}

test("enabled Google login hands off to the correct OAuth endpoint", async ({
  page,
}) => {
  await page.route("**/auth/v1/settings", (route) =>
    route.fulfill({
      json: { external: { google: true, apple: false, email: true } },
    }),
  );
  // Stop at the OAuth boundary: no real Google account or Supabase session is used.
  await page.route("**/auth/v1/authorize?**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>OAuth test handoff</h1>",
    }),
  );
  await openPage(page, "/login");
  const request = page.waitForRequest(
    (request) => new URL(request.url()).pathname === "/auth/v1/authorize",
  );
  await page.getByRole("button", { name: "Jatka Google-tilillä" }).click();
  const url = new URL((await request).url());
  expect(url.searchParams.get("provider")).toBe("google");
  expect(url.searchParams.get("redirect_to")).toBe(
    new URL("/auth/callback", test.info().project.use.baseURL).href,
  );
  await expect(
    page.getByRole("heading", { name: "OAuth test handoff" }),
  ).toBeVisible();
});

test("Google disabled after page load does not leave the app", async ({
  page,
}) => {
  let settingsRequests = 0;
  const authorizeRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/auth/v1/authorize")
      authorizeRequests.push(request.url());
  });
  await page.route("**/auth/v1/settings", (route) =>
    route.fulfill({
      json: {
        external: {
          google: ++settingsRequests === 1,
          apple: false,
          email: true,
        },
      },
    }),
  );
  await openPage(page, "/login");
  await page.getByRole("button", { name: "Jatka Google-tilillä" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Google-kirjautuminen ei ole käytössä.",
  );
  expect(authorizeRequests).toEqual([]);
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("button", { name: "Kirjaudu", exact: true }),
  ).toBeEnabled();
});

test("settings failure leaves validation and email login available", async ({
  page,
}) => {
  await page.route("**/auth/v1/settings", (route) =>
    route.fulfill({ status: 503, json: { error: "test outage" } }),
  );
  await openPage(page, "/login");
  await expect(
    page.getByText(
      "Kirjautumistapoja ei voitu tarkistaa. Voit käyttää sähköpostikirjautumista.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Google/ })).toHaveCount(0);
  await page
    .getByLabel("Sähköpostiosoite", { exact: true })
    .fill("invalid-email");
  await page.getByRole("button", { name: "Kirjaudu", exact: true }).click();
  await expect(
    page.getByText("Syötä kelvollinen sähköpostiosoite"),
  ).toBeVisible();
});
