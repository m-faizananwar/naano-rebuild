import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const CONNECT_TIMEOUT_SECONDS = 5;

function create(url: string) {
  // Supabase's transaction pooler (port 6543) does not support prepared
  // statements, so they are disabled explicitly.
  const client = postgres(url, {
    prepare: false,
    connect_timeout: CONNECT_TIMEOUT_SECONDS,
  });
  return drizzle(client, { schema });
}

let cached: ReturnType<typeof create> | undefined;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

// Lazy so importing this module never fails at build time on a machine
// without DATABASE_URL; the first query is what needs it.
export function getDb() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  cached = create(url);
  return cached;
}

export type Db = ReturnType<typeof getDb>;
