import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_PAYMENT_REQUIRED, HTTP_UNAUTHORIZED, MAX_PROVIDER_ATTEMPTS } from "../constants";
import { ANTHROPIC_MODEL, DEFAULT_MAX_RETRIES, DEFAULT_MAX_TOKENS, DEFAULT_TIMEOUT_MS, ERROR_MESSAGE_MAX, GEMINI_MODEL } from "../constants";
import { aiProvider, demoteProvider } from "./provider";

export type StructuredRequest<T extends z.ZodType> = {
  system: string;
  user: string;
  // Transform-free wire schema (JSON Schema cannot express zod transforms);
  // callers validate the result against their shared schema afterwards.
  schema: T;
  maxTokens?: number;
  timeoutMs?: number;
  effort?: "low" | "medium" | "high";
};
export type StructuredResult<T> = { data: T; provider: "anthropic" | "gemini" };
export type TextRequest = Omit<StructuredRequest<z.ZodType>, "schema">;

// One interface over both providers. Returns null when the provider is the
// template (no key) or the model refused / produced nothing usable; throws
// on transport errors so callers can log and fall back.
export async function generateStructured<T extends z.ZodType>(req: StructuredRequest<T>): Promise<StructuredResult<z.infer<T>> | null> {
  return withDemotion<StructuredResult<z.infer<T>>>((provider) =>
    provider.name === "anthropic" ? anthropicStructured(req, provider.apiKey as string) : geminiStructured(req, provider.apiKey as string),
  );
}

export async function generateText(req: TextRequest): Promise<{ text: string; provider: "anthropic" | "gemini" } | null> {
  return withDemotion<{ text: string; provider: "anthropic" | "gemini" }>((provider) =>
    provider.name === "anthropic" ? anthropicText(req, provider.apiKey as string) : geminiText(req, provider.apiKey as string),
  );
}

// Runs the call on the current provider. An account-level failure (no credit,
// bad key, forbidden) demotes that provider and retries once on the next one;
// transport errors still throw to the caller.
async function withDemotion<R>(call: (provider: ReturnType<typeof aiProvider>) => Promise<R | null>): Promise<R | null> {
  for (let attempt = 0; attempt < MAX_PROVIDER_ATTEMPTS; attempt++) {
    const provider = aiProvider();
    if (provider.name === "template") return null;
    try {
      return await call(provider);
    } catch (error) {
      const reason = accountLevelReason(error);
      if (!reason) throw error;
      demoteProvider(provider.name, reason);
    }
  }
  return null;
}

const ACCOUNT_STATUSES = new Set([HTTP_UNAUTHORIZED, HTTP_PAYMENT_REQUIRED, HTTP_FORBIDDEN]);
const CREDIT_PATTERN = /credit balance|billing|quota|api key/i;
function accountLevelReason(error: unknown): string | null {
  if (error instanceof Anthropic.APIError) {
    if (ACCOUNT_STATUSES.has(error.status ?? 0) || (error.status === HTTP_BAD_REQUEST && CREDIT_PATTERN.test(error.message))) return describeAiError(error);
    return null;
  }
  if (error instanceof Error && /API key|PERMISSION_DENIED|UNAUTHENTICATED|RESOURCE_EXHAUSTED/.test(error.message)) return describeAiError(error);
  return null;
}

async function anthropicStructured<T extends z.ZodType>(req: StructuredRequest<T>, apiKey: string) {
  const client = new Anthropic({ apiKey, timeout: req.timeoutMs ?? DEFAULT_TIMEOUT_MS, maxRetries: DEFAULT_MAX_RETRIES });
  const response = await client.messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
    system: req.system,
    messages: [{ role: "user", content: req.user }],
    output_config: { format: zodOutputFormat(req.schema), ...(req.effort ? { effort: req.effort } : {}) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) return null;
  return { data: response.parsed_output as z.infer<T>, provider: "anthropic" as const };
}

async function anthropicText(req: TextRequest, apiKey: string) {
  const client = new Anthropic({ apiKey, timeout: req.timeoutMs ?? DEFAULT_TIMEOUT_MS, maxRetries: DEFAULT_MAX_RETRIES });
  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
    system: req.system,
    messages: [{ role: "user", content: req.user }],
    ...(req.effort ? { output_config: { effort: req.effort } } : {}),
  });
  if (response.stop_reason === "refusal") return null;
  const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
  return text ? { text, provider: "anthropic" as const } : null;
}

// Gemini: structured JSON output against the same wire schema (zod → JSON
// Schema), then the same zod validation as the Anthropic path.
async function geminiStructured<T extends z.ZodType>(req: StructuredRequest<T>, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: req.user,
    config: {
      systemInstruction: req.system,
      responseMimeType: "application/json",
      responseJsonSchema: toGeminiSchema(z.toJSONSchema(req.schema)),
      maxOutputTokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
      httpOptions: { timeout: req.timeoutMs ?? DEFAULT_TIMEOUT_MS },
    },
  });
  const text = response.text?.trim();
  if (!text) return null;
  const parsed = req.schema.safeParse(JSON.parse(text));
  return parsed.success ? { data: parsed.data as z.infer<T>, provider: "gemini" as const } : null;
}

async function geminiText(req: TextRequest, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: req.user,
    config: { systemInstruction: req.system, maxOutputTokens: req.maxTokens ?? DEFAULT_MAX_TOKENS, httpOptions: { timeout: req.timeoutMs ?? DEFAULT_TIMEOUT_MS } },
  });
  const text = response.text?.trim();
  return text ? { text, provider: "gemini" as const } : null;
}

// Gemini accepts a JSON Schema subset: `const` becomes a one-value `enum`,
// `oneOf` becomes `anyOf`, `$schema` is dropped. Applied recursively.
function toGeminiSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(toGeminiSchema);
  if (!node || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === "$schema") continue;
    if (key === "const") { out.enum = [value]; continue; }
    out[key === "oneOf" ? "anyOf" : key] = toGeminiSchema(value);
  }
  return out;
}

// For logs: a one-line reason without the payload.
export function describeAiError(error: unknown): string {
  if (error instanceof Anthropic.APIError) return `anthropic ${error.status ?? ""} ${error.message.slice(0, ERROR_MESSAGE_MAX)}`.trim();
  if (error instanceof Error) return `${error.name}: ${error.message.slice(0, ERROR_MESSAGE_MAX)}`;
  return "unexpected error";
}
