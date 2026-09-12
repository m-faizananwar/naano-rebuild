import { NextResponse } from "next/server";
import { pixelEventSchema } from "@/features/tracking/schemas";
import { recordPixelEvent } from "@/features/tracking/server/record-pixel-event";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;

export function OPTIONS() {
  return new NextResponse(null, { status: HTTP_NO_CONTENT, headers: CORS });
}

// Collector for /n.js. Always answers quickly and never leaks why an event
// was dropped: the pixel runs on customer sites.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: HTTP_BAD_REQUEST, headers: CORS });
  }
  const parsed = pixelEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: HTTP_BAD_REQUEST, headers: CORS });
  try {
    const stored = await recordPixelEvent(parsed.data);
    return NextResponse.json({ ok: stored }, { headers: CORS });
  } catch (error) {
    console.error("[pixel] failed to record event", error);
    return NextResponse.json({ ok: false }, { headers: CORS });
  }
}
