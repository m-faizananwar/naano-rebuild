"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants";

// naano's dark "Cookies" pill bottom-right on the public site: a two-line
// notice with a link to the cookie section and an OK, remembered per browser.
export function CookiesPill() {
  const [state, setState] = useState<"hidden" | "pill" | "open">("hidden");
  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(STORAGE_KEYS.cookies) === "1";
    } catch {
      /* storage blocked */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after mount
    setState(ok ? "hidden" : "pill");
  }, []);
  if (state === "hidden") return null;
  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.cookies, "1");
    } catch {
      /* storage blocked */
    }
    setState("hidden");
  };
  return state === "pill" ? (
    <button type="button" onClick={() => setState("open")} className="pointer-events-auto h-10 rounded-full bg-foreground px-4 text-sm font-medium text-background shadow-lg hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
      Cookies
    </button>
  ) : (
    <div role="dialog" aria-label="Cookie notice" className="pointer-events-auto w-[min(320px,calc(100vw-2rem))] rounded-2xl bg-foreground p-4 text-sm text-background shadow-xl">
      <p>One session cookie when you sign in, one click cookie on tracked links. No ads, no analytics.</p>
      <p className="mt-1 text-background/70">
        <Link href="/privacy#cookies" className="underline underline-offset-2 hover:text-background">Cookie notice</Link>
      </p>
      <button type="button" onClick={accept} className="mt-3 h-9 rounded-full bg-background px-4 text-sm font-semibold text-foreground hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60">
        OK
      </button>
    </div>
  );
}
