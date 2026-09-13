"use client";

import { AssistantWidget } from "@/features/assistant/components/AssistantWidget";

// The public site's floating assistant: the shared widget, logged out (it
// answers about the product). The bubble keeps its own 16px corner position.
export function PublicAssistantPill() {
  return <AssistantWidget mode="public" />;
}
