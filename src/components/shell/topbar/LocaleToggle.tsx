"use client";

import { useState } from "react";

const LOCALES = ["EN", "FR"] as const;

// Visual only: FR is a real locale on naano; this build ships English strings
// and the toggle re-renders the same copy (the README says so).
export function LocaleToggle() {
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("EN");
  return (
    <div role="group" aria-label="Language (English only in this build)" className="inline-flex h-9 items-center rounded-lg border p-0.5 text-xs font-semibold">
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className="rounded-md px-2.5 py-1.5 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-pressed:bg-foreground aria-pressed:text-background"
        >
          {code}
        </button>
      ))}
    </div>
  );
}
