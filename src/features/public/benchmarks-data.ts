import { BRAND } from "@/config/brand";
// naano's Q2 2026 benchmark report (data window Q1 2026), from the market
// notes and the /benchmarks screenshot. First-party marketing figures.

export const BENCHMARKS = {
  hero: {
    eyebrow: "Q2 2026 benchmark report · 14 min read · EN",
    title: "B2B Creator-Led Growth Benchmarks: Q2 2026",
    sub: `First-party CPL, CTR, and conversion data from ~300 vetted B2B nano-creators on ${BRAND.name}. Methodology, sample sizes, and per-vertical breakdowns.`,
    meta: `Published April 27, 2026 · Authored by the ${BRAND.name} team · Sample: 312 campaigns, 1,847 sponsored posts, Q1 2026`,
  },
  editorialNote:
    `Editorial note (July 14, 2026): the data in this report was measured in Q1 2026 under ${BRAND.name}'s earlier cost-per-click pricing model. Since then, ${BRAND.name} has moved to creator-defined fixed-price offers. The performance benchmarks below (CPL, CTR, conversion) remain valid as historical Q1 2026 data.`,
  intro:
    `This is the first edition of ${BRAND.name}'s quarterly benchmark report on B2B creator-led growth. It publishes the CPL, CTR, time-to-launch and conversion data from every campaign that ran on the ${BRAND.name} marketplace during Q1 2026. Numbers are first-party measurements, not estimates, and every table includes the sample size behind it.`,
  summary: [
    `Average CPL on ${BRAND.name} in Q1 2026 was €18.10 across 312 campaigns, ~67–80% below typical LinkedIn Ads CPL for comparable B2B SaaS audiences (€55–€90). The lowest vertical (marketing-ops, median €16) and the highest (vertical SaaS, median €21) bracket a tighter-than-expected distribution.`,
    "CTR on creator-led posts averaged 12.0% across 1,847 posts, roughly 15× the LinkedIn Sponsored Content benchmark (0.8%). CTR scales inversely with creator follower count: 1k–3k creators clocked 13.8% median CTR, 10k+ creators clocked 8.7%.",
    "Median time-to-launch was 7 days from brief submission to first post live, with a p25 of 5 days and a p90 of 16 days.",
  ],
  headline: [
    { value: "312", label: "Campaigns" },
    { value: "89", label: "Brands" },
    { value: "1,847", label: "Sponsored posts" },
    { value: "€18.10", label: "Average CPL" },
    { value: "12.0%", label: "Average CTR" },
    { value: "€2.30", label: "Average CPC" },
  ],
  methodology: [
    { label: "Data window", text: "2026-01-01 to 2026-03-31 (Q1 2026)." },
    { label: "Sample", text: `312 campaigns from 89 distinct brands; 1,847 individual sponsored posts; ~300 active creators from the ${BRAND.name} roster.` },
    { label: "Qualified click", text: `A click that carries a ${BRAND.name} tracking parameter, resolves to the brand's landing page, and records 30+ seconds of on-site engagement. Bots are filtered server-side; visits are deduplicated to one per IP per hour.` },
    { label: "Vertical", text: "Campaigns are tagged at brief creation with one of sales-tech, RevOps, devtools, product, HR-tech, fintech, marketing-ops or vertical SaaS." },
    { label: "Statistics", text: "\"Average\" refers to the mean unless otherwise noted. Percentiles are computed on the full underlying distribution, not on per-campaign aggregates." },
  ],
  vsAds: {
    title: "Headline benchmarks",
    body: `The metrics most often cited in B2B SaaS budget conversations. ${BRAND.name} figures are Q1 2026 means; LinkedIn Ads ranges reflect publicly reported values for B2B SaaS audiences in EU and US markets.`,
    columns: ["Metric", `${BRAND.name} (Q1 2026)`, "LinkedIn Ads benchmark", "Delta"],
    rows: [
      ["Average CPL (cost per lead)", "€18.10", "€55–€90 (LinkedIn Ads, B2B SaaS)", "−67% to −80%"],
      ["Average CTR (sponsored content)", "12.0%", "0.8% (LinkedIn B2B Marketing Benchmark 2025)", "+15× absolute"],
      ["Average CPC (per qualified click)", "€2.30", "€8–€15 (LinkedIn Ads CPC range)", "−71% to −85%"],
      ["Time-to-launch (brief → first post)", "7 days (median)", "21–35 days (typical agency)", "−67% to −80%"],
      ["Reply rate, warm outbound to post engagers", "39.6%", "~5% (cold outbound industry avg)", "+8× absolute"],
    ],
    footnote: "Sample: 312 campaigns / 1,847 posts / 89 brands. CPL = total paid spend ÷ qualified leads. CTR = qualified clicks ÷ impressions reported by LinkedIn at post level.",
  },
  ctrByTier: {
    title: "CTR by creator tier",
    body: "Smaller creators get higher click-through: their audiences are narrower and self-selected around a topic, so a sponsored post reads like a recommendation rather than an ad.",
    columns: ["Creator size", "Median CTR", "Read"],
    rows: [
      ["1k–3k followers", "13.8%", "Highest CTR; niche, high-trust audiences"],
      ["3k–7k followers", "12.1%", "At platform average"],
      ["7k–10k followers", "10.4%", "Reach grows faster than click quality"],
      ["10k+ followers", "8.7%", "Still ~11× the LinkedIn Ads baseline"],
    ],
  },
  cplByVertical: {
    title: "CPL by vertical",
    body: "CPL varies primarily with creator supply and audience density. Verticals with deep creator pools and highly self-identified audiences (sales-tech, marketing-ops) come in below the platform mean of €18; sparse-supply verticals (vertical SaaS, HR-tech) trend higher.",
    columns: ["Vertical", "CPL p10", "CPL median", "CPL p90", "N campaigns"],
    rows: [
      ["Sales-tech", "€11", "€16", "€23", "n=58"],
      ["RevOps", "€12", "€17", "€24", "n=41"],
      ["Devtools", "€13", "€19", "€26", "n=47"],
      ["Product", "€12", "€18", "€25", "n=39"],
      ["HR-tech", "€14", "€20", "€27", "n=34"],
      ["Fintech", "€13", "€19", "€26", "n=29"],
      ["Marketing-ops", "€10", "€16", "€22", "n=36"],
      ["Vertical SaaS", "€14", "€21", "€28", "n=28"],
    ],
  },
  funnel: {
    title: "Conversion benchmarks",
    body: "Measured on the 104 campaigns that connected a pixel through to CRM stage data.",
    steps: [
      { label: "Click → 30s+ engagement", value: "67%" },
      { label: "Engagement → demo", value: "8.3%" },
      { label: "Demo → SQL", value: "41%" },
      { label: "Cost per SQL", value: "≈ €530" },
    ],
    note: "Implied qualified-click → SQL conversion across the full funnel is approximately 3.4%.",
  },
  timeToLaunch: [
    { label: "p25", value: "5 days" },
    { label: "Median", value: "7 days" },
    { label: "p90", value: "16 days" },
  ],
  caveats: [
    "All numbers are first-party marketing claims of naano.com (the reference product) from a single quarter; they are not independently audited.",
    "Brands self-select into creator-led campaigns, so results are not a randomized comparison against LinkedIn Ads.",
    "The Q1 2026 data was measured under the earlier cost-per-click pricing model.",
  ],
  cite: `${BRAND.name} (2026). B2B Creator-Led Growth Benchmarks: Q2 2026. Source data: naano.com/benchmarks/q2-2026.`,
} as const;
