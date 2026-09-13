import "server-only";
import { isDbConfigured } from "@/db";
import { listCountries } from "@/features/marketplace/server/queries";
import type { CountryCount } from "@/lib/country-coords";

// Creator count per country for the globes; empty (a bare globe) when the
// database is not configured or unreachable — never a failed page.
export async function getCountryCounts(): Promise<CountryCount[]> {
  if (!isDbConfigured()) return [];
  try {
    return await listCountries();
  } catch (error) {
    console.error("[globe] country counts failed", { error });
    return [];
  }
}
