import "server-only";
import { VAPI_API_URL, VAPI_ASSISTANT_NAME } from "../constants";
import { webhookSecret } from "./voice-token";

import { BRAND } from "@/config/brand";
export const isVapiConfigured = () => Boolean(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY && process.env.VAPI_PRIVATE_KEY);

const SYSTEM_PROMPT = `You are ${BRAND.name}'s voice assistant inside a LinkedIn creator marketplace. Keep replies to one short sentence.
Call the "command" tool with the user's words, verbatim, for anything that is an action or a navigation. For a money or status change the tool first answers with a question ending in "Confirm?" — say it and wait. Only if the user clearly says yes, call "command" again with the ORIGINAL command and confirmed=true. Never set confirmed=true on your own.`;

// One assistant with a single passthrough tool: Vapi does speech and turns,
// our webhook does the parsing and the actions, exactly like the web path.
const assistantBody = (serverUrl: string) => ({
  name: VAPI_ASSISTANT_NAME,
  firstMessage: "Hi, what would you like to do?",
  model: {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    messages: [{ role: "system", content: SYSTEM_PROMPT }],
    tools: [
      {
        type: "function",
        async: false,
        server: { url: serverUrl, secret: webhookSecret() },
        function: {
          name: "command",
          description: "Run the user's spoken command (navigation, search, booking, approvals, top-up, apply, submit draft) or their yes/no answer to a pending confirmation.",
          parameters: {
            type: "object",
            properties: {
              transcript: { type: "string", description: "The user's words, verbatim." },
              confirmed: { type: "boolean", description: "true only after the user said yes to the tool's 'Confirm?' question." },
            },
            required: ["transcript"],
          },
        },
      },
    ],
  },
  voice: { provider: "11labs", voiceId: "sarah" },
  transcriber: { provider: "deepgram", model: "nova-2", language: "en" },
  metadata: { app: `${BRAND.key}-rebuild` },
});

let cached: { serverUrl: string; id: string } | null = null;

// Find-or-create by name, once per server process. Created from code so the
// dashboard is never a manual step.
export async function ensureAssistant(serverUrl: string): Promise<string> {
  if (cached?.serverUrl === serverUrl) return cached.id;
  const headers = { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`, "Content-Type": "application/json" };
  const list = await fetch(`${VAPI_API_URL}/assistant`, { headers }).then((r) => (r.ok ? r.json() : []));
  const existing = Array.isArray(list) ? list.find((a: { name?: string }) => a.name === VAPI_ASSISTANT_NAME) : null;
  const method = existing ? "PATCH" : "POST";
  const url = existing ? `${VAPI_API_URL}/assistant/${existing.id}` : `${VAPI_API_URL}/assistant`;
  const res = await fetch(url, { method, headers, body: JSON.stringify(assistantBody(serverUrl)) });
  if (!res.ok) throw new Error(`Vapi ${method} assistant failed: ${res.status} ${await res.text()}`);
  const { id } = (await res.json()) as { id: string };
  cached = { serverUrl, id };
  return id;
}
