import { z } from "zod";
import { intentSchema } from "@/features/voice/schemas";
import { MESSAGE_MAX_CHARS } from "./constants";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(MESSAGE_MAX_CHARS),
  // Gated voice/chat intent awaiting a yes/no, echoed back by the client.
  pending: intentSchema.optional(),
  // Recent turns for conversational answers (never used for tools).
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(MESSAGE_MAX_CHARS) })).max(12).optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export type ChatMessage = { role: "user" | "assistant"; text: string };

export type ChatResponse = {
  ok: boolean;
  text: string;
  navigate?: string;
  pending?: z.infer<typeof intentSchema>;
  // "tool" ran through the voice executor; "llm" is a conversational answer; "template" is the keyless fallback.
  source: "tool" | "llm" | "template";
};
