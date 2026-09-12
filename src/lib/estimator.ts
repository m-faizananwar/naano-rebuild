import { BRAND } from "@/config/brand";
// Pre-spend campaign estimator: selected creators × naano's Q2 2026 benchmark
// (CTR by follower tier, CPL by vertical). Pure; every number traces back to
// a benchmark row or a creator field. First-party numbers, not audited.

export type EstimatorCreator = { followers: number; medianViews: number; priceCents: number };

export type Vertical =
  | "mktg-ops"
  | "sales-tech"
  | "revops"
  | "product"
  | "devtools"
  | "fintech"
  | "hr-tech"
  | "vertical-saas"
  | "default";

export type Confidence = "High" | "Medium" | "Low";

export type Estimate = {
  creators: number;
  creatorsWithReach: number;
  estClicks: number;
  estLeads: number;
  estCplCents: number | null;
  estCpcCents: number | null;
  totalSpendCents: number;
  vertical: Vertical;
  benchmarkCplCents: number;
  confidence: Confidence;
  sourceNote: string;
};

export const ESTIMATOR_SOURCE_NOTE = `Based on ${BRAND.name}'s Q2 2026 benchmark (312 campaigns). First-party numbers, not audited.`;

// CTR by creator size: smaller accounts click through more.
const CTR_BY_TIER = [
  { maxFollowers: 3_000, ctr: 0.138 },
  { maxFollowers: 7_000, ctr: 0.121 },
  { maxFollowers: 10_000, ctr: 0.104 },
  { maxFollowers: Infinity, ctr: 0.087 },
];

// Median CPL by vertical, in cents.
export const CPL_BY_VERTICAL: Record<Vertical, number> = {
  "mktg-ops": 1_600,
  "sales-tech": 1_600,
  revops: 1_700,
  product: 1_800,
  devtools: 1_900,
  fintech: 1_900,
  "hr-tech": 2_000,
  "vertical-saas": 2_100,
  default: 1_800,
};

// Funnel: click → engagement 67% · engagement → demo 8.3%. The lead estimate
// caps at the demo rate applied to clicks.
const CLICK_TO_LEAD = 0.083;
const CONFIDENCE_THRESHOLDS = { high: 5, medium: 2 };

const VERTICAL_BY_INDUSTRY: Record<string, Vertical> = {
  Marketing: "mktg-ops",
  SEO: "mktg-ops",
  "Growth / GTM": "mktg-ops",
  Creative: "mktg-ops",
  Sales: "sales-tech",
  Outreach: "sales-tech",
  CRM: "revops",
  "Data / Analytics": "revops",
  Design: "product",
  Productivity: "product",
  "Developer Tools": "devtools",
  Cybersecurity: "devtools",
  Fintech: "fintech",
  HR: "hr-tech",
  HealthTech: "vertical-saas",
  EdTech: "vertical-saas",
  LegalTech: "vertical-saas",
  "Real Estate / PropTech": "vertical-saas",
  "E-commerce": "vertical-saas",
};

// First industry with a known vertical wins; generic ones (B2B, SaaS, AI) fall
// through to the marketplace default.
export function verticalFor(industries: string[]): Vertical {
  for (const industry of industries) {
    const vertical = VERTICAL_BY_INDUSTRY[industry];
    if (vertical) return vertical;
  }
  return "default";
}

export function ctrForFollowers(followers: number): number {
  return (CTR_BY_TIER.find((t) => followers <= t.maxFollowers) ?? CTR_BY_TIER[CTR_BY_TIER.length - 1]).ctr;
}

function confidenceFor(creatorsWithReach: number): Confidence {
  if (creatorsWithReach >= CONFIDENCE_THRESHOLDS.high) return "High";
  if (creatorsWithReach >= CONFIDENCE_THRESHOLDS.medium) return "Medium";
  return "Low";
}

export function estimate(creators: EstimatorCreator[], vertical: Vertical): Estimate {
  const withReach = creators.filter((c) => c.medianViews > 0);
  const estClicks = Math.round(withReach.reduce((sum, c) => sum + c.medianViews * ctrForFollowers(c.followers), 0));
  const totalSpendCents = creators.reduce((sum, c) => sum + c.priceCents, 0);
  const benchmarkCplCents = CPL_BY_VERTICAL[vertical];
  const leadsBySpend = totalSpendCents / benchmarkCplCents;
  const leadsByFunnel = estClicks * CLICK_TO_LEAD;
  const estLeads = Math.round(Math.min(leadsBySpend, leadsByFunnel));
  return {
    creators: creators.length,
    creatorsWithReach: withReach.length,
    estClicks,
    estLeads,
    estCplCents: estLeads > 0 ? Math.round(totalSpendCents / estLeads) : null,
    estCpcCents: estClicks > 0 ? Math.round(totalSpendCents / estClicks) : null,
    totalSpendCents,
    vertical,
    benchmarkCplCents,
    confidence: confidenceFor(withReach.length),
    sourceNote: ESTIMATOR_SOURCE_NOTE,
  };
}
