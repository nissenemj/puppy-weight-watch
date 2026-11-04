import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import {
  test,
  expect,
  openPage,
  expectHeaderToFit,
} from "../fixtures/navigation";

test.use({ contextOptions: { reducedMotion: "reduce" } });

const routes = [
  "/",
  "/guides",
  "/puppy-book-landing",
  "/guides/pennun-hankinnat",
  "/guides/puppy-guide",
  "/guides/socialization",
  "/guides/safety",
  "/guides/relaxation-protocol",
  "/guides/feeding",
  "/info",
  "/info/food-types",
];

async function expectAccessible(page: Page, scope: string) {
  const result = await new AxeBuilder({ page })
    .include(scope)
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    })),
  ).toEqual([]);
}

for (const width of [320, 768, 1024, 1440]) {
  for (const path of routes) {
    test(`illustrations load and fit ${path} at ${width}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const obsoleteAssets: string[] = [];
      page.on("request", (request) => {
        if (
          /welcome-illustration|puppy-care-guide|relaxation-protocol-infographic|Pennut_nakertavat/.test(
            request.url(),
          )
        ) {
          obsoleteAssets.push(request.url());
        }
      });
      await openPage(page, path);
      await expectHeaderToFit(page);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect
        .poll(() =>
          page.locator("main h1").evaluate((h1) => {
            const title = h1.getBoundingClientRect();
            const header = document
              .querySelector("header")!
              .getBoundingClientRect();
            return (
              title.top >= header.bottom &&
              title.left >= 0 &&
              title.right <= innerWidth
            );
          }),
        )
        .toBe(true);

      const intro = page.locator(".guide-illustration-intro");
      if (await intro.count()) {
        await expect(intro.locator("img")).toHaveAttribute("loading", "eager");
        await expect(intro.locator("img")).toHaveAttribute(
          "fetchpriority",
          "high",
        );
        await expect(intro.locator("img")).not.toHaveAttribute("alt", "");
        await expect(intro.locator("figcaption")).toContainText(
          "Tekoälyllä luotu",
        );
        await expect(intro.locator("video, canvas")).toHaveCount(0);
        const bounds = await intro.evaluate((section) => ({
          title: section.querySelector("h1")!.getBoundingClientRect().toJSON(),
          photo: section
            .querySelector(".guide-illustration-frame")!
            .getBoundingClientRect()
            .toJSON(),
        }));
        const overlap =
          bounds.title.left < bounds.photo.right &&
          bounds.title.right > bounds.photo.left &&
          bounds.title.top < bounds.photo.bottom &&
          bounds.title.bottom > bounds.photo.top;
        expect(overlap).toBe(false);
        await expectAccessible(page, ".guide-illustration-intro");
      } else if (path === "/guides") {
        await expectAccessible(page, "main");
      }

      // The fixture intentionally blocks third-party advertising. Its fallback
      // is tested separately; editorial illustrations must all decode locally.
      const images = page.locator("main img:not([data-external-ad])");
      let checked = 0;
      const decoded = [];
      for (const image of await images.all()) {
        if (!(await image.isVisible())) continue;
        await image.scrollIntoViewIfNeeded();
        const imageSource = await image.getAttribute("src");
        await expect
          .poll(
            () =>
              image.evaluate(
                (element: HTMLImageElement) =>
                  element.complete && element.naturalWidth > 0,
              ),
            { message: `Illustration must decode: ${imageSource}` },
          )
          .toBe(true);
        await expect(image).toHaveAttribute("alt");
        await expect(image).toHaveAttribute("width", /^[1-9]\d*$/);
        await expect(image).toHaveAttribute("height", /^[1-9]\d*$/);
        decoded.push(
          await image.evaluate((element: HTMLImageElement) => ({
            source: element.currentSrc,
            width: element.naturalWidth,
            displayWidth: element.getBoundingClientRect().width,
            alt: element.alt,
          })),
        );
        checked++;
      }
      expect(checked).toBeGreaterThan(0);
      expect(obsoleteAssets).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await testInfo.attach("decoded-illustrations", {
        body: JSON.stringify(decoded, null, 2),
        contentType: "application/json",
      });
    });
  }
}

for (const path of [
  "/info/puppy-guide",
  "/info/socialization-guide",
  "/info/safety",
  "/info/feeding-data",
]) {
  test(`legacy guide illustration works ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openPage(page, path);
    const image = page.locator(".guide-illustration-intro img");
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(page.locator(".guide-illustration-error")).toHaveCount(0);
  });
}

test("AVIF loading failure falls back to WebP without hiding the guide", async ({
  page,
}) => {
  await page.route(
    /\/assets\/guide-relaxation-v2-.*\.avif(?:\?.*)?$/,
    (route) => route.abort(),
  );
  await openPage(page, "/guides/relaxation-protocol");
  const image = page.locator(".guide-illustration-intro img");
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete &&
          element.naturalWidth > 0 &&
          element.currentSrc.includes(".webp"),
      ),
    )
    .toBe(true);
  await expect(page.locator(".guide-illustration-error")).toHaveCount(0);
});

test("a blocked advertisement keeps a labelled, usable fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await openPage(page, "/guides/puppy-guide");
  const advert = page.locator("[data-ad-banner]");
  await advert.scrollIntoViewIfNeeded();
  await expect(advert).toHaveAccessibleName("Mainos");
  const link = advert.getByRole("link", {
    name: "Muotitassu Tutustu koiratarvikkeisiin",
  });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute(
    "href",
    "https://in.muotitassu.fi/t/t?a=1962036177&as=2037227635&t=2&tk=1",
  );
  await expect(advert.locator("img")).toHaveCount(0);
  await expectAccessible(page, "[data-ad-banner]");
});

test("a failed illustration can be retried with the keyboard on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  let allowImages = false;
  await page.route(
    /\/assets\/guide-relaxation-v2-.*\.(?:avif|webp)(?:\?.*)?$/,
    (route) => (allowImages ? route.continue() : route.abort()),
  );
  await openPage(page, "/guides/relaxation-protocol");
  const figure = page.locator(".guide-illustration-intro figure");
  const retry = figure.getByRole("button", { name: "Lataa kuvitus uudelleen" });
  await expect(retry).toBeVisible();
  await expect(page.locator("main h1")).toBeVisible();
  await expectAccessible(page, ".guide-illustration-intro");
  const buttonBox = await retry.boundingBox();
  expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
  await retry.focus();
  allowImages = true;
  await retry.press("Enter");
  await expect(figure.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      figure
        .locator("img")
        .evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await expect(figure).toBeFocused();
  await expect(figure.getByRole("status")).toHaveText("Kuvitus ladattu.");
});

test("guide headers have no autoplaying media even when motion is allowed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openPage(page, "/guides/puppy-guide");
  const intro = page.locator(".guide-illustration-intro");
  await expect(intro.locator("video, canvas")).toHaveCount(0);
  expect(
    await intro.evaluate((section) =>
      [section, ...section.querySelectorAll("*")].every(
        (element) => getComputedStyle(element).animationName === "none",
      ),
    ),
  ).toBe(true);
});

test("a slow illustration keeps space reserved for the article", async ({
  page,
}) => {
  let releaseImage: () => void = () => {};
  const imageReady = new Promise<void>((resolve) => {
    releaseImage = resolve;
  });
  await page.route(
    /\/assets\/guide-relaxation-v2-.*\.(?:avif|webp)(?:\?.*)?$/,
    async (route) => {
      await imageReady;
      await route.continue();
    },
  );
  // The image request is intentionally held; navigation must not wait for load.
  await page.goto("/guides/relaxation-protocol", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("main h1")).toBeVisible();
  const intro = page.locator(".guide-illustration-intro");
  const frame = intro.locator(".guide-illustration-frame");
  await expect
    .poll(async () => (await frame.boundingBox())!.height)
    .toBeGreaterThan(100);
  const before = await intro.boundingBox();
  releaseImage();
  await expect
    .poll(() =>
      intro
        .locator("img")
        .evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
    )
    .toBe(true);
  const after = await intro.boundingBox();
  expect(Math.abs(before!.height - after!.height)).toBeLessThan(1);
});

test.describe("mobile image resolution", () => {
  test.use({ deviceScaleFactor: 2 });

  test("the illustration stays sharp on a high-density phone display", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/guides/socialization");
    const image = page.locator(".guide-illustration-intro img");
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const resolution = await image.evaluate((element: HTMLImageElement) => ({
      assetWidth: Number(element.currentSrc.match(/-(320|640|1200)-/)?.[1]),
      source: element.currentSrc,
      displayWidth: element.getBoundingClientRect().width,
      scale: devicePixelRatio,
    }));
    expect(resolution.scale).toBe(2);
    expect(resolution.source).toContain(".avif");
    expect(resolution.assetWidth).toBeGreaterThanOrEqual(
      resolution.displayWidth * resolution.scale,
    );
  });
});
