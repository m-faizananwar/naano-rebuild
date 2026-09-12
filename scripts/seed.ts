import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Seed data lives here, never in components. Nothing to seed until the first
// tables exist; the script is wired up so `pnpm db:seed` is a known command.
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  console.log("seed: no tables yet, nothing to do");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
