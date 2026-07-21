import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("shows validation errors for empty submit", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.getByText(/Name is required|Invalid email/i).first()).toBeVisible();
  });

  test("displays contact details with phone link", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("link", { name: /0800/i })).toBeVisible();
  });
});
