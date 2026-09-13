import { ChevronDown } from "lucide-react";
import { EDGE_GAP, PHRASES, PILL_HEIGHT, PILL_WIDTH } from "../constants";
import { SpinnerRing } from "./SpinnerRing";
import "./assistant.css";

// What you see at rest, server-rendered with zero client JS: the glass pill
// with the glyph, the first placeholder, the waveform button and the chevron
// — same dimensions and classes as the live widget, which swaps in on top
// with no layout shift (AssistantMount). Nothing here is interactive.
export function AssistantShell({ mode }: { mode: "public" | "brand" | "creator" }) {
  const width = mode === "public" ? PILL_WIDTH.public : PILL_WIDTH.app;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center" style={{ paddingBottom: EDGE_GAP }} aria-hidden="true">
      <div className="flex flex-col items-center" style={{ width, maxWidth: "calc(100vw - 2rem)" }}>
        <div className="relative z-10 -my-3 rounded-full">
          <span className="assistant-ink60 flex h-6 w-9 items-center justify-center rounded-full">
            <ChevronDown className="size-3.5" />
          </span>
        </div>
        <div className="assistant-shell-pill assistant-glass flex items-center gap-3 rounded-full pl-4 pr-1.5" style={{ width, maxWidth: "calc(100vw - 2rem)", height: PILL_HEIGHT }}>
          <span className="assistant-ink60"><SpinnerRing spinning={false} /></span>
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{PHRASES[0]}</span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4">
              <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 12h2" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
