"use client";

import { AudioLines, Sparkles } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandAssistantSheet } from "./BrandAssistantSheet";
import { CreatorAssistantSheet } from "./CreatorAssistantSheet";

type Props = { role: "brand" | "creator"; workspace: string };

// naano's floating assistant pill, bottom-centre on both apps. Brand: a Nao
// prompt box + three shortcuts. Creator: three links, no chat.
export function AssistantPill({ role, workspace }: Props) {
  const [open, setOpen] = useState(false);
  const label = role === "brand" ? "What would you like to do?" : "What would you like to see?";
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={`${label} Open the assistant`}
        className="fixed bottom-4 left-1/2 z-30 flex h-12 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-full border bg-background/95 px-4 text-left text-sm text-muted-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:left-[calc(50%+8rem)]"
      >
        <Sparkles className="size-4 text-brand" aria-hidden="true" />
        <span className="flex-1 truncate">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-muted" aria-hidden="true">
          <AudioLines className="size-4" />
        </span>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full overflow-y-auto rounded-t-2xl p-6 sm:max-w-xl sm:inset-x-0">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>
            {role === "brand" ? `Nao · Creator intelligence for ${workspace}` : "Jump straight to the part of your workspace you need."}
          </SheetDescription>
        </SheetHeader>
        {role === "brand" ? <BrandAssistantSheet workspace={workspace} onNavigate={() => setOpen(false)} /> : <CreatorAssistantSheet onNavigate={() => setOpen(false)} />}
      </SheetContent>
    </Sheet>
  );
}
