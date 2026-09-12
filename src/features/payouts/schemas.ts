import { z } from "zod";
import { MIN_WITHDRAWAL_CENTS, PAYOUT_METHODS } from "./constants";

export const withdrawSchema = z.object({
  amountCents: z.number().int().min(MIN_WITHDRAWAL_CENTS, "Minimum withdrawal is €10"),
  method: z.enum(PAYOUT_METHODS),
});
export type WithdrawInput = z.infer<typeof withdrawSchema>;

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export type LedgerRowDto = {
  id: string;
  date: string;
  type: "topup" | "booking" | "payout" | "withdrawal";
  status: "pending" | "completed";
  amountCents: number;
  reference: string;
  description: string;
};
