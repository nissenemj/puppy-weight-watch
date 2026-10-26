import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect, expectHeaderToFit } from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

async function expectAccessible(page: Page, scope: string) {
  const report = await new AxeBuilder({ page })
    .include(scope)
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    report.violations.map((rule) => ({
      id: rule.id,
      problems: rule.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}

async function expectLayout(page: Page) {
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expectHeaderToFit(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const bounds = await page.locator("main h1").evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    headerBottom: document.querySelector("header")!.getBoundingClientRect()
      .bottom,
  }));
  expect(bounds.top).toBeGreaterThanOrEqual(bounds.headerBottom);
}

for (const width of [320, 768, 1024, 1440]) {
  for (const path of ["/guides/pennun-hankinnat", "/muistokirja"]) {
    test(`${path} is readable and accessible at ${width}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://pentulaskuri.com${path}`,
      );
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expectLayout(page);
      await expectAccessible(page, "main");
      await page.screenshot({
        path: testInfo.outputPath("page.png"),
        fullPage: true,
      });
    });
  }
}

test("the checklist works by keyboard and identifies the existing commercial links", async ({
  page,
}) => {
  await page.goto("/guides/pennun-hankinnat");
  const first = page.getByRole("checkbox", {
    name: "Panta tai valjaat ja talutushihna",
  });
  await first.focus();
  await first.press("Space");
  await expect(first).toBeChecked();
  await expect(
    page.locator("#hankintalista").getByRole("status"),
  ).toContainText("1/8 valmiina");
  await first.press("Space");
  await expect(
    page.locator("#hankintalista").getByRole("status"),
  ).toContainText("0/8 valmiina");
  const partners = page.locator('a[rel~="sponsored"]');
  await expect(partners).toHaveCount(2);
  for (const link of await partners.all()) {
    await expect(link).toContainText("Mainoslinkki");
    await expect(link).toContainText("avautuu uuteen välilehteen");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    expect(
      new URL((await link.getAttribute("href"))!).searchParams.get("as"),
    ).toBe("2037227635");
  }
  // Intentionally do not click affiliate URLs.
});

test("the example can be browsed, linked directly and followed to an honest interest form", async ({
  page,
}) => {
  await page.goto("/muistokirja");
  await expect(
    page.getByText("Nuppu ja kaikki kirjan tiedot ovat kuvitteellisia.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edellinen esimerkkisivu" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Seuraava esimerkkisivu" }).click();
  await expect(page).toHaveURL(/sivu=ensimmaiset-paivat/);
  await expect(
    page.getByRole("heading", { name: "Tervetuloa kotiin, Nuppu." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pieniä suuria hetkiä", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Seuraava esimerkkisivu" }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pieniä suuria hetkiä", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("Muistokirja on suunnitteilla eikä sitä voi vielä ostaa.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Kerro kiinnostuksesta" }).click();
  await expect(page).toHaveURL(/\/contact\?aihe=muistokirja$/);
  await expect(page.getByLabel("Aihe", { exact: true })).toHaveValue(
    "Kiinnostus muistokirjaan (hintaehdotus 14,90 €)",
  );
  // Message delivery is tested with a mocked fetch in Contact.test.tsx.
});

test("new pages are reachable from the guides and puppy-book landing page", async ({
  page,
}) => {
  await page.goto("/guides");
  await page
    .getByRole("link", { name: "Lue Pennun hankintalista -opas" })
    .click();
  await expect(page).toHaveURL(/\/guides\/pennun-hankinnat$/);
  await page
    .getByRole("link", { name: "Katso muistokirjan esimerkki" })
    .click();
  await expect(page).toHaveURL(/\/muistokirja$/);
  await expectLayout(page);
  await page.goto("/puppy-book-landing");
  await page
    .getByRole("link", { name: "Katso muistokirjan esimerkki" })
    .click();
  await expect(page).toHaveURL(/\/muistokirja$/);
  await expectLayout(page);
});

const owner = "11111111-1111-4111-8111-111111111111";
const bookId = "33333333-3333-4333-8333-333333333333";
const book = {
  id: bookId,
  owner_id: owner,
  dog_id: "22222222-2222-4222-8222-222222222222",
  title: "Nupun pentukirja",
  birth_date: "2026-04-01",
  cover_image_url: null,
  theme: { bannerColor: "green" },
  privacy_settings: { visibility: "private" },
  created_at: "2026-06-03T10:00:00Z",
  updated_at: "2026-06-03T10:00:00Z",
  dogs: null,
};

async function mockBook(
  page: Page,
  options: { failFirstSave?: boolean; title?: string } = {},
) {
  const memories: Record<string, unknown>[] = [];
  const writes: Record<string, unknown>[] = [];
  await page.route(
    /https:\/\/[^/]+\.supabase\.co\/rest\/v1\/puppy_books(?:\?|$)/,
    async (route) => {
      if (route.request().method() !== "GET") return route.abort();
      const data = route
        .request()
        .headers()
        .accept?.includes("vnd.pgrst.object")
        ? { owner_id: owner }
        : [{ ...book, title: options.title || book.title }];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    },
  );
  await page.route(
    /https:\/\/[^/]+\.supabase\.co\/rest\/v1\/memories(?:\?|$)/,
    async (route) => {
      if (route.request().method() === "POST") {
        const payload = route.request().postDataJSON() as Record<
          string,
          unknown
        >;
        writes.push(payload);
        if (options.failFirstSave && writes.length === 1)
          return route.fulfill({
            status: 403,
            contentType: "application/json",
            body: JSON.stringify({
              code: "42501",
              message: "Tallennus estettiin testissä. Yritä uudelleen.",
            }),
          });
        memories.push({
          ...payload,
          id: "44444444-4444-4444-8444-444444444444",
          created_at: new Date().toISOString(),
          reactions: [],
          comments: [],
        });
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(memories),
        });
      }
      if (route.request().method() !== "GET") return route.abort();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(memories),
      });
    },
  );
  return writes;
}

test.describe("the signed-in puppy book", () => {
  test.use({ userState: "signed-in" });

  for (const width of [320, 768, 1024, 1440]) {
    test(`has one header, usable actions and accessible month controls at ${width}`, async ({
      page,
    }, testInfo) => {
      await mockBook(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/puppy-book");
      await expect(
        page.getByRole("heading", { name: book.title, exact: true }),
      ).toBeVisible();
      await expectLayout(page);
      await expect(
        page.getByRole("button", { name: "Muistot", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: "Kirjoita muisto" }),
      ).toBeVisible();
      await expectAccessible(page, "main");
      await page.screenshot({
        path: testInfo.outputPath("private-book.png"),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Kuukaudet", exact: true })
        .click();
      await expect(page).toHaveURL(/osio=kuukaudet/);
      const month = page.getByRole("button", {
        name: "Syntymästä 1 kuukauteen",
        exact: true,
      });
      await month.click();
      await expect(
        page.getByRole("button", { name: "Edellinen kuukausi" }),
      ).toBeDisabled();
      const bounds = await month.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }

  test("a memory dialog supports keyboard dismissal, restores focus and keeps its draft", async ({
    page,
  }) => {
    await mockBook(page);
    await page.goto("/puppy-book");
    const trigger = page.getByRole("button", { name: "Kirjoita muisto" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Lisää muisto" });
    await expect(dialog).toBeVisible();
    await dialog
      .getByLabel("Muisto", { exact: true })
      .fill("Luonnos yhteisestä aamusta");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    await expect(dialog.getByLabel("Muisto", { exact: true })).toHaveValue(
      "Luonnos yhteisestä aamusta",
    );
    await expectAccessible(page, '[role="dialog"]');
  });

  test("a failed save retains the text, and retry displays the saved memory", async ({
    page,
  }) => {
    const writes = await mockBook(page, { failFirstSave: true });
    await page.goto("/puppy-book");
    await page.getByRole("button", { name: "Kirjoita muisto" }).click();
    const dialog = page.getByRole("dialog", { name: "Lisää muisto" });
    const caption = "Ensimmäinen ilta uudessa kodissa.";
    await dialog.getByLabel("Muisto", { exact: true }).fill(caption);
    await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Muiston lisääminen epäonnistui. Tarkista käyttöoikeus ja yhteys.",
    );
    await expect(dialog.getByLabel("Muisto", { exact: true })).toHaveValue(
      caption,
    );
    await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText(caption, { exact: true })).toBeVisible();
    expect(writes).toHaveLength(2);
    expect(writes[1]).toMatchObject({
      book_id: bookId,
      content_type: "text",
      created_by: owner,
      caption,
    });
    await page.getByRole("button", { name: "Näytä muistot listana" }).click();
    await expect(
      page.getByRole("button", { name: "Näytä muistot listana" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("a long book title stays inside the mobile page", async ({ page }) => {
    const title = "Hyvin pitkännimisen koiran yhteiset muistot "
      .repeat(6)
      .trim();
    await mockBook(page, { title });
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/puppy-book?osio=muistot");
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expectLayout(page);
  });
});
