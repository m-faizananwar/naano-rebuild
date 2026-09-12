import "server-only";
import { redirect } from "next/navigation";
import { getViewer, type Viewer } from "@/features/auth/server/session";

export type BrandViewer = Viewer & { brand: NonNullable<Viewer["brand"]> };

// Pages call this first: no session → login, a creator → their own workspace.
export async function requireBrand(next: string): Promise<BrandViewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!viewer.brand) redirect("/creator");
  return { ...viewer, brand: viewer.brand };
}
