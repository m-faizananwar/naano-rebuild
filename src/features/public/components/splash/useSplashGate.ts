"use client";

import { useSyncExternalStore } from "react";
import { isSplashDone, onSplashDone } from "./splash-events";

// true once the landing splash has finished (immediately on pages without it
// once something marks it done, and on the server). Entrances key off it so
// nothing plays behind the overlay.
export function useSplashGate(): boolean {
  return useSyncExternalStore(onSplashDone, isSplashDone, () => false);
}
