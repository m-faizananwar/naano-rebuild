import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/constants";

export const dynamic = "force-dynamic";

// A session cookie whose row is gone or expired (reseed, cleanup, expiry):
// drop the cookie so nothing looks logged in, then continue to /login.
// Server components cannot clear cookies during render, so the shell sends
// the browser through here.
export function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next") ?? "/";
  const url = new URL("/login", request.url);
  url.searchParams.set("next", next);
  const res = NextResponse.redirect(url);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
