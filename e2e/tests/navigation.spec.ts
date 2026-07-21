import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates to contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Contact", exact: true }).first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole("heading", { name: /Contact Us/i })).toBeVisible();
  });

  test("navigates to referral page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Make a Referral/i }).first().click();
    await expect(page).toHaveURL(/\/referral/);
    await expect(page.getByRole("heading", { name: /Make a Referral/i })).toBeVisible();
  });

  test("mobile menu opens on small viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(page.getByRole("link", { name: "FAQs" })).toBeVisible();
  });
});
