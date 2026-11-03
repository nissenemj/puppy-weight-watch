import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures/navigation";
import { newPreparation } from "../../src/features/preparation/model";
import {
  PREPARATION_DATABASE,
  type SavedPreparation,
} from "../../src/features/preparation/storage";
import { newScrapbookDraft } from "../../src/features/annual-book/scrapbook";
import {
  SCRAPBOOK_DATABASE,
  type SavedScrapbook,
} from "../../src/features/annual-book/scrapbookStorage";

test.use({ contextOptions: { reducedMotion: "reduce" } });
const guide = "/guides/pennun-hankinnat";
const saveStatus = (page: Page) =>
  page.getByRole("status", {
    name: "Valmistautumisen tallennus",
    exact: true,
  });
const caption = (page: Page) =>
  page.getByLabel("Omat sanat (valinnainen)", { exact: true });
const copyButton = (page: Page) =>
  page.getByRole("button", {
    name: "Lisää kuvasivu pentukirjaan",
    exact: true,
  });
const book = (page: Page) =>
  page.getByRole("region", { name: "Leikekirjan kokoaminen", exact: true });
async function saved(page: Page) {
  await expect(saveStatus(page)).toHaveText(
    "Valmistelut tallentuvat automaattisesti tähän selaimeen.",
  );
}
async function addPhoto(page: Page) {
  // A repository fixture, never an upload from the user's own browser or device.
  await page.locator('input[name="preparation-photo"]').setInputFiles({
    name: "valmistelukuva.webp",
    mimeType: "image/webp",
    buffer: await readFile(
      new URL("../../src/assets/puppy-home-1200.webp", import.meta.url),
    ),
  });
  await expect(page.locator(".preparation-memory-preview img")).toHaveAttribute(
    "src",
    /^data:image\/jpeg;base64,/,
  );
}
async function readRecord<T>(page: Page, database: string, key: string) {
  return (await page.evaluate(
    async ({ database, key }) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(database, 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore("drafts");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return await new Promise<unknown>((resolve, reject) => {
        const transaction = db.transaction("drafts", "readonly");
        const request = transaction.objectStore("drafts").get(key);
        transaction.oncomplete = () => {
          db.close();
          resolve(request.result);
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error);
        };
      });
    },
    { database, key },
  )) as T | undefined;
}
async function putRecord(
  page: Page,
  database: string,
  key: string,
  record: unknown,
) {
  await page.evaluate(
    async ({ database, key, record }) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(database, 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore("drafts");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction("drafts", "readwrite");
        transaction.objectStore("drafts").put(record, key);
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error);
        };
      });
    },
    { database, key, record },
  );
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .include("main")
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

for (const width of [320, 768, 1024, 1440]) {
  test(`preparation survives reload and becomes a dated book page at ${width}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    const writes: string[] = [];
    page.on("request", (request) => {
      if (
        /\.supabase\.co\//.test(request.url()) &&
        !["GET", "OPTIONS"].includes(request.method())
      )
        writes.push(request.url());
    });
    await page.setViewportSize({ width, height: 900 });
    if (width === 1440)
      await page.addInitScript(() => {
        window.print = () => {
          document.documentElement.dataset.preparationPrint = "ready";
        };
      });
    await page.goto(guide);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pentu tulee kotiin.",
    );
    await saved(page);
    expect(
      await readRecord(page, PREPARATION_DATABASE, "preparation"),
    ).toBeUndefined();
    const floor = page.getByRole("checkbox", {
      name: "Lattiat ja pienet tavarat",
      exact: true,
    });
    expect(
      await floor.evaluate((element) => getComputedStyle(element).appearance),
    ).not.toBe("none");
    await floor.focus();
    await floor.press("Space");
    await expect(page.getByLabel("Kotikierroksen edistyminen")).toHaveText(
      "1/4 tarkistettu",
    );
    const shopping = page.getByRole("checkbox", {
      name: "Ruoka- ja vesikuppi",
      exact: true,
    });
    await shopping.focus();
    await shopping.press("Space");
    await expect(page.getByText("1/8 valmiina", { exact: true })).toBeVisible();
    await page
      .getByLabel("Ruokinnasta huolehtii", { exact: true })
      .fill("Vuorot sovittu perheen kesken");
    await addPhoto(page);
    const paper = page.getByRole("region", {
      name: "Valmistelukuvan kirjasivu",
      exact: true,
    });
    if (width < 1024) {
      await expect(paper).toBeFocused();
      await expect
        .poll(() =>
          paper.evaluate(
            (element) =>
              element.getBoundingClientRect().top -
              document.querySelector("header")!.getBoundingClientRect().bottom,
          ),
        )
        .toBeGreaterThanOrEqual(0);
    }
    await caption(page).fill("Tämä paikka odotti sinua.");
    await page
      .getByText("Päivä ja kuvan kuvaus (valinnaiset)", {
        exact: true,
      })
      .click();
    await page
      .getByLabel("Tapahtumapäivä (valinnainen)", {
        exact: true,
      })
      .fill("2025-12-30");
    await page
      .getByLabel("Kuvan kuvaus ruudunlukijalle (valinnainen)", {
        exact: true,
      })
      .fill("Testikuva: valmiiksi tehty pentunurkka.");
    await saved(page);
    await page.reload();
    await saved(page);
    await expect(floor).toBeChecked();
    await expect(shopping).toBeChecked();
    await expect(
      page.getByLabel("Ruokinnasta huolehtii", { exact: true }),
    ).toHaveValue("Vuorot sovittu perheen kesken");
    await expect(caption(page)).toHaveValue("Tämä paikka odotti sinua.");
    await expect(paper.locator("img")).toHaveAttribute(
      "alt",
      "Testikuva: valmiiksi tehty pentunurkka.",
    );
    await expect(paper).toContainText("30.12.2025");
    await accessible(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const targetSizes = await page
      .locator(
        ".preparation-navigation a, .preparation-photo-actions button, .preparation-field input, .preparation-photo-details summary, .starter-item",
      )
      .evaluateAll((elements) =>
        elements
          .map((element) => element.getBoundingClientRect())
          .filter((box) => box.width > 0 && box.height > 0)
          .every((box) => box.height >= 44 && box.width >= 44),
      );
    expect(targetSizes).toBe(true);
    // No wait for the debounce: the copy action must flush the newest words.
    await caption(page).fill("Viimeiset sanat ehtivät myös kirjaan.");
    await copyButton(page).focus();
    await copyButton(page).press("Enter");
    const continueLink = page.getByRole("link", {
      name: "Jatka kirjan muokkaamista",
      exact: true,
    });
    await expect(continueLink).toBeFocused();
    const source = await readRecord<SavedPreparation>(
      page,
      PREPARATION_DATABASE,
      "preparation",
    );
    const stored = await readRecord<SavedScrapbook>(
      page,
      SCRAPBOOK_DATABASE,
      "public-trial",
    );
    expect(stored!.draft.pages.at(-1)).toEqual(source!.draft.memory);
    expect(stored!.draft.pages.at(-1)!.caption).toBe(
      "Viimeiset sanat ehtivät myös kirjaan.",
    );
    expect(stored!.draft.pages.at(-1)!.date).toBe("2025-12-30");
    expect(JSON.stringify(stored)).not.toContain("Vuorot sovittu");
    await page.locator("#ensimmainen-sivu").screenshot({
      path: testInfo.outputPath(`valmistelukuvasivu-${width}.png`),
    });
    await continueLink.click();
    await expect(book(page)).toBeVisible();
    await expect(caption(page)).toHaveValue(
      "Viimeiset sanat ehtivät myös kirjaan.",
    );
    await page
      .locator("#kokeile-kantta")
      .getByRole("button", {
        name: "Selaa kokeilukirjaa",
        exact: true,
      })
      .click();
    const reader = page.getByRole("dialog");
    await expect(reader).toContainText("Viimeiset sanat ehtivät myös kirjaan.");
    await expect(reader).toContainText("30.12.2025");
    await expect(reader).not.toContainText("Vuorot sovittu");
    if (width === 1440) {
      const print = reader.getByRole("button", {
        name: "Tulosta tai tallenna PDF",
        exact: true,
      });
      await print.click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-preparation-print",
        "ready",
      );
      const root = page.locator(".annual-print-root");
      await expect(root).toContainText("Viimeiset sanat ehtivät myös kirjaan.");
      await expect(root).toContainText("30.12.2025");
      await expect(root).not.toContainText("Vuorot sovittu");
      for (const sheet of await root.locator(".annual-sheet").all())
        expect(
          await sheet.evaluate(
            (element) =>
              element.scrollHeight <= element.clientHeight + 2 &&
              element.scrollWidth <= element.clientWidth + 2,
          ),
        ).toBe(true);
      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      await expect(print).toBeFocused();
    }
    await page.keyboard.press("Escape");
    expect(writes).toEqual([]);
  });
}

test("copy preserves the existing book and later book edits, without duplicates", async ({
  page,
}) => {
  await page.goto("/guides");
  const existing = newScrapbookDraft();
  existing.puppyName = "Sisu";
  existing.palette = "berry";
  existing.pages[0].caption = "Aiempi tärkeä kirjasivu.";
  await putRecord(page, SCRAPBOOK_DATABASE, "public-trial", {
    revision: 4,
    draft: existing,
  });
  await page.goto(guide);
  await saved(page);
  await addPhoto(page);
  await caption(page).fill("Oppaassa kirjoitettu teksti.");
  await copyButton(page).click();
  const continueLink = page.getByRole("link", {
    name: "Jatka kirjan muokkaamista",
    exact: true,
  });
  await expect(continueLink).toBeVisible();
  const firstCopy = (await readRecord<SavedScrapbook>(
    page,
    SCRAPBOOK_DATABASE,
    "public-trial",
  ))!;
  expect(firstCopy.draft.puppyName).toBe("Sisu");
  expect(firstCopy.draft.palette).toBe("berry");
  expect(firstCopy.draft.pages[0]).toEqual(existing.pages[0]);
  expect(firstCopy.draft.pages).toHaveLength(2);
  await continueLink.click();
  await expect(book(page)).toBeVisible();
  await caption(page).fill("Kirjassa myöhemmin muokattu teksti.");
  await expect(book(page).getByLabel("Leikekirjan tallennus")).toHaveText(
    "Luonnos tallessa tässä selaimessa.",
  );
  await page.goto(guide);
  await saved(page);
  await caption(page).fill("Oppaassa muutettu teksti.");
  await copyButton(page).click();
  await expect(
    page.getByText(
      "Tämä sivu löytyy jo kirjaluonnoksesta. Jatka sen muokkaamista kirjassa.",
      { exact: true },
    ),
  ).toBeVisible();
  const secondCopy = (await readRecord<SavedScrapbook>(
    page,
    SCRAPBOOK_DATABASE,
    "public-trial",
  ))!;
  expect(secondCopy.draft.pages).toHaveLength(2);
  expect(secondCopy.draft.pages[0]).toEqual(existing.pages[0]);
  expect(secondCopy.draft.pages[1].caption).toBe(
    "Kirjassa myöhemmin muokattu teksti.",
  );
  expect(secondCopy.draft.puppyName).toBe("Sisu");
  expect(secondCopy.draft.palette).toBe("berry");
});

test("an unreadable preparation record stays intact and editing requires an explicit session choice", async ({
  page,
}) => {
  await page.goto("/guides");
  const future = { revision: 9, draft: { ...newPreparation(), version: 2 } };
  await putRecord(page, PREPARATION_DATABASE, "preparation", future);
  await page.goto(guide);
  await expect(page.getByRole("alert")).toContainText("Sitä ei korvattu");
  await expect(
    page.getByRole("checkbox", {
      name: "Lattiat ja pienet tavarat",
      exact: true,
    }),
  ).toBeDisabled();
  expect(await readRecord(page, PREPARATION_DATABASE, "preparation")).toEqual(
    future,
  );
  await page
    .getByRole("button", { name: "Jatka kertakokeiluna", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "Lattiat ja pienet tavarat", exact: true })
    .check();
  await addPhoto(page);
  await expect(saveStatus(page)).toContainText("Muutokset eivät säily");
  await expect(copyButton(page)).toBeDisabled();
  expect(await readRecord(page, PREPARATION_DATABASE, "preparation")).toEqual(
    future,
  );
  expect(
    await readRecord(page, SCRAPBOOK_DATABASE, "public-trial"),
  ).toBeUndefined();
  await accessible(page);
});

test("a blocked storage write retains the previous save and current edits until retry", async ({
  page,
}) => {
  await page.goto(guide);
  await saved(page);
  const field = page.getByLabel("Ruokinnasta huolehtii", { exact: true });
  await field.fill("Aiempi sovittu vuoro");
  await saved(page);
  const previous = await readRecord(page, PREPARATION_DATABASE, "preparation");
  await page.evaluate((database) => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (
        this.transaction.db.name === database &&
        document.documentElement.dataset.failPreparation === "yes"
      )
        throw new DOMException(
          "Testin tallennuskiintiö täynnä",
          "QuotaExceededError",
        );
      return original.apply(this, args);
    };
    document.documentElement.dataset.failPreparation = "yes";
  }, PREPARATION_DATABASE);
  await field.fill("Uusi sopimus on vielä tässä näkymässä");
  await expect(page.getByRole("alert")).toContainText("tallennustila");
  await expect(field).toHaveValue("Uusi sopimus on vielä tässä näkymässä");
  expect(await readRecord(page, PREPARATION_DATABASE, "preparation")).toEqual(
    previous,
  );
  await page.evaluate(() => {
    document.documentElement.dataset.failPreparation = "no";
  });
  await page
    .getByRole("button", { name: "Yritä tallennusta uudelleen", exact: true })
    .click();
  await saved(page);
  expect(
    (await readRecord<SavedPreparation>(
      page,
      PREPARATION_DATABASE,
      "preparation",
    ))!.draft.family.food,
  ).toBe("Uusi sopimus on vielä tässä näkymässä");
});

test("a stale tab cannot overwrite a newer saved preparation", async ({
  page,
  context,
  baseURL,
}) => {
  await page.goto(guide);
  await saved(page);
  const field = page.getByLabel("Ruokinnasta huolehtii", { exact: true });
  await field.fill("Ensimmäinen yhteinen sopimus");
  await saved(page);
  const other = await context.newPage();
  const origin = new URL(baseURL!).origin;
  await other.route("**/*", (route) =>
    new URL(route.request().url()).origin === origin
      ? route.continue()
      : route.abort(),
  );
  await other.goto(guide);
  await saved(other);
  await field.fill("Uudempi tallennettu sopimus");
  await saved(page);
  await other
    .getByLabel("Ruokinnasta huolehtii", { exact: true })
    .fill("Toisen välilehden keskeneräinen muutos");
  await expect(other.getByRole("alert")).toContainText("Toinen välilehti");
  await expect(
    other.getByLabel("Ruokinnasta huolehtii", { exact: true }),
  ).toHaveValue("Toisen välilehden keskeneräinen muutos");
  expect(
    (await readRecord<SavedPreparation>(
      page,
      PREPARATION_DATABASE,
      "preparation",
    ))!.draft.family.food,
  ).toBe("Uudempi tallennettu sopimus");
  await other
    .getByRole("button", { name: "Avaa tallennettu versio", exact: true })
    .click();
  await saved(other);
  await expect(
    other.getByLabel("Ruokinnasta huolehtii", { exact: true }),
  ).toHaveValue("Uudempi tallennettu sopimus");
  await other.close();
});

test("failed photo decoding and an unreadable book leave both saved drafts intact", async ({
  page,
}) => {
  await page.goto(guide);
  await saved(page);
  await addPhoto(page);
  await caption(page).fill("Tärkeä ensimmäinen kuva.");
  await saved(page);
  const previous = await readRecord(page, PREPARATION_DATABASE, "preparation");
  await page.locator('input[name="preparation-photo"]').setInputFiles({
    name: "rikkoutunut.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toContainText("Aiempi kuvasi säilyi");
  expect(await readRecord(page, PREPARATION_DATABASE, "preparation")).toEqual(
    previous,
  );
  const unreadable = {
    revision: 5,
    draft: { version: 99, important: "Ei saa korvata" },
  };
  await putRecord(page, SCRAPBOOK_DATABASE, "public-trial", unreadable);
  await copyButton(page).click();
  await expect(page.getByRole("alert").last()).toContainText(
    "Sitä ei korvattu",
  );
  expect(await readRecord(page, SCRAPBOOK_DATABASE, "public-trial")).toEqual(
    unreadable,
  );
  expect(await readRecord(page, PREPARATION_DATABASE, "preparation")).toEqual(
    previous,
  );
});
