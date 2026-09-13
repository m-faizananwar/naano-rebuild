"use client";

import { useId } from "react";
import { Switch } from "@/components/ui/switch";
import { useAgentMode } from "@/features/assistant/components/agentMode";

// "Agent mode": on, the assistant can be called — a phone button on the pill
// and a "Call Amplio" item in the sidebar open the full-page call.
export function AgencyModeToggle() {
  const id = useId();
  const [on, setOn] = useAgentMode();
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <label htmlFor={id} className="grid gap-0.5 text-sm">
        <span className="font-medium">Agent mode</span>
        <span className="text-[11px] text-muted-foreground">{on ? "On · call Amplio from the sidebar or the pill" : "Off"}</span>
      </label>
      <Switch id={id} checked={on} onCheckedChange={setOn} aria-label="Agent mode" />
    </div>
  );
}
