import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfig } from "./config";

// For client components only (session listening, realtime). Reads go through
// features/*/server/queries.ts, mutations through actions.ts — never from here.
export function createSupabaseBrowserClient() {
  const { url, anonKey } = assertSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
