import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

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
  return Boolean(process.env.DATABASE_URL);
}

// Lazy so importing this module never fails at build time on a machine
// without DATABASE_URL; the first query is what needs it.
export function getDb(): Db {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  cached = createDb(url).db;
  return cached;
}
