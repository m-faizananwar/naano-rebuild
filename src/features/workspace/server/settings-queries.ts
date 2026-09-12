import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { brands, creators, users } from "@/db/schema";

export type BrandSettings = {
  company: string;
  website: string;
  valueProp: string;
  targetIndustries: string[];
  targetRegions: string[];
  owner: { name: string; email: string };
  icps: Array<{ title: string; description: string }>;
};

export async function getBrandSettings(brandId: string): Promise<BrandSettings | null> {
  const [row] = await getDb()
    .select({ brand: brands, firstName: users.firstName, lastName: users.lastName, email: users.email })
    .from(brands)
    .innerJoin(users, eq(users.id, brands.ownerUserId))
    .where(eq(brands.id, brandId));
  if (!row) return null;
  return {
    company: row.brand.company,
    website: row.brand.website ?? "",
    valueProp: row.brand.valueProp ?? "",
    targetIndustries: row.brand.targetIndustries,
    targetRegions: row.brand.targetRegions,
    owner: { name: `${row.firstName} ${row.lastName}`, email: row.email },
    icps: row.brand.icps,
  };
}

export type CreatorSettings = {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  linkedinUrl: string;
  industries: string[];
  priceCents: number;
  handle: string;
};

export async function getCreatorSettings(creatorId: string): Promise<CreatorSettings | null> {
  const [row] = await getDb()
    .select({ creator: creators, firstName: users.firstName, lastName: users.lastName, email: users.email })
    .from(creators)
    .innerJoin(users, eq(users.id, creators.userId))
    .where(eq(creators.id, creatorId));
  if (!row) return null;
  return {
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    headline: row.creator.headline,
    linkedinUrl: row.creator.linkedinUrl,
    industries: row.creator.industries,
    priceCents: row.creator.priceCents,
    handle: row.creator.handle,
  };
}
