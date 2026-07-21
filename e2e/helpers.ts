import type { Page } from "@playwright/test";

/** Dismiss cookie banner so it does not block form interactions. */
export async function dismissCookieConsent(page: Page) {
  const accept = page.getByRole("button", { name: /Accept All/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

/** Open the mobile nav drawer when links are hidden behind the menu toggle. */
export async function openMobileMenuIfNeeded(page: Page) {
  const menuButton = page.getByRole("button", { name: /open menu/i });
  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click();
  }
}
