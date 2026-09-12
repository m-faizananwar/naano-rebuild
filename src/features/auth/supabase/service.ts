import "server-only";
import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfig } from "./config";

// Service-role client: bypasses RLS. The `server-only` import above makes the
// build fail if this file is ever pulled into a client bundle.
export function createSupabaseServiceClient() {
  const { url } = assertSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
