"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { McpClientSetup } from "./mcpClientsFor";

import { BRAND } from "@/config/brand";
export function McpSetupDialog({ setup, url }: { setup: McpClientSetup; url: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("MCP URL copied");
    } catch {
      toast.error("Could not copy the URL");
    }
  }
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>{setup.triggerLabel}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{setup.title}</DialogTitle>
          <DialogDescription>{setup.lead}</DialogDescription>
        </DialogHeader>
        <ol className="grid gap-3">
          {setup.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="rounded-lg bg-muted px-3 py-2 font-mono text-xs break-all">{url}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={copy}>
            <Copy aria-hidden="true" /> Copy MCP URL
          </Button>
          <Button type="button" variant="outline" disabled title="Not part of this build">
            {setup.secondary}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">The endpoint itself is not part of this build; the setup flow is documented as naano shows it.</p>
      </DialogContent>
    </Dialog>
  );
}
