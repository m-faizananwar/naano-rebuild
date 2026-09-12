"use client";

import { ArrowRight, AudioLines, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { BRAND } from "@/config/brand";
const PHRASES = ["What would you like to see?", "What can I help you find?", "What would you like to know?"] as const;
const LINKS = [
  { href: "/#how-it-works", label: `How ${BRAND.name} works` },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-creators", label: "For creators" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/book-a-call", label: "Book a strategy call" },
  { href: "/register", label: "Create an account" },
] as const;

// naano's floating assistant on the public site. No chat here: a sheet of
// the places a visitor usually asks for.
export function PublicAssistantPill() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open the assistant"
        className="lift fixed bottom-4 left-1/2 z-30 flex h-12 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-full border bg-background/95 px-4 text-left text-sm text-muted-foreground shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <Sparkles className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <CyclingText phrases={PHRASES} className="flex-1 truncate" />
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
          <AudioLines className="size-4" />
        </span>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-6 sm:max-w-lg sm:inset-x-0">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>What would you like to see?</SheetTitle>
          <SheetDescription>Jump to the part of {BRAND.name} you&apos;re looking for.</SheetDescription>
        </SheetHeader>
        <ul className="mt-4 grid gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium hover:bg-muted">
                {l.label}
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
