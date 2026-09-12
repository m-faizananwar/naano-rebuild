import { sql } from "drizzle-orm";
import { getDb } from "./index";

export type DbHealth = { ok: true } | { ok: false; reason: "not configured" | "unreachable" };

// Used by /api/health only. The real error is logged server-side; the
// response carries a category, never connection details.
export async function pingDatabase(): Promise<DbHealth> {
  if (!process.env.DATABASE_URL) return { ok: false, reason: "not configured" };
  try {
    await getDb().execute(sql`select 1`);
    return { ok: true };
  } catch (error) {
    console.error("[health] database ping failed", error);
    return { ok: false, reason: "unreachable" };
  }
}
