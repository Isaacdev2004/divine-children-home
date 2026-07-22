import { loadApiEnv } from "./load-api-env";

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
  try {
    loadApiEnv();
  } catch (err) {
    console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

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
