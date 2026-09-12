"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import type { ShellViewer } from "./viewer";

export function MobileNav({ viewer }: { viewer: ShellViewer }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Sidebar viewer={viewer} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
