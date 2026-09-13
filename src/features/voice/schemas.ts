import { z } from "zod";
import { TRANSCRIPT_MAX_CHARS } from "./constants";

const name = z.string().trim().min(1).max(120);

// One intent per utterance. The same shape is what Claude is asked to
// produce (structured output), what the regex fallback produces, and what
// Vapi's function calls are mapped onto.
export const intentSchema = z.discriminatedUnion("tool", [
  z.object({ tool: z.literal("navigate"), route: z.string().trim().min(1).max(60) }),
  z.object({
    tool: z.literal("searchCreators"),
    industry: z.string().trim().max(60).optional(),
    country: z.string().trim().max(60).optional(),
    maxPriceEuros: z.number().int().positive().max(100_000).optional(),
    minPriceEuros: z.number().int().positive().max(100_000).optional(),
    query: z.string().trim().max(120).optional(),
  }),
  z.object({ tool: z.literal("openCreator"), name }),
  z.object({ tool: z.literal("bookCreator"), name, posts: z.number().int().min(1).max(20).default(1) }),
  z.object({ tool: z.literal("openCampaign"), name }),
  z.object({ tool: z.literal("approveDraft"), creatorName: name }),
  z.object({ tool: z.literal("requestChanges"), creatorName: name, note: z.string().trim().min(1).max(500) }),
  z.object({ tool: z.literal("topUp"), amountEuros: z.number().int().positive().max(1_000_000) }),
  z.object({ tool: z.literal("showResults"), campaign: z.string().trim().max(120).optional() }),
  z.object({ tool: z.literal("applyToCampaign"), name }),
  z.object({ tool: z.literal("submitDraft"), text: z.string().trim().min(1).max(3000) }),
  z.object({ tool: z.literal("unknown"), reason: z.string().trim().max(200) }),
]);
export type VoiceIntent = z.infer<typeof intentSchema>;

// Transform-free twin for Claude's structured output (JSON Schema cannot
// express trim/default); results are re-parsed through intentSchema.
const plain = z.string().min(1).max(120);
export const intentWireSchema = z.discriminatedUnion("tool", [
  z.object({ tool: z.literal("navigate"), route: z.string().min(1).max(60) }),
  z.object({
    tool: z.literal("searchCreators"),
    industry: z.string().max(60).nullable(),
    country: z.string().max(60).nullable(),
    maxPriceEuros: z.number().int().nullable(),
    minPriceEuros: z.number().int().nullable(),
    query: z.string().max(120).nullable(),
  }),
  z.object({ tool: z.literal("openCreator"), name: plain }),
  z.object({ tool: z.literal("bookCreator"), name: plain, posts: z.number().int() }),
  z.object({ tool: z.literal("openCampaign"), name: plain }),
  z.object({ tool: z.literal("approveDraft"), creatorName: plain }),
  z.object({ tool: z.literal("requestChanges"), creatorName: plain, note: z.string().min(1).max(500) }),
  z.object({ tool: z.literal("topUp"), amountEuros: z.number().int() }),
  z.object({ tool: z.literal("showResults"), campaign: z.string().max(120).nullable() }),
  z.object({ tool: z.literal("applyToCampaign"), name: plain }),
  z.object({ tool: z.literal("submitDraft"), text: z.string().min(1).max(3000) }),
  z.object({ tool: z.literal("unknown"), reason: z.string().max(200) }),
]);

export const voiceRequestSchema = z.object({
  transcript: z.string().trim().min(1).max(TRANSCRIPT_MAX_CHARS),
  // A gated intent the client is answering yes/no to.
  pending: intentSchema.optional(),
  // Vapi path: the model re-sends the original command after a spoken yes.
  confirmed: z.boolean().optional(),
});
export type VoiceRequest = z.infer<typeof voiceRequestSchema>;

// What the executor produces; the routes wrap it into a VoiceResponse.
export type VoiceOutcome = { speech: string; navigate?: string; pending?: VoiceIntent; failed?: boolean };

export type VoiceResponse = {
  ok: boolean;
  // What the assistant says back (web speech speaks it; Vapi speaks its own).
  speech: string;
  // Client-side navigation to perform, if any.
  navigate?: string;
  // Gated intent awaiting a yes; the client sends it back with the answer.
  pending?: VoiceIntent;
  intent?: VoiceIntent;
  source?: "model" | "grammar";
  // Why the grammar answered instead of the model (provider error class, never a payload).
  fallbackReason?: string;
};
