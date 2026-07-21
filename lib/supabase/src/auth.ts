import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "administrator" | "content_editor";

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
}

let _authClient: SupabaseClient | null = null;

function getAuthConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_ANON_KEY must be set for admin authentication",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function getAuthClient(): SupabaseClient {
  if (!_authClient) {
    const { supabaseUrl, supabaseAnonKey } = getAuthConfig();
    _authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _authClient;
}

export async function verifyAccessToken(
  token: string,
): Promise<{ user: User; profile: AdminProfile } | null> {
  const { getSupabase } = await import("./client.js");
  const { data, error } = await getSupabase().auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  const profile = await getAdminProfile(data.user.id);
  if (!profile || !profile.isActive) {
    return null;
  }

  return { user: data.user, profile };
}

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { getSupabase } = await import("./client.js");
  const { data, error } = await getSupabase()
    .from("admin_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapAdminProfile(data);
}

export function mapAdminProfile(row: {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  avatar_url: string | null;
  last_login_at: string | null;
}): AdminProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    avatarUrl: row.avatar_url,
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : null,
  };
}

export async function touchLastLogin(userId: string): Promise<void> {
  const { getSupabase } = await import("./client.js");
  await getSupabase()
    .from("admin_profiles")
    .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", userId);
}
