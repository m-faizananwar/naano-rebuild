import { z } from "zod";
import type { FitResult } from "@/lib/fit-score";
import {
  CREATOR_TABS, DISCOUNT_PRESETS, MATCHING_PROMPT_MAX_LENGTH, MAX_PAGES, MIN_OFFER_CENTS, OFFER_NOTE_MAX_LENGTH,
  PLATFORM_MAX_POST_CENTS, SEARCH_MAX_LENGTH, SORT_KEYS,
} from "./constants";

// ---- URL state ----------------------------------------------------------------

const csv = z
  .string()
  .optional()
  .transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []));

const cents = z.coerce.number().int().nonnegative().optional().catch(undefined);

export const marketplaceQuerySchema = z.object({
  campaign: z.string().uuid().optional().catch(undefined),
  tab: z.enum(CREATOR_TABS).catch("all"),
  q: z.string().trim().max(SEARCH_MAX_LENGTH).optional().catch(undefined),
  sort: z.enum(SORT_KEYS).catch("best"),
  industry: csv,
  country: csv,
  min: cents,
  max: cents,
  page: z.coerce.number().int().min(1).max(MAX_PAGES).catch(1),
});
export type MarketplaceQuery = z.infer<typeof marketplaceQuerySchema>;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseMarketplaceQuery(raw: RawSearchParams): MarketplaceQuery {
  const flat = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  return marketplaceQuerySchema.parse(flat);
}

// ---- DTOs -----------------------------------------------------------------------

export type CreatorPostDto = {
  id: string;
  url: string;
  body: string;
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  postedAt: string;
};

export type CreatorDto = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  linkedinUrl: string;
  headline: string;
  bio: string;
  country: string;
  industries: string[];
  followers: number;
  medianViews: number;
  engagementRate: number;
  postsPerMonth: number;
  priceCents: number;
  bundle: { posts: number; totalCents: number } | null;
  cpmCents: number | null;
  audienceJobTitles: Record<string, number>;
  audienceSeniority: Record<string, number>;
  engagerSample: number;
  posts: CreatorPostDto[];
  fit: FitResult;
  shortlisted: boolean;
  // Status of this creator's collaboration on the selected campaign, if any.
  collaborationStatus: string | null;
};

export type CampaignOptionDto = { id: string; name: string; status: "draft" | "active" | "completed" };

export type MarketplaceContextDto = {
  brandId: string;
  company: string;
  walletCents: number;
  icpTitles: string[];
  targetIndustries: string[];
  campaigns: CampaignOptionDto[];
  selectedCampaign: CampaignOptionDto | null;
};

export type CountryOptionDto = { code: string; count: number };

export type CreatorListDto = {
  items: CreatorDto[];
  total: number;
  allCount: number;
  shortlistCount: number;
  hasMore: boolean;
};

// ---- Actions ----------------------------------------------------------------------

export type ActionError = {
  ok: false;
  error: string;
  code?: "insufficient_funds" | "duplicate" | "unauthorized" | "invalid" | "unknown";
  shortfallCents?: number;
};
export type ActionResult<T = undefined> = { ok: true; data: T } | ActionError;

export const toggleShortlistSchema = z.object({
  creatorId: z.string().uuid(),
  shortlisted: z.boolean(),
});
export type ToggleShortlistInput = z.infer<typeof toggleShortlistSchema>;

export const bookCreatorSchema = z.object({
  campaignId: z.string().uuid(),
  creatorId: z.string().uuid(),
  option: z.enum(["single", "bundle"]),
});
export type BookCreatorInput = z.infer<typeof bookCreatorSchema>;

export const sendOfferSchema = z.object({
  campaignId: z.string().uuid("Pick a campaign that has a brief."),
  creatorId: z.string().uuid(),
  offerCents: z
    .number()
    .int()
    .min(MIN_OFFER_CENTS, "Offers start at 20 € per post.")
    .max(PLATFORM_MAX_POST_CENTS, "The platform limit is 1 500 € per post."),
  discountPercent: z.number().int().min(0).max(100),
  postBy: z.string().date("Enter a valid date."),
  approveBeforePublish: z.boolean(),
  note: z.string().trim().max(OFFER_NOTE_MAX_LENGTH).optional(),
});
export type SendOfferInput = z.infer<typeof sendOfferSchema>;

export const discountPresetSchema = z.enum(DISCOUNT_PRESETS.map(String) as [string, ...string[]]);

export const runMatchingSchema = z.object({
  campaignId: z.string().uuid(),
  prompt: z.string().trim().min(1, "Tell Nao what you are looking for.").max(MATCHING_PROMPT_MAX_LENGTH),
});
export type RunMatchingInput = z.infer<typeof runMatchingSchema>;

export type BookingResultDto = { collaborationId: string; status: string; feeCents: number; acceptBy: string | null };

export type MatchingResultDto = {
  requested: number;
  intro: string;
  headline: string;
  rationale: string;
  tradeoff: string;
  source: "claude" | "template";
  creators: CreatorDto[];
};

// "Make an offer" form state (euros in the input; the action takes cents).
export const offerFormSchema = z.object({
  preset: z.enum(["10", "20", "30", "other"]),
  offerEuros: z.number({ message: "Enter a price." }).positive("Enter a price."),
  postBy: z.string().date("Enter a valid date."),
  campaignId: z.string().uuid("Pick a campaign that has a brief."),
  approveBeforePublish: z.boolean(),
});
export type OfferFormValues = z.infer<typeof offerFormSchema>;
