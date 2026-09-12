import { NextResponse } from "next/server";
import { pingDatabase } from "@/db/health";

export const dynamic = "force-dynamic";

const HTTP_SERVICE_UNAVAILABLE = 503;

// Smoke test after every deploy: { ok, db, dbEnv, ai, voice, commit }.
// ai/voice name which optional integrations are configured (presence only).
export async function GET() {
  const db = await pingDatabase();
  const body = {
    ok: db.ok,
    db: db.ok ? "ok" : db.reason,
    dbEnv: db.via,
    ai: process.env.ANTHROPIC_API_KEY ? "claude" : "template",
    voice: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY && process.env.VAPI_PRIVATE_KEY ? "vapi" : "web-speech",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local",
  };
  return NextResponse.json(body, { status: db.ok ? 200 : HTTP_SERVICE_UNAVAILABLE });
}
