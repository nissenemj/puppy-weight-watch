import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import { test, expect } from "../fixtures/navigation";
import { SCRAPBOOK_DATABASE } from "../../src/features/annual-book/scrapbookStorage";

test.use({ contextOptions: { reducedMotion: "reduce" } });
const studio = (page: Page) => page.locator("#kokeile-kantta");
const editor = (page: Page) =>
  page.getByRole("region", { name: "Leikekirjan kokoaminen", exact: true });
const picture = async () => ({
  name: "tassukuva.png",
  mimeType: "image/png",
  buffer: await readFile(
    new URL("../../src/assets/paw-prints.png", import.meta.url),
  ),
});
async function openEditor(page: Page) {
  await page.goto("/puppy-book-landing#kokeile-kantta");
  await expect(
    editor(page).getByRole("button", { name: /^(Valitse|Vaihda) kuva$/ }),
  ).toBeEnabled();
}
async function saved(page: Page) {
  await expect(
    editor(page).getByRole("status", {
      name: "Leikekirjan tallennus",
      exact: true,
    }),
  ).toHaveText("Luonnos tallessa tässä selaimessa.");
}
async function addPhoto(page: Page) {
  await editor(page)
    .locator('input[name="scrapbook-photo"]')
    .setInputFiles(await picture());
  await expect(
    editor(page).locator(".scrap-editing-paper .scrap-photo-scene > img"),
  ).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
}
async function details(page: Page) {
  const input = editor(page).getByLabel("Tapahtumapäivä (valinnainen)", {
    exact: true,
  });
  if (!(await input.isVisible()))
    await editor(page)
      .getByText("Päivä ja kuvan kuvaus", { exact: true })
      .click();
  return input;
}
async function topic(page: Page, label: string) {
  await editor(page)
    .getByRole("button", { name: "Kuvausideat", exact: true })
    .click();
  const ideas = page.getByRole("dialog", {
    name: "Valitse kuvausidea",
    exact: true,
  });
  await ideas.getByRole("button", { name: label, exact: true }).click();
  await expect(ideas).not.toBeVisible();
}
async function accessible(page: Page, scope: string) {
  const result = await new AxeBuilder({ page })
    .include(scope)
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((rule) => ({
      id: rule.id,
      nodes: rule.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}
async function expectBubbleOnPhoto(surface: Locator, visible = true) {
  const bubble = surface.locator(".scrap-quote-on-photo");
  if (visible) await expect(bubble).toBeVisible();
  else await expect(bubble).toBeAttached();
  const bounds = await bubble.evaluate((element) => {
    const photo = element.closest(".scrap-photo-scene")!.querySelector("img")!;
    return {
      bubble: element.getBoundingClientRect().toJSON(),
      photo: photo.getBoundingClientRect().toJSON(),
    };
  });
  expect(bounds.bubble.left).toBeGreaterThanOrEqual(bounds.photo.left - 1);
  expect(bounds.bubble.right).toBeLessThanOrEqual(bounds.photo.right + 1);
  expect(bounds.bubble.top - 9).toBeGreaterThanOrEqual(bounds.photo.top - 1);
  expect(bounds.bubble.bottom).toBeLessThanOrEqual(bounds.photo.bottom + 1);
}

for (const width of [320, 768, 1024, 1440]) {
  for (const [slug, words] of [
    ["lelupassi", "Minä valitsin tämän."],
    ["kommellus", "Minä vain vartioin."],
  ]) {
    test(`speech bubble stays on the example photo ${slug} at ${width}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/muistokirja?sivu=${slug}`);
      const surface = page.locator("#memory-sample-page");
      const image = surface.locator(".scrap-photo-scene > img");
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(surface.locator(".scrap-quote-on-photo")).toHaveText(words);
      await expectBubbleOnPhoto(surface);
      await expect(surface).toContainText("Pennun kuviteltu puhe.");
      await accessible(page, "#memory-sample-page");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await surface
        .locator(".annual-sheet")
        .screenshot({ path: testInfo.outputPath(`${slug}-${width}.png`) });
      if (process.env.SCRAPBOOK_OUTPUT) {
        await surface.locator(".annual-sheet").screenshot({
          path: `${process.env.SCRAPBOOK_OUTPUT}/${slug}-${width}.png`,
        });
      }
    });
  }
}

test("example speech bubbles remain on their photos in the A5 PDF", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.speechPrint = "ready";
    };
  });
  await page.goto("/muistokirja?sivu=lelupassi");
  const print = page.getByRole("button", {
    name: "Tulosta tai tallenna PDF",
    exact: true,
  });
  await print.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-speech-print",
    "ready",
  );
  const root = page.locator(".annual-print-root");
  const sheets = root.locator(".annual-sheet");
  await expect(sheets).toHaveCount(13);
  for (const sheet of await sheets.all()) {
    expect(
      await sheet.evaluate(
        (element) =>
          element.scrollHeight <= element.clientHeight + 2 &&
          element.scrollWidth <= element.clientWidth + 2,
      ),
    ).toBe(true);
  }
  await expectBubbleOnPhoto(
    sheets.filter({ hasText: "Lelupassi: Ankka" }),
    false,
  );
  await expectBubbleOnPhoto(
    sheets.filter({ hasText: "Tapaus kadonnut sukka" }),
    false,
  );
  await page.emulateMedia({ media: "print" });
  if (process.env.SCRAPBOOK_OUTPUT) {
    await page.pdf({
      path: `${process.env.SCRAPBOOK_OUTPUT}/puhekupla-esimerkkikirja.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
    });
  }
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(root).toHaveCount(0);
  await expect(print).toBeFocused();
});
async function stored(page: Page) {
  return page.evaluate(async (dbName) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return await new Promise<
      | {
          revision: number;
          draft: {
            version: number;
            puppyName: string;
            pages: Array<{
              id: string;
              title: string;
              caption: string;
              image?: string;
            }>;
          };
        }
      | undefined
    >((resolve, reject) => {
      const transaction = db.transaction("drafts", "readonly");
      const request = transaction.objectStore("drafts").get("public-trial");
      transaction.oncomplete = () => {
        db.close();
        resolve(request.result);
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  }, SCRAPBOOK_DATABASE);
}

for (const width of [320, 768, 1024, 1440]) {
  test(
    "photo-first scrapbook keeps content, dates and accessible controls through layout changes at " +
      width,
    async ({ page }) => {
      const writes: string[] = [];
      page.on("request", (request) => {
        if (
          /\.supabase\.co\//.test(request.url()) &&
          !["GET", "OPTIONS"].includes(request.method())
        )
          writes.push(request.url());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/puppy-book-landing#kokeile-kantta");
      await studio(page).getByText("Kirjan kansi", { exact: true }).click();
      await studio(page)
        .getByLabel("Pennun nimi", { exact: true })
        .fill("Sisu");
      await studio(page)
        .getByRole("radio", { name: "Marja", exact: true })
        .check();
      const board = editor(page);
      await addPhoto(page);
      if (width < 900) {
        const paper = board.getByRole("article", {
          name: "Oma kirjasivu",
          exact: true,
        });
        await expect(paper).toBeFocused();
        const top = await paper.boundingBox();
        const header = await page.getByRole("banner").boundingBox();
        expect(top!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
      }
      await board
        .getByLabel("Kirjasivun otsikko", { exact: true })
        .fill("Meidän pieni tassu");
      await board
        .getByLabel("Omat sanat (valinnainen)", { exact: true })
        .fill("Yhteinen kuvahetki.\nPieni tassu omalla peitolla.");
      const initial = await board
        .locator(".scrap-editing-paper .scrap-photo-scene > img")
        .getAttribute("src");
      const big = board.getByRole("button", { name: "Iso kuva", exact: true });
      await big.focus();
      await big.press("Space");
      await expect(big).toHaveAttribute("aria-pressed", "true");
      await board.getByRole("button", { name: "Sydän", exact: true }).click();
      await (await details(page)).fill("2026-10-05");
      await board
        .getByLabel("Kuvan kuvaus ruudunlukijalle (valinnainen)", {
          exact: true,
        })
        .fill("Tassunjälkiä esimerkkikuvassa.");
      await topic(page, "Unikeko");
      await topic(page, "Kommellus");
      await board
        .getByRole("button", { name: "Lisää puhekupla", exact: true })
        .click();
      await expect(
        board.getByLabel("Pennun kuviteltu puhe", { exact: true }),
      ).toBeFocused();
      await board
        .getByLabel("Pennun kuviteltu puhe", { exact: true })
        .fill("Tämä peitto kuului kuulemma minulle.");
      await expectBubbleOnPhoto(board.locator(".scrap-editing-paper"));
      await board
        .getByRole("button", { name: "Tarinasivu", exact: true })
        .click();
      await expect(
        board.getByLabel("Kirjasivun otsikko", { exact: true }),
      ).toHaveValue("Meidän pieni tassu");
      await expect(
        board.getByLabel("Oma havainto", { exact: true }),
      ).toHaveValue("Yhteinen kuvahetki.\nPieni tassu omalla peitolla.");
      await expect(
        board.locator(".scrap-editing-paper .scrap-photo-scene > img"),
      ).toHaveAttribute("src", initial!);
      await saved(page);
      await accessible(page, "main");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const button of await board
        .locator(".scrap-layout-options button,.scrap-sticker-options button")
        .all()) {
        const size = await button.boundingBox();
        expect(size!.height).toBeGreaterThanOrEqual(44);
        expect(size!.width).toBeGreaterThanOrEqual(44);
      }
      await studio(page)
        .getByRole("button", { name: "Selaa kokeilukirjaa", exact: true })
        .click();
      const reader = page.getByRole("dialog");
      await expect(reader).toContainText("Meidän pieni tassu");
      await expect(reader).toContainText("Pieni tassu omalla peitolla.");
      await expect(reader).toContainText("Pennun kuviteltu puhe");
      await expect(reader).toContainText("Leikillinen, itse keksitty teksti.");
      await expect(reader).toContainText("5.10.2026");
      await expect(reader).not.toContainText("1.4.2026");
      await expect(
        reader.getByRole("img", {
          name: "Tassunjälkiä esimerkkikuvassa.",
          exact: true,
        }),
      ).toBeVisible();
      await accessible(page, ".book-reader");
      await expectBubbleOnPhoto(reader);
      await reader.press("Escape");
      await expect(
        studio(page).getByRole("button", {
          name: "Selaa kokeilukirjaa",
          exact: true,
        }),
      ).toBeFocused();
      await page.reload();
      await expect(editor(page)).toBeVisible();
      await expect(
        board.getByLabel("Kirjasivun otsikko", { exact: true }),
      ).toHaveValue("Meidän pieni tassu");
      await expect(
        board.getByRole("button", { name: "Tarinasivu", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        board.getByRole("button", { name: "Sydän", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        board.getByLabel("Pennun kuviteltu puhe", { exact: true }),
      ).toHaveValue("Tämä peitto kuului kuulemma minulle.");
      await (await details(page)).fill("2026-10-05");
      await expect(
        board.getByLabel("Kuvan kuvaus ruudunlukijalle (valinnainen)", {
          exact: true,
        }),
      ).toHaveValue("Tassunjälkiä esimerkkikuvassa.");
      await saved(page);
      if (process.env.SCRAPBOOK_OUTPUT) {
        await page
          .getByRole("link", {
            name: "Kokeile kirjasivua ilman kirjautumista",
            exact: true,
          })
          .click();
        await page.screenshot({
          path: process.env.SCRAPBOOK_OUTPUT + "/leikekirja-" + width + ".png",
        });
      }
      expect(writes).toEqual([]);
      expect(page.url()).not.toContain("Sisu");
      expect(
        await page.evaluate(() => JSON.stringify(localStorage)),
      ).not.toContain("Pieni tassu omalla");
    },
  );
}

test("repeated templates, author order and page deletion can be undone without losing images or dates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await openEditor(page);
  const board = editor(page);
  for (let index = 1; index <= 3; index += 1) {
    if (index > 1)
      await board
        .getByRole("button", { name: "Uusi sivu", exact: true })
        .click();
    await addPhoto(page);
    await topic(page, "Unikeko");
    await board
      .getByLabel("Kirjasivun otsikko", { exact: true })
      .fill("Unikuva " + index);
    await board
      .locator('[name="scrapbook-caption"]')
      .fill("Oma asento " + index);
    await (await details(page)).fill("2026-10-0" + index);
  }
  await board
    .getByRole("button", { name: "Avaa sivu 2: Unikuva 2", exact: true })
    .click();
  await board
    .getByRole("button", { name: "Aikaisemmaksi", exact: true })
    .click();
  await expect
    .poll(() =>
      board
        .locator(".scrap-book-pages ol button")
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("aria-label")),
        ),
    )
    .toEqual([
      "Avaa sivu 1: Unikuva 2",
      "Avaa sivu 2: Unikuva 1",
      "Avaa sivu 3: Unikuva 3",
    ]);
  await board
    .getByRole("button", { name: "Poista tämä sivu", exact: true })
    .click();
  await expect(board.locator(".scrap-book-pages ol button")).toHaveCount(2);
  await board.getByRole("button", { name: "Peru muutos", exact: true }).click();
  await expect(board.locator(".scrap-book-pages ol button")).toHaveCount(3);
  await expect(
    board.getByLabel("Kirjasivun otsikko", { exact: true }),
  ).toHaveValue("Unikuva 2");
  await expect(board.locator('[name="scrapbook-caption"]')).toHaveValue(
    "Oma asento 2",
  );
  await expect(await details(page)).toHaveValue("2026-10-02");
  await saved(page);
  await studio(page)
    .getByRole("button", { name: "Selaa kokeilukirjaa", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByLabel("Valitse lukutilan sivu")
      .locator("option"),
  ).toHaveText([
    "1. Pennun ensimmäinen vuosi",
    "2. Unikuva 2",
    "3. Unikuva 1",
    "4. Unikuva 3",
  ]);
});

test("invalid photos preserve the previous photo and words; a photo removal can be undone", async ({
  page,
}) => {
  await openEditor(page);
  await addPhoto(page);
  const board = editor(page),
    input = board.locator('input[name="scrapbook-photo"]');
  await board.locator('[name="scrapbook-caption"]').fill("Tämä teksti säilyy.");
  const image = board.locator(".scrap-editing-paper .scrap-photo-scene > img");
  const original = await image.getAttribute("src");
  await input.setInputFiles({
    name: "wrong.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(board.getByRole("alert")).toContainText(
    "Valitse JPEG-, PNG- tai WebP-kuva.",
  );
  await input.setInputFiles({
    name: "large.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });
  await expect(board.getByRole("alert")).toContainText(
    "Kuvan enimmäiskoko on 5 Mt.",
  );
  await input.setInputFiles({
    name: "broken.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("broken"),
  });
  await expect(board.getByRole("alert")).toContainText("Kuvaa ei voitu avata.");
  await expect(image).toHaveAttribute("src", original!);
  await expect(board.locator('[name="scrapbook-caption"]')).toHaveValue(
    "Tämä teksti säilyy.",
  );
  await details(page);
  await board
    .getByRole("button", { name: "Poista kuva sivulta", exact: true })
    .click();
  await expect(image).toHaveCount(0);
  await board.getByRole("button", { name: "Peru muutos", exact: true }).click();
  await expect(image).toHaveAttribute("src", original!);
  await accessible(page, "main");
});

test("an incompatible stored draft is not overwritten, including in a temporary session", async ({
  page,
}) => {
  await openEditor(page);
  await page.evaluate(async (dbName) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open(dbName, 1);
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve) => {
      const transaction = db.transaction("drafts", "readwrite");
      transaction
        .objectStore("drafts")
        .put({ revision: 7, draft: { version: 99 } }, "public-trial");
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  }, SCRAPBOOK_DATABASE);
  await page.reload();
  const board = editor(page);
  await expect(board.getByRole("alert")).toContainText("eri versiota");
  await expect(
    board.getByRole("button", { name: "Valitse kuva", exact: true }),
  ).toBeDisabled();
  expect((await stored(page))!.draft.version).toBe(99);
  await board
    .getByRole("button", { name: "Jatka tallentamatta", exact: true })
    .click();
  await board
    .getByRole("button", { name: "Kokeile esimerkkikuvalla", exact: true })
    .click();
  await expect(
    board.locator(".scrap-editing-paper .scrap-photo-scene > img"),
  ).toBeVisible();
  await expect(
    board.getByRole("status", { name: "Leikekirjan tallennus", exact: true }),
  ).toContainText("Kertakokeilu");
  expect((await stored(page))!.draft.version).toBe(99);
  await accessible(page, "main");
});

test("a failed local save retains the photo and text for an explicit retry", async ({
  page,
}) => {
  await page.addInitScript((dbName) => {
    const original = IDBObjectStore.prototype.put;
    (window as Window & { failScrapbookSave?: boolean }).failScrapbookSave =
      true;
    IDBObjectStore.prototype.put = function (value, key) {
      if (
        this.transaction.db.name === dbName &&
        (window as Window & { failScrapbookSave?: boolean }).failScrapbookSave
      )
        throw new DOMException(
          "Testin tallennustila on täynnä.",
          "QuotaExceededError",
        );
      return original.call(this, value, key);
    };
  }, SCRAPBOOK_DATABASE);
  await openEditor(page);
  await addPhoto(page);
  const board = editor(page);
  await board
    .locator('[name="scrapbook-caption"]')
    .fill("Tämä säilyy virheen yli.");
  await expect(board.getByRole("alert")).toContainText("täynnä");
  await expect(
    board.locator(".scrap-editing-paper .scrap-photo-scene > img"),
  ).toBeVisible();
  await expect(board.locator('[name="scrapbook-caption"]')).toHaveValue(
    "Tämä säilyy virheen yli.",
  );
  await page.evaluate(() => {
    (window as Window & { failScrapbookSave?: boolean }).failScrapbookSave =
      false;
  });
  await board
    .getByRole("button", { name: "Yritä tallentaa uudelleen", exact: true })
    .click();
  await saved(page);
  expect((await stored(page))!.draft.pages[0].caption).toBe(
    "Tämä säilyy virheen yli.",
  );
});

test("an older tab cannot overwrite a newer local draft", async ({
  page,
  context,
}) => {
  await openEditor(page);
  await addPhoto(page);
  await saved(page);
  const other = await context.newPage();
  const origin = new URL(page.url()).origin;
  await other.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin === origin)
      await route.continue();
    else await route.abort();
  });
  await openEditor(other);
  await editor(page)
    .getByLabel("Kirjasivun otsikko", { exact: true })
    .fill("Uudempi sivu");
  await saved(page);
  await editor(other)
    .getByLabel("Kirjasivun otsikko", { exact: true })
    .fill("Vanha välilehti");
  await expect(editor(other).getByRole("alert")).toContainText(
    "Toinen välilehti",
  );
  expect((await stored(page))!.draft.pages[0].title).toBe("Uudempi sivu");
  await editor(other)
    .getByRole("button", { name: "Lataa tallennettu luonnos", exact: true })
    .click();
  await expect(
    editor(other).getByLabel("Kirjasivun otsikko", { exact: true }),
  ).toHaveValue("Uudempi sivu");
});

test("all layouts retain maximum text and stickers in A5 and restore print focus", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.scrapbookPrint = "yes";
    };
    document.addEventListener("DOMContentLoaded", () => {
      new MutationObserver(() => {
        const sheets = document.querySelectorAll<HTMLElement>(
          ".annual-print-root .annual-sheet",
        );
        if (sheets.length)
          document.documentElement.dataset.scrapbookPaper = JSON.stringify(
            Array.from(sheets, (sheet) => ({
              title: sheet.getAttribute("aria-label"),
              height: sheet.scrollHeight,
              available: sheet.clientHeight,
              width: sheet.scrollWidth,
              availableWidth: sheet.clientWidth,
            })),
          );
      }).observe(document.body, { childList: true, subtree: true });
    });
  });
  await openEditor(page);
  const board = editor(page);
  for (const layout of ["polaroid", "poster", "story"]) {
    if (layout !== "polaroid")
      await board
        .getByRole("button", { name: "Uusi sivu", exact: true })
        .click();
    await addPhoto(page);
    await board
      .getByLabel("Kirjasivun otsikko", { exact: true })
      .fill("W".repeat(60));
    await board.locator('[name="scrapbook-caption"]').fill("W".repeat(140));
    await board
      .getByRole("button", { name: "Lisää puhekupla", exact: true })
      .click();
    await board
      .getByLabel("Pennun kuviteltu puhe", { exact: true })
      .fill("犬".repeat(140));
    await board
      .getByRole("button", {
        name:
          layout === "polaroid"
            ? "Polaroidi"
            : layout === "poster"
              ? "Iso kuva"
              : "Tarinasivu",
        exact: true,
      })
      .click();
    await board.getByRole("button", { name: "Tähti", exact: true }).click();
    await (await details(page)).fill("2026-10-31");
  }
  await saved(page);
  await studio(page)
    .getByRole("button", { name: "Selaa kokeilukirjaa", exact: true })
    .click();
  const reader = page.getByRole("dialog");
  const print = reader.getByRole("button", {
    name: "Tulosta tai tallenna PDF",
    exact: true,
  });
  await print.click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.scrapbookPrint),
    )
    .toBe("yes")
    .catch(async (error) => {
      console.info(
        await page.evaluate(
          () => document.documentElement.dataset.scrapbookPaper,
        ),
      );
      throw error;
    });
  const sheets = page.locator(".annual-print-root .annual-sheet");
  await expect(sheets).toHaveCount(10);
  for (const sheet of await sheets.all())
    expect(
      await sheet.evaluate(
        (element) =>
          element.scrollHeight <= element.clientHeight + 2 &&
          element.scrollWidth <= element.clientWidth + 2,
      ),
    ).toBe(true);
  await expect(
    page.locator(".annual-print-root .scrap-photo-scene > img"),
  ).toHaveCount(3);
  await expect(
    page.locator(".annual-print-root .scrap-paper-sticker"),
  ).toHaveCount(3);
  const text = await page.locator(".annual-print-root").textContent();
  expect(text!.split("W").length - 1).toBe(960);
  expect(text!.split("犬").length - 1).toBe(420);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("main")).not.toBeVisible();
  if (process.env.SCRAPBOOK_OUTPUT)
    await page.pdf({
      path: process.env.SCRAPBOOK_OUTPUT + "/leikekirjan-taittotesti.pdf",
      preferCSSPageSize: true,
      printBackground: true,
    });
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator(".annual-print-root")).toHaveCount(0);
  await expect(print).toBeFocused();
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 844, height: 390 },
]) {
  test(
    "new and reopened scrapbook pages stay reachable on a short phone " +
      viewport.width +
      "x" +
      viewport.height,
    async ({ page }) => {
      await page.setViewportSize(viewport);
      await openEditor(page);
      await addPhoto(page);
      const board = editor(page);
      await board
        .getByLabel("Omat sanat (valinnainen)", { exact: true })
        .fill("Pitkä yhteinen tarina pienestä pennusta. ".repeat(3));
      await board
        .getByRole("button", { name: "Uusi sivu", exact: true })
        .click();
      const paper = board.getByRole("article", {
        name: "Oma kirjasivu",
        exact: true,
      });
      await expect(paper).toHaveCount(0);
      const camera = board.getByRole("button", {
        name: "Ota kuva",
        exact: true,
      });
      await expect(camera).toBeFocused();
      const bounds = await camera.boundingBox();
      const header = await page.getByRole("banner").boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
      await expect(camera).toBeVisible();
      await board
        .getByRole("button", {
          name: "Avaa sivu 1: Pieni suuri hetki",
          exact: true,
        })
        .click();
      await expect(paper).toBeFocused();
      await expect(
        board.locator(".scrap-editing-paper .scrap-photo-scene > img"),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await accessible(page, "main");
    },
  );
}

test("a sticker never covers the sample-image caption on a small phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await openEditor(page);
  const board = editor(page);
  await board
    .getByRole("button", { name: "Kokeile esimerkkikuvalla", exact: true })
    .click();
  await board.getByRole("button", { name: "Tähti", exact: true }).click();
  for (const layout of ["Polaroidi", "Iso kuva", "Tarinasivu"]) {
    await board.getByRole("button", { name: layout, exact: true }).click();
    const overlap = await board
      .locator(".scrap-editing-paper figure")
      .evaluate((figure) => {
        const caption = figure.querySelector("figcaption")!;
        const sticker = figure
          .querySelector(".scrap-paper-sticker")!
          .getBoundingClientRect();
        const text = document.createRange();
        text.selectNodeContents(caption);
        return Array.from(text.getClientRects()).some(
          (line) =>
            line.left < sticker.right &&
            line.right > sticker.left &&
            line.top < sticker.bottom &&
            line.bottom > sticker.top,
        );
      });
    expect(overlap).toBe(false);
  }
  await accessible(page, "main");
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 768, height: 900 },
  { width: 844, height: 390 },
  { width: 1440, height: 900 },
]) {
  test(
    "photo ideas work by keyboard, retain the draft and never print helper questions at " +
      viewport.width +
      "x" +
      viewport.height,
    async ({ page }) => {
      await page.setViewportSize(viewport);
      await openEditor(page);
      const board = editor(page);
      const launch = board.getByRole("button", {
        name: "Kuvausideat",
        exact: true,
      });
      await launch.focus();
      await launch.press("Enter");
      const ideas = page.getByRole("dialog", {
        name: "Valitse kuvausidea",
        exact: true,
      });
      const heading = ideas.getByRole("heading", {
        name: "Valitse kuvausidea",
        exact: true,
      });
      await expect(heading).toBeFocused();
      const cards = ideas
        .getByRole("group", { name: "Kirjasivun aihe", exact: true })
        .getByRole("button");
      await expect(cards).toHaveCount(9);
      for (const card of await cards.all()) {
        const size = await card.boundingBox();
        expect(size!.width).toBeGreaterThanOrEqual(44);
        expect(size!.height).toBeGreaterThanOrEqual(44);
      }
      expect(
        await ideas.evaluate(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      ).toBe(true);
      await accessible(page, ".scrap-ideas-dialog");
      await ideas
        .getByRole("button", { name: "Kommellus", exact: true })
        .focus();
      await ideas.press("Tab");
      await expect(
        ideas.getByRole("button", { name: "Sulje kuvausideat", exact: true }),
      ).toBeFocused();
      await ideas.press("Escape");
      await expect(launch).toBeFocused();
      await topic(page, "Tassunjälki");
      const paper = board.getByRole("article", {
        name: "Oma kirjasivu",
        exact: true,
      });
      await expect(paper).toBeFocused();
      const title = board.getByLabel("Kirjasivun otsikko", { exact: true });
      await expect(title).toHaveValue("Näillä tassuilla maailmaan");
      await expect(
        board.getByRole("status", { name: "Kuvahetken kysymys", exact: true }),
      ).toHaveText("Mihin nämä tassut kulkivat tänään?");
      await addPhoto(page);
      const caption = board.getByLabel("Omat sanat (valinnainen)", {
        exact: true,
      });
      await title.fill("Tassut ja meidän tiistai");
      await caption.fill("Kävelimme pienen polun yhdessä.");
      await (await details(page)).fill("2026-10-04");
      const image = await board
        .locator(".scrap-editing-paper .scrap-photo-scene > img")
        .getAttribute("src");
      await topic(page, "Ensimmäinen asu");
      await expect(title).toHaveValue("Tassut ja meidän tiistai");
      await expect(caption).toHaveValue("Kävelimme pienen polun yhdessä.");
      await expect(
        board.locator(".scrap-editing-paper .scrap-photo-scene > img"),
      ).toHaveAttribute("src", image!);
      const question = board.getByRole("status", {
        name: "Kuvahetken kysymys",
        exact: true,
      });
      await expect(question).toHaveText("Minkä värinen pennun asu on?");
      await board
        .getByRole("button", { name: "Toinen kysymys", exact: true })
        .click();
      await expect(question).toHaveText("Minne tässä asussa lähdetään?");
      await expect(caption).toHaveValue("Kävelimme pienen polun yhdessä.");
      await saved(page);
      await page.reload();
      await expect(
        board.getByRole("complementary", {
          name: "Ideoita kuvahetkeen",
          exact: true,
        }),
      ).toContainText("Ensimmäinen asu");
      await expect(title).toHaveValue("Tassut ja meidän tiistai");
      await expect(caption).toHaveValue("Kävelimme pienen polun yhdessä.");
      await expect(await details(page)).toHaveValue("2026-10-04");
      await accessible(page, "main");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await studio(page)
        .getByRole("button", { name: "Selaa kokeilukirjaa", exact: true })
        .click();
      const reader = page.getByRole("dialog");
      await expect(reader).toContainText("Kävelimme pienen polun yhdessä.");
      await expect(reader).toContainText("4.10.2026");
      await expect(reader).not.toContainText("Minkä värinen pennun asu on?");
      await expect(reader).not.toContainText("Minne tässä asussa lähdetään?");
      await expect(reader).not.toContainText("Kysykää yhdessä");
    },
  );
}
