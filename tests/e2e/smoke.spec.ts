import { test, expect } from "@playwright/test";

test.describe("App smoke check", () => {
  test("placeholder passes until real e2e added", async () => {
    expect(true).toBeTruthy();
  });
});
