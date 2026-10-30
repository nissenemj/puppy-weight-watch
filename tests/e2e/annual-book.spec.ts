import { test, expect } from "../fixtures/navigation";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import type { Page } from "@playwright/test";
import { makeDraftData } from "../../src/features/annual-book/draft";

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
    id: "44444444-4444-4444-8444-444444444441",
    caption: "Ensimmäinen kotipäivä.",
    content_type: "image",
    content_url: photoPath,
    timeline_entry_id: "home",
    created_at: "2026-10-27T00:00:00Z",
    tags: [],
  },
  {
    id: "44444444-4444-4444-8444-444444444442",
    caption: "Sukka löytyi pennun pedistä.",
    content_type: "text",
    content_url: null,
    timeline_entry_id: null,
    created_at: "2026-10-27T00:00:00Z",
    tags: [],
  },
  {
    id: "44444444-4444-4444-8444-444444444443",
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
    failDraftLoad?: boolean;
    failDraftSave?: boolean;
    allowMemoryCreation?: boolean;
  } = {},
) {
  const reads: string[] = [];
  const writes: string[] = [];
  const draftWrites: Record<string, unknown>[] = [];
  const memoryWrites: Record<string, unknown>[] = [];
  const extraMemories: Record<string, unknown>[] = [];
  const state: { draft: Record<string, unknown> | null } = { draft: null };
  await page.route(
    /https:\/\/[^/]+\.supabase\.co\/(rest|storage)\/v1\//,
    async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (
        url.pathname.endsWith("/memories") &&
        request.method() === "POST" &&
        options.allowMemoryCreation
      ) {
        const payload = request.postDataJSON() as Record<string, unknown>;
        memoryWrites.push(payload);
        const created = {
          ...payload,
          id: "44444444-4444-4444-8444-444444444444",
          created_at: "2026-10-27T15:00:00Z",
          timeline_entry_id: null,
        };
        extraMemories.push(created);
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify([created]),
        });
      }
      if (url.pathname.endsWith("/annual_book_drafts")) {
        const send = (status: number, body: unknown) =>
          route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify(body),
          });
        if (request.method() === "GET")
          return options.failDraftLoad
            ? send(503, { message: "synthetic load failure" })
            : send(200, state.draft ? [state.draft] : []);
        if (!["POST", "PATCH"].includes(request.method())) return route.abort();
        const payload = request.postDataJSON() as Record<string, unknown>;
        draftWrites.push(payload);
        if (options.failDraftSave)
          return send(503, { message: "synthetic save failure" });
        if (request.method() === "POST" && state.draft)
          return send(409, { code: "23505", message: "synthetic conflict" });
        if (
          request.method() === "PATCH" &&
          url.searchParams.get("revision") !== "eq." + state.draft?.revision
        )
          return send(200, []);
        state.draft = {
          ...state.draft,
          ...payload,
          book_id: bookId,
          owner_id: owner,
          updated_at: new Date().toISOString(),
        };
        return send(
          200,
          request.headers().accept?.includes("vnd.pgrst.object")
            ? state.draft
            : [state.draft],
        );
      }
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
        data = [
          ...memories.map((memory, index) =>
            index === 0 && options.longCaption
              ? { ...memory, caption: options.longCaption }
              : memory,
          ),
          ...extraMemories,
        ];
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
  return { reads, writes, options, draftWrites, memoryWrites, state };
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
    test(`UX: book shortcuts keep the draft, move focus and reach the preview at ${width}`, async ({
      page,
    }) => {
      await sources(page);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/puppy-book?osio=vuosikirja");
      const steps = page.getByRole("navigation", {
        name: "Kirjan kokoamisen vaiheet",
        exact: true,
      });
      await expect(steps).toBeInViewport({ ratio: 1 });
      await steps
        .getByRole("button", { name: "Kansi ja ilme", exact: true })
        .click();
      await expect(page.locator(".annual-design-section")).toBeFocused();
      await page
        .getByLabel("Kirjan oma nimi (valinnainen)", { exact: true })
        .fill("Meidän yhteinen pentuvuosi");
      await steps
        .getByRole("button", { name: "Muistot ja päivät", exact: true })
        .click();
      await expect(page.locator(".annual-memories-section")).toBeFocused();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByLabel("Kirjan oma nimi (valinnainen)", { exact: true }),
      ).toHaveValue("Meidän yhteinen pentuvuosi");
      await chooseMemories(page);
      await steps
        .getByRole("button", { name: "Esikatselu", exact: true })
        .click();
      await expect(
        page.getByRole("button", {
          name: "Kokoa kirjan esikatselu",
          exact: true,
        }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("heading", {
          name: "Oman kirjan esikatselu",
          exact: true,
        }),
      ).toBeFocused();
      await steps
        .getByRole("button", { name: "Kansi ja ilme", exact: true })
        .click();
      await steps
        .getByRole("button", { name: "Esikatselu", exact: true })
        .click();
      await expect(
        page.getByRole("heading", {
          name: "Oman kirjan esikatselu",
          exact: true,
        }),
      ).toBeFocused();
      if (process.env.UX_SCREENSHOTS) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `${process.env.UX_SCREENSHOTS}/kirja-${width}.png`,
        });
      }
      const result = await new AxeBuilder({ page })
        .include("main")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    });
  }

  test("the live cover uses only an included, dated private photo and respects the illustration choice", async ({
    page,
  }) => {
    const calls = await sources(page);
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(
      page.getByLabel("Kirjan oma nimi (valinnainen)"),
    ).toBeVisible();
    await page
      .getByRole("radio", { name: "Oma kuva kanteen", exact: true })
      .check();
    await expect(
      page.getByText("Valitse alempaa kuvamuisto", { exact: false }),
    ).toBeVisible();
    await expect(page.getByAltText("Kanteen valittu oma kuva")).toHaveCount(0);
    await page.getByRole("checkbox", { name: /^Muisto 1:/ }).check();
    const cover = page.getByAltText("Kanteen valittu oma kuva");
    await expect(cover).toBeVisible();
    await expect(cover).toHaveAttribute("src", /object\/sign\/puppy-books\//);
    await page
      .getByLabel("Kirjan oma nimi (valinnainen)")
      .fill("Meidän pieni tarinamme");
    await expect(page.locator(".annual-cover-title")).toHaveText(
      "Meidän pieni tarinamme",
    );
    await page.getByLabel("Tapahtumapäivä, muisto 1", { exact: true }).fill("");
    await expect(cover).toHaveCount(0);
    await page
      .getByRole("radio", { name: "Piirretty pentu kanteen", exact: true })
      .check();
    await expect(page.locator(".annual-cover-drawing img")).toBeVisible();
    expect(calls.writes).toEqual([]);
  });

  test("a version 1 draft opens with its original choices and upgrades only after editing", async ({
    page,
  }) => {
    const requests = await sources(page);
    const { design: _design, ...fields } = makeDraftData(
      "Vanha Nuppu",
      "2026-04-01",
      "2027-03-31",
      true,
      [],
    );
    requests.state.draft = {
      book_id: bookId,
      owner_id: owner,
      revision: 7,
      updated_at: "2026-10-27T15:00:00Z",
      payload: {
        ...fields,
        version: 1,
        memories: [
          {
            id: memories[0].id,
            date: "2026-06-04",
            included: true,
            mishap: false,
          },
        ],
      },
    };
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Vanha Nuppu",
    );
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 1", { exact: true }),
    ).toHaveValue("2026-06-04");
    await expect(
      page.getByRole("radio", { name: "Metsä", exact: true }),
    ).toBeChecked();
    expect(requests.draftWrites).toEqual([]);
    await page.getByRole("radio", { name: "Marja", exact: true }).check();
    await expect(
      page.getByText(
        "Tallennettu. Voit palata jatkamaan tätä kirjaa myöhemmin.",
        { exact: true },
      ),
    ).toBeVisible();
    expect(requests.state.draft.revision).toBe(8);
    expect(requests.state.draft.payload).toMatchObject({
      version: 2,
      design: { palette: "berry" },
      memories: expect.arrayContaining([
        expect.objectContaining({ date: "2026-06-04" }),
      ]),
    });
  });

  test("cover design, private letter and an inspired new memory survive reload without losing earlier choices", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.print = () => {
        document.documentElement.dataset.printRequested = "true";
      };
    });
    const requests = await sources(page, { allowMemoryCreation: true });
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/puppy-book?osio=vuosikirja");
    await chooseMemories(page);
    await page
      .getByLabel("Kirjan oma nimi (valinnainen)", { exact: true })
      .fill("Nupun suuret pienet seikkailut");
    await page.getByRole("radio", { name: "Järvi", exact: true }).check();
    await page.getByRole("radio", { name: "Järvi", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("radio", { name: "Marja", exact: true }),
    ).toBeChecked();
    await page.keyboard.press("ArrowLeft");
    await expect(
      page.getByRole("radio", { name: "Järvi", exact: true }),
    ).toBeChecked();
    await page
      .getByRole("radio", { name: "Piirretty pentu kanteen", exact: true })
      .check();
    await page
      .getByText("Kirje isommalle sinulle (valinnainen)", { exact: true })
      .click();
    const letter =
      "Pieni ystäväni, haluan muistaa hassun tapasi tervehtiä jokaista aamua.";
    await page.getByLabel("Oma kirje pennulle", { exact: true }).fill(letter);
    await expect(
      page.getByText(
        "Tallennettu. Voit palata jatkamaan tätä kirjaa myöhemmin.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByLabel("Kirjan oma nimi (valinnainen)", { exact: true }),
    ).toHaveValue("Nupun suuret pienet seikkailut");
    await expect(
      page.getByRole("radio", { name: "Järvi", exact: true }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", { name: "Piirretty pentu kanteen", exact: true }),
    ).toBeChecked();
    await page
      .getByText("Kirje isommalle sinulle (valinnainen)", { exact: true })
      .click();
    await expect(
      page.getByLabel("Oma kirje pennulle", { exact: true }),
    ).toHaveValue(letter);
    await page
      .getByText("Pieni ideapankki täyttämisen tueksi", { exact: true })
      .click();
    const idea = page.getByRole("button", { name: /^Sinun hassu tapasi/ });
    await idea.click();
    const dialog = page.getByRole("dialog", {
      name: "Lisää muisto",
      exact: true,
    });
    await expect(dialog.getByLabel("Muisto", { exact: true })).toHaveValue("");
    await expect(
      dialog.getByText(
        "Mikä pieni tapa saa sinut aina hymyilemään? Kerro yksi tavallinen hetki.",
        { exact: true },
      ),
    ).toBeVisible();
    const caption = "Venyttelet tassuja aina juuri ennen aamupalaa.";
    await dialog.getByLabel("Muisto", { exact: true }).fill(caption);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(idea).toBeFocused();
    await idea.click();
    await expect(dialog.getByLabel("Muisto", { exact: true })).toHaveValue(
      caption,
    );
    await expect(dialog).toHaveCSS("opacity", "1");
    const a11y = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11y.violations).toEqual([]);
    await dialog.getByRole("button", { name: "Tallenna", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText(caption, { exact: true })).toBeVisible();
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
    ).toHaveValue("2026-07-12");
    await page.getByRole("checkbox", { name: /^Muisto 4:/ }).check();
    await page
      .getByLabel("Tapahtumapäivä, muisto 4", { exact: true })
      .fill("2026-10-27");
    await page
      .getByRole("button", { name: "Kokoa kirjan esikatselu", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Nupun suuret pienet seikkailut",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".annual-document")).toHaveClass(
      /annual-palette-lake/,
    );
    await expect(page.locator(".annual-cover-illustration img")).toBeVisible();
    await page.getByLabel("Valitse kirjan sivu").selectOption("8");
    await expect(page.locator(".annual-letter-copy")).toHaveText(letter);
    await expect(
      page.getByText(
        "Tallennettu. Voit palata jatkamaan tätä kirjaa myöhemmin.",
        { exact: true },
      ),
    ).toBeVisible();
    expect(requests.memoryWrites).toEqual([
      expect.objectContaining({
        caption,
        book_id: bookId,
        created_by: owner,
        content_type: "text",
      }),
    ]);
    expect(requests.writes).toEqual([]);
    const saved = requests.state.draft?.payload as {
      version: number;
      design: { letter: string };
      memories: unknown[];
    };
    expect(saved.version).toBe(2);
    expect(saved.design.letter).toBe(letter);
    expect(saved.memories).toHaveLength(4);
    await page
      .getByRole("button", { name: "Tulosta tai tallenna PDF", exact: true })
      .click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.printRequested),
      )
      .toBe("true");
    await expect(
      page.locator(".annual-print-root .annual-cover-illustration img"),
    ).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
    await expect(page.locator(".annual-print-root .annual-sheet")).toHaveCount(
      9,
    );
    await expect(
      page.locator(".annual-print-root .annual-letter-copy"),
    ).toHaveText(letter);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    if (process.env.ANNUAL_BOOK_DESIGN_SCREENSHOT) {
      if (process.env.ANNUAL_BOOK_MOBILE_SCREENSHOT) {
        await page.locator(".annual-cover-studio").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: process.env.ANNUAL_BOOK_MOBILE_SCREENSHOT,
        });
      }
      await page.setViewportSize({ width: 1390, height: 1132 });
      await page.reload();
      await expect(
        page.getByLabel("Kirjan oma nimi (valinnainen)", { exact: true }),
      ).toHaveValue("Nupun suuret pienet seikkailut");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: process.env.ANNUAL_BOOK_DESIGN_SCREENSHOT,
      });
      await page.locator(".annual-design-section").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: process.env.ANNUAL_BOOK_STUDIO_SCREENSHOT,
      });
      if (process.env.ANNUAL_BOOK_NATIVE_SCREENSHOT) {
        await page.setViewportSize({ width: 1505, height: 1045 });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: process.env.ANNUAL_BOOK_NATIVE_SCREENSHOT,
        });
      }
    }
  });

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
      await page.getByLabel("Valitse kirjan sivu").selectOption("5");
      await expect(
        page.locator(".annual-document").getByRole("img", {
          name: /Kasvukäyrä omista painomittauksista/,
        }),
      ).toBeVisible();
      await expect(
        page.locator(".annual-document .annual-growth-chart circle"),
      ).toHaveCount(2);
      await expect(
        page.locator(".annual-growth-inline .annual-growth-chart circle"),
      ).toHaveCount(2);
      await expect
        .poll(() =>
          page
            .locator(".annual-document .annual-chart-axis text")
            .first()
            .evaluate((element) => element.getBoundingClientRect().height),
        )
        .toBeGreaterThanOrEqual(11);
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
      await expect(
        page.getByText(
          "Tallennettu. Voit palata jatkamaan tätä kirjaa myöhemmin.",
          { exact: true },
        ),
      ).toBeVisible();
      await page.getByRole("button", { name: "Muistot", exact: true }).click();
      await expect(page.getByRole("alertdialog")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Kirjoita muisto", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Oma kirja", exact: true })
        .click();
      await expect(
        page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
      ).toHaveValue("2026-07-12");
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
      await page
        .getByLabel("Kirjan oma nimi (valinnainen)", { exact: true })
        .fill("W".repeat(60));
      await page
        .getByLabel("Pennun nimi", { exact: true })
        .fill("W".repeat(40));
      if (label === "wide text")
        await page
          .getByRole("radio", { name: "Piirretty pentu kanteen", exact: true })
          .check();
      await page.getByRole("checkbox", { name: /^Muisto 1:/ }).check();
      await page
        .getByText("Kirje isommalle sinulle (valinnainen)", { exact: true })
        .click();
      const letter =
        label === "wide text" ? "W".repeat(1200) : "Tassut 🐾\n\n".repeat(100);
      await page.getByLabel("Oma kirje pennulle", { exact: true }).fill(letter);
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
        .locator(".annual-print-root .annual-copy:not(.annual-letter-copy)")
        .allTextContents();
      expect(text.join("")).toBe(caption);
      expect(
        (
          await page
            .locator(".annual-print-root .annual-letter-copy")
            .allTextContents()
        ).join(""),
      ).toBe(letter);
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

  test("autosave restores settings and dates including deselected memories after reload", async ({
    page,
  }) => {
    const requests = await sources(page);
    await page.goto("/puppy-book?osio=vuosikirja");
    await chooseMemories(page);
    await page.getByRole("checkbox", { name: /^Muisto 2:/ }).uncheck();
    await page
      .getByLabel("Pennun nimi", { exact: true })
      .fill("Nupun oma vuosi");
    await page.getByLabel("Alkupäivä", { exact: true }).fill("2026-05-01");
    await page
      .getByRole("checkbox", {
        name: "Lisää kasvukäyrä ja painomittaukset kirjaan",
      })
      .uncheck();
    await expect(page.getByText(/^Tallennettu\. Voit palata/)).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Nupun oma vuosi",
    );
    await expect(page.getByLabel("Alkupäivä", { exact: true })).toHaveValue(
      "2026-05-01",
    );
    await expect(page.getByLabel("Loppupäivä", { exact: true })).toHaveValue(
      "2027-04-30",
    );
    await expect(
      page.getByRole("checkbox", { name: /^Muisto 2:/ }),
    ).not.toBeChecked();
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
    ).toHaveValue("2026-07-12");
    await expect(
      page.getByRole("checkbox", {
        name: "Kuukauden kommellus, muisto 2",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("checkbox", {
        name: "Lisää kasvukäyrä ja painomittaukset kirjaan",
      }),
    ).not.toBeChecked();
    expect(JSON.stringify(requests.draftWrites)).not.toMatch(
      /caption|content_url|synthetic|created_at|access_token/,
    );
    expect(requests.writes).toEqual([]);
  });

  test("a failed save keeps choices and the leave guard until retry succeeds", async ({
    page,
  }) => {
    const requests = await sources(page, { failDraftSave: true });
    await page.goto("/puppy-book?osio=vuosikirja");
    await chooseMemories(page);
    await expect(
      page.getByRole("button", { name: "Yritä tallennusta uudelleen" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Muistot", exact: true }).click();
    await expect(page.getByRole("alertdialog")).toContainText(
      "Kirjan valinnat ovat tallentamatta",
    );
    await page.getByRole("button", { name: "Jatka kirjan kokoamista" }).click();
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
    ).toHaveValue("2026-07-12");
    requests.options.failDraftSave = false;
    await page
      .getByRole("button", { name: "Yritä tallennusta uudelleen" })
      .click();
    await expect(page.getByText(/^Tallennettu\. Voit palata/)).toBeVisible();
    await page.reload();
    await expect(
      page.getByLabel("Tapahtumapäivä, muisto 2", { exact: true }),
    ).toHaveValue("2026-07-12");
    expect(requests.writes).toEqual([]);
  });

  test("an unavailable or unknown saved draft cannot be overwritten by an empty form", async ({
    page,
  }) => {
    const requests = await sources(page, { failDraftLoad: true });
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByRole("alert")).toContainText(
      "Tallennetun luonnoksen lataus epäonnistui",
    );
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveCount(
      0,
    );
    expect(requests.draftWrites).toEqual([]);
    requests.options.failDraftLoad = false;
    requests.state.draft = {
      book_id: bookId,
      owner_id: owner,
      payload: { version: 2 },
      revision: 1,
      updated_at: new Date().toISOString(),
    };
    await page
      .getByRole("button", { name: "Yritä uudelleen", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      "Sen tietoja ei korvattu",
    );
    expect(requests.draftWrites).toEqual([]);
  });

  test("another tabs newer draft requires deliberate reload instead of silent overwrite", async ({
    page,
  }) => {
    const requests = await sources(page);
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Nuppu",
    );
    requests.state.draft = {
      book_id: bookId,
      owner_id: owner,
      payload: makeDraftData(
        "Toisessa välilehdessä",
        "2026-04-01",
        "2027-03-31",
        true,
        [],
      ),
      revision: 1,
      updated_at: new Date().toISOString(),
    };
    await page
      .getByLabel("Pennun nimi", { exact: true })
      .fill("Oma keskeneräinen nimi");
    await expect(
      page.getByRole("button", { name: "Avaa tallennettu versio" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Avaa tallennettu versio" }).click();
    await expect(page.getByRole("alertdialog")).toContainText(
      "Tämän välilehden tallentamattomat valinnat korvataan",
    );
    await page.getByRole("button", { name: "Peruuta", exact: true }).click();
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Oma keskeneräinen nimi",
    );
    await page.getByRole("button", { name: "Avaa tallennettu versio" }).click();
    await page
      .getByRole("button", { name: "Lataa tallennettu luonnos" })
      .click();
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Toisessa välilehdessä",
    );
    expect(requests.draftWrites).toHaveLength(1);
    expect(requests.state.draft.payload).toHaveProperty(
      "puppyName",
      "Toisessa välilehdessä",
    );
  });

  test("offline choices save after reconnect and incomplete fields can be resumed", async ({
    page,
    context,
  }) => {
    const requests = await sources(page);
    await page.goto("/puppy-book?osio=vuosikirja");
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Nuppu",
    );
    await context.setOffline(true);
    await page.getByLabel("Pennun nimi", { exact: true }).fill("");
    await page.getByLabel("Alkupäivä", { exact: true }).fill("");
    await expect(page.getByText(/^Ei verkkoyhteyttä\./)).toBeVisible();
    expect(requests.draftWrites).toHaveLength(0);
    await context.setOffline(false);
    await expect(page.getByText(/^Tallennettu\. Voit palata/)).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "",
    );
    await expect(page.getByLabel("Alkupäivä", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Loppupäivä", { exact: true })).toHaveValue(
      "",
    );
    expect(requests.writes).toEqual([]);
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
  await expect(sheets).toHaveCount(8);
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

for (const width of [320, 768, 1024, 1440]) {
  test(`the book reader supports keyboard, responsive spreads and focus return at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/muistokirja");
    const trigger = page.getByRole("button", {
      name: "Avaa lukutila",
      exact: true,
    });
    await trigger.click();
    const reader = page.getByRole("dialog");
    const canvas = reader.getByRole("region", {
      name: "Kirjan lukusivut",
      exact: true,
    });
    await expect(canvas).toBeFocused();
    // The site's fixed reading-progress bar must stay behind the full-screen book.
    expect(
      await page.evaluate(() =>
        Boolean(document.elementFromPoint(1, 1)?.closest(".book-reader")),
      ),
    ).toBe(true);
    await canvas.press("ArrowRight");
    await expect(reader.locator(".annual-sheet")).toHaveCount(
      width >= 1024 ? 2 : 1,
    );
    await expect(reader.getByRole("status")).toHaveText(
      width >= 1024 ? "Sivut 2–3 / 8" : "Sivu 2 / 8",
    );
    await reader
      .getByLabel("Valitse lukutilan sivu", { exact: true })
      .selectOption("3");
    await expect(
      reader.getByRole("heading", { name: "Kuukauden kommellus", exact: true }),
    ).toBeVisible();
    await expect(
      reader.locator(".annual-mishap-illustration img"),
    ).toBeVisible();
    await expect(reader.getByLabel("Valitse lukutilan sivu")).toHaveValue("3");
    const violations = await new AxeBuilder({ page })
      .include(".book-reader")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      violations.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.failureSummary),
      })),
    ).toEqual([]);
    expect(await reader.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
      true,
    );
    for (const button of await reader.getByRole("button").all()) {
      const size = await button.boundingBox();
      expect(size!.width).toBeGreaterThanOrEqual(44);
      expect(size!.height).toBeGreaterThanOrEqual(44);
    }
    if (process.env.BOOK_READER_SCREENSHOTS) {
      await page.screenshot({
        path: `${process.env.BOOK_READER_SCREENSHOTS}/lukutila-${width}.png`,
      });
      if (width === 1440) {
        await page.setViewportSize({ width: 1505, height: 1045 });
        await page.screenshot({
          path: `${process.env.BOOK_READER_SCREENSHOTS}/lukutila-native.png`,
        });
        await page.setViewportSize({ width, height: 1000 });
      }
    }
    if (width === 320) {
      await page.setViewportSize({ width, height: 568 });
      await canvas.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      expect(
        await canvas.evaluate((element) => element.scrollTop),
      ).toBeGreaterThan(0);
      await reader
        .getByRole("button", { name: "Seuraava lukusivu", exact: true })
        .click();
      await expect
        .poll(() => canvas.evaluate((element) => element.scrollTop))
        .toBe(0);
    }
    await reader.getByLabel("Valitse lukutilan sivu").selectOption("7");
    await expect(
      reader.getByRole("button", { name: "Seuraava lukusivu", exact: true }),
    ).toBeDisabled();
    await canvas.focus();
    await canvas.press("Escape");
    await expect(reader).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(
      page.getByLabel("Valitse kirjan sivu", { exact: true }),
    ).toHaveValue("7");
  });
}

test("printing from the reader isolates all book pages and returns focus inside the dialog", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.readerPrint = "true";
    };
  });
  await page.goto("/muistokirja");
  await page
    .getByRole("button", { name: "Avaa lukutila", exact: true })
    .click();
  const reader = page.getByRole("dialog");
  const print = reader.getByRole("button", {
    name: "Tulosta tai tallenna PDF",
    exact: true,
  });
  await print.click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.readerPrint),
    )
    .toBe("true");
  await expect(page.locator(".annual-print-root .annual-sheet")).toHaveCount(8);
  await page.emulateMedia({ media: "print" });
  await expect(reader).toBeHidden();
  await expect(page.locator(".annual-print-root")).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator(".annual-print-root")).toHaveCount(0);
  await expect(print).toBeFocused();
  await reader.getByRole("button", { name: "Sulje", exact: true }).click();
  await expect(reader).toHaveCount(0);
});
