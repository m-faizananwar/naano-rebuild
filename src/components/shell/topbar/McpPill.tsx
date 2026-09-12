import { ArrowRight } from "lucide-react";
import Link from "next/link";

// naano's "NAANO MCP / Connect →" pill; brand top bar only.
export function McpPill() {
  return (
    <Link
      href="/brand/integrations"
      aria-label="Connect Naano to your AI assistant"
      className="hidden h-9 items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:inline-flex"
    >
      <span className="uppercase tracking-wide">Naano MCP</span>
      <span className="text-muted-foreground" aria-hidden="true">/</span>
      <span className="inline-flex items-center gap-1">
        Connect <ArrowRight className="size-3" aria-hidden="true" />
      </span>
    </Link>
  );
}
