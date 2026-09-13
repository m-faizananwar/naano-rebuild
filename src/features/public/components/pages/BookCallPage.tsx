import { Check } from "lucide-react";
import Link from "next/link";
import { SlotPicker } from "./SlotPicker";

import { BRAND } from "@/config/brand";
const BULLETS = ["Creator angles tailored to your market", "Recommended campaign format and budget", "A clear launch plan for your next campaign"];
const TRUSTED = ["lemlist", "folk.", "ringover", "attio", "gojiberry"];

// public-13-book-call.png. The slot picker is a fake: it writes nothing.
export function BookCallPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand">Campaign strategy call</p>
      <h1 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s build your next creator campaign.</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
        In 30 minutes, we&apos;ll map the right creator angles, campaign format and budget for your ICP.
      </p>
      <ul className="mt-6 grid justify-center gap-2 text-sm">
        {BULLETS.map((b) => (
          <li key={b} className="flex items-center justify-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-brand/10 text-brand"><Check className="size-3" aria-hidden="true" /></span>
            {b}
          </li>
        ))}
      </ul>
      <section className="mt-10 rounded-2xl border bg-background p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">Book a campaign call</h2>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">⏱ 30 min</span>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">▣ Video call</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Available
          </span>
        </div>
        <div className="mt-4">
          <SlotPicker />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">You&apos;ll receive a Google Calendar invite instantly — in the real product. Here nothing is written.</span>
          <a href={`mailto:${BRAND.supportEmail}`} className="font-medium text-brand hover:underline">Prefer email? Contact us <span className="arrow-glyph" aria-hidden="true">→</span></a>
        </div>
      </section>
      <p className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>Trusted by B2B teams at</span>
        {TRUSTED.map((t) => (
          <span key={t} className="font-semibold text-foreground/60">{t}</span>
        ))}
      </p>
      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">← Back to homepage</Link>
      </p>
    </main>
  );
}
