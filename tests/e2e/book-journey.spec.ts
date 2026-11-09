import AxeBuilder from "@axe-core/playwright";
import { test, expect, openPage } from "../fixtures/navigation";
test.use({ contextOptions: { reducedMotion: "reduce" } });
test("a signed-out book action preserves the selected step on the login link", async ({
  page,
}) => {
  await openPage(page, "/puppy-book-landing");
  await page.getByRole("link", { name: "Avaa Oma kirja", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Kirjaudu ja aloita oma kirja" }),
  ).toHaveAttribute("href", "/login?next=puppy-book&osio=vuosikirja");
});
test.describe("book email callback", () => {
  test.use({ userState: "signed-in" });
  test("a new email tab returns to the selected book step without session storage", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      sessionStorage.clear();
      localStorage.setItem(
        "pentulaskuri.auth.return",
        "/puppy-book?osio=kasvu",
      );
    });
    await page.goto("/auth/callback");
    await expect(page).toHaveURL(/\/puppy-book\?osio=kasvu$/);
  });
});
for (const width of [320, 768, 1024, 1440]) {
  test(`illustrated book workflow links to real actions at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await openPage(page, "/puppy-book-landing");
    const guide = page.getByRole("region", {
      name: "Näin pennun vuodesta tulee oma kirja.",
      exact: true,
    });
    await expect(guide.getByRole("img")).toHaveCount(4);
    await expect(
      guide.getByRole("link", { name: "Lisää ensimmäinen muisto" }),
    ).toHaveAttribute("href", "/puppy-book?osio=muistot");
    await expect(
      guide.getByRole("link", { name: "Kirjaa kasvun hetki" }),
    ).toHaveAttribute("href", "/puppy-book?osio=kasvu");
    await expect(
      guide.getByRole("link", { name: "Avaa Oma kirja" }),
    ).toHaveAttribute("href", "/puppy-book?osio=vuosikirja");
    await guide
      .getByRole("button", { name: "Näin tallennat ja tulostat" })
      .click();
    await expect(
      guide.getByRole("region", { name: "Kirjan tallennus ja tulostus" }),
    ).toContainText("A5");
    await expect(
      guide.getByRole("region", { name: "Kirjan tallennus ja tulostus" }),
    ).toContainText("tämän selaimen muistiin");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (process.env.WORKFLOW_SCREENSHOTS)
      await guide.screenshot({
        path: process.env.WORKFLOW_SCREENSHOTS + `/book-journey-${width}.png`,
        style:
          'body > #root header:not(.book-journey-intro), nav[aria-label="Alapalkin navigaatio"] { visibility: hidden !important; }',
      });
    const report = await new AxeBuilder({ page })
      .include(".book-journey")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      report.violations.map((row) => ({
        id: row.id,
        targets: row.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
}
