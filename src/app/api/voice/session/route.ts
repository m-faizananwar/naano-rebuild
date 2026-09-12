import { NextResponse } from "next/server";
import { createHeadlessSession, getViewer } from "@/features/auth/server/session";
import { ensureAssistant, isVapiConfigured } from "@/features/voice/server/vapi-assistant";

export const dynamic = "force-dynamic";

// GET → { provider: "vapi", assistantId, publicKey, voiceToken } or { provider: "web-speech" }.
// The voice token is a one-hour headless session so the Vapi webhook can act as
// this user through the same intent route (cookie + csrf), nothing else.
export async function GET(request: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isVapiConfigured()) return NextResponse.json({ provider: "web-speech" });
  try {
    const serverUrl = new URL("/api/voice/vapi", request.url).toString();
    const assistantId = await ensureAssistant(serverUrl);
    return NextResponse.json({
      provider: "vapi",
      assistantId,
      publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
      voiceToken: await createHeadlessSession(viewer.userId),
    });
  } catch (error) {
    console.error("[voice] vapi session failed, falling back to web speech", { userId: viewer.userId, error });
    return NextResponse.json({ provider: "web-speech" });
  }
}
