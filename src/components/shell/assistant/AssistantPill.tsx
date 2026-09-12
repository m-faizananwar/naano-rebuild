"use client";

import { AudioLines, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandAssistantSheet } from "./BrandAssistantSheet";
import { CreatorAssistantSheet } from "./CreatorAssistantSheet";

type Props = { role: "brand" | "creator"; workspace: string };

// naano's placeholder rotation, every 4s with localeIn.
const PHRASES = ["What would you like to do?", "What can I help you find?", "What would you like to see?"] as const;

// naano's floating assistant pill, bottom-centre on both apps. Brand: a Nao
// prompt box + three shortcuts. Creator: three links, no chat. The chevron
// above it collapses the pill to a dot.
export function AssistantPill({ role, workspace }: Props) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const title = role === "brand" ? "What would you like to do?" : "What would you like to see?";
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Show the assistant" : "Hide the assistant"}
          aria-expanded={!collapsed}
          className="flex size-6 items-center justify-center rounded-full border bg-background/95 text-muted-foreground shadow-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          {collapsed ? <ChevronUp className="size-3.5" aria-hidden="true" /> : <ChevronDown className="size-3.5" aria-hidden="true" />}
        </button>
        <SheetTrigger
          aria-label={`${title} Open the assistant`}
          data-collapsed={collapsed}
          className="lift flex h-12 w-[calc(100vw-2rem)] max-w-sm items-center gap-3 overflow-hidden rounded-full border bg-background/95 px-4 text-left text-sm text-muted-foreground shadow-lg backdrop-blur transition-[width,height,padding] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 data-[collapsed=true]:size-3 data-[collapsed=true]:w-3 data-[collapsed=true]:gap-0 data-[collapsed=true]:bg-brand data-[collapsed=true]:px-0 motion-reduce:transition-none"
        >
          {collapsed ? null : (
            <>
              <Sparkles className="size-4 shrink-0 text-brand" aria-hidden="true" />
              <CyclingText phrases={PHRASES} className="flex-1 truncate" />
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                <AudioLines className="size-4" />
              </span>
            </>
          )}
        </SheetTrigger>
      </div>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full overflow-y-auto rounded-t-2xl p-6 sm:max-w-xl sm:inset-x-0">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {role === "brand" ? `Nao · Creator intelligence for ${workspace}` : "Jump straight to the part of your workspace you need."}
          </SheetDescription>
        </SheetHeader>
        {role === "brand" ? <BrandAssistantSheet workspace={workspace} onNavigate={() => setOpen(false)} /> : <CreatorAssistantSheet onNavigate={() => setOpen(false)} />}
      </SheetContent>
    </Sheet>
  );
}
