import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.CI
  ? "http://localhost:4173"
  : (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:23337");

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: process.env.CI
      ? "pnpm --filter @workspace/divine-children-home exec vite preview --config vite.config.ts --host 0.0.0.0 --port 4173"
      : "pnpm dev:web",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
