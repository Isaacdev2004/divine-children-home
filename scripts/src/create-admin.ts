/**
 * Creates the default super admin user in Supabase Auth + admin_profiles.
 * Usage: pnpm --filter @workspace/scripts run create-admin
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (load from api-server/.env).
 */
import { getSupabase } from "@workspace/supabase";
import { loadApiEnv } from "./load-api-env";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@divine-children-home.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123!";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Super Admin";

async function main() {
  loadApiEnv();
  const db = getSupabase();

  const { data: existingProfile } = await db
    .from("admin_profiles")
    .select("id, email")
    .eq("email", ADMIN_EMAIL)
    .maybeSingle();

  if (existingProfile) {
    console.log(`Admin profile already exists for ${ADMIN_EMAIL} (${existingProfile.id})`);
    console.log("Login at /admin/login with your configured password.");
    return;
  }

  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: ADMIN_NAME },
  });

  if (authError || !authData.user) {
    if (authError?.message.includes("already been registered")) {
      const { data: listData } = await db.auth.admin.listUsers();
      const users = (listData?.users ?? []) as Array<{ id: string; email?: string }>;
      const user = users.find((u) => u.email === ADMIN_EMAIL);
      if (!user) {
        throw new Error(authError.message);
      }
      await linkProfile(db, user.id);
      return;
    }
    throw new Error(authError?.message ?? "Failed to create auth user");
  }

  await linkProfile(db, authData.user.id);
}

async function linkProfile(
  db: ReturnType<typeof getSupabase>,
  userId: string,
) {
  const { error } = await db.from("admin_profiles").upsert([
    {
      id: userId,
      email: ADMIN_EMAIL,
      full_name: ADMIN_NAME,
      role: "super_admin",
      is_active: true,
    },
  ]);

  if (error) {
    throw new Error(`Auth user created but profile failed: ${error.message}`);
  }

  console.log("Super admin created successfully.");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Role:     super_admin`);
  console.log("  Login:    /admin/login");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
