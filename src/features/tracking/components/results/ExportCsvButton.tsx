"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SPINNER_MS = 600;

// Shows a short spinner, then hands the browser the CSV (a normal navigation to the export route).
export function ExportCsvButton({ href, label, size = "sm", variant = "outline" }: { href: string; label: string; size?: "sm" | "xs"; variant?: "outline" | "ghost" }) {
  const [busy, setBusy] = useState(false);
  function start() {
    setBusy(true);
    window.setTimeout(() => {
      window.location.assign(href);
      setBusy(false);
    }, SPINNER_MS);
  }
  return (
    <Button type="button" variant={variant} size={size} onClick={start} disabled={busy} aria-busy={busy}>
      {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />} {label}
    </Button>
  );
}
