import "server-only";
import { and, arrayOverlaps, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { brands, campaigns, collaborations, creatorPosts, creators, shortlist, users } from "@/db/schema";
import { getViewer, type Viewer } from "@/features/auth/server/session";
import type { FitCampaign } from "@/lib/fit-score";
import { PAGE_SIZE, TOP_RANKED } from "../constants";
import type {
  CampaignOptionDto, CountryOptionDto, CreatorDto, CreatorListDto, MarketplaceContextDto, MarketplaceQuery,
} from "../schemas";
import { type CreatorDtoContext, type CreatorRowWithName, toCreatorDto } from "./creator-dto";

// ---- context: brand, campaigns, selected campaign ---------------------------------

export async function getMarketplaceContext(viewer: Viewer, campaignId?: string): Promise<MarketplaceContextDto | null> {
  if (!viewer.brand) return null;
  const db = getDb();
  const [brand] = await db
    .select({ icps: brands.icps, targetIndustries: brands.targetIndustries })
    .from(brands)
    .where(eq(brands.id, viewer.brand.id));
  if (!brand) return null;

  const rows = await db
    .select({ id: campaigns.id, name: campaigns.name, status: campaigns.status, targetIndustries: sql<string[]>`${campaigns.brief}->'targetIndustries'` })
    .from(campaigns)
    .where(eq(campaigns.brandId, viewer.brand.id))
    .orderBy(desc(campaigns.createdAt));

  const options: CampaignOptionDto[] = rows.map((r) => ({ id: r.id, name: r.name, status: r.status }));
  // Default: the most recent active campaign, else the most recent one.
  const selected = options.find((c) => c.id === campaignId) ?? options.find((c) => c.status === "active") ?? options[0] ?? null;
  const selectedRow = rows.find((r) => r.id === selected?.id);
  const targetIndustries = selectedRow?.targetIndustries?.length ? selectedRow.targetIndustries : brand.targetIndustries;

  return {
    brandId: viewer.brand.id,
    company: viewer.brand.company,
    walletCents: viewer.brand.walletCents,
    icpTitles: brand.icps.map((i) => i.title),
    targetIndustries,
    campaigns: options,
    selectedCampaign: selected,
  };
}

export function fitCampaignOf(ctx: MarketplaceContextDto): FitCampaign {
  return { targetIndustries: ctx.targetIndustries, icpTitles: ctx.icpTitles };
}

const DAY_MS = 86_400_000;

// ---- creator list -------------------------------------------------------------------

function whereFor(query: MarketplaceQuery, shortlistedIds: Set<string>) {
  const clauses = [];
  if (query.industry.length) clauses.push(arrayOverlaps(creators.industries, query.industry));
  if (query.country.length) clauses.push(inArray(creators.country, query.country));
  if (query.min !== undefined) clauses.push(gte(creators.priceCents, query.min));
  if (query.max !== undefined) clauses.push(lte(creators.priceCents, query.max));
  if (query.q) {
    const term = `%${query.q}%`;
    clauses.push(
      or(ilike(sql`${users.firstName} || ' ' || ${users.lastName}`, term), ilike(creators.headline, term), ilike(creators.handle, term)),
    );
  }
  if (query.tab === "shortlist") clauses.push(inArray(creators.id, [...shortlistedIds]));
  if (query.activity !== "any") {
    // Active in the window = at least one public post since then.
    const since = new Date(Date.now() - Number(query.activity) * DAY_MS);
    clauses.push(sql`exists (select 1 from ${creatorPosts} where ${creatorPosts.creatorId} = ${creators.id} and ${creatorPosts.postedAt} >= ${since})`);
  }
  return clauses.length ? and(...clauses) : undefined;
}

function sortItems(items: CreatorDto[], sort: MarketplaceQuery["sort"]) {
  const by: Record<MarketplaceQuery["sort"], (a: CreatorDto, b: CreatorDto) => number> = {
    best: (a, b) => b.fit.score - a.fit.score || b.medianViews - a.medianViews,
    price: (a, b) => a.priceCents - b.priceCents || b.fit.score - a.fit.score,
    followers: (a, b) => b.followers - a.followers,
    engagement: (a, b) => b.engagementRate - a.engagementRate,
  };
  return items.sort(by[sort]);
}

async function loadDtoContext(ctx: MarketplaceContextDto, creatorIds: string[]): Promise<Omit<CreatorDtoContext, "campaign" | "shortlistedIds">> {
  const db = getDb();
  const postsByCreator = new Map<string, (typeof creatorPosts.$inferSelect)[]>();
  const collaborationStatusByCreator = new Map<string, string>();
  if (creatorIds.length === 0) return { postsByCreator, collaborationStatusByCreator };

  const posts = await db.select().from(creatorPosts).where(inArray(creatorPosts.creatorId, creatorIds));
  for (const p of posts) postsByCreator.set(p.creatorId, [...(postsByCreator.get(p.creatorId) ?? []), p]);

  if (ctx.selectedCampaign) {
    const collabs = await db
      .select({ creatorId: collaborations.creatorId, status: collaborations.status })
      .from(collaborations)
      .where(and(eq(collaborations.campaignId, ctx.selectedCampaign.id), inArray(collaborations.creatorId, creatorIds)));
    for (const c of collabs) collaborationStatusByCreator.set(c.creatorId, c.status);
  }
  return { postsByCreator, collaborationStatusByCreator };
}

async function shortlistedIdsFor(brandId: string) {
  const rows = await getDb().select({ creatorId: shortlist.creatorId }).from(shortlist).where(eq(shortlist.brandId, brandId));
  return new Set(rows.map((r) => r.creatorId));
}

// Filters run in SQL; the fit score (the default sort) is computed per row,
// so ordering and paging happen in memory. 300 creators make that cheap.
export async function listCreators(ctx: MarketplaceContextDto, query: MarketplaceQuery): Promise<CreatorListDto> {
  const db = getDb();
  const shortlistedIds = await shortlistedIdsFor(ctx.brandId);
  const [all] = await db.select({ n: count() }).from(creators);
  const allCount = all?.n ?? 0;
  const empty = { items: [], topRanked: 0, total: 0, allCount, shortlistCount: shortlistedIds.size, hasMore: false };
  // inArray([]) is invalid SQL; an empty shortlist is simply an empty tab.
  if (query.tab === "shortlist" && shortlistedIds.size === 0) return empty;

  const rows: CreatorRowWithName[] = await db
    .select({ creator: creators, firstName: users.firstName, lastName: users.lastName })
    .from(creators)
    .innerJoin(users, eq(users.id, creators.userId))
    .where(whereFor(query, shortlistedIds))
    .orderBy(asc(creators.createdAt));

  const base: CreatorDtoContext = {
    campaign: fitCampaignOf(ctx),
    shortlistedIds,
    postsByCreator: new Map(),
    collaborationStatusByCreator: new Map(),
  };
  const scored = sortItems(rows.map((r) => toCreatorDto(r, base)), query.sort);
  // "Show more" appends: page N shows the first N pages so a reload keeps the view.
  const limit = query.page * PAGE_SIZE;
  const pageIds = new Set(scored.slice(0, limit).map((s) => s.id));
  const pageRows = rows.filter((r) => pageIds.has(r.creator.id));
  const extra = await loadDtoContext(ctx, [...pageIds]);
  const items = sortItems(pageRows.map((r) => toCreatorDto(r, { ...base, ...extra })), query.sort);

  // The strip only makes sense on the ranked view of all creators.
  const topRanked = query.tab === "all" && query.sort === "best" ? Math.min(TOP_RANKED, items.length) : 0;
  return { ...empty, items, topRanked, total: scored.length, hasMore: scored.length > limit };
}

export async function listCountries(): Promise<CountryOptionDto[]> {
  const rows = await getDb()
    .select({ code: creators.country, n: count() })
    .from(creators)
    .groupBy(creators.country)
    .orderBy(desc(count()));
  return rows.map((r) => ({ code: r.code, count: r.n }));
}

// Nao: every creator scored against the campaign, best first. Optional
// industry hint narrows the pool when the prompt names one.
export async function rankCreators(ctx: MarketplaceContextDto, industries: string[]): Promise<CreatorDto[]> {
  const query: MarketplaceQuery = { tab: "all", sort: "best", industry: industries, country: [], min: undefined, max: undefined, page: 1, activity: "any" };
  const list = await listCreators(ctx, query);
  return list.items;
}

// ---- page loaders: never throw, so page.tsx stays a switch on the result ---------

export type MarketplacePageData =
  | { kind: "ok"; ctx: MarketplaceContextDto; list: CreatorListDto; countries: CountryOptionDto[] }
  | { kind: "no-brand" }
  | { kind: "error" };

export async function loadMarketplacePage(query: MarketplaceQuery): Promise<MarketplacePageData> {
  try {
    const viewer = await getViewer();
    const ctx = viewer ? await getMarketplaceContext(viewer, query.campaign) : null;
    if (!ctx) return { kind: "no-brand" };
    const [list, countries] = await Promise.all([listCreators(ctx, query), listCountries()]);
    return { kind: "ok", ctx, list, countries };
  } catch (error) {
    console.error("[marketplace] failed to load the marketplace page", { query, error });
    return { kind: "error" };
  }
}

export type MatchingPageData = { kind: "ok"; ctx: MarketplaceContextDto } | { kind: "no-brand" } | { kind: "error" };

export async function loadMatchingPage(query: MarketplaceQuery): Promise<MatchingPageData> {
  try {
    const viewer = await getViewer();
    const ctx = viewer ? await getMarketplaceContext(viewer, query.campaign) : null;
    return ctx ? { kind: "ok", ctx } : { kind: "no-brand" };
  } catch (error) {
    console.error("[marketplace] failed to load AI Matching", { query, error });
    return { kind: "error" };
  }
}
