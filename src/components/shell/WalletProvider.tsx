"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type WalletContextValue = { walletCents: number; setWalletCents: (cents: number) => void };

const WalletContext = createContext<WalletContextValue | null>(null);

// The top-bar chip is server-rendered from the viewer; screens that move money
// (billing top-ups, withdrawals) push their optimistic balance here so the chip
// follows immediately and rolls back with them. router.refresh() re-syncs it.
export function WalletProvider({ initialCents, children }: { initialCents: number; children: ReactNode }) {
  const [walletCents, setWalletCents] = useState(initialCents);
  // Re-sync when the server sends a fresh balance (after router.refresh()).
  const [syncedCents, setSyncedCents] = useState(initialCents);
  if (syncedCents !== initialCents) {
    setSyncedCents(initialCents);
    setWalletCents(initialCents);
  }
  return <WalletContext.Provider value={{ walletCents, setWalletCents }}>{children}</WalletContext.Provider>;
}

export function useWallet(fallbackCents = 0): WalletContextValue {
  const ctx = useContext(WalletContext);
  return ctx ?? { walletCents: fallbackCents, setWalletCents: () => undefined };
}
