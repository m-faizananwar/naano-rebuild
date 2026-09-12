import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { resolveDatabaseUrl } from "@/lib/database-url";

const CONNECT_TIMEOUT_SECONDS = 5;

// Supabase's transaction pooler (port 6543) does not support prepared
// statements, so they are disabled explicitly. Works the same on plain Postgres.
export function createDb(url: string) {
  const client = postgres(url, { prepare: false, connect_timeout: CONNECT_TIMEOUT_SECONDS });
  return { db: drizzle(client, { schema }), close: () => client.end() };
}

export type Db = ReturnType<typeof createDb>["db"];

let cached: Db | undefined;

export function isDbConfigured() {
  return resolveDatabaseUrl(process.env) !== null;
}

// Lazy so importing this module never fails at build time on a machine
// without DATABASE_URL; the first query is what needs it.
export function getDb(): Db {
  if (cached) return cached;
  const resolved = resolveDatabaseUrl(process.env);
  if (!resolved) throw new Error("No database URL set (DATABASE_URL or a Vercel/Neon-prefixed equivalent)");
  cached = createDb(resolved.url).db;
  return cached;
}
