"use client";

import { CalendarCheck, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { nextWeekdaySlots } from "./nextWeekdaySlots";

type Slot = { iso: string; time: string; label: string };

// naano embeds a Google Calendar appointment page here. This picker is the
// stand-in: pick a slot, "Book my onboarding" toasts, nothing is written.
export function SlotPicker() {
  const days = useMemo(() => nextWeekdaySlots(new Date()), []);
  const [slot, setSlot] = useState<Slot | null>(null);

  function book() {
    if (!slot) return;
    toast.success(`Booked (demo) — ${slot.label} at ${slot.time}`, { description: "Nothing was written; no calendar in this build." });
  }

  return (
    <div className="grid gap-4">
      <div role="radiogroup" aria-label="Available slots" className="grid gap-3 sm:grid-cols-5">
        {days.map((day) => (
          <div key={day.iso} className="grid gap-1.5">
            <p className="text-xs font-semibold text-muted-foreground">{day.label}</p>
            {day.times.map((time) => {
              const selected = slot?.iso === day.iso && slot.time === time;
              return (
                <button
                  key={time}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSlot({ iso: day.iso, time, label: day.label })}
                  className="rounded-lg border px-2 py-1.5 text-sm tabular-nums transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-checked:border-brand aria-checked:bg-brand aria-checked:text-brand-foreground"
                >
                  {time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={book} disabled={!slot} className="bg-brand text-brand-foreground hover:bg-brand/90">
          <CalendarCheck aria-hidden="true" /> Book my onboarding
        </Button>
        <Button type="button" variant="outline" disabled title="No calendar provider in this build">
          <ExternalLink aria-hidden="true" /> Open calendar in a new tab
        </Button>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {slot ? `${slot.label} · ${slot.time} · 15 min` : "Pick a slot. The calendar link is disabled: no provider is wired in this build."}
        </p>
      </div>
    </div>
  );
}
