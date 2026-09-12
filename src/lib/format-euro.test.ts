import { describe, expect, it } from "vitest";
import { formatCompact, formatEuro, formatEuroAmount } from "./format-euro";

describe("formatEuro", () => {
  it("prints whole euros without decimals", () => {
    expect(formatEuro(18800)).toBe("188 €");
  });
  it("keeps discount decimals", () => {
    expect(formatEuro(16920)).toBe("169.2 €");
    expect(formatEuroAmount(13160)).toBe("131.6");
  });
  it("groups thousands with a narrow space", () => {
    expect(formatEuro(562500)).toBe("5 625 €");
    expect(formatEuroAmount(150000000)).toBe("1 500 000");
  });
});

describe("formatCompact", () => {
  it("abbreviates thousands and millions", () => {
    expect(formatCompact(17300)).toBe("17.3K");
    expect(formatCompact(2070)).toBe("2.1K");
    expect(formatCompact(1_000_000)).toBe("1M");
    expect(formatCompact(950)).toBe("950");
  });
});
