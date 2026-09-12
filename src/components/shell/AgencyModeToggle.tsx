"use client";

import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";

// naano's brand sidebar starts with an "Agency mode" switch (manage several
// client workspaces). Visual only here: it flips a label and changes no data.
export function AgencyModeToggle() {
  const id = useId();
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <label htmlFor={id} className="grid gap-0.5 text-sm">
        <span className="font-medium">Agency mode</span>
        <span className="text-[11px] text-muted-foreground">{on ? "On · visual only in this build" : "Off · visual only in this build"}</span>
      </label>
      <Switch id={id} checked={on} onCheckedChange={setOn} aria-label="Agency mode (visual only in this build)" />
    </div>
  );
}
