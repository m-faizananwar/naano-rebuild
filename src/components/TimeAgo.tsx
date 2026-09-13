"use client";

import { useRef, useSyncExternalStore } from "react";
import { timeAgo } from "@/lib/dates";

const subscribeNever = () => () => undefined;

// "2 hours ago" without a hydration mismatch: the server renders the
// fallback, the client fills the relative time in once after hydration
// (server and browser clocks — UTC vs the user's zone — never both render it).
export function TimeAgo({ iso, fallback = "—" }: { iso: string | null | undefined; fallback?: string }) {
  const at = useRef(0);
  const now = useSyncExternalStore(subscribeNever, () => at.current || (at.current = Date.now()), () => 0);
  return <>{now ? timeAgo(iso, fallback, now) : fallback}</>;
}
