import { test, expect } from "../fixtures/navigation";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import type { Page } from "@playwright/test";

const owner = "11111111-1111-4111-8111-111111111111";
const bookId = "33333333-3333-4333-8333-333333333333";
const dogId = "22222222-2222-4222-8222-222222222222";
const book = {
  id: bookId,
  owner_id: owner,
  dog_id: dogId,
  title: "Nuppu",
  birth_date: "2026-04-01",
  theme: {},
  privacy_settings: { visibility: "private" },
};
const photoPath = `${owner}/books/${bookId}/one.webp`;
const memories = [
  {
    id: "early",
    caption: "Ensimmäinen kotipäivä.",
    content_type: "image",
    content_url: photoPath,
    timeline_entry_id: "home",
    created_at: "2026-10-27T00:00:00Z",
    tags: [],
  },
  {
    id: "mishap",
    caption: "Sukka löytyi pennun pedistä.",
    content_type: "text",
    content_url: null,
    timeline_entry_id: null,
    created_at: "2026-10-27T00:00:00Z",
    tags: [],
  },
  {
    id: "late",
    caption: "Syksyn yhteinen retki.",
    content_type: "image",
    content_url: photoPath,
    timeline_entry_id: null,
    created_at: "2026-10-27T00:00:00Z",
    tags: [],
  },
];

async function sources(
  page: Page,
  options: {
    failImage?: boolean;
    deniedOwner?: boolean;
    failMemories?: boolean;
    longCaption?: string;
  } = {},
) {
  const reads: string[] = [];
  const writes: string[] = [];
  await page.route(
    /https:\/\/[^/]+\.supabase\.co\/(rest|storage)\/v1\//,
    async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      // Signing a private image is a read operation implemented as POST by Storage.
      if (
        url.pathname.startsWith("/storage/v1/object/sign/") &&
        request.method() === "POST"
      )
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            signedURL: `/object/sign/puppy-books/${photoPath}?token=synthetic`,
          }),
        });
      if (request.method() !== "GET") {
        writes.push(url.pathname);
        return route.abort();
      }
      reads.push(url.pathname + url.search);
      if (url.pathname.startsWith("/storage/"))
        return options.failImage
          ? route.fulfill({
              status: 403,
              contentType: "application/json",
              body: '{"message":"test denied"}',
            })
          : route.fulfill({
              status: 200,
              contentType: "image/webp",
              path: path.resolve("src/assets/puppy-home-640.webp"),
            });
      let data: unknown = [];
      if (url.pathname.endsWith("/puppy_books"))
        data = request.headers().accept?.includes("vnd.pgrst.object")
          ? { ...book, owner_id: options.deniedOwner ? "another-user" : owner }
          : [book];
      if (url.pathname.endsWith("/memories")) {
        if (options.failMemories)
          return route.fulfill({
            status: 503,
            contentType: "application/json",
            body: '{"message":"test unavailable"}',
          });
        data = memories.map((memory, index) =>
          index === 0 && options.longCaption
            ? { ...memory, caption: options.longCaption }
            : memory,
        );
      }
      if (url.pathname.endsWith("/timeline_entries"))
        data = [{ id: "home", entry_date: "2026-06-03" }];
      if (url.pathname.endsWith("/weight_entries"))
        data = [
          { date: "2026-06-03", weight: 4.2 },
          { date: "2026-07-03", weight: 6.5 },
        ];
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    },
  );
  return { reads, writes, options };
}

async function chooseMemories(page: Page) {
  for (const n of [1, 2, 3])
    await page
      .getByRole("checkbox", { name: new RegExp(`^Muisto ${n}:`) })
      .check();
  await expect(
    page.getByLabel("Tapahtumapäivä, muisto 1", { exact: true }),
  ).toHaveValue("2026-06-03");
  await expect(
    page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
  ).toHaveValue("");
  await page
    .getByLabel("Tapahtumapäivä, muisto 2", { exact: true })
    .fill("2026-07-12");
  await page
    .getByLabel("Tapahtumapäivä, muisto 3", { exact: true })
    .fill("2026-09-03");
  await page
    .getByRole("checkbox", {
      name: "Kuukauden kommellus, muisto 2",
      exact: true,
    })
    .check();
}

test.describe("automatic puppy book", () => {
  test.use({ userState: "signed-in" });

  for (const width of [320, 768, 1024, 1440]) {
    test(`confirmed memories, keyboard and accessible preview at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const requests = await sources(page);
      await page.goto("/puppy-book?osio=vuosikirja");
      await expect(
        page.getByRole("button", { name: "Kirjoita muisto", exact: true }),
      ).toHaveCount(0);
      await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
        "Nuppu",
      );
      await page
        .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
        .click();
      await expect(page.getByRole("alert")).toContainText(
        "vähintään yksi muisto",
      );
      await chooseMemories(page);
      await page
        .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
        .click();
      // Assert document focus, independent of which macOS window the user is using.
      await expect
        .poll(() =>
          page
            .getByRole("heading", {
              name: "Oman kirjan esikatselu",
              exact: true,
            })
            .evaluate(
              (element) => element.ownerDocument.activeElement === element,
            ),
        )
        .toBe(true);
      await page.getByLabel("Valitse kirjan sivu").selectOption("1");
      await expect(
        page.getByRole("heading", { name: "Silloin ja nyt", exact: true }),
      ).toBeVisible();
      await page.getByLabel("Valitse kirjan sivu").selectOption("3");
      await expect(
        page.getByRole("heading", { name: "Kuukauden kommellus", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Sukka löytyi pennun pedistä.", { exact: true }).last(),
      ).toBeVisible();
      const a11y = await new AxeBuilder({ page })
        .include("#puppy-book-content")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(a11y.violations).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page.getByLabel("Pennun nimi", { exact: true }).fill("Nuppu uusi");
      await expect(
        page.getByRole("button", {
          name: "Tulosta tai tallenna PDF",
          exact: true,
        }),
      ).toHaveCount(0);
      await page
        .getByRole("button", { name: "Päivitä esikatselu", exact: true })
        .click();
      await expect(
        page.getByRole("button", {
          name: "Tulosta tai tallenna PDF",
          exact: true,
        }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Muistot", exact: true }).click();
      await expect(page.getByRole("alertdialog")).toContainText(
        "Kirjan valinnat ovat tallentamatta",
      );
      await page
        .getByRole("button", { name: "Jatka kirjan kokoamista", exact: true })
        .click();
      await expect(page).toHaveURL(/osio=vuosikirja/);
      await page.getByRole("button", { name: "Muistot", exact: true }).click();
      await page
        .getByRole("button", { name: "Poistu ja hylkää valinnat", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Kirjoita muisto", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Oma kirja", exact: true })
        .click();
      await expect(
        page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
      ).toHaveValue("");
      expect(requests.writes).toEqual([]);
      const weightQuery = requests.reads.find((url) =>
        url.includes("/weight_entries"),
      );
      expect(weightQuery).toContain(`dog_id=eq.${dogId}`);
      expect(weightQuery).toContain(`user_id=eq.${owner}`);
    });
  }

  for (const [label, caption] of [
    ["wide text", "W".repeat(5000)],
    ["multiline text", "Pentu 🐾\n\n".repeat(300)],
  ]) {
    test(`long ${label} continues across paper pages without lost text`, async ({
      page,
    }) => {
      await page.addInitScript(() => {
        window.print = () => {
          document.documentElement.dataset.printRequested = "true";
        };
      });
      await sources(page, { longCaption: caption });
      await page.goto("/puppy-book?osio=vuosikirja");
      await page.getByRole("checkbox", { name: /^Muisto 1:/ }).check();
      await page
        .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Tulosta tai tallenna PDF", exact: true })
        .click();
      await expect
        .poll(() =>
          page.evaluate(() => document.documentElement.dataset.printRequested),
        )
        .toBe("true");
      const text = await page
        .locator(".annual-print-root .annual-copy")
        .allTextContents();
      expect(text.join("")).toBe(caption);
      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    });
  }

  test("a failed private image blocks export and preserves the draft for retry", async ({
    page,
  }) => {
    const requests = await sources(page, { failImage: true });
    await page.goto("/puppy-book?osio=vuosikirja");
    await chooseMemories(page);
    await page
      .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      "kuvan lataus epäonnistui",
    );
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
    ).toHaveValue("2026-07-12");
    await expect(
      page.getByRole("button", {
        name: "Tulosta tai tallenna PDF",
        exact: true,
      }),
    ).toHaveCount(0);
    requests.options.failImage = false;
    await page
      .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Oman kirjan esikatselu",
        exact: true,
      }),
    ).toBeVisible();
    expect(requests.writes).toEqual([]);
  });

  test("an ownership failure stops source reads", async ({ page }) => {
    const requests = await sources(page, { deniedOwner: true });
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByRole("alert")).toContainText("käyttöoikeutta");
    expect(requests.reads.some((url) => url.includes("weight_entries"))).toBe(
      false,
    );
    await expect(
      page.getByRole("button", {
        name: "Kokoa kirjan esikatselu",
        exact: true,
      }),
    ).toHaveCount(0);
  });

  test("a source failure can be retried", async ({ page }) => {
    const requests = await sources(page, { failMemories: true });
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByRole("alert")).toContainText(
      "Muistojen lataus epäonnistui",
    );
    requests.options.failMemories = false;
    await page
      .getByRole("button", { name: "Yritä uudelleen", exact: true })
      .click();
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toBeVisible();
  });
});

test("the shared sample layout prints only book pages and restores keyboard focus", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.printRequested = "true";
    };
  });
  await page.goto("/muistokirja?sivu=kommellus");
  await expect(
    page.getByRole("heading", { name: "Kuukauden kommellus", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Tulosta tai tallenna PDF", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.printRequested),
    )
    .toBe("true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("body > #root")).toBeHidden();
  await expect(page.locator(".annual-print-root")).toBeVisible();
  const sheets = page.locator(".annual-print-root .annual-sheet");
  await expect(sheets).toHaveCount(6);
  expect(
    await sheets.evaluateAll((elements) =>
      elements
        .filter((element) => element.scrollHeight > element.clientHeight + 2)
        .map((element) => element.textContent),
    ),
  ).toEqual([]);
  const pdf = await page.pdf({
    path: process.env.ANNUAL_BOOK_SAMPLE_PDF,
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
    outline: true,
  });
  expect(pdf.byteLength).toBeLessThan(2_000_000);
  expect(pdf.toString("latin1")).toContain("/StructTreeRoot");
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator(".annual-print-root")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .getByRole("button", { name: "Tulosta tai tallenna PDF", exact: true })
        .evaluate((element) => element.ownerDocument.activeElement === element),
    )
    .toBe(true);
});
