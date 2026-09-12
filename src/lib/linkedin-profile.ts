// Simulated "read the public LinkedIn profile once" step. naano scrapes via
// Apify; we derive a plausible Basic card deterministically from the URL slug,
// so the same URL always yields the same name, followers and headline.

export type LinkedinProfile = {
  slug: string;
  name: string;
  followers: number;
  headline: string;
  medianViews: number;
  engagementRate: number;
};

const SLUG_PATTERN = /linkedin\.com\/in\/([A-Za-z0-9._-]+)/i;
const SLUG_MAX_LENGTH = 100;

// FNV-1a, 32-bit. Small, stable across runtimes, spreads slugs evenly.
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const UINT32 = 0x1_0000_0000;

// Follower tiers: most creators are small. Weights sum to 100.
const FOLLOWER_TIERS = [
  { weight: 62, min: 1_000, max: 10_000 },
  { weight: 23, min: 10_000, max: 30_000 },
  { weight: 10, min: 30_000, max: 70_000 },
  { weight: 5, min: 70_000, max: 120_000 },
] as const;
const FOLLOWER_ROUND = 10;

// Reach and engagement per follower band, same shape as the seed's tiers so
// simulated creators look like seeded ones. Jitter keeps twins apart.
const REACH_TIERS = [
  { maxFollowers: 3_000, reach: 0.45, engagement: 0.055 },
  { maxFollowers: 7_000, reach: 0.32, engagement: 0.042 },
  { maxFollowers: 10_000, reach: 0.25, engagement: 0.034 },
  { maxFollowers: 100_000, reach: 0.12, engagement: 0.024 },
  { maxFollowers: Infinity, reach: 0.06, engagement: 0.018 },
] as const;
const JITTER = 0.3;
const RATE_DECIMALS = 4;
// Independent draws per slug.
const DRAW = { tier: 1, followers: 2, reach: 3, engagement: 4 } as const;

export const HEADLINE_TEMPLATES = [
  "Helping B2B SaaS teams turn LinkedIn into a pipeline channel",
  "Founder · Building in public about AI, growth and go-to-market",
  "Head of Marketing · Demand gen, content and the numbers behind them",
  "Sales leader · Outbound, pipeline and what actually converts",
  "Product marketer · Positioning, launches and messaging that lands",
  "RevOps · CRM, data and the systems behind predictable revenue",
  "Fintech operator · Payments, compliance and scaling finance teams",
  "Developer advocate · Dev tools, APIs and shipping faster",
  "Growth lead · Experiments, funnels and honest retention talk",
  "HR & People · Hiring, culture and the future of work",
  "Cybersecurity practitioner · Making security a business enabler",
  "Ex-consultant · Strategy, operations and B2B storytelling",
] as const;

export function hashSlug(slug: string): number {
  let hash = FNV_OFFSET;
  for (const char of slug.toLowerCase()) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash >>> 0;
}

// Unit interval from a hash and a salt, so one slug feeds several independent draws.
function unit(hash: number, salt: number): number {
  return hashSlug(`${hash}:${salt}`) / UINT32;
}

export function parseLinkedinSlug(url: string): string | null {
  const match = SLUG_PATTERN.exec(url.trim());
  if (!match) return null;
  const slug = match[1].replace(/[._-]+$/, "");
  return slug.length > 0 && slug.length <= SLUG_MAX_LENGTH ? slug : null;
}

// "jane-doe-1a2b" → "Jane Doe": the trailing hash LinkedIn appends carries digits.
export function nameFromSlug(slug: string): string {
  const words = slug.split(/[-._]+/).filter((w) => w.length > 0 && !/\d/.test(w));
  const kept = words.length > 0 ? words : slug.split(/[-._]+/).filter((w) => w.length > 0);
  return kept.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function pickFollowers(hash: number): number {
  const roll = unit(hash, DRAW.tier) * 100;
  let cumulative = 0;
  for (const tier of FOLLOWER_TIERS) {
    cumulative += tier.weight;
    if (roll < cumulative) {
      const within = unit(hash, DRAW.followers);
      return Math.round((tier.min + within * (tier.max - tier.min)) / FOLLOWER_ROUND) * FOLLOWER_ROUND;
    }
  }
  return FOLLOWER_TIERS[0].min;
}

function jitter(value: number, draw: number): number {
  return value * (1 - JITTER + draw * 2 * JITTER);
}

export function deriveLinkedinProfile(url: string): LinkedinProfile | null {
  const slug = parseLinkedinSlug(url);
  if (!slug) return null;
  const hash = hashSlug(slug);
  const followers = pickFollowers(hash);
  const tier = REACH_TIERS.find((t) => followers <= t.maxFollowers) ?? REACH_TIERS[REACH_TIERS.length - 1];
  const headlineIndex = hashSlug(`${slug}:headline`) % HEADLINE_TEMPLATES.length;
  return {
    slug,
    name: nameFromSlug(slug),
    followers,
    headline: HEADLINE_TEMPLATES[headlineIndex],
    medianViews: Math.round(jitter(followers * tier.reach, unit(hash, DRAW.reach))),
    engagementRate: Number(jitter(tier.engagement, unit(hash, DRAW.engagement)).toFixed(RATE_DECIMALS)),
  };
}
