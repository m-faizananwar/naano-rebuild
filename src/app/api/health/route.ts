import { NextResponse } from "next/server";
import { pingDatabase } from "@/db/health";

export const dynamic = "force-dynamic";

const HTTP_SERVICE_UNAVAILABLE = 503;

// Smoke test after every deploy: { ok, db, commit }.
export async function GET() {
  const db = await pingDatabase();
  const body = {
    ok: db.ok,
    db: db.ok ? "ok" : db.reason,
    dbEnv: db.via,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local",
  };
  return NextResponse.json(body, { status: db.ok ? 200 : HTTP_SERVICE_UNAVAILABLE });
}
