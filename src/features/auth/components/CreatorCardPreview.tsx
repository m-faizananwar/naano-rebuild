import { cn } from "cn";
import { NaanoWordmark } from "@/components/NaanoWordmark";

const STATS = ["Followers", "Est. impressions", "Cost / post"];

// Static version of the "marketplace card" naano previews next to the creator
// sign-up. The live-updating version belongs to creator onboarding.
export function CreatorCardPreview({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-xl ring-1 ring-border/60", className)} aria-hidden="true">
      <div className="relative h-32 bg-linear-to-br from-brand to-brand/80">
        <span className="absolute left-5 top-5 inline-flex size-9 items-center justify-center rounded-lg bg-brand-foreground/90 text-sm font-bold text-brand">in</span>
        <div className="absolute inset-x-0 top-9 flex justify-center">
          <NaanoWordmark inverted className="text-xl" />
        </div>
      </div>
      <div className="-mt-10 flex flex-col items-center px-6 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground ring-4 ring-card">Y</span>
        <p className="mt-4 text-2xl font-bold tracking-tight">Your name</p>
        <p className="mt-2 text-muted-foreground">Your LinkedIn headline and topics will appear here.</p>
        <div className="mt-6 flex w-full items-center gap-3 text-xs text-muted-foreground">
          <span>Data</span>
          <span className="h-1 flex-1 rounded-full bg-muted" />
          <span className="font-semibold text-foreground">Pending</span>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-3 divide-x border-t bg-muted/40">
        {STATS.map((label) => (
          <div key={label} className="px-3 py-6 text-center">
            <dd className="text-xl font-bold">—</dd>
            <dt className="mt-1 text-xs text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
