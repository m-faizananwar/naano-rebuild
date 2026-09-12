import { type NextRequest, NextResponse } from "next/server";
import { CLICK_COOKIE, CLICK_COOKIE_DAYS, CLICK_QUERY_PARAM } from "@/features/tracking/constants";
import { recordClick } from "@/features/tracking/server/record-click";

export const dynamic = "force-dynamic";

const DAY_SECONDS = 86_400;
const HTTP_FOUND = 302;
const HTTP_NOT_FOUND = 404;

// Tracked link: one insert + one 302, nothing else. The click id travels on a
// cookie (same-site demo pages) and a query param (any destination) so the
// pixel can attribute what happens next.
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await recordClick(code, {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
    country: request.headers.get("x-vercel-ip-country"),
  });
  if (result.kind === "unconfigured") return NextResponse.redirect(new URL("/", request.url), HTTP_FOUND);
  if (result.kind === "unknown") return new NextResponse("Unknown link", { status: HTTP_NOT_FOUND });

  // Relative destinations (the seeded demo landing page) resolve against this
  // deployment. Seeded placeholder hosts (*.example) have nowhere to go, so
  // they land on the demo page for that brand with its own pixel key.
  const destination = new URL(result.destination, request.url);
  if (destination.hostname.endsWith(".example")) {
    destination.href = new URL(`/demo/landing?site=${result.siteKey}`, request.url).href;
  }
  destination.searchParams.set(CLICK_QUERY_PARAM, result.clickId);
  const response = NextResponse.redirect(destination, HTTP_FOUND);
  response.cookies.set(CLICK_COOKIE, result.clickId, {
    maxAge: CLICK_COOKIE_DAYS * DAY_SECONDS,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
