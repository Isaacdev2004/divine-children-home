import { test, expect } from "@playwright/test";
import { openMobileMenuIfNeeded } from "../helpers";

test.describe("Navigation", () => {
  test("navigates to contact page", async ({ page }) => {
    await page.goto("/");
    await openMobileMenuIfNeeded(page);

    const contactNav = page.getByLabel("Mobile navigation").getByRole("link", { name: "Contact", exact: true });
    const contactLink = (await contactNav.isVisible().catch(() => false))
      ? contactNav
      : page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Contact", exact: true });

    await contactLink.click();
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
    await expect(page.getByLabel("Mobile navigation").getByRole("link", { name: "FAQs" })).toBeVisible();
  });
});
