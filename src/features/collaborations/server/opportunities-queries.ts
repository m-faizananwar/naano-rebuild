import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { brands, campaigns, collaborations, creators } from "@/db/schema";
import { fitScore } from "@/lib/fit-score";
import type { OpportunityDto } from "../schemas";
import { toBriefDto } from "./dto";

const DAY_MS = 86_400_000;

function daysUntil(date: Date | null, now: number) {
  if (!date) return null;
  return Math.max(0, Math.ceil((date.getTime() - now) / DAY_MS));
}

// Every active campaign open to applications, scored against this creator.
// Campaigns the creator already has a collaboration on stay in the list with
// that state instead of an Apply button.
export async function listOpportunities(creatorId: string): Promise<OpportunityDto[]> {
  const db = getDb();
  const [creator] = await db.select().from(creators).where(eq(creators.id, creatorId));
  if (!creator) return [];

  const rows = await db
    .select({ campaign: campaigns, brand: brands, existingId: collaborations.id, existingStatus: collaborations.status })
    .from(campaigns)
    .innerJoin(brands, eq(brands.id, campaigns.brandId))
    .leftJoin(collaborations, and(eq(collaborations.campaignId, campaigns.id), eq(collaborations.creatorId, creatorId)))
    .where(and(eq(campaigns.status, "active"), eq(campaigns.openToApplications, true)))
    .orderBy(asc(campaigns.createdAt));

  const now = Date.now();
  return rows
    .map(({ campaign, brand, existingId, existingStatus }) => {
      const brief = toBriefDto(campaign, brand, null);
      const fit = fitScore(creator, { targetIndustries: brief.targetIndustries, icpTitles: brief.icpTitles });
      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        description: campaign.description,
        brandCompany: brand.company,
        brandInitial: brief.brandInitial,
        brandWebsite: brand.website,
        industries: brief.targetIndustries,
        regions: brief.targetGeos,
        postDeadline: brief.postDeadline,
        daysToDeadline: daysUntil(campaign.postDeadline, now),
        matchScore: fit.score,
        matchReason: fit.reason,
        listPriceCents: creator.priceCents,
        existingCollaborationId: existingId,
        existingStatus,
        brief,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
