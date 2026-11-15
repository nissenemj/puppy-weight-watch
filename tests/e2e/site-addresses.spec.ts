import { readFileSync } from "node:fs";
import { parseHTML } from "linkedom";
import { test, expect } from "../fixtures/navigation";

const site: typeof import("../../src/data/sitePages.json") = JSON.parse(
  readFileSync(new URL("../../src/data/sitePages.json", import.meta.url), "utf8"),
);
const vercel: typeof import("../../vercel.json") = JSON.parse(
  readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"),
);

test("sitemap links resolve directly to page-specific indexable HTML", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const urls = Array.from((await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) => url);
  expect(urls).toEqual(Object.keys(site.pages).map((path) => site.origin + path));
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${site.origin}/sitemap.xml`);
  const responses = await Promise.all(Object.entries(site.pages).map(async ([path, page]) => {
    const response = await request.get(path, { maxRedirects: 0 });
    return { path, page, response, html: await response.text() };
  }));
  for (const { path, page, response, html } of responses) {
    expect(response.status(), path).toBe(200);
    const { document } = parseHTML(html);
    expect(document.querySelector("h1")?.textContent, path).toBe(page.heading);
    expect(document.title, path).toContain(page.heading);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(site.origin + path);
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toMatch(/^index,/);
  }
});

test("old paths keep query parameters, private pages stay out of search, and missing routes return 404", async ({ request }) => {
  const aliases = Object.entries(site.aliases);
  for (const [path, target] of aliases) {
    const response = await request.get(`${path}?preserve=1`, { maxRedirects: 0 });
    expect(response.status(), path).toBe(308);
    expect(response.headers()["location"]).toBe(`${target}?preserve=1`);
    expect(vercel.redirects).toContainEqual({ source: path, destination: target, permanent: true });
  }
  for (const path of [...site.appPaths, "/test-missing-page"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(site.appPaths.includes(path) ? 200 : 404);
    const { document } = parseHTML(await response.text());
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toMatch(/^noindex,/);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  }
  expect(vercel.rewrites.map((rewrite) => rewrite.source)).toEqual(site.appPaths);
  expect((await request.get("/calculator/", { maxRedirects: 0 })).headers()["location"]).toBe("/calculator");
});

test("back navigation from safety restores the information page and its canonical address", async ({ page }) => {
  await page.goto("/info");
  await expect(page.getByRole("heading", { name: "Tietoa pennun arkeen" })).toBeVisible();
  // Background tabs can defer animation frames. The canonical address must still follow navigation.
  await page.evaluate(() => {
    const requestFrame = window.requestAnimationFrame.bind(window);
    window.addEventListener("restore-test-animation-frames", () => {
      window.requestAnimationFrame = requestFrame;
    }, { once: true });
    window.requestAnimationFrame = () => -1;
  });
  await page.locator('main a[href="/guides/safety"]').press("Enter");
  await expect(page).toHaveURL(/\/guides\/safety$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site.origin}/guides/safety`);
  await page.evaluate(() => window.dispatchEvent(new Event("restore-test-animation-frames")));
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Tietoa pennun arkeen" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site.origin}/info`);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
});
