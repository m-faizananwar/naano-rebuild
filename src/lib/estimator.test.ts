import { describe, expect, it } from "vitest";
import { CPL_BY_VERTICAL, ctrForFollowers, estimate, verticalFor } from "./estimator";

describe("ctrForFollowers", () => {
  it("uses naano's tiers: smaller creators click through more", () => {
    expect(ctrForFollowers(1_500)).toBe(0.138);
    expect(ctrForFollowers(3_000)).toBe(0.138);
    expect(ctrForFollowers(5_000)).toBe(0.121);
    expect(ctrForFollowers(9_000)).toBe(0.104);
    expect(ctrForFollowers(50_000)).toBe(0.087);
  });
});

describe("verticalFor", () => {
  it("maps naano industries to a benchmark vertical, generic ones to the default", () => {
    expect(verticalFor(["B2B", "SaaS", "AI"])).toBe("default");
    expect(verticalFor(["B2B", "Sales"])).toBe("sales-tech");
    expect(verticalFor(["Fintech"])).toBe("fintech");
    expect(verticalFor([])).toBe("default");
  });
});

describe("estimate", () => {
  const creators = [
    { followers: 2_000, medianViews: 1_000, priceCents: 20_000 },
    { followers: 5_000, medianViews: 2_000, priceCents: 30_000 },
    { followers: 20_000, medianViews: 10_000, priceCents: 90_000 },
  ];

  it("applies tier CTR to median views", () => {
    const result = estimate(creators, "default");
    // 1000 × 13.8% + 2000 × 12.1% + 10000 × 8.7% = 138 + 242 + 870
    expect(result.estClicks).toBe(1_250);
    expect(result.totalSpendCents).toBe(140_000);
  });

  it("caps leads at the funnel rate and derives CPL / CPC from spend", () => {
    const result = estimate(creators, "default");
    // spend ÷ CPL = 140000 ÷ 1800 ≈ 77.8; funnel = 1250 × 8.3% ≈ 103.75 → min = 78
    expect(result.estLeads).toBe(78);
    expect(result.estCplCents).toBe(Math.round(140_000 / 78));
    expect(result.estCpcCents).toBe(112);
    expect(result.benchmarkCplCents).toBe(CPL_BY_VERTICAL.default);
  });

  it("labels confidence by creators with reach data", () => {
    expect(estimate(creators, "default").confidence).toBe("Medium");
    expect(estimate([creators[0]], "default").confidence).toBe("Low");
    const five = Array.from({ length: 5 }, () => creators[0]);
    expect(estimate(five, "default").confidence).toBe("High");
    const noReach = creators.map((c) => ({ ...c, medianViews: 0 }));
    expect(estimate(noReach, "default").confidence).toBe("Low");
  });

  it("has no CPL or CPC when nothing is selected", () => {
    const result = estimate([], "devtools");
    expect(result.estClicks).toBe(0);
    expect(result.estCplCents).toBeNull();
    expect(result.estCpcCents).toBeNull();
    expect(result.sourceNote).toContain("Q2 2026");
  });
});
