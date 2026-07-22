import { describe, expect, it } from "vitest";
import { isOriginAllowed } from "../middleware/cors";

describe("isOriginAllowed", () => {
  const allowed = [
    "https://divine-children-home-divine-childre.vercel.app",
    "https://www.divinechildrenhome.co.uk",
    "https://*.vercel.app",
  ];

  it("allows exact production and preview origins", () => {
    expect(isOriginAllowed("https://divine-children-home-divine-childre.vercel.app", allowed)).toBe(true);
    expect(isOriginAllowed("https://www.divinechildrenhome.co.uk", allowed)).toBe(true);
  });

  it("allows wildcard vercel preview subdomains", () => {
    expect(isOriginAllowed("https://my-branch.vercel.app", allowed)).toBe(true);
  });

  it("rejects unknown origins", () => {
    expect(isOriginAllowed("https://evil.example.com", allowed)).toBe(false);
  });

  it("ignores trailing slashes on origin", () => {
    expect(
      isOriginAllowed("https://divine-children-home-divine-childre.vercel.app/", allowed),
    ).toBe(true);
  });
});
