"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { BRAND } from "@/config/brand";
// Per shell: the brand and creator rails remember their own state.
const STORAGE_PREFIX = `${BRAND.key}.sidebar.collapsed.`;

// Desktop sidebar that collapses to an icon rail: 0.2s width transition,
// labels fade (see .side-label in globals.css). Remembered per browser.
export function SidebarFrame({ role, children }: { role: "brand" | "creator"; children: ReactNode }) {
  const storageKey = STORAGE_PREFIX + role;
  // Server renders expanded; the stored preference is applied after hydration via a subscription-free read.
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem(storageKey) === "1") setCollapsed(true);
      } catch {
        // storage can be unavailable (private mode); default stays expanded
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [storageKey]);
  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {
      // ignore
    }
  }
  return (
    <aside
      data-collapsed={collapsed}
      data-hydrated={hydrated}
      className="group/side sticky top-0 hidden h-screen shrink-0 border-r bg-background transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block data-[collapsed=true]:w-16 data-[collapsed=false]:w-64"
    >
      {children}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-4 -right-3 flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {collapsed ? <PanelLeftOpen className="size-3.5" aria-hidden="true" /> : <PanelLeftClose className="size-3.5" aria-hidden="true" />}
      </button>
    </aside>
  );
}
