import { AssistantMount } from "@/features/assistant/components/AssistantMount";

// The public site's floating assistant: a static shell at paint, the widget
// loaded on idle / approach (logged out, it answers about the product).
export function PublicAssistantPill() {
  return <AssistantMount mode="public" />;
}
