import { test, expect } from "@playwright/test";
import { dismissCookieConsent } from "../helpers";

test.describe("Contact form", () => {
  test("shows validation errors for empty submit", async ({ page }) => {
    await page.goto("/contact");
    await dismissCookieConsent(page);

    const submit = page.getByRole("button", { name: /Send Message/i });
    await submit.scrollIntoViewIfNeeded();
    await submit.click();

    await expect(page.getByRole("alert").filter({ hasText: /Name is required/i }).first()).toBeVisible();
  });

  test("displays contact details with phone link", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("main").getByRole("link", { name: /0800/i })).toBeVisible();
  });
});
