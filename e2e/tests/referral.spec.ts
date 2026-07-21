import { test, expect } from "@playwright/test";

test.describe("Referral form", () => {
  test("loads secure referral form", async ({ page }) => {
    await page.goto("/referral");
    await expect(page.getByRole("heading", { name: /Secure Referral Form/i })).toBeVisible();
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
  });

  test("shows emergency phone link", async ({ page }) => {
    await page.goto("/referral");
    await expect(page.getByRole("main").getByRole("link", { name: /0800/i })).toBeVisible();
  });
});
