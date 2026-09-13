"use client";

import { AssistantWidget } from "@/features/assistant/components/AssistantWidget";
import { CookiesPill } from "@/features/assistant/components/CookiesPill";

// The public site's floating assistant: the shared widget (logged out, it
// answers about the product) plus naano's "Cookies" pill bottom-right.
export function PublicAssistantPill() {
  return (
    <>
      <AssistantWidget mode="public" />
      {/* left of the assistant's bubble slot (16px edge + 48px bubble + 8px) */}
      {/* .cookies-dock: the ink footer lifts it above the pill row while the bottom row is on screen */}
      <div className="cookies-dock pointer-events-none fixed right-4 bottom-[4.75rem] z-30 flex flex-col items-end gap-2 transition-[bottom] duration-300 sm:right-[4.5rem] sm:bottom-4">
        <CookiesPill />
      </div>
    </>
  );
}
