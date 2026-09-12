"use client";

import Link from "next/link";
import { formatCents } from "@/lib/money";
import { useWallet } from "../WalletProvider";

// Brand → Billing, creator → Earnings. Reads the optimistic balance so top-ups
// and withdrawals move the chip before the server round-trip.
export function WalletChip({ role, walletCents }: { role: "brand" | "creator"; walletCents: number }) {
  const wallet = useWallet(walletCents);
  const href = role === "brand" ? "/brand/billing" : "/creator/earnings";
  return (
    <Link
      href={href}
      aria-label={`Wallet: ${formatCents(wallet.walletCents, "EUR")}. ${role === "brand" ? "Open billing" : "Open earnings"}`}
      className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold tabular-nums transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
      {formatCents(wallet.walletCents, "EUR")}
    </Link>
  );
}
