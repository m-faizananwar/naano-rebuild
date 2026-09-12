import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SlotPicker } from "./SlotPicker";

const OUTCOMES = ["Creator angles tailored to your market", "Recommended campaign format and budget", "A clear launch plan for your next campaign"];

// Copy from the product map: the overview's "Naano experts available" card and
// the campaign chooser's "Launch free with the Naano team" card.
export function BookACallView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section aria-labelledby="call-title" className="rounded-2xl border bg-background p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Campaign strategy call</p>
        <h2 id="call-title" className="mt-2 text-xl font-semibold">
          Book a campaign call
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          15 minutes with a Naano expert to plan your next campaign. A campaign manager turns your selection into a ready-to-launch campaign. You
          validate, they handle the rest.
        </p>
        <ul className="mt-3 grid gap-1 text-sm">
          {OUTCOMES.map((line) => (
            <li key={line} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full border px-2.5 py-1">15 min</span>
          <span className="rounded-full border px-2.5 py-1">Video call</span>
          <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Slot available today
          </span>
        </div>
        <div className="mt-6">
          <SlotPicker />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">No commitment · Slot available today · You would receive a Google Calendar invite instantly on naano.</p>
      </section>
      <aside className="rounded-2xl border bg-background p-5">
        <h2 className="text-lg font-semibold">Or start now</h2>
        <p className="mt-1 text-sm text-muted-foreground">AI asks the right questions and prepares a fully editable brief in 5 minutes.</p>
        <Link href="/brand/campaigns/new/ai" className={buttonVariants({ className: "mt-4 w-full bg-brand text-brand-foreground hover:bg-brand/90" })}>
          Create with AI instead
        </Link>
        <Link href="/brand/campaigns/new" className={buttonVariants({ variant: "outline", className: "mt-2 w-full" })}>
          Back to launch options
        </Link>
      </aside>
    </div>
  );
}
