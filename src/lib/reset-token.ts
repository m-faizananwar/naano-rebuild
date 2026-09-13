// Password reset token lifecycle, pure. The db row carries expiresAt and
// usedAt; the server hashes the raw token and looks the row up by hash.
const MINUTE_MS = 60_000;
const RESET_TOKEN_TTL_MINUTES = 30;
export const RESET_TOKEN_TTL_MS = RESET_TOKEN_TTL_MINUTES * MINUTE_MS;

export type ResetTokenRow = { expiresAt: Date; usedAt: Date | null };
export type ResetTokenState = "valid" | "expired" | "used";

export function resetTokenExpiry(now: number): Date {
  return new Date(now + RESET_TOKEN_TTL_MS);
}

// "used" wins over "expired": a consumed token stays consumed however old it is.
export function resetTokenState(row: ResetTokenRow, now: number): ResetTokenState {
  if (row.usedAt) return "used";
  if (row.expiresAt.getTime() <= now) return "expired";
  return "valid";
}
