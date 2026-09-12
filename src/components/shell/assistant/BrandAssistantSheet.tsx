"use client";

import { BarChart3, Briefcase, Send, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { BRAND } from "@/config/brand";
const SHORTCUTS = [
  { href: "/brand/creators", label: "Find creators", icon: Users },
  { href: "/brand/campaigns/new", label: "New campaign", icon: Briefcase },
  { href: "/brand/results", label: "Results", icon: BarChart3 },
] as const;

// Same prefill as AI Matching; "Ask Nao" hands the prompt to that screen.
export function BrandAssistantSheet({ workspace, onNavigate }: { workspace: string; onNavigate: () => void }) {
  const router = useRouter();
  const id = useId();
  const [prompt, setPrompt] = useState(`Find 4 creators for ${workspace}. Use my campaign brief and prioritize strong audience and content fit.`);

  function ask() {
    const text = prompt.trim();
    if (!text) return;
    onNavigate();
    router.push(`/brand/creators/matching?prompt=${encodeURIComponent(text)}`);
  }

  return (
    <div className="grid gap-4">
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ask {BRAND.copilot}
        </label>
        <Textarea id={id} value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="resize-none" />
        <div className="flex justify-end">
          <Button type="submit" disabled={!prompt.trim()} className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Send aria-hidden="true" /> Ask {BRAND.copilot}
          </Button>
        </div>
      </form>
      <nav aria-label="Shortcuts" className="grid gap-2 sm:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <s.icon className="size-4 text-brand" aria-hidden="true" />
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
