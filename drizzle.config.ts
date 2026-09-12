import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { resolveDatabaseUrl } from "./src/lib/database-url";

// Load .env.local the same way Next does, so drizzle-kit sees DATABASE_URL.
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: resolveDatabaseUrl(process.env)?.url ?? "" },
  strict: true,
  verbose: true,
});
