"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { ledgerEntries } from "@/db/schema";
import { getViewer } from "@/features/auth/server/session";
import { type ActionResult, type WithdrawInput, withdrawSchema } from "../schemas";
import { getEarningsSummary } from "./queries";

const REF_BYTES = 3;

// Withdrawal = a completed ledger row. There is no Stripe or bank rail in this
// build; the README says so. The balance check is the real part.
export async function withdrawEarnings(input: WithdrawInput): Promise<ActionResult<{ availableCents: number }>> {
  const viewer = await getViewer();
  if (!viewer?.creator) return { ok: false, error: "Sign in as a creator to withdraw." };
  const parsed = withdrawSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid amount" };

  const summary = await getEarningsSummary(viewer.creator.id);
  if (parsed.data.amountCents > summary.availableCents) {
    return { ok: false, error: "That is more than your available balance." };
  }
  try {
    await getDb().insert(ledgerEntries).values({
      creatorId: viewer.creator.id,
      type: "withdrawal",
      status: "completed",
      amountCents: -parsed.data.amountCents,
      reference: `WD-${randomBytes(REF_BYTES).toString("hex").toUpperCase()}`,
      description: parsed.data.method === "stripe" ? "Withdrawal · Stripe (instant)" : "Withdrawal · Bank transfer",
    });
  } catch (error) {
    console.error("[payouts] withdrawal failed", { creatorId: viewer.creator.id, error });
    return { ok: false, error: "We couldn't record the withdrawal. Nothing was moved." };
  }
  revalidatePath("/creator/earnings");
  return { ok: true, data: { availableCents: summary.availableCents - parsed.data.amountCents } };
}
