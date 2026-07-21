import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with hero and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Divine Children Home/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Safety|Stability|Hope/i);
    await expect(page.getByRole("link", { name: /Make a Referral/i }).first()).toBeVisible();
  });

  test("has skip link for accessibility", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /Skip to main content/i });
    await expect(skipLink).toBeAttached();
  });
});
