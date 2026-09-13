import "server-only";
import { type AiProvider, type AiProviderName, resolveAiProvider } from "@/lib/ai-provider";

// Resolved once per server process. A provider that answers with an
// account-level error (no credit, bad key, forbidden) is demoted for the rest
// of the process so the next one takes over instead of every call falling
// back to the template; /api/health reports the effective name and why.
const demoted = new Map<AiProviderName, string>();

export function aiProvider(): AiProvider {
  const env: Record<string, string | undefined> = { ...process.env };
  for (const [name] of demoted) {
    if (name === "anthropic") delete env.ANTHROPIC_API_KEY;
    if (name === "gemini") delete env.GEMINI_API_KEY;
  }
  return resolveAiProvider(env);
}

export function demoteProvider(name: AiProviderName, reason: string) {
  if (!demoted.has(name)) console.error(`[ai] ${name} demoted for this process: ${reason}`);
  demoted.set(name, reason);
}

export function demotedProviders(): Record<string, string> {
  return Object.fromEntries(demoted);
}
