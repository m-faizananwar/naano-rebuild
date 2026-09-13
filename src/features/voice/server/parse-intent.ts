import "server-only";
import { generateStructured } from "@/features/ai/server/llm";
import { aiProvider } from "@/features/ai/server/provider";
import { parseVoiceCommand } from "@/lib/voice-grammar";
import { VOICE_MAX_TOKENS, VOICE_TIMEOUT_MS } from "../constants";
import { intentSchema, intentWireSchema, type VoiceIntent } from "../schemas";

import { BRAND } from "@/config/brand";
const SYSTEM = `You turn one spoken command from a user of ${BRAND.name} (a B2B LinkedIn creator marketplace) into exactly one tool call.
Brands: navigate, searchCreators, openCreator, bookCreator, openCampaign, approveDraft, requestChanges, topUp, showResults.
Creators: navigate, openCampaign, applyToCampaign, submitDraft, showResults.
Prices are euros. Names are as spoken. If the command is not one of these, return tool "unknown" with a short reason. Never invent values the user did not say.`;

// Claude with structured output when the key is set; the regex grammar otherwise or on any failure.
export async function parseIntent(transcript: string, role: "brand" | "creator"): Promise<{ intent: VoiceIntent; source: "model" | "grammar" }> {
  const fallback = () => ({ intent: intentSchema.parse(parseVoiceCommand(transcript)), source: "grammar" as const });
  if (aiProvider().name === "template") return fallback();
  try {
    const result = await generateStructured({ system: SYSTEM, user: `Role: ${role}. Command: "${transcript}"`, schema: intentWireSchema, maxTokens: VOICE_MAX_TOKENS, timeoutMs: VOICE_TIMEOUT_MS });
    if (!result) return fallback();
    // Drop nulls so the app schema's optionals/defaults apply.
    const cleaned = Object.fromEntries(Object.entries(result.data).filter(([, v]) => v !== null));
    return { intent: intentSchema.parse(cleaned), source: "model" };
  } catch (error) {
    console.error("[voice] intent parse failed, using grammar", { error });
    return fallback();
  }
}
