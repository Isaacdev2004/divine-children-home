import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("loads admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Admin Sign In", level: 1 })).toBeVisible();
  });
});
