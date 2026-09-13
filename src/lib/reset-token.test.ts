import { describe, expect, it } from "vitest";
import { RESET_TOKEN_TTL_MS, resetTokenExpiry, resetTokenState } from "./reset-token";

describe("reset token lifecycle", () => {
  const issued = Date.UTC(2026, 8, 13, 12, 0, 0);
  const row = { expiresAt: resetTokenExpiry(issued), usedAt: null };

  it("expires exactly 30 minutes after issue", () => {
    expect(row.expiresAt.getTime() - issued).toBe(RESET_TOKEN_TTL_MS);
    expect(RESET_TOKEN_TTL_MS).toBe(30 * 60 * 1000);
  });

  it("is valid until the expiry, then expired", () => {
    expect(resetTokenState(row, issued)).toBe("valid");
    expect(resetTokenState(row, issued + RESET_TOKEN_TTL_MS - 1)).toBe("valid");
    expect(resetTokenState(row, issued + RESET_TOKEN_TTL_MS)).toBe("expired");
  });

  it("is single-use: once consumed it is used, even before expiry, and stays used after it", () => {
    const used = { ...row, usedAt: new Date(issued + 60_000) };
    expect(resetTokenState(used, issued + 120_000)).toBe("used");
    expect(resetTokenState(used, issued + RESET_TOKEN_TTL_MS + 1)).toBe("used");
  });
});
