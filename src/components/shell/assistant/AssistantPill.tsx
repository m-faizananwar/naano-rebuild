"use client";

import { AssistantWidget } from "@/features/assistant/components/AssistantWidget";

type Props = { role: "brand" | "creator"; workspace: string; csrfToken: string };

// The app shells' floating assistant is the shared widget (src/features/assistant):
// naano's pill, the chevron collapse to a bubble, the chat panel and the mic.
export function AssistantPill({ role, csrfToken }: Props) {
  return <AssistantWidget mode={role} csrfToken={csrfToken} />;
}
