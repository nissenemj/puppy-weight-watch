import { test as base, expect, type Page } from "@playwright/test";

type UserState = "visitor" | "guest-with-data" | "signed-in";

export const longDogName = "Mittauskoiran hyvin pitkä testinimi "
  .repeat(6)
  .trim();
export const longEmail = `${"navigaatiotesti".repeat(8)}@example.invalid`;

// UI fixtures only. Supabase reads are fulfilled locally; writes are aborted.
export const test = base.extend<{ userState: UserState }>({
  userState: ["visitor", { option: true }],
  page: async ({ page, userState }, runWithPage) => {
    const user = {
      id: "11111111-1111-4111-8111-111111111111",
      email: longEmail,
      aud: "authenticated",
      role: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: "2026-01-01T00:00:00Z",
    };
    const dog = {
      id: "22222222-2222-4222-8222-222222222222",
      user_id: user.id,
      name: longDogName,
      created_at: user.created_at,
    };
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const jwtPart = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
    const session = {
      access_token: `${jwtPart({ alg: "HS256" })}.${jwtPart({ sub: user.id, exp: expiry })}.ui-test-only`,
      refresh_token: "ui-test-only",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: expiry,
      user,
    };

    await page.route(/https:\/\/[^/]+\.supabase\.co\//, async (route) => {
      const url = new URL(route.request().url());
      if (route.request().method() !== "GET") {
        await route.abort();
        return;
      }
      const body =
        url.pathname === "/auth/v1/settings"
          ? { external: { google: false, apple: false, email: true } }
          : url.pathname === "/auth/v1/user"
            ? user
            : url.pathname === "/rest/v1/dogs" && userState === "signed-in"
              ? [dog]
              : route.request().headers().accept?.includes("vnd.pgrst.object")
                ? null
                : [];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
    await page.addInitScript(
      ({ state, testSession }) => {
        localStorage.removeItem("sb-ckwwxuyteyaaxfcvozvb-auth-token");
        localStorage.removeItem("pentulaskuri-guest-data");
        localStorage.removeItem("pentulaskuri-guest-profile");
        if (state === "signed-in") {
          localStorage.setItem(
            "sb-ckwwxuyteyaaxfcvozvb-auth-token",
            JSON.stringify(testSession),
          );
        }
        if (state === "guest-with-data") {
          localStorage.setItem(
            "pentulaskuri-guest-data",
            JSON.stringify([
              {
                id: "guest-ui-test",
                date: "2026-01-01",
                weight: 4.2,
                created_at: "2026-01-01T00:00:00Z",
              },
            ]),
          );
        }
      },
      { state: userState, testSession: session },
    );
    await runWithPage(page);
  },
});

export { expect };

export async function openPage(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("main")).toBeVisible();
  if (path === "/puppy-book") {
    await expect(
      page.getByText("Kirjaudu sisään nähdäksesi pentukirjasi", {
        exact: true,
      }),
    ).toBeVisible();
  } else if (path === "/login") {
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  } else {
    await expect(page.locator("main h1").first()).toBeVisible();
  }
}

export async function expectHeaderToFit(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const nav = document.querySelector("header nav");
        if (!nav) return ["Päänavigaatio puuttuu"];
        const bounds = nav.getBoundingClientRect();
        const controls = [...nav.querySelectorAll("a, button")]
          .map((element) => ({
            name: element.textContent?.trim(),
            box: element.getBoundingClientRect(),
          }))
          .filter(({ box }) => box.width > 0 && box.height > 0);
        const issues = controls
          .filter(
            ({ box }) =>
              box.left < bounds.left - 1 ||
              box.right > bounds.right + 1 ||
              box.top < bounds.top - 1 ||
              box.bottom > bounds.bottom + 1,
          )
          .map(({ name }) => `Ulkopuolella: ${name}`);
        for (let i = 1; i < controls.length; i++) {
          if (controls[i].box.left < controls[i - 1].box.right - 1) {
            issues.push(
              `Päällekkäin: ${controls[i - 1].name} / ${controls[i].name}`,
            );
          }
        }
        return issues;
      }),
    )
    .toEqual([]);
}
