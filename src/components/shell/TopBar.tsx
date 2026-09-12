"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCents } from "@/lib/money";
import { AccountMenu } from "./AccountMenu";
import { LaunchPlanButton } from "./LaunchPlanButton";
import { MobileNav } from "./MobileNav";
import type { ShellViewer } from "./viewer";

const LOCALES = ["EN", "FR"] as const;

export function TopBar({ viewer }: { viewer: ShellViewer }) {
  // Visual only: the product is English in this build.
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("EN");
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur lg:px-8">
      <MobileNav viewer={viewer} />
      <div className="ml-auto flex items-center gap-2">
        {viewer.launchPlan ? <LaunchPlanButton plan={viewer.launchPlan} /> : null}
        <span className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold" title="Wallet">
          <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
          {formatCents(viewer.walletCents, "EUR")}
        </span>
        <div role="group" aria-label="Language" className="inline-flex h-9 items-center rounded-lg border p-0.5 text-xs font-semibold">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={locale === code}
              onClick={() => setLocale(code)}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {code}
            </button>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={`Notifications (${viewer.notifications.length})`} className="relative" />}>
            <Bell aria-hidden="true" />
            {viewer.notifications.length > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground" aria-hidden="true">
                {viewer.notifications.length}
              </span>
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {viewer.notifications.length === 0 ? (
                <p className="px-2 pb-2 text-sm text-muted-foreground">You&apos;re all caught up. New activity on your campaigns will show up here.</p>
              ) : (
                viewer.notifications.map((n) => (
                  <DropdownMenuItem key={n.id} render={<Link href={n.href} />} className="flex flex-col items-start gap-0.5">
                    <span className="font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.body}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <AccountMenu viewer={viewer} />
      </div>
    </header>
  );
}
