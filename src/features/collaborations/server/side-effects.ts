import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { brands, campaigns, collaborations, ledgerEntries, trackingLinks } from "@/db/schema";

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type Collab = typeof collaborations.$inferSelect;

const CODE_BYTES = 4;
const REF_BYTES = 3;

export class InsufficientFundsError extends Error {
  constructor(readonly shortfallCents: number) {
    super("Wallet balance does not cover this booking");
    this.name = "InsufficientFundsError";
  }
}

function reference(prefix: string) {
  return `${prefix}-${randomBytes(REF_BYTES).toString("hex").toUpperCase()}`;
}

async function brandForCollab(tx: Tx, collab: Collab) {
  const [row] = await tx
    .select({ brand: brands })
    .from(campaigns)
    .innerJoin(brands, eq(brands.id, campaigns.brandId))
    .where(eq(campaigns.id, collab.campaignId));
  if (!row) throw new Error(`campaign ${collab.campaignId} not found`);
  return row.brand;
}

// Funded booking: hold the fee from the brand's wallet as a pending ledger
// entry. Invitations do this when sent; applications when the brand accepts.
export async function holdBookingFee(tx: Tx, collab: Collab) {
  const brand = await brandForCollab(tx, collab);
  if (brand.walletCents < collab.feeCents) throw new InsufficientFundsError(collab.feeCents - brand.walletCents);
  await tx.insert(ledgerEntries).values({
    brandId: brand.id,
    collaborationId: collab.id,
    type: "booking",
    status: "pending",
    amountCents: -collab.feeCents,
    reference: reference("BK"),
    description: `Booking · ${brand.company}`,
  });
  await tx.update(brands).set({ walletCents: sql`${brands.walletCents} - ${collab.feeCents}` }).where(eq(brands.id, brand.id));
}

// A declined invitation gives the held fee back.
export async function releaseBookingFee(tx: Tx, collab: Collab) {
  const brand = await brandForCollab(tx, collab);
  const released = await tx
    .delete(ledgerEntries)
    .where(and(eq(ledgerEntries.collaborationId, collab.id), eq(ledgerEntries.type, "booking"), eq(ledgerEntries.status, "pending")))
    .returning({ amountCents: ledgerEntries.amountCents });
  const refund = released.reduce((sum, r) => sum - r.amountCents, 0);
  if (refund > 0) await tx.update(brands).set({ walletCents: sql`${brands.walletCents} + ${refund}` }).where(eq(brands.id, brand.id));
}

export async function ensureTrackingLink(tx: Tx, collab: Collab) {
  const brand = await brandForCollab(tx, collab);
  await tx
    .insert(trackingLinks)
    .values({ collaborationId: collab.id, code: randomBytes(CODE_BYTES).toString("hex"), destination: brand.website ?? "https://naano.com" })
    .onConflictDoNothing();
}

// Live: the creator sees the fee as "awaiting release". Paid: booking settles,
// payout completes.
export async function recordPayout(tx: Tx, collab: Collab, status: "pending" | "completed") {
  const brand = await brandForCollab(tx, collab);
  if (status === "completed") {
    await tx
      .update(ledgerEntries)
      .set({ status: "completed" })
      .where(and(eq(ledgerEntries.collaborationId, collab.id), eq(ledgerEntries.type, "booking")));
    await tx
      .update(ledgerEntries)
      .set({ status: "completed" })
      .where(and(eq(ledgerEntries.collaborationId, collab.id), eq(ledgerEntries.type, "payout")));
    return;
  }
  await tx.insert(ledgerEntries).values({
    creatorId: collab.creatorId,
    collaborationId: collab.id,
    type: "payout",
    status,
    amountCents: collab.feeCents,
    reference: reference("PO"),
    description: `Payout · ${brand.company}`,
  });
}
