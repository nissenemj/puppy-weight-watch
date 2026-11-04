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
  // Route styles and scroll restoration settle after the lazy page mounts.
  await expect
    .poll(() =>
      page
        .locator("main h1")
        .evaluate(
          (element) =>
            element.getBoundingClientRect().top -
            document.querySelector("header")!.getBoundingClientRect().bottom,
        ),
    )
    .toBeGreaterThanOrEqual(0);
}

for (const width of [320, 768, 1024, 1440]) {
  for (const path of [
    "/guides/pennun-hankinnat",
    "/muistokirja",
    "/puppy-book-landing",
  ]) {
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
      if (
        path === "/puppy-book-landing" &&
        process.env.BOOK_LANDING_SCREENSHOTS
      ) {
        await page.screenshot({
          path: `${process.env.BOOK_LANDING_SCREENSHOTS}/esittely-${width}-viewport.png`,
        });
        await page.screenshot({
          path: `${process.env.BOOK_LANDING_SCREENSHOTS}/esittely-${width}.png`,
          fullPage: true,
        });
        if (width === 1440) {
          await page.setViewportSize({ width: 1505, height: 1045 });
          await page.screenshot({
            path: `${process.env.BOOK_LANDING_SCREENSHOTS}/esittely-native.png`,
          });
        }
      }
    });
  }
}

for (const width of [320, 768, 1024, 1440]) {
  test(`the public cover trial works without an account, with keyboard and accessible reading at ${width}`, async ({
    page,
  }, testInfo) => {
    const writes: string[] = [];
    page.on("request", (request) => {
      if (
        /\.supabase\.co\//.test(request.url()) &&
        !["GET", "OPTIONS"].includes(request.method())
      )
        writes.push(request.url());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/puppy-book-landing");
    await page
      .getByRole("link", { name: "Kokeile kirjan kantta", exact: true })
      .click();
    const trial = page.getByRole("region", {
      name: "Kokeile kantta pennun nimellä.",
      exact: true,
    });
    await expect(trial).toBeFocused();
    await expect(
      trial.getByText("Kokeilu toimii ilman kirjautumista.", { exact: false }),
    ).toBeVisible();
    await trial.getByLabel("Pennun nimi", { exact: true }).fill("Lumi");
    const cover = trial.getByRole("region", {
      name: "Kannen esikatselu",
      exact: true,
    });
    await expect(cover.getByText("Lumi", { exact: true })).toBeVisible();
    expect(
      await cover
        .getByText("Lumi", { exact: true })
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    expect(
      await cover.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    const lake = trial.getByRole("radio", { name: "Järvi", exact: true });
    await lake.focus();
    await lake.press("ArrowRight");
    await expect(
      trial.getByRole("radio", { name: "Marja", exact: true }),
    ).toBeChecked();
    await expect(cover.locator(".annual-cover-swatch")).toHaveClass(
      /annual-palette-berry/,
    );
    await expect(
      trial.getByRole("status", { name: "Kansiväri", exact: true }),
    ).toContainText("Valittu kansiväri: Marja.");
    for (const label of await trial.locator(".annual-radio").all()) {
      const size = await label.boundingBox();
      expect(size!.width).toBeGreaterThanOrEqual(44);
      expect(size!.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expectAccessible(page, "main");
    await trial.screenshot({ path: testInfo.outputPath("cover-trial.png") });
    if (process.env.BOOK_COVER_TRIAL_SCREENSHOTS)
      await trial.screenshot({
        path: `${process.env.BOOK_COVER_TRIAL_SCREENSHOTS}/kansikokeilu-${width}.png`,
      });
    const readerTrigger = trial.getByRole("button", {
      name: "Katso esimerkkiaukeamaa",
      exact: true,
    });
    await readerTrigger.focus();
    await readerTrigger.press("Enter");
    const reader = page.getByRole("dialog");
    await expect(reader).toBeVisible();
    await expect(
      reader.getByRole("region", { name: "Kirjan lukusivut", exact: true }),
    ).toBeFocused();
    await expect(reader).toContainText(
      "Esimerkin kuvat, päivämäärät ja tarinat ovat kuvitteellisia.",
    );
    await expect(reader.locator(".annual-kicker").first()).toContainText(
      "Lumi",
    );
    await expect(reader.locator(".annual-sheet")).toHaveCount(
      width >= 1024 ? 2 : 1,
    );
    await expect(
      reader.getByRole("button", {
        name: "Tulosta tai tallenna PDF",
        exact: true,
      }),
    ).toHaveCount(0);
    await expectAccessible(page, ".book-reader");
    await reader.press("Escape");
    await expect(reader).toHaveCount(0);
    await expect(readerTrigger).toBeFocused();
    await expect(trial.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Lumi",
    );
    await expect(
      trial.getByRole("radio", { name: "Marja", exact: true }),
    ).toBeChecked();
    await trial
      .getByRole("tab", { name: "Ensimmäinen hetki", exact: true })
      .press("Enter");
    const memoryTab = trial.getByRole("tab", {
      name: "Ensimmäinen hetki",
      exact: true,
    });
    await expect(memoryTab).toHaveAttribute("aria-selected", "true");
    await trial.getByRole("radio", { name: "Kommellus", exact: true }).check();
    await trial
      .getByLabel("Yksi lause teistä", { exact: true })
      .fill("Sukka löytyi pennun pedistä.");
    await trial
      .getByRole("button", { name: "Poimi hetki kirjaan", exact: true })
      .click();
    await expect(
      trial.getByRole("status", { name: "Kokeilun palaute", exact: true }),
    ).toContainText("Kirjassa on 1 hetki.");
    const memory = trial.getByRole("region", {
      name: "Muiston esikatselu",
      exact: true,
    });
    if (width < 900) {
      await expect(memory).toBeFocused();
      const bounds = await memory.boundingBox();
      const header = await page.getByRole("banner").boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
      await trial
        .getByRole("link", { name: "Palaa kirjoittamaan", exact: true })
        .click();
      await expect(
        trial.getByLabel("Yksi lause teistä", { exact: true }),
      ).toBeFocused();
    }
    await expect(memory).toContainText("Sukka löytyi pennun pedistä.");
    await expect(memory).toContainText("Hetki poimittu");
    expect(
      await memory
        .locator(".book-cover-trial-stamp")
        .evaluate((element) => getComputedStyle(element).animationName),
    ).toBe("none");
    await expectAccessible(page, "main");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (process.env.BOOK_COVER_TRIAL_SCREENSHOTS)
      await trial.screenshot({
        path: `${process.env.BOOK_COVER_TRIAL_SCREENSHOTS}/muistokokeilu-${width}.png`,
      });
    await memoryTab.focus();
    await memoryTab.press("ArrowLeft");
    await expect(
      trial.getByRole("tab", { name: "Kansi", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(trial.getByLabel("Pennun nimi", { exact: true })).toHaveValue(
      "Lumi",
    );
    await trial
      .getByRole("link", { name: "Aloita oma pentukirja", exact: true })
      .click();
    await expect(page).toHaveURL(/\/puppy-book$/);
    await expect(
      page.getByRole("link", { name: "Kirjaudu sisään", exact: true }),
    ).toBeVisible();
    expect(writes).toEqual([]);
    expect(page.url()).not.toContain("Lumi");
  });
}

test("the interactive trial retains each draft, updates rather than duplicates a moment and reads collected words without saving them", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (
      /\.supabase\.co\//.test(request.url()) &&
      !["GET", "OPTIONS"].includes(request.method())
    )
      writes.push(request.url());
  });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/puppy-book-landing#kokeile-kantta");
  const trial = page.locator("#kokeile-kantta");
  await trial.getByLabel("Pennun nimi", { exact: true }).fill("Lumi");
  await trial
    .getByRole("tab", { name: "Ensimmäinen hetki", exact: true })
    .click();
  await expect(
    trial.getByRole("tab", { name: "Ensimmäinen hetki", exact: true }),
  ).toBeFocused();
  const draft = trial.getByLabel("Yksi lause teistä", { exact: true });
  await draft.fill("Nukahdit villasukka tyynynäsi.");
  const idea = trial.getByRole("status", {
    name: "Kirjoitusidea",
    exact: true,
  });
  const firstIdea = await idea.innerText();
  await trial
    .getByRole("button", { name: "Vaihda kirjoitusideaa", exact: true })
    .click();
  await expect(idea).not.toHaveText(firstIdea);
  await expect(draft).toHaveValue("Nukahdit villasukka tyynynäsi.");
  await trial
    .getByRole("button", { name: "Poimi hetki kirjaan", exact: true })
    .click();
  const feedback = trial.getByRole("status", {
    name: "Kokeilun palaute",
    exact: true,
  });
  await expect(feedback).toContainText("Kirjassa on 1 hetki.");
  await trial
    .getByRole("button", { name: "Päivitä hetki kirjassa", exact: true })
    .click();
  await expect(feedback).toContainText("hetki päivitetty");
  await expect(feedback).toContainText("Kirjassa on 1 hetki.");
  const home = trial.getByRole("radio", { name: "Kotipäivä", exact: true });
  await home.focus();
  await home.press("ArrowRight");
  await expect(
    trial.getByRole("radio", { name: "Kommellus", exact: true }),
  ).toBeChecked();
  await expect(draft).toHaveValue("");
  await draft.fill("Sukka olikin tärkeä aarre.");
  await trial
    .getByRole("button", { name: "Poimi hetki kirjaan", exact: true })
    .click();
  await expect(feedback).toContainText("Kirjassa on 2 hetkeä.");
  await home.check();
  await expect(draft).toHaveValue("Nukahdit villasukka tyynynäsi.");
  await draft.fill("Nukahdit lopulta kainalooni.");
  await expect(trial.getByText("Hetki poimittu", { exact: true })).toHaveCount(
    0,
  );
  await trial
    .getByRole("button", { name: "Päivitä hetki kirjassa", exact: true })
    .click();
  await expect(feedback).toContainText("Kirjassa on 2 hetkeä.");
  await trial
    .getByRole("button", { name: "Katso esimerkkiaukeamaa", exact: true })
    .click();
  const reader = page.getByRole("dialog");
  await expect(reader).toContainText(
    "mukana on myös kokeilussa lisäämäsi teksti",
  );
  const pageMenu = reader.getByLabel("Valitse lukutilan sivu", { exact: true });
  const options = await pageMenu.locator("option").allTextContents();
  const homePage = options.findIndex((label) => label.includes("kesäkuu"));
  const mishapPage = options.findIndex((label) =>
    label.includes("Kuukauden kommellus"),
  );
  expect(homePage).toBeGreaterThan(0);
  expect(mishapPage).toBeGreaterThan(homePage);
  await pageMenu.selectOption(String(homePage));
  await expect(reader).toContainText("Nukahdit lopulta kainalooni.");
  await expect(reader).not.toContainText("Nukahdit villasukka tyynynäsi.");
  await pageMenu.selectOption(String(mishapPage));
  await expect(reader).toContainText("Sukka olikin tärkeä aarre.");
  await expectAccessible(page, ".book-reader");
  await reader.press("Escape");
  await expect(
    trial.getByRole("button", { name: "Katso esimerkkiaukeamaa", exact: true }),
  ).toBeFocused();
  expect(writes).toEqual([]);
  expect(page.url()).not.toContain("Lumi");
  expect(page.url()).not.toContain("kainalooni");
  await page.reload();
  await trial
    .getByRole("tab", { name: "Ensimmäinen hetki", exact: true })
    .click();
  await expect(draft).toHaveValue("");
  await expect(
    trial.getByRole("button", { name: "Poimi hetki kirjaan", exact: true }),
  ).toBeVisible();
  await expect(feedback).toContainText("Kokeile omia sanoja");
});

test("the interactive trial handles long text, whitespace, all moment choices and reduced motion on a small phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/puppy-book-landing#kokeile-kantta");
  const trial = page.locator("#kokeile-kantta");
  await trial
    .getByRole("tab", { name: "Ensimmäinen hetki", exact: true })
    .click();
  const draft = trial.getByLabel("Yksi lause teistä", { exact: true });
  const memory = trial.getByRole("region", {
    name: "Muiston esikatselu",
    exact: true,
  });
  await draft.fill("Pentu".repeat(36));
  await expect(draft).toHaveValue("Pentu".repeat(36));
  await expect(memory).toContainText("Pentu".repeat(36));
  for (const label of await trial.locator(".book-cover-trial-moment").all()) {
    const size = await label.boundingBox();
    expect(size!.width).toBeGreaterThanOrEqual(44);
    expect(size!.height).toBeGreaterThanOrEqual(44);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await memory
      .locator(".book-cover-trial-sheet")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await expectAccessible(page, "main");
  await draft.fill("   ");
  await trial
    .getByRole("button", { name: "Poimi hetki kirjaan", exact: true })
    .click();
  await expect(memory).toContainText("Pieni nenä tutki jokaisen nurkan.");
  await trial.getByRole("radio", { name: "Seikkailu", exact: true }).check();
  await expect(draft).toHaveValue("");
  await trial
    .getByRole("button", { name: "Poimi hetki kirjaan", exact: true })
    .click();
  await expect(memory).toContainText("Löysimme uuden metsäpolun.");
  await expect(
    trial.getByRole("status", { name: "Kokeilun palaute", exact: true }),
  ).toContainText("Kirjassa on 2 hetkeä.");
  await expectAccessible(page, "main");
});

test("the public cover trial handles an empty or long name and restores its local cover draft", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/puppy-book-landing#kokeile-kantta");
  const trial = page.locator("#kokeile-kantta");
  const name = trial.getByLabel("Pennun nimi", { exact: true });
  await name.fill("");
  await expect(
    trial.getByRole("region", { name: "Kannen esikatselu", exact: true }),
  ).toContainText("Oma pentu");
  const longName = "Pentu".repeat(8);
  await name.fill(longName);
  await expect(name).toHaveValue(longName);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expectAccessible(page, "main");
  await expect(
    trial.locator('[aria-label="Leikekirjan tallennus"]'),
  ).toHaveText("Luonnos tallessa tässä selaimessa.");
  await page.reload();
  await expect(name).toHaveValue(longName);
  await expect(
    trial.getByRole("radio", { name: "Järvi", exact: true }),
  ).toBeChecked();
});

test("a failed public reader load leaves the cover trial usable", async ({
  page,
}) => {
  await page.route(/\/assets\/BookReader-[^/]+\.js$/, (route) => route.abort());
  await page.goto("/puppy-book-landing#kokeile-kantta");
  const trial = page.locator("#kokeile-kantta");
  await trial.getByLabel("Pennun nimi", { exact: true }).fill("Lumi");
  await trial
    .getByRole("button", { name: "Katso esimerkkiaukeamaa", exact: true })
    .click();
  await expect(trial.getByRole("alert")).toContainText(
    "Esimerkkiaukeamaa ei saatu ladattua",
  );
  await expect(trial.getByRole("alert")).toBeFocused();
  await expect(
    trial.getByRole("link", {
      name: "Avaa esimerkkikirja omalla sivulla",
      exact: true,
    }),
  ).toHaveAttribute("href", "/muistokirja");
  await trial.getByLabel("Pennun nimi", { exact: true }).fill("Kuura");
  await expect(
    trial.getByRole("region", { name: "Kannen esikatselu", exact: true }),
  ).toContainText("Kuura");
  await expectAccessible(page, "main");
});

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
  await expect(page).toHaveURL(/sivu=tassunjalki/);
  await expect(
    page.getByRole("heading", {
      name: "Näillä tassuilla maailmaan",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pieniä suuria hetkiä", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Seuraava esimerkkisivu" }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pieniä suuria hetkiä", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText(
      "Maksullinen laajempi pentukirja on suunnitteilla eikä sitä voi vielä ostaa.",
      {
        exact: false,
      },
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Kerro kiinnostuksesta" }).click();
  await expect(page).toHaveURL(/\/contact\?aihe=muistokirja$/);
  await expect(page.getByLabel("Aihe", { exact: true })).toHaveValue(
    "Kiinnostus pentukirjaan (hintaehdotus 14,90 €)",
  );
  // Message delivery is tested with a mocked fetch in Contact.test.tsx.
});

test("new pages are reachable from the guides and puppy-book landing page", async ({
  page,
}) => {
  await page.goto("/guides");
  await page
    .getByRole("link", {
      name: "Avaa opas: Pennun tuloon valmistautuminen",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/guides\/pennun-hankinnat$/);
  await page.getByRole("link", { name: "Katso pentukirjan esimerkki" }).click();
  await expect(page).toHaveURL(/\/muistokirja$/);
  await expectLayout(page);
  await page.goto("/puppy-book-landing");
  await page.getByRole("link", { name: "Katso pentukirjan esimerkki" }).click();
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
  options: {
    failFirstSave?: boolean;
    title?: string;
    initialMemories?: Record<string, unknown>[];
  } = {},
) {
  const memories: Record<string, unknown>[] = [
    ...(options.initialMemories || []),
  ];
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

  for (const width of [320, 1440]) {
    for (const type of ["text", "image"]) {
      test(`stored ${type} memory actions and comments are accessible at ${width}`, async ({
        page,
      }) => {
        const caption =
          "Ensimmäinen yhteinen aamumme kotona. Kaikki tuntui uudelta.";
        const writes = await mockBook(page, {
          initialMemories: [
            {
              id: "44444444-4444-4444-8444-444444444444",
              book_id: bookId,
              content_type: type,
              caption,
              tags: ["koti"],
              reactions: [],
              comments: [],
              content_url:
                type === "image" ? `${owner}/books/${bookId}/test.webp` : null,
              created_at: "2026-06-03T10:00:00Z",
              created_by: owner,
            },
          ],
        });
        await page.route(
          "**/storage/v1/object/sign/puppy-books/**",
          async (route) => {
            if (route.request().method() === "POST")
              return route.fulfill({
                json: {
                  signedURL:
                    "/object/sign/puppy-books/test.webp?token=ui-test-only",
                },
              });
            if (route.request().method() === "GET")
              return route.fulfill({
                contentType: "image/webp",
                path: `${process.cwd()}/src/assets/puppy-home-640.webp`,
              });
            return route.abort();
          },
        );
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/puppy-book");
        const card = page.getByRole("article").filter({ hasText: caption });
        await expect(card).toBeVisible();
        if (type === "image") await expect(card.locator("img")).toBeVisible();
        await expectAccessible(page, "main");
        const actions = card.getByRole("group", {
          name: "Muiston toiminnot",
          exact: true,
        });
        for (const button of await actions.getByRole("button").all()) {
          const bounds = await button.boundingBox();
          expect(bounds!.height).toBeGreaterThanOrEqual(44);
          expect(bounds!.width).toBeGreaterThanOrEqual(44);
          await button.focus();
          expect(
            await button.evaluate((el) => {
              const r = el.getBoundingClientRect();
              return el.contains(
                document.elementFromPoint(
                  r.x + r.width / 2,
                  r.y + r.height / 2,
                ),
              );
            }),
          ).toBe(true);
        }
        const choices = card.getByRole("button", {
          name: "Muiston valinnat",
          exact: true,
        });
        await choices.press("Enter");
        await expect(choices).toHaveAttribute("aria-expanded", "true");
        const options = card.getByRole("group", {
          name: "Muiston valinnat",
          exact: true,
        });
        await options
          .getByRole("button", { name: "Poista", exact: true })
          .focus();
        await page.keyboard.press("Escape");
        await expect(options).toBeHidden();
        await expect(choices).toBeFocused();
        await card
          .getByRole("button", { name: "Näytä kommentit", exact: true })
          .click();
        await card
          .getByRole("button", { name: "Kommentoi", exact: true })
          .click();
        await expect(
          card.getByRole("textbox", {
            name: "Kirjoita kommentti",
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          card.getByRole("button", { name: "Lähetä kommentti", exact: true }),
        ).toBeDisabled();
        await expectAccessible(page, "main");
        expect(writes).toHaveLength(0);
      });
    }
  }

  test("missing memory fields announce errors and receive keyboard focus", async ({
    page,
  }) => {
    const writes = await mockBook(page);
    await page.goto("/puppy-book");
    await page
      .getByRole("button", { name: "Kirjoita muisto", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "Lisää muisto",
      exact: true,
    });
    await expect(dialog).toHaveCSS("animation-name", "none");
    const caption = dialog.getByLabel("Muisto", { exact: true });
    await expect(caption).toHaveAttribute("aria-required", "true");
    const save = dialog.getByRole("button", { name: "Tallenna", exact: true });
    await save.focus();
    await save.press("Enter");
    await expect(caption).toBeFocused();
    await expect(caption).toHaveAttribute("aria-invalid", "true");
    await expect
      .poll(() =>
        caption.evaluate((el) => parseFloat(getComputedStyle(el).outlineWidth)),
      )
      .toBeGreaterThanOrEqual(2);
    const focusContrast = await caption.evaluate((el) => {
      const luminance = (colour: string) =>
        colour
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((value) => value / 255)
          .map((value) =>
            value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
          )
          .reduce(
            (sum, value, index) =>
              sum + value * [0.2126, 0.7152, 0.0722][index],
            0,
          );
      const outline = luminance(getComputedStyle(el).outlineColor);
      const background = luminance(
        getComputedStyle(el.closest('[role="dialog"]')!).backgroundColor,
      );
      return (
        (Math.max(outline, background) + 0.05) /
        (Math.min(outline, background) + 0.05)
      );
    });
    expect(focusContrast).toBeGreaterThanOrEqual(3);
    await expect(caption).toHaveAttribute(
      "aria-describedby",
      /memory-save-error/,
    );
    await expect(dialog.getByRole("alert")).toHaveText(
      "Kirjoita muisto ensin.",
    );
    await caption.fill("Pieni tärkeä hetki.");
    await expect(caption).not.toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("alert")).toBeHidden();
    await dialog.getByRole("button", { name: "Kuva", exact: true }).click();
    const photoDialog = page.getByRole("dialog", {
      name: "Lisää kuva",
      exact: true,
    });
    const photoSave = photoDialog.getByRole("button", {
      name: "Tallenna",
      exact: true,
    });
    await photoSave.focus();
    await photoSave.press("Enter");
    const photo = photoDialog.getByRole("button", {
      name: "Valitse kuva (pakollinen)",
      exact: true,
    });
    await expect(photo).toBeFocused();
    await expect(photo).toHaveAttribute("aria-invalid", "true");
    await expect(photo).toHaveAttribute(
      "aria-describedby",
      /memory-save-error/,
    );
    await expect(photoDialog.getByRole("alert")).toHaveText(
      "Valitse kuva ensin.",
    );
    await expectAccessible(page, '[role="dialog"]');
    expect(writes).toHaveLength(0);
  });

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

  for (const [width, height] of [
    [320, 568],
    [844, 390],
    [1440, 900],
  ]) {
    test(`the entry menu fits ${width}x${height}, supports keyboard use and restores focus`, async ({
      page,
    }, testInfo) => {
      await mockBook(page);
      await page.setViewportSize({ width, height });
      await page.goto("/puppy-book");
      const trigger = page.getByRole("button", {
        name: "Lisää merkintä",
        exact: true,
      });
      await trigger.focus();
      await trigger.press("Enter");
      const menu = page.getByRole("menu", {
        name: "Lisää merkintä",
        exact: true,
      });
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS("animation-name", "none");
      await expect(
        menu.getByRole("menuitem", { name: "Lisää kuva", exact: true }),
      ).toBeFocused();
      // Radix computes collision placement on the next layout frame.
      await expect
        .poll(async () => {
          const box = await menu.boundingBox();
          return (
            box && [
              box.x >= 15,
              box.y >= 15,
              box.x + box.width <= width - 15,
              box.y + box.height <= height - 15,
            ]
          );
        })
        .toEqual([true, true, true, true]);
      const bounds = await menu.boundingBox();
      for (const item of await menu.getByRole("menuitem").all()) {
        expect((await item.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await expectAccessible(page, '[role="menu"]');
      await page.keyboard.press("End");
      const healthItem = menu.getByRole("menuitem", {
        name: "Lisää terveysmerkintä",
        exact: true,
      });
      await expect(healthItem).toBeFocused();
      const lastBounds = await healthItem.boundingBox();
      expect(lastBounds!.y + lastBounds!.height).toBeLessThanOrEqual(
        bounds!.y + bounds!.height,
      );
      await page.screenshot({ path: testInfo.outputPath("entry-menu.png") });
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.press("Enter");
      await page.keyboard.press("ArrowDown");
      await expect(
        menu.getByRole("menuitem", { name: "Lisää tapahtuma", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      const eventDialog = page.getByRole("dialog", {
        name: "Lisää tapahtuma",
        exact: true,
      });
      await expect(eventDialog).toBeVisible();
      await expect
        .poll(() =>
          eventDialog.evaluate((el) => el.contains(document.activeElement)),
        )
        .toBe(true);
      await page.keyboard.press("Escape");
      await expect(eventDialog).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      // Clicking the visible words must activate the same full-size target as the icon.
      await menu.getByText("Lisää terveysmerkintä", { exact: true }).click();
      const healthDialog = page.getByRole("dialog", {
        name: "Lisää terveysmerkintä",
        exact: true,
      });
      await expect(healthDialog).toBeVisible();
      await expect
        .poll(() =>
          healthDialog.evaluate((el) => el.contains(document.activeElement)),
        )
        .toBe(true);
      await page.keyboard.press("Escape");
      await expect(healthDialog).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      await expect(menu).toBeVisible();
      // The menu is modal: underlying controls are intentionally hidden from
      // assistive technology. Use the verified empty margin for an outside tap.
      await page.mouse.move(8, Math.round(height / 2), { steps: 5 });
      await page.mouse.click(8, Math.round(height / 2));
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
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

for (const width of [320, 768, 1024, 1440]) {
  test(
    "the richer example keeps its page links, mobile contents and accessible reader at " +
      width,
    async ({ page }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.goto("/muistokirja?sivu=lelupassi");
      const preview = page.locator("#memory-sample-page");
      await expect(
        preview.getByRole("heading", { name: "Lelupassi: Ankka", exact: true }),
      ).toBeVisible();
      await expect(preview).toContainText("Erikoistaito: muuttuu tyynyksi.");
      const contents = page.locator(".memory-contents");
      if (width < 1024) {
        await expect(contents).not.toHaveAttribute("open", "");
        await contents.locator("summary").click();
      }
      expect(
        await contents
          .locator("nav button > span:last-child")
          .evaluateAll((labels) =>
            labels.every((label) => label.scrollWidth <= label.clientWidth + 1),
          ),
      ).toBe(true);
      await page
        .getByRole("navigation", { name: "Esimerkkikirjan sivut", exact: true })
        .getByRole("button", { name: /Unikeko/ })
        .click();
      await expect(page).toHaveURL(/sivu=unikeko/);
      await expect(preview).toBeFocused();
      await expect(
        preview.getByRole("heading", {
          name: "Unen pieni mestari",
          exact: true,
        }),
      ).toBeVisible();
      const bounds = await preview.locator(".annual-sheet").boundingBox();
      const banner = await page.getByRole("banner").boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(banner!.y + banner!.height);
      const image = preview.locator(".scrap-photo-frame img");
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate(
            (element) =>
              element instanceof HTMLImageElement &&
              element.complete &&
              element.naturalWidth >= 1200,
          ),
        )
        .toBe(true);
      await page.reload();
      await expect(preview).toContainText("Unen pieni mestari");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const check = await new AxeBuilder({ page })
        .include("main")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        check.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.failureSummary),
        })),
      ).toEqual([]);
      const launch = page.getByRole("button", {
        name: "Avaa lukutila",
        exact: true,
      });
      await launch.click();
      const reader = page.getByRole("dialog");
      const canvas = reader.getByRole("region", {
        name: "Kirjan lukusivut",
        exact: true,
      });
      await expect(canvas).toBeFocused();
      await expect(reader).toContainText("Unen pieni mestari");
      await expect(reader).toContainText("Mittaukset ovat esimerkkilukuja.");
      await canvas.press("Escape");
      await expect(reader).toBeHidden();
      await expect(launch).toBeFocused();
      await expect(
        page.getByRole("link", { name: "Kokeile omalla kuvalla", exact: true }),
      ).toHaveAttribute("href", "/puppy-book-landing#kokeile-kantta");
    },
  );
}
