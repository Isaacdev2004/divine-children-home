import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function loadApiEnv(): string {
  const envPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../artifacts/api-server/.env",
  );

  if (!existsSync(envPath)) {
    throw new Error(
      `Missing ${envPath}. Copy .env.example and add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.`,
    );
  }

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  return envPath;
}
