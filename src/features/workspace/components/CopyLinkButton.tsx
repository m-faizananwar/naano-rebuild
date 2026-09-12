"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ value, label, variant = "default" }: { value: string; label: string; variant?: "default" | "outline" }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }
  return (
    <Button type="button" variant={variant} onClick={copy}>
      <Copy aria-hidden="true" /> {label}
    </Button>
  );
}
