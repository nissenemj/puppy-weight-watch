import { defineConfig, devices } from "@playwright/test";

const startPreview = process.env.PLAYWRIGHT_START_PREVIEW === "1";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ||
      (startPreview ? "http://127.0.0.1:4173" : "http://localhost:8081"),
    // Keep API fixtures authoritative when testing a production PWA build.
    serviceWorkers: "block",
    actionTimeout: 0,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: startPreview
    ? {
        command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: false,
        timeout: 30_000,
      }
    : undefined,
  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testDir: "./tests/a11y",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
