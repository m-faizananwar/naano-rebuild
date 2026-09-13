import { NextResponse } from "next/server";
import { pingDatabase } from "@/db/health";
import { aiProvider, demotedProviders } from "@/features/ai/server/provider";
import { aiKeyEnvNames } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

const HTTP_SERVICE_UNAVAILABLE = 503;

// Smoke test after every deploy: { ok, db, dbEnv, ai, voice, email, commit }.
// ai/voice/email name which optional integrations are configured (presence only).
export async function GET() {
  const db = await pingDatabase();
  const body = {
    ok: db.ok,
    db: db.ok ? "ok" : db.reason,
    dbEnv: db.via,
    ai: aiProvider().name,
    // names only, never values: shows a misspelt or prefixed key variable
    aiEnv: aiKeyEnvNames(process.env),
    // providers demoted in this process after an account-level error (reason text, no payload)
    aiDemoted: demotedProviders(),
    voice: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY && process.env.VAPI_PRIVATE_KEY ? "vapi" : "web-speech",
    email: process.env.RESEND_API_KEY ? "resend" : "on-screen",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local",
  };
  return NextResponse.json(body, { status: db.ok ? 200 : HTTP_SERVICE_UNAVAILABLE });
}
