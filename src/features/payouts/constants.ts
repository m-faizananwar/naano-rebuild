export const EARNINGS_MONTHS = 6;
export const MIN_WITHDRAWAL_CENTS = 1_000;
export const PAYOUT_METHODS = ["stripe", "bank"] as const;
export type PayoutMethod = (typeof PAYOUT_METHODS)[number];
export const TOPUP_PRESETS_CENTS = [250_000, 500_000, 1_000_000, 2_500_000] as const;
export const MIN_TOPUP_CENTS = 50_000;
