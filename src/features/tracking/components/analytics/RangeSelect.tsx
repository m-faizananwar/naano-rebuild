"use client";

import { usePathname, useRouter } from "next/navigation";

const OPTIONS = [
  { value: "all", label: "All time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

// "All time" select from naano's analytics header; drives the URL so the server re-queries.
export function RangeSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Period</span>
      <select
        value={value}
        onChange={(e) => router.push(e.target.value === "all" ? pathname : `${pathname}?range=${e.target.value}`)}
        className="h-9 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
