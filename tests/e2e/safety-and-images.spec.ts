import AxeBuilder from "@axe-core/playwright";
import {
  test,
  expect,
  openPage,
  expectHeaderToFit,
} from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const width of [320, 768, 1024, 1440]) {
  test(`photo challenges are accessible and private by default at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page, "/satukuvat");
    await expectHeaderToFit(page);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("radio")).toHaveCount(5);
    await expect(
      page.getByRole("button", { name: "Luo muokattu kuva" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("link", { name: "Kirjaudu sisään", exact: true }).last(),
    ).toBeVisible();
    await expect(page.locator('input[type="file"]')).toHaveAttribute(
      "accept",
      "image/jpeg,image/png,image/webp",
    );
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Ota yhteyttä", exact: true }),
    ).toHaveAttribute("href", "/contact");
    const report = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      report.violations.map((rule) => ({
        id: rule.id,
        nodes: rule.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("safety news shows source health and returns to the current guide index", async ({
  page,
}) => {
  const now = new Date().toISOString();
  await page.route("**/functions/v1/safety-news", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: "test-notice",
            source_id: "ruokavirasto-rehut",
            title: "Testitiedote: koiranruoan takaisinveto",
            url: "https://www.ruokavirasto.fi/elaimet/rehut/testitiedote/",
            published_at: now,
            kind: "recall",
            region: null,
          },
        ],
        checks: ["ruokavirasto-rehut", "ruokavirasto-elaimet"].map(
          (source_id) => ({
            source_id,
            status: "ok",
            last_attempt_at: now,
            last_success_at: now,
            error_code: null,
          }),
        ),
      }),
    }),
  );
  await openPage(page, "/guides/safety");
  await expect(
    page.getByText("Lähteet tarkistettu", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Testitiedote: koiranruoan takaisinveto/ }),
  ).toHaveAttribute(
    "href",
    "https://www.ruokavirasto.fi/elaimet/rehut/testitiedote/",
  );
  await page.getByRole("link", { name: /Takaisin tietopankkiin/ }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await expect(page.locator("main h1")).toBeVisible();
});

test("an unavailable lazy module offers a safe full-page recovery", async ({
  page,
}) => {
  await page.route(/\/assets\/InfoHome-[^/]+\.js$/, (route) =>
    route.abort("failed"),
  );
  await page.goto("/info");
  await expect(
    page.getByRole("heading", { name: "Sivun lataaminen keskeytyi" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Lataa sivu uudelleen" }),
  ).toHaveAttribute("href", "/info");
  await page.unroute(/\/assets\/InfoHome-[^/]+\.js$/);
  await page.getByRole("link", { name: "Lataa sivu uudelleen" }).click();
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.getByText("Unexpected Application Error!")).toHaveCount(0);
});
