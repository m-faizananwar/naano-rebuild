import { CalendarCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Book a call · naano" };

export default function BrandBookACallPage() {
  return (
    <>
      <PageHeader
        title="Launch free with the Naano team"
        description="15 minutes with a Naano expert to plan your next campaign. A campaign manager turns your selection into a ready-to-launch campaign. You validate, they handle the rest."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="calendar-title" className="rounded-2xl border border-dashed bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today · 14:30 · 15 min</p>
          <h2 id="calendar-title" className="mt-2 text-lg font-semibold">
            Calendar
          </h2>
          <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-xl bg-muted/60 p-6 text-center">
            <CalendarCheck className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Booking is not wired in this build. The real product embeds a Google Calendar appointment page here; everything else in the workspace is live.
            </p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No commitment · Slot available today</p>
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
    </>
  );
}
