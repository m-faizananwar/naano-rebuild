import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LinkForm } from "@/features/campaigns/components/create/LinkForm";
import { requireBrand } from "@/features/campaigns/server/require-brand";

export const metadata: Metadata = { title: "Start from your link · naano" };

export default async function CreateFromLinkPage() {
  await requireBrand("/brand/campaigns/new/link");
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/brand/campaigns/new" aria-label="Back" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ChevronLeft aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Start from your link</h1>
          <p className="mt-1 text-muted-foreground">Paste an influence campaign you already ran: Naano reuses the brief and structure.</p>
        </div>
      </div>
      <LinkForm />
    </>
  );
}
