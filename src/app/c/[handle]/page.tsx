import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { buttonVariants } from "@/components/ui/button";
import { WorkspaceCard } from "@/features/workspace/components/card/WorkspaceCard";
import { getPublicCard } from "@/features/workspace/server/card-queries";

import { BRAND } from "@/config/brand";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} · ${BRAND.wordmark} creator card` };
}

// The shareable "deal link": a creator's marketplace card, public.
export default async function PublicCardPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const card = await getPublicCard(handle);
  if (!card) notFound();
  return (
    <main className="mx-auto grid max-w-4xl gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/"><BrandLockup size="sm" /></Link>
        <Link href="/register/brand" className={buttonVariants({ size: "sm" })}>Book {card.name.split(" ")[0]} on {BRAND.name}</Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <WorkspaceCard card={card} />
      </div>
    </main>
  );
}
