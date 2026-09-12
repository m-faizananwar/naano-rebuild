"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type BriefDoc, briefToMarkdown } from "@/lib/brief-markdown";
import { useCopyToClipboard } from "./useCopyToClipboard";

export function CopyMarkdownButton({ brief }: { brief: BriefDoc }) {
  const copy = useCopyToClipboard();
  return (
    <Button
      type="button"
      className="bg-brand text-brand-foreground hover:bg-brand/90"
      onClick={() => copy(briefToMarkdown(brief), "Brief copied as Markdown")}
    >
      <Copy data-icon="inline-start" aria-hidden="true" />
      Copy as Markdown
    </Button>
  );
}
