import type { Metadata } from "next";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = { title: `Call · ${BRAND.wordmark}` };

// The call itself is the CallOverlayHost in the app layout (it survives route
// changes under it); this page only gives the route a document.
export default function BrandCallPage() {
  return <h1 className="sr-only">On a call with {BRAND.name}</h1>;
}
