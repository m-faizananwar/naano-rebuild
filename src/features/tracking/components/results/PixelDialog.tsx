"use client";

import { Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function pixelSnippet(origin: string, siteKey: string) {
  return [
    "<script> window.naano = window.naano || function(){ (window.naano.q = window.naano.q || []).push(arguments); }; </script>",
    `<script async src="${origin}/n.js" data-site="${siteKey}"></script>`,
  ].join("\n");
}

export function PixelDialog({ siteKey, origin, active }: { siteKey: string; origin: string; active: boolean }) {
  const snippet = pixelSnippet(origin, siteKey);
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Snippet copied");
    } catch {
      toast.error("Could not copy — select the snippet and copy it manually");
    }
  }
  return (
    <Dialog>
      <DialogTrigger render={<Button variant={active ? "outline" : "default"} />}>{active ? "View the snippet" : "Install the pixel"}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pixel Naano — {active ? "Active" : "Not installed yet"}</DialogTitle>
          <DialogDescription>
            Track visits and conversions from your creators&apos; posts. Installation: 2 minutes. Paste this snippet before
            &lt;/head&gt; on every page of your site, hardcoded or via Google Tag Manager. Visits attribute themselves; for
            sign-ups and purchases, call naano(&apos;track&apos;, …) in your product only after the corresponding action succeeds.
            From the first event received, the status above switches to Active.
          </DialogDescription>
        </DialogHeader>
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{snippet}</pre>
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{`naano('track', 'signup', { email });\nnaano('track', 'purchase', { value: 49, order_id });`}</pre>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={copy}>
            <Copy aria-hidden="true" /> Copy the snippet
          </Button>
          <Link href={`/demo/landing?site=${siteKey}`} className={buttonVariants({ variant: "outline" })} target="_blank">
            Open the demo landing page →
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Your site key <code className="rounded bg-muted px-1">{siteKey}</code>. Install it once: it covers all your campaigns, past and future.
        </p>
      </DialogContent>
    </Dialog>
  );
}
