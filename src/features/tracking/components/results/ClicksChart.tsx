"use client";

import Link from "next/link";
import { DrawnChart } from "@/components/motion/DrawnChart";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesRange } from "../../constants";
import type { SeriesPoint } from "../../server/queries";

// naano draws every line chart on mount: 2.5s ease-out after a 0.5s delay.

const RANGES: Array<{ key: SeriesRange; label: string }> = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

export function ClicksChart({ series, range, basePath }: { series: SeriesPoint[]; range: SeriesRange; basePath: string }) {
  const total = series.reduce((sum, p) => sum + p.clicks, 0);
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Performance over time</h2>
          <p className="text-sm text-muted-foreground">Qualified clicks · {total.toLocaleString("en-US")} in this range</p>
        </div>
        <div role="group" aria-label="Range" className="inline-flex rounded-lg border p-0.5 text-xs font-semibold">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={`${basePath}?range=${r.key}`}
              aria-current={range === r.key ? "page" : undefined}
              className="rounded-md px-3 py-1.5 text-muted-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>
      <DrawnChart replayKey={range} className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} minTickGap={24} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, borderColor: "var(--color-border)", fontSize: 12 }} />
            <Line type="monotone" dataKey="clicks" stroke="var(--color-brand)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </DrawnChart>
    </section>
  );
}
