import { AssistantMount } from "@/features/assistant/components/AssistantMount";

type Props = { role: "brand" | "creator"; workspace: string; csrfToken: string };

// The app shells' floating assistant: a static shell at paint, the interactive
// widget (src/features/assistant) loaded on idle / approach and swapped in place.
export function AssistantPill({ role, csrfToken }: Props) {
  return <AssistantMount mode={role} csrfToken={csrfToken} />;
}
