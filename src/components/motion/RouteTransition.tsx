"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Re-keys the page content on navigation so it plays sectionAppear once per route.
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-section">
      {children}
    </div>
  );
}
