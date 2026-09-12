"use client";

import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VoiceMic } from "@/features/voice/components/VoiceMic";
import { BrandAssistantSheet } from "./BrandAssistantSheet";
import { CreatorAssistantSheet } from "./CreatorAssistantSheet";

import { BRAND } from "@/config/brand";
type Props = { role: "brand" | "creator"; workspace: string; csrfToken: string };

// naano's placeholder rotation, every 4s with localeIn.
const PHRASES = ["What would you like to do?", "What can I help you find?", "What would you like to see?"] as const;

// naano's floating assistant pill, bottom-centre on both apps. Brand: a Nao
// prompt box + three shortcuts. Creator: three links, no chat. The chevron
// above it collapses the pill to a dot. The mic on the right is the voice
// layer (src/features/voice); the pill row is relative so its captions sit above.
export function AssistantPill({ role, workspace, csrfToken }: Props) {
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
        <div
          data-collapsed={collapsed}
          className="lift relative flex h-12 w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-full border bg-background/95 pr-2 pl-4 text-sm text-muted-foreground shadow-lg backdrop-blur transition-[width,height,padding] duration-200 ease-out data-[collapsed=true]:size-3 data-[collapsed=true]:w-3 data-[collapsed=true]:gap-0 data-[collapsed=true]:overflow-hidden data-[collapsed=true]:bg-brand data-[collapsed=true]:p-0 motion-reduce:transition-none"
        >
          {collapsed ? null : (
            <>
              <SheetTrigger
                aria-label={`${title} Open the assistant`}
                className="flex h-full min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full"
              >
                <Sparkles className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <CyclingText phrases={PHRASES} className="flex-1 truncate" />
              </SheetTrigger>
              <VoiceMic csrfToken={csrfToken} />
            </>
          )}
        </div>
      </div>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full overflow-y-auto rounded-t-2xl p-6 sm:max-w-xl sm:inset-x-0">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {role === "brand" ? `${BRAND.copilot} · Creator intelligence for ${workspace}` : "Jump straight to the part of your workspace you need."}
          </SheetDescription>
        </SheetHeader>
        {role === "brand" ? <BrandAssistantSheet workspace={workspace} onNavigate={() => setOpen(false)} /> : <CreatorAssistantSheet onNavigate={() => setOpen(false)} />}
      </SheetContent>
    </Sheet>
  );
}
