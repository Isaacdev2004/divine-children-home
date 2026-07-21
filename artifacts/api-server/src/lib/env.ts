import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  CORS_ORIGIN: z.string().optional(),
  ADMIN_RESET_PASSWORD_URL: z.string().url().optional(),
  TRUST_PROXY: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function validateEnv(): Env {
  if (cached) return cached;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const messages = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(
      `Environment validation failed:\n${messages.join("\n")}\n\nCopy .env.example to artifacts/api-server/.env and fill in required values.`,
    );
  }

  if (
    result.data.NODE_ENV === "production" &&
    !result.data.CORS_ORIGIN?.trim()
  ) {
    throw new Error(
      "CORS_ORIGIN must be set in production (comma-separated allowed origins).",
    );
  }

  cached = result.data;
  return cached;
}

export function getEnv(): Env {
  return validateEnv();
}
