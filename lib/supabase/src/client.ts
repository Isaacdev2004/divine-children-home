import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL must be set. Add it to artifacts/api-server/.env",
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must be set. Add it to artifacts/api-server/.env — see SUPABASE_SETUP.md",
    );
  }

  return { supabaseUrl, supabaseServiceRoleKey };
}

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const { supabaseUrl, supabaseServiceRoleKey } = getConfig();
    _client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return _client;
}

/** @deprecated Use getSupabase() — kept for route imports */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});
