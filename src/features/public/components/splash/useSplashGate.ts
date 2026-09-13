"use client";

import { useSyncExternalStore } from "react";
import { isSplashDone, onSplashDone } from "./splash-events";

// true once the landing splash has finished — or right away on a page that
// has no splash (the overlay carries data-splash). Entrances key off it so
// nothing plays behind the overlay; the server snapshot is false.
const snapshot = () => isSplashDone() || !document.querySelector("[data-splash]");
export function useSplashGate(): boolean {
  return useSyncExternalStore(onSplashDone, snapshot, () => false);
}
