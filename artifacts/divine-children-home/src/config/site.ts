export const siteConfig = {
  name: "Divine Children Home Ltd",
  shortName: "Divine Children Home",
  description:
    "Safe, nurturing residential care for children and young people across the UK. Compassionate support in a warm, therapeutic environment.",
  url: "https://www.divinechildrenhome.co.uk",
  email: "referrals@divinechildrenhome.co.uk",
  infoEmail: "info@divinechildrenhome.co.uk",
  phone: "0800 123 4567",
  phoneTel: "08001234567",
  locale: "en_GB",
} as const;

export const publicRoutes = [
  "/",
  "/about",
  "/homes",
  "/services",
  "/referral",
  "/careers",
  "/news",
  "/resources",
  "/contact",
  "/safeguarding",
  "/faqs",
  "/gallery",
  "/privacy",
  "/terms",
  "/cookies",
  "/complaints",
] as const;
