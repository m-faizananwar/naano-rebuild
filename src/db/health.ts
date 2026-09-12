import { sql } from "drizzle-orm";
import { getDb } from "./index";
import { type DatabaseUrlName, resolveDatabaseUrl } from "@/lib/database-url";

// `via` is the env var name the URL came from, never the value.
export type DbHealth = { ok: true; via: DatabaseUrlName } | { ok: false; reason: "not configured" | "unreachable"; via: DatabaseUrlName | null };

// Used by /api/health only. The real error is logged server-side; the
// response carries a category, never connection details.
export async function pingDatabase(): Promise<DbHealth> {
  const resolved = resolveDatabaseUrl(process.env);
  if (!resolved) return { ok: false, reason: "not configured", via: null };
  try {
    await getDb().execute(sql`select 1`);
    return { ok: true, via: resolved.name };
  } catch (error) {
    console.error("[health] database ping failed", { via: resolved.name, error });
    return { ok: false, reason: "unreachable", via: resolved.name };
  }
}
