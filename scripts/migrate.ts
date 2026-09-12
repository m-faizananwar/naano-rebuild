import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { resolveDatabaseUrl } from "../src/lib/database-url";

// Applies drizzle/ migrations with drizzle-orm's migrator. drizzle-kit migrate
// (0.31) silently skipped 0004 against a database that had 0000–0003 applied,
// while the programmatic migrator applied it, so both db:migrate scripts use
// this. Same env resolution as the app; .env.remote.local via remote-env.mjs.
async function main() {
  loadEnvConfig(process.cwd());
  const resolved = resolveDatabaseUrl(process.env);
  if (!resolved) {
    console.error("scripts/migrate: no database url (DATABASE_URL or one of its Neon-prefixed names).");
    process.exit(1);
  }
  const client = postgres(resolved.url, { prepare: false, max: 1, onnotice: () => undefined });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  const rows = await client`select count(*)::int as n from drizzle.__drizzle_migrations`;
  console.log(`migrate: up to date via ${resolved.name} (${rows[0]?.n} migrations recorded)`);
  await client.end();
}

main().catch((error) => {
  console.error("scripts/migrate failed", error);
  process.exit(1);
});
