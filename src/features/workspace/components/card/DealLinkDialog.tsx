"use client";

import { Check, Copy, Mail, MessageSquareShare, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { url: string; handle: string };

const SHARE_TEXT = "My Naano creator card — positioning, audience and price per post, in one link.";

// "Copy or share my Deal Link": the public card URL with a real clipboard copy
// and real share intents (LinkedIn share, X intent, mailto).
export function DealLinkDialog({ url, handle }: Props) {
  const [copied, setCopied] = useState(false);
  const shares = [
    { label: "Share on LinkedIn", icon: MessageSquareShare, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "Post on X", icon: Share2, href: `https://x.com/intent/post?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}` },
    { label: "Send by email", icon: Mail, href: `mailto:?subject=${encodeURIComponent(`My Naano card (@${handle})`)}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${url}`)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Deal Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <Dialog onOpenChange={(open) => !open && setCopied(false)}>
      <DialogTrigger render={<Button />}>
        <Share2 aria-hidden="true" /> Copy or share my Deal Link
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Copy or share my Deal Link</DialogTitle>
          <DialogDescription>Put it on LinkedIn. Earn when a brand joins through it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="deal-link">Your public card</Label>
          <div className="flex gap-2">
            <Input id="deal-link" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" />
            <Button type="button" onClick={copy} className="shrink-0">
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {shares.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <s.icon aria-hidden="true" /> {s.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Brands who sign up through this link count towards your affiliate share.</p>
      </DialogContent>
    </Dialog>
  );
}
