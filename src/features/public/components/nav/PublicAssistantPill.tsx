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
      <div className="pointer-events-none fixed bottom-4 right-[4.5rem] z-30 flex flex-col items-end gap-2">
        <CookiesPill />
      </div>
    </>
  );
}
