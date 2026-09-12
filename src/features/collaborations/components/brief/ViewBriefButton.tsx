"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BriefDto } from "../../schemas";
import { BriefDrawer } from "./BriefDrawer";

type Props = { brief: BriefDto; label?: string; variant?: "outline" | "ghost" | "default"; className?: string };

// The "View the brief" button and the drawer it opens, in one client island.
export function ViewBriefButton({ brief, label = "View the brief", variant = "outline", className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant={variant} className={className} onClick={() => setOpen(true)}>
        <FileText data-icon="inline-start" aria-hidden="true" />
        {label}
      </Button>
      <BriefDrawer brief={brief} open={open} onOpenChange={setOpen} />
    </>
  );
}
