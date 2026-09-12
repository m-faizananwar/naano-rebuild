import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/constants";

// Optimistic guard: a session cookie must exist to enter either app shell.
// The layouts do the real check (valid session, correct role). Without a
// database there is nothing to protect, so the shells stay reachable and
// render their "database not configured" state.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const guarded = pathname.startsWith("/brand") || pathname.startsWith("/creator");
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const dbConfigured = Boolean(process.env.DATABASE_URL);

  if (guarded && dbConfigured && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/brand/:path*", "/creator/:path*"],
};
