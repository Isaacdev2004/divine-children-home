import type { RequestHandler } from "express";
import cors from "cors";

function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];

  return raw
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Supports exact origins and simple wildcard subdomains, e.g. https://*.vercel.app */
export function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  const normalizedOrigin = origin.replace(/\/+$/, "");

  return allowedOrigins.some((allowed) => {
    if (allowed === normalizedOrigin) return true;

    if (allowed.includes("*")) {
      const pattern = `^${escapeRegExp(allowed).replace("\\*", "[^/]+")}$`;
      return new RegExp(pattern).test(normalizedOrigin);
    }

    return false;
  });
}

const allowedOrigins = parseAllowedOrigins(process.env["CORS_ORIGIN"]);

export const corsMiddleware: RequestHandler = cors({
  origin(origin, callback) {
    // Non-browser clients (curl, server-to-server) omit Origin.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (!allowedOrigins.length) {
      callback(null, true);
      return;
    }

    callback(null, isOriginAllowed(origin, allowedOrigins));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
