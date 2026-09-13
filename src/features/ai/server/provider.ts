import "server-only";
import { type AiProvider, type AiProviderName, resolveAiProvider } from "@/lib/ai-provider";
import { DEMOTION_TTL_MS } from "../constants";

// Resolved from the keys on every call. A provider that failed with a
// billing / auth / quota error or a network failure is set aside for
// DEMOTION_TTL_MS so the next one takes over, then tried again — topping up
// an account brings it back without a redeploy. /api/health probes the
// effective provider (see llm.ts probeProvider) rather than trusting keys.
const demoted = new Map<AiProviderName, { reason: string; until: number }>();

export function aiProvider(now = Date.now()): AiProvider {
  const env: Record<string, string | undefined> = { ...process.env };
  for (const [name, entry] of demoted) {
    if (entry.until <= now) { demoted.delete(name); continue; }
    if (name === "anthropic") delete env.ANTHROPIC_API_KEY;
    if (name === "gemini") delete env.GEMINI_API_KEY;
  }
  return resolveAiProvider(env);
}

export function demoteProvider(name: AiProviderName, reason: string, now = Date.now()) {
  if (!demoted.has(name)) console.error(`[ai] ${name} set aside for ${DEMOTION_TTL_MS / 1000}s: ${reason}`);
  demoted.set(name, { reason, until: now + DEMOTION_TTL_MS });
}

export function demotedProviders(): Record<string, string> {
  return Object.fromEntries([...demoted].map(([name, e]) => [name, e.reason]));
}
