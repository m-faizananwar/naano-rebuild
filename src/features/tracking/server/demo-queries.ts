import "server-only";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/db";
import { brands } from "@/db/schema";

export type DemoSite = { company: string; website: string | null; siteKey: string; valueProp: string | null };

// The demo landing page impersonates a brand's site. It takes the key from
// the URL (so any brand's snippet can be tried) and falls back to the demo brand.
export async function getDemoSite(siteKey?: string): Promise<DemoSite | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  const where = siteKey ? eq(brands.pixelSiteKey, siteKey) : eq(brands.slug, "zune");
  const [brand] = await db
    .select({ company: brands.company, website: brands.website, siteKey: brands.pixelSiteKey, valueProp: brands.valueProp })
    .from(brands)
    .where(where);
  return brand ?? null;
}
