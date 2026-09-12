import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/constants";
import { viewerFromToken } from "@/features/auth/server/session";
import { readToolCall, toolResult } from "@/features/voice/server/vapi-webhook";
import { webhookSecret } from "@/features/voice/server/voice-token";

export const dynamic = "force-dynamic";

// Vapi server URL. Verifies the shared secret, identifies the user by the
// headless session started in /api/voice/session, then forwards the words to
// /api/voice/intent with that session's cookie and csrf token — the webhook
// never runs an action itself, so both providers share one path.
export async function POST(request: Request) {
  if (request.headers.get("x-vapi-secret") !== webhookSecret()) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const call = readToolCall(await request.json().catch(() => null));
  if (!call) return NextResponse.json({ results: [] });
  const viewer = await viewerFromToken(call.voiceToken);
  if (!viewer) return NextResponse.json(toolResult(call.id, "Your voice session expired. Reload the page and start again."));

  const res = await fetch(new URL("/api/voice/intent", request.url), {
    method: "POST",
    headers: { "content-type": "application/json", cookie: `${SESSION_COOKIE}=${call.voiceToken}`, "x-csrf-token": viewer.csrfToken },
    body: JSON.stringify({ transcript: call.transcript, confirmed: call.confirmed }),
  }).catch(() => null);
  const body = res ? ((await res.json().catch(() => null)) as { speech?: string } | null) : null;
  return NextResponse.json(toolResult(call.id, body?.speech ?? "Something went wrong. Try again."));
}
