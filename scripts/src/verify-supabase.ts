import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function loadApiEnv() {
  const envPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../artifacts/api-server/.env",
  );

  if (!existsSync(envPath)) {
    console.error(`FAIL: Missing ${envPath}`);
    process.exit(1);
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
}

const TABLES = [
  "jobs",
  "news",
  "faqs",
  "testimonials",
  "gallery",
  "site_stats",
  "contact_submissions",
  "referral_submissions",
  "career_applications",
  "newsletter_subscribers",
] as const;

async function main() {
  loadApiEnv();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error("FAIL: SUPABASE_URL is not set in artifacts/api-server/.env");
    process.exit(1);
  }

  if (!key) {
    console.error(
      "FAIL: SUPABASE_SERVICE_ROLE_KEY is not set.\n\n" +
        "1. Open Supabase Dashboard → Settings → API\n" +
        "2. Copy the service_role key\n" +
        "3. Paste into artifacts/api-server/.env\n" +
        "4. Re-run: pnpm verify:supabase",
    );
    process.exit(1);
  }

  const { supabase } = await import("@workspace/supabase");

  console.log(`Supabase URL: ${url}`);
  console.log("Checking tables...\n");

  let failed = false;

  for (const table of TABLES) {
    const { error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.error(`  ✗ ${table}: ${error.message}`);
      failed = true;
    } else {
      console.log(`  ✓ ${table}`);
    }
  }

  const { data: buckets, error: storageError } =
    await supabase.storage.listBuckets();

  if (storageError) {
    console.error(`  ✗ storage: ${storageError.message}`);
    failed = true;
  } else {
    const imagesBucket = buckets?.find((b) => b.name === "images");
    console.log(
      imagesBucket
        ? "  ✓ storage bucket: images"
        : "  ✗ storage bucket: images (run supabase/migrations/000_combined.sql)",
    );
    if (!imagesBucket) failed = true;
  }

  console.log("");
  if (failed) {
    console.error(
      "Some checks failed. Run supabase/migrations/000_combined.sql in the Supabase SQL Editor.",
    );
    process.exit(1);
  }

  console.log("All Supabase checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
