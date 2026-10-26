import {
  test,
  expect,
  openPage,
  expectHeaderToFit,
  longDogName,
  longEmail,
} from "../fixtures/navigation";

const routes = [
  "/",
  "/calculator",
  "/guides",
  "/guides/puppy-guide",
  "/login",
  "/privacy",
  "/puppy-book",
  "/puppy-book-landing",
  "/weight-tracker",
];
const widths = [320, 375, 768, 1024, 1279, 1280, 1440, 1920];

test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("Yhteinen sivuasettelu", () => {
  for (const path of routes) {
    const testedWidths = [
      "/",
      "/calculator",
      "/guides/puppy-guide",
      "/login",
    ].includes(path)
      ? widths
      : [320, 768, 1280, 1920];
    for (const width of testedWidths) {
      test(`${path} leveydellä ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await openPage(page, path);
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.locator("#main-content")).toHaveCount(1);
        await expect(
          page.getByRole("link", { name: "Siirry sisältöön", exact: true }),
        ).toHaveAttribute("href", "#main-content");
        await expectHeaderToFit(page);
        const bounds = await page.evaluate(() => ({
          headerBottom: document
            .querySelector("header")!
            .getBoundingClientRect().bottom,
          mainTop: document.querySelector("main")!.getBoundingClientRect().top,
          contentTop: [
            ...document.querySelectorAll("main h1, main h2, main h3, main p"),
          ]
            .find((element) => element.getBoundingClientRect().height > 0)
            ?.getBoundingClientRect().top,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }));
        expect(bounds.mainTop).toBeGreaterThanOrEqual(bounds.headerBottom);
        expect(bounds.contentTop).toBeGreaterThanOrEqual(bounds.headerBottom);
        expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.viewportWidth);
        const menu = page
          .getByRole("navigation", { name: "Päänavigaatio", exact: true })
          .getByRole("button", { name: "Avaa valikko", exact: true });
        if (width < 1280) await expect(menu).toBeVisible();
        else await expect(menu).toBeHidden();
        if (
          (path === "/puppy-book-landing" && width === 320) ||
          (path === "/" && width === 1440)
        ) {
          await expect(page.locator("main h1").locator("..")).toHaveCSS(
            "opacity",
            "1",
          );
          await page.screenshot({ path: testInfo.outputPath("layout.png") });
        }
      });
    }
  }
});

test.describe("Pentukirjan esittely", () => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 844, height: 390 },
    { width: 1440, height: 900 },
  ]) {
    test(`teksti ja painikkeet eivät leikkaudu ${viewport.width}x${viewport.height}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await openPage(page, "/puppy-book-landing");
      const hero = page.getByRole("region", {
        name: "Pentukirjan esittely",
        exact: true,
      });
      await expect
        .poll(() =>
          hero.evaluate((section) => {
            const background = section
              .querySelector("section")!
              .getBoundingClientRect();
            return [...section.querySelectorAll("h1, p, a, button")]
              .filter((element) => {
                const bounds = element.getBoundingClientRect();
                return (
                  bounds.left < background.left - 1 ||
                  bounds.right > background.right + 1 ||
                  bounds.top < background.top - 1 ||
                  bounds.bottom > background.bottom + 1
                );
              })
              .map((element) => element.textContent?.trim());
          }),
        )
        .toEqual([]);
      const startLink = hero.getByRole("link", {
        name: "Aloita pentukirja",
        exact: true,
      });
      await expect(startLink).toHaveAttribute("href", "/puppy-book");
      await expect(startLink.getByRole("button")).toHaveCount(0);
      await page.screenshot({ path: testInfo.outputPath("hero.png") });
      await startLink.press("Tab");
      const featuresLink = hero.getByRole("link", {
        name: "Katso ominaisuudet",
        exact: true,
      });
      await expect(featuresLink).toBeFocused();
      const focus = await featuresLink.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const bottomNav = document
          .querySelector('nav[aria-label="Alapalkin navigaatio"]')
          ?.getBoundingClientRect();
        return {
          top: bounds.top,
          bottom: bounds.bottom,
          headerBottom: document
            .querySelector("header")!
            .getBoundingClientRect().bottom,
          footerTop:
            bottomNav && bottomNav.height > 0 ? bottomNav.top : innerHeight,
          hit: element.contains(
            document.elementFromPoint(
              bounds.left + bounds.width / 2,
              bounds.top + bounds.height / 2,
            ),
          ),
        };
      });
      expect(focus.top).toBeGreaterThanOrEqual(focus.headerBottom);
      expect(focus.bottom).toBeLessThanOrEqual(focus.footerTop);
      expect(focus.hit).toBe(true);
      await featuresLink.press("Enter");
      const features = page.locator("#puppy-book-features");
      await expect(features).toBeFocused();
      await expect(page).toHaveURL(/#puppy-book-features$/);
      const target = await features.evaluate((element) => ({
        top: element.getBoundingClientRect().top,
        headerBottom: document.querySelector("header")!.getBoundingClientRect()
          .bottom,
      }));
      expect(target.top).toBeGreaterThanOrEqual(target.headerBottom);
    });
  }

  for (const path of ["/guides/safety", "/guides/socialization"]) {
    for (const width of [320, 1280]) {
      test(`muu kuvan päällä oleva otsikko ${path} ${width}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await openPage(page, path);
        await expectHeaderToFit(page);
        const bounds = await page.locator("main h1").evaluate((element) => ({
          title: element.getBoundingClientRect().toJSON(),
          background: element
            .closest("section")!
            .getBoundingClientRect()
            .toJSON(),
        }));
        expect(bounds.title.top).toBeGreaterThanOrEqual(bounds.background.top);
        expect(bounds.title.bottom).toBeLessThanOrEqual(
          bounds.background.bottom,
        );
      });
    }
  }
});

test.describe("Navigointi ja näppäimistö", () => {
  test("työpöytälinkki avaa laskurin", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/");
    await page
      .getByRole("navigation", { name: "Päänavigaatio", exact: true })
      .getByRole("link", { name: "Ruokalaskuri", exact: true })
      .click();
    await expect(page).toHaveURL(/\/calculator$/);
    await expect(page.locator("main h1")).toContainText("Ruokamäärät");
  });

  test("alapalkista avatun valikon fokus palaa alapalkkiin", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openPage(page, "/login");
    const opener = page
      .getByRole("navigation", { name: "Alapalkin navigaatio", exact: true })
      .getByRole("button", { name: "Avaa valikko", exact: true });
    await opener.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page
        .getByRole("dialog")
        .getByRole("button", { name: "Sulje", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(opener).toBeFocused();
  });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    test(`valikon viimeinen toiminto ja Escape ${viewport.width}x${viewport.height}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await openPage(page, "/puppy-book-landing");
      const opener = page
        .getByRole("navigation", { name: "Päänavigaatio", exact: true })
        .getByRole("button", { name: "Avaa valikko", exact: true });
      await opener.click();
      const dialog = page.getByRole("dialog");
      const lastAction = dialog.getByRole("link", {
        name: "Tutustu ominaisuuksiin",
        exact: true,
      });
      await lastAction.scrollIntoViewIfNeeded();
      const link = await lastAction.boundingBox();
      const bounds = await dialog.evaluate((element) => {
        return {
          top: element.getBoundingClientRect().top,
          bottom: element.getBoundingClientRect().bottom,
          scrollTop: element.scrollTop,
        };
      });
      expect(bounds.scrollTop).toBeGreaterThan(0);
      expect(link).not.toBeNull();
      expect(link!.y).toBeGreaterThanOrEqual(bounds.top);
      expect(link!.y + link!.height).toBeLessThanOrEqual(bounds.bottom);
      await page.screenshot({ path: testInfo.outputPath("mobile-menu.png") });
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
      await opener.click();
      await dialog
        .getByRole("link", {
          name: "Ruokalaskuri Laske sopivat annoskoot",
          exact: true,
        })
        .click();
      await expect(page).toHaveURL(/\/calculator$/);
      await expect(dialog).toBeHidden();
    });
  }

  for (const path of ["/", "/login", "/privacy"]) {
    test(`sisältölinkki siirtää fokuksen ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await openPage(page, path);
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("link", { name: "Siirry sisältöön", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("main")).toBeFocused();
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              document.querySelector("main")!.getBoundingClientRect().top >=
              document.querySelector("header")!.getBoundingClientRect().bottom -
                1,
          ),
        )
        .toBe(true);
    });
  }

  test("ankkuri ei jää yläpalkin alle ja yläpalkki pysyy vierityksessä", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openPage(page, "/guides/puppy-guide");
    await page.locator('a[href="#ruokinta-koulutus"]').click();
    await expect
      .poll(() =>
        page.evaluate(() => ({
          headerTop: Math.round(
            document.querySelector("header")!.getBoundingClientRect().top,
          ),
          clear:
            document
              .getElementById("ruokinta-koulutus")!
              .getBoundingClientRect().top >=
            document.querySelector("header")!.getBoundingClientRect().bottom,
        })),
      )
      .toEqual({ headerTop: 0, clear: true });
  });

  test("kirjautumislomakkeen fokus pysyy palkkien välissä", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await openPage(page, "/login");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const controls = await page
      .locator(
        "main a:visible, main button:visible, main input:visible, main summary:visible",
      )
      .count();
    for (let i = 0; i < controls; i++) {
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const element = document.activeElement!;
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          header: document.querySelector("header")!.getBoundingClientRect()
            .bottom,
          footer: document
            .querySelector('nav[aria-label="Alapalkin navigaatio"]')!
            .getBoundingClientRect().top,
        };
      });
      expect(focus.top).toBeGreaterThanOrEqual(focus.header - 1);
      expect(focus.bottom).toBeLessThanOrEqual(focus.footer + 1);
    }
  });
});

test.describe("Tallennetut vierasmittaukset", () => {
  test.use({ userState: "guest-with-data" });
  test("vain yksi tallennuskehotus yläpalkissa", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openPage(page, "/guides");
    const nav = page.getByRole("navigation", {
      name: "Päänavigaatio",
      exact: true,
    });
    await expect(
      nav.getByRole("link", { name: "Tallenna mittaukset", exact: true }),
    ).toBeVisible();
    await expect(
      nav.getByRole("link", { name: /Kirjaudu|Luo profiili/ }),
    ).toHaveCount(0);
    await expectHeaderToFit(page);
  });
});

test.describe("Pitkät käyttäjätiedot", () => {
  test.use({ userState: "signed-in" });
  for (const width of [320, 768, 1024, 1279, 1280, 1920]) {
    test(`koiranimi ja sähköposti ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openPage(page, "/guides");
      await expectHeaderToFit(page);
      const nav = page.getByRole("navigation", {
        name: "Päänavigaatio",
        exact: true,
      });
      if (width >= 1280) {
        await nav
          .getByRole("button", {
            name: "Käyttäjävalikko - Avaa käyttäjän asetukset",
            exact: true,
          })
          .click();
        await expect(page.getByRole("menu")).toContainText(longEmail);
      } else {
        await nav
          .getByRole("button", { name: "Avaa valikko", exact: true })
          .click();
        await expect(page.getByRole("dialog")).toContainText(longEmail);
      }
      const container = page.locator(
        '[role="menu"][aria-label="Käyttäjän valikko"], #mobile-menu',
      );
      await expect(container).toContainText(longDogName);
      await expect
        .poll(() =>
          container.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return (
              element.scrollWidth <= bounds.width + 1 &&
              bounds.left >= 0 &&
              bounds.right <= window.innerWidth
            );
          }),
        )
        .toBe(true);
    });
  }
});
