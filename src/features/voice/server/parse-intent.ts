import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { parseVoiceCommand } from "@/lib/voice-grammar";
import { VOICE_MODEL, VOICE_TIMEOUT_MS } from "../constants";
import { intentSchema, intentWireSchema, type VoiceIntent } from "../schemas";

const SYSTEM = `You turn one spoken command from a user of Naano (a B2B LinkedIn creator marketplace) into exactly one tool call.
Brands: navigate, searchCreators, openCreator, bookCreator, openCampaign, approveDraft, requestChanges, topUp, showResults.
Creators: navigate, openCampaign, applyToCampaign, submitDraft, showResults.
Prices are euros. Names are as spoken. If the command is not one of these, return tool "unknown" with a short reason. Never invent values the user did not say.`;

// Claude with structured output when the key is set; the regex grammar otherwise or on any failure.
export async function parseIntent(transcript: string, role: "brand" | "creator"): Promise<{ intent: VoiceIntent; source: "claude" | "grammar" }> {
  const fallback = () => ({ intent: intentSchema.parse(parseVoiceCommand(transcript)), source: "grammar" as const });
  if (!process.env.ANTHROPIC_API_KEY) return fallback();
  try {
    const client = new Anthropic({ timeout: VOICE_TIMEOUT_MS, maxRetries: 0 });
    const message = await client.messages.parse({
      model: VOICE_MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: "user", content: `Role: ${role}. Command: "${transcript}"` }],
      output_config: { format: zodOutputFormat(intentWireSchema) },
    });
    if (!message.parsed_output) return fallback();
    // Drop nulls so the app schema's optionals/defaults apply.
    const cleaned = Object.fromEntries(Object.entries(message.parsed_output).filter(([, v]) => v !== null));
    return { intent: intentSchema.parse(cleaned), source: "claude" };
  } catch (error) {
    console.error("[voice] intent parse failed, using grammar", { error });
    return fallback();
  }
}
