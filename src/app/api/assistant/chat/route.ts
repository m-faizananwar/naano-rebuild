import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/features/assistant/schemas";
import { answerChat } from "@/features/assistant/server/answer";
import { getViewer } from "@/features/auth/server/session";

export const dynamic = "force-dynamic";

// POST { message, pending?, history? } → { ok, text, navigate?, pending?, source }.
// Signed-in requests carry the session's csrf token (tools mutate); the
// landing is logged out and gets conversation only.
export async function POST(request: Request) {
  const viewer = await getViewer().catch(() => null);
  if (viewer && request.headers.get("x-csrf-token") !== viewer.csrfToken) {
    return NextResponse.json({ ok: false, text: "This session is stale. Reload the page.", source: "tool" }, { status: 403 });
  }
  const parsed = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, text: "Say a little more and I'll try again.", source: "template" }, { status: 400 });
  try {
    return NextResponse.json(await answerChat(parsed.data, viewer));
  } catch (error) {
    console.error("[assistant] chat route failed", { userId: viewer?.userId, error });
    return NextResponse.json({ ok: false, text: "Something went wrong on our side. Try again.", source: "template" }, { status: 500 });
  }
}
