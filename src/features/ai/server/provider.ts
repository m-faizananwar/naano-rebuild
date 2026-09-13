import "server-only";
import { type AiProvider, resolveAiProvider } from "@/lib/ai-provider";

// Resolved once per server process; /api/health reports `name`.
let cached: AiProvider | null = null;
export function aiProvider(): AiProvider {
  cached ??= resolveAiProvider(process.env);
  return cached;
}
