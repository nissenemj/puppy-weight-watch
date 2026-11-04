import { test, expect } from "../fixtures/navigation";

// Unlike API fixture tests, this checks a real worker on an isolated local origin.
test.use({ serviceWorkers: "allow" });
test("online navigation replaces old cached HTML and the refreshed page remains available offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    )
    .toBe(true);
  const target = "/calculator?vaihe=aikuinen&cachetest=1";
  await page.evaluate(async (path) => {
    const cache = await caches.open("dynamic-v5");
    await cache.put(
      new URL(path, location.origin).href,
      new Response(
        '<!doctype html><html lang="fi"><title>Vanha julkaisu</title><body>Vanhentunut sivu</body></html>',
        { headers: { "Content-Type": "text/html" } },
      ),
    );
  }, target);
  await page.goto(target);
  await expect(
    page.getByRole("heading", {
      name: "Aikuisen koiran ruoka-annos",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Vanhentunut sivu", { exact: true })).toHaveCount(
    0,
  );
  try {
    await context.setOffline(true);
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: "Aikuisen koiran ruoka-annos",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByLabel("Nykyinen paino (kg) *", { exact: true }),
    ).toBeEnabled();
  } finally {
    await context.setOffline(false);
  }
});
