import { NextResponse } from "next/server";
import { getViewer } from "@/features/auth/server/session";
import { getClickLog } from "@/features/tracking/server/queries";

import { BRAND } from "@/config/brand";
export const dynamic = "force-dynamic";

const HTTP_UNAUTHORIZED = 401;

function csvCell(value: string | null) {
  const v = value ?? "";
  return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v;
}

// The click log as CSV: the auditable version of "Attribution by creator".
export async function GET(request: Request) {
  const viewer = await getViewer();
  if (!viewer?.brand) return new NextResponse("Sign in required", { status: HTTP_UNAUTHORIZED });
  const creatorId = new URL(request.url).searchParams.get("creator") ?? undefined;
  const rows = await getClickLog(viewer.brand.id, creatorId);
  const header = "clicked_at,creator,campaign,link_code,country,referrer,user_agent";
  const body = rows.map((r) => [r.clickedAt, r.creator, r.campaign, r.code, r.country, r.referrer, r.userAgent].map(csvCell).join(","));
  const filename = `${BRAND.key}-clicks-${creatorId ? `creator-${creatorId.slice(0, 8)}-` : ""}${new Date().toISOString().slice(0, "YYYY-MM-DD".length)}.csv`;
  return new NextResponse([header, ...body].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"` },
  });
}
