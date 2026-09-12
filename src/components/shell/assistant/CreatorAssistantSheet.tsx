import { ChevronRight, Layers, Store, Wallet } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { href: "/creator/opportunities", label: "Browse opportunities", body: "Open brand campaigns ranked by audience fit.", icon: Store },
  { href: "/creator/collaborations", label: "My collaborations", body: "Where each booking stands and what to do next.", icon: Layers },
  { href: "/creator/earnings", label: "Earnings", body: "What is available, awaiting release and withdrawn.", icon: Wallet },
] as const;

// The creator pill is a small help sheet: three links, no chat.
export function CreatorAssistantSheet({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav aria-label="Where to go" className="grid gap-2">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <l.icon className="size-4" aria-hidden="true" />
          </span>
          <span className="grid flex-1 gap-0.5">
            <span className="text-sm font-medium">{l.label}</span>
            <span className="text-xs text-muted-foreground">{l.body}</span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}
