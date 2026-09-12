import { describe, expect, it } from "vitest";
import { parseMarketplaceQuery, sendOfferSchema } from "./schemas";

describe("parseMarketplaceQuery", () => {
  it("applies defaults for an empty URL", () => {
    expect(parseMarketplaceQuery({})).toEqual({ tab: "all", sort: "best", industry: [], country: [], min: undefined, max: undefined, page: 1, activity: "any" });
  });

  it("reads csv filters, euro prices and the page", () => {
    const q = parseMarketplaceQuery({ industry: "AI,SaaS", country: ["FR"], min: "100", max: "600", page: "3", sort: "price", tab: "shortlist" });
    expect(q.industry).toEqual(["AI", "SaaS"]);
    expect(q.country).toEqual(["FR"]);
    expect(q.min).toBe(10000);
    expect(q.max).toBe(60000);
    expect(q.page).toBe(3);
    expect(q.sort).toBe("price");
    expect(q.tab).toBe("shortlist");
  });

  it("falls back instead of throwing on junk", () => {
    const q = parseMarketplaceQuery({ sort: "nope", page: "-4", min: "abc", campaign: "not-a-uuid" });
    expect(q.sort).toBe("best");
    expect(q.page).toBe(1);
    expect(q.min).toBeUndefined();
    expect(q.campaign).toBeUndefined();
  });
});

describe("sendOfferSchema", () => {
  const base = {
    campaignId: "5d18809f-c849-48e6-ba29-c6c3ecd5d7bd",
    creatorId: "5d18809f-c849-48e6-ba29-c6c3ecd5d7bd",
    discountPercent: 20,
    postBy: "2026-09-26",
    approveBeforePublish: true,
  };
  it("enforces the marketplace floor and the platform cap", () => {
    expect(sendOfferSchema.safeParse({ ...base, offerCents: 1000 }).success).toBe(false);
    expect(sendOfferSchema.safeParse({ ...base, offerCents: 200000 }).success).toBe(false);
    expect(sendOfferSchema.safeParse({ ...base, offerCents: 26800 }).success).toBe(true);
  });
});
