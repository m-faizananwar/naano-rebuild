import { describe, expect, it } from "vitest";
import { cpmCents, priceFromCpmCents } from "./cpm";

describe("cpm", () => {
  it("is post cost per thousand views", () => {
    // 188 € for 17,300 views ≈ 10.87 € per 1,000 views
    expect(cpmCents(18800, 17300)).toBe(1087);
  });

  it("is null without reach", () => {
    expect(cpmCents(18800, 0)).toBeNull();
  });

  it("round-trips through the pricing explanation", () => {
    expect(priceFromCpmCents(1087, 17300)).toBe(18805);
  });
});
