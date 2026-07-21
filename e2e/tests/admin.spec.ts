import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("loads admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /sign in|login|admin/i })).toBeVisible();
  });
});
