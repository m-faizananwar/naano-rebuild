import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseConfig } from "./config";

// Cookie-backed client for server components, server actions and route
// handlers. Acts as the signed-in user, so RLS applies.
export async function createSupabaseServerClient() {
  const { url, anonKey } = assertSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a server component, where cookies are read-only.
          // Session refresh is handled by the proxy/middleware layer instead.
        }
      },
    },
  });
}
