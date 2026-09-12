"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "../../constants";

const ITEM = "rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

// Under lg the public nav collapses into a menu button + right-hand sheet.
export function MobilePublicNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 gap-0 p-6">
        <SheetTitle className="text-lg font-bold tracking-tight">Menu</SheetTitle>
        <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} onClick={close} className={ITEM}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 grid gap-2 border-t pt-6">
          <Link
            href="/login"
            onClick={close}
            className="inline-flex h-11 items-center justify-center rounded-full bg-background text-sm font-semibold ring-1 ring-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={close}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            Sign up
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
