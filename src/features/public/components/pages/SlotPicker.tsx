"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DAYS = 5;
const SLOTS = ["09:30", "11:00", "14:30", "16:00"];
const DAY_MS = 86_400_000;
const SATURDAY = 6;
const SUNDAY = 0;

function nextWeekdays(count: number) {
  const days: Date[] = [];
  let cursor = new Date();
  while (days.length < count) {
    cursor = new Date(cursor.getTime() + DAY_MS);
    const dow = cursor.getDay();
    if (dow !== SATURDAY && dow !== SUNDAY) days.push(cursor);
  }
  return days;
}

// Looks like the embedded calendar; books nothing (no calendar in this build).
export function SlotPicker() {
  const days = useMemo(() => nextWeekdays(DAYS), []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <div className="grid gap-4 rounded-xl border p-4">
      <div role="tablist" aria-label="Day" className="flex flex-wrap gap-2">
        {days.map((d, i) => (
          <button
            key={d.toISOString()}
            type="button"
            role="tab"
            aria-selected={day === i}
            onClick={() => {
              setDay(i);
              setSlot(null);
            }}
            className="rounded-lg border px-3 py-2 text-sm aria-selected:border-brand aria-selected:bg-brand/10 aria-selected:text-brand"
          >
            {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label="Time" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={slot === s}
            onClick={() => setSlot(s)}
            className="rounded-lg border px-3 py-2 text-sm aria-checked:border-brand aria-checked:bg-brand/10 aria-checked:text-brand"
          >
            {s}
          </button>
        ))}
      </div>
      <Button
        type="button"
        disabled={!slot}
        onClick={() => toast.success(`Booked (demo) · ${days[day].toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at ${slot}. Nothing was written — no calendar in this build.`)}
        className="rounded-full bg-foreground text-background hover:bg-foreground/90"
      >
        Book my call
      </Button>
    </div>
  );
}
