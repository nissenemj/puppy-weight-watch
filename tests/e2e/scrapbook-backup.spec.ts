import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures/navigation";
import { SCRAPBOOK_DATABASE } from "../../src/features/annual-book/scrapbookStorage";
import type { ScrapbookDraft } from "../../src/features/annual-book/scrapbook";

test.use({ contextOptions: { reducedMotion: "reduce" } });
const studio = (page: Page) => page.locator("#kokeile-kantta");
const backup = (page: Page) => studio(page).locator(".scrap-backup");
const status = (page: Page) =>
  studio(page).getByLabel("Leikekirjan tallennus", { exact: true });
const confirm = (page: Page) =>
  page.getByRole("dialog", {
    name: "Korvataanko tämän selaimen kirjaluonnos?",
    exact: true,
  });
async function saved(page: Page) {
  await expect(status(page)).toHaveText("Luonnos tallessa tässä selaimessa.");
}
async function start(page: Page) {
  await page.goto("/puppy-book-landing#kokeile-kantta");
  await expect(
    studio(page).getByRole("button", { name: "Valitse kuva", exact: true }),
  ).toBeEnabled();
}
async function addPhoto(page: Page) {
  await studio(page)
    .locator('input[name="scrapbook-photo"]')
    .setInputFiles({
      name: "tassut.png",
      mimeType: "image/png",
      buffer: await readFile(
        new URL("../../src/assets/paw-prints.png", import.meta.url),
      ),
    });
  await expect(
    studio(page).locator(".scrap-editing-paper img").first(),
  ).toBeVisible();
}
async function stored(page: Page, key = "public-trial") {
  return page.evaluate(
    async ({ database, key }) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(database, 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return new Promise<
        { draft: ScrapbookDraft; revision: number } | undefined
      >((resolve, reject) => {
        const transaction = db.transaction("drafts", "readonly");
        const request = transaction.objectStore("drafts").get(key);
        transaction.oncomplete = () => {
          db.close();
          resolve(request.result);
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      });
    },
    { database: SCRAPBOOK_DATABASE, key },
  );
}
async function openBackup(page: Page) {
  if (!((await backup(page).getAttribute("open")) === ""))
    await backup(page).locator("summary").click();
}
async function download(page: Page) {
  await openBackup(page);
  const downloading = page.waitForEvent("download");
  await backup(page)
    .getByRole("button", { name: "Lataa varmuuskopio", exact: true })
    .click();
  const file = await downloading;
  expect(file.suggestedFilename()).toMatch(/\.pentukirja\.json$/);
  return readFile((await file.path())!);
}
async function choose(page: Page, buffer: Buffer) {
  await openBackup(page);
  await backup(page)
    .getByLabel("Valitse pentukirjan varmuuskopio", { exact: true })
    .setInputFiles({
      name: "oma.pentukirja.json",
      mimeType: "application/json",
      buffer,
    });
}
async function replace(page: Page) {
  await confirm(page)
    .getByRole("button", {
      name: "Korvaa luonnos varmuuskopiolla",
      exact: true,
    })
    .click();
  await expect(confirm(page)).toHaveCount(0);
  await saved(page);
}
for (const width of [320, 768, 1024, 1440]) {
  test(`editable backup preserves exact pages and recovers the previous book at ${width}`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await start(page);
    await addPhoto(page);
    await studio(page)
      .getByLabel("Omat sanat (valinnainen)", { exact: true })
      .fill("Ensimmäinen tassukuva.");
    await studio(page)
      .getByText("Päivä ja kuvan kuvaus", { exact: true })
      .click();
    await studio(page)
      .getByLabel("Tapahtumapäivä (valinnainen)", { exact: true })
      .fill("2024-02-29");
    await studio(page).getByText("Kirjan kansi", { exact: true }).click();
    await studio(page).getByLabel("Pennun nimi", { exact: true }).fill("Sisu");
    await studio(page)
      .getByRole("radio", { name: "Marja", exact: true })
      .check();
    await studio(page)
      .getByRole("button", { name: "Uusi sivu", exact: true })
      .click();
    await studio(page)
      .getByRole("button", { name: "Aloita pelkillä sanoilla", exact: true })
      .click();
    await studio(page)
      .getByLabel("Omat sanat (valinnainen)", { exact: true })
      .fill("Tämän hetken päivää ei muisteta.");
    await saved(page);
    const original = (await stored(page))!.draft;
    const file = await download(page);
    expect(JSON.parse(file.toString()).draft).toEqual(original);
    await studio(page)
      .getByLabel("Omat sanat (valinnainen)", { exact: true })
      .fill("Uusi säilytettävä versio.");
    await saved(page);
    const beforeRestore = await stored(page);
    await choose(page, file);
    await expect(confirm(page)).toContainText("Sisu. 2 sivua, 1 kuvaa.");
    await expect(
      confirm(page).getByRole("button", { name: "Peru palautus", exact: true }),
    ).toBeFocused();
    const a11y = await new AxeBuilder({ page })
      .include(".scrap-backup-dialog")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11y.violations).toEqual([]);
    await confirm(page)
      .getByRole("button", { name: "Peru palautus", exact: true })
      .click();
    expect(await stored(page)).toEqual(beforeRestore);
    await choose(page, file);
    await replace(page);
    expect((await stored(page))!.draft).toEqual(original);
    expect(await stored(page, "before-restore")).toEqual(beforeRestore);
    await page.reload();
    await saved(page);
    expect((await stored(page))!.draft).toEqual(original);
    await openBackup(page);
    await backup(page)
      .getByRole("button", {
        name: "Palauta ennen viimeisintä palautusta tallennettu kirja",
        exact: true,
      })
      .click();
    await replace(page);
    expect((await stored(page))!.draft).toEqual(beforeRestore!.draft);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("bad, oversized, disguised and undecodable backups cannot replace the book", async ({
  page,
}) => {
  await start(page);
  await addPhoto(page);
  await saved(page);
  const original = await stored(page);
  const valid = JSON.parse((await download(page)).toString());
  const invalidImage = structuredClone(valid);
  invalidImage.draft.pages[0].image = "data:image/jpeg;base64,/9j/AA==";
  const disguised = structuredClone(valid);
  disguised.draft.pages[0].image = "data:image/jpeg;base64,PHN2Zz4=";
  for (const file of [
    Buffer.from("{"),
    Buffer.from(JSON.stringify({ ...valid, version: 8 })),
    Buffer.from(JSON.stringify(disguised)),
    Buffer.from(JSON.stringify(invalidImage)),
    Buffer.alloc(25 * 1024 * 1024 + 1),
  ]) {
    await choose(page, file);
    await expect(backup(page).getByRole("alert")).toBeVisible();
    await expect(confirm(page)).toHaveCount(0);
    expect(await stored(page)).toEqual(original);
  }
});

test("restore write failure is atomic and leaves current and recovery drafts intact", async ({
  page,
}) => {
  await start(page);
  await addPhoto(page);
  await saved(page);
  const file = await download(page);
  await studio(page)
    .getByLabel("Omat sanat (valinnainen)", { exact: true })
    .fill("Tätä ei saa hukata.");
  await saved(page);
  const original = await stored(page);
  await choose(page, file);
  await page.evaluate((database) => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (value, key) {
      if (this.transaction.db.name === database && key === "public-trial")
        throw new DOMException("Testi: tila täynnä", "QuotaExceededError");
      return put.call(this, value, key);
    };
  }, SCRAPBOOK_DATABASE);
  await confirm(page)
    .getByRole("button", {
      name: "Korvaa luonnos varmuuskopiolla",
      exact: true,
    })
    .click();
  await expect(confirm(page).getByRole("alert")).toContainText("täynnä");
  expect(await stored(page)).toEqual(original);
  expect(await stored(page, "before-restore")).toBeUndefined();
  await confirm(page)
    .getByRole("button", { name: "Peru palautus", exact: true })
    .click();
  await expect(
    studio(page).getByLabel("Omat sanat (valinnainen)", { exact: true }),
  ).toHaveValue("Tätä ei saa hukata.");
  // Rescue download remains available even when browser storage is full.
  expect(JSON.parse((await download(page)).toString()).draft).toEqual(
    original!.draft,
  );
});

test("restore cannot overwrite a book saved elsewhere while confirmation was open", async ({
  page,
}) => {
  await start(page);
  await addPhoto(page);
  await saved(page);
  const file = await download(page);
  const original = (await stored(page))!;
  await choose(page, file);
  const newer = {
    revision: original.revision + 1,
    draft: { ...original.draft, puppyName: "Toisen välilehden kirja" },
  };
  await page.evaluate(
    async ({ database, record }) => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open(database, 1);
        request.onsuccess = () => resolve(request.result);
      });
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction("drafts", "readwrite");
        transaction.objectStore("drafts").put(record, "public-trial");
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      });
    },
    { database: SCRAPBOOK_DATABASE, record: newer },
  );
  await confirm(page)
    .getByRole("button", {
      name: "Korvaa luonnos varmuuskopiolla",
      exact: true,
    })
    .click();
  await expect(confirm(page).getByRole("alert")).toContainText(
    "Toinen välilehti",
  );
  expect(await stored(page)).toEqual(newer);
  expect(await stored(page, "before-restore")).toBeUndefined();
});

test("a backup can be opened in a fresh browser and closing its confirmation restores keyboard focus", async ({
  page,
  browser,
}) => {
  await start(page);
  await addPhoto(page);
  await saved(page);
  const file = await download(page),
    expected = (await stored(page))!.draft;
  const origin = new URL(page.url()).origin;
  const fresh = await browser.newContext({
    baseURL: origin,
    serviceWorkers: "block",
  });
  try {
    const other = await fresh.newPage();
    await other.route("**/*", (route) =>
      new URL(route.request().url()).origin === origin
        ? route.continue()
        : route.abort(),
    );
    await start(other);
    await choose(other, file);
    await replace(other);
    expect((await stored(other))!.draft).toEqual(expected);
    await openBackup(other);
    const opener = backup(other).getByRole("button", {
      name: "Avaa varmuuskopio",
      exact: true,
    });
    const fileChooser = other.waitForEvent("filechooser");
    await opener.click();
    await (
      await fileChooser
    ).setFiles({
      name: "oma.json",
      mimeType: "application/json",
      buffer: file,
    });
    await expect(confirm(other)).toBeVisible();
    await confirm(other).press("Escape");
    await expect(confirm(other)).toHaveCount(0);
    await expect(opener).toBeFocused();
  } finally {
    await fresh.close();
  }
});
