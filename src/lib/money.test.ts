import { describe, expect, it } from "vitest";
import { formatCents, toCents } from "./money";

describe("money", () => {
  it("converts decimal amounts to integer cents without float drift", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(0)).toBe(0);
  });

  it("formats cents as currency", () => {
    expect(formatCents(123456)).toBe("$1,234.56");
    // Intl uses a non-breaking space before the symbol in de-DE.
    expect(formatCents(5, "EUR", "de-DE")).toBe("0,05\u00a0€");
  });
});
