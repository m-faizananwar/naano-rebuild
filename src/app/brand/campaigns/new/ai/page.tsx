import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/components/page/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import { AiComposer } from "@/features/campaigns/components/create/AiComposer";
import { AiHistoryRail } from "@/features/campaigns/components/create/AiHistoryRail";
import { listAiHistory } from "@/features/campaigns/server/queries";
import { requireBrand } from "@/features/campaigns/server/require-brand";
import { safeQuery } from "@/features/campaigns/server/safe-query";

export const metadata: Metadata = { title: "Create with AI · naano" };

export default async function CreateWithAiPage() {
  const viewer = await requireBrand("/brand/campaigns/new/ai");
  const history = await safeQuery("ai history", { brandId: viewer.brand.id }, () => listAiHistory(viewer.brand.id));
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/brand/campaigns/new" aria-label="Back" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ChevronLeft aria-hidden="true" />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Generate your campaign in one click</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {history.ok ? <AiHistoryRail history={history.data} /> : <ErrorState body="History could not be loaded." retryHref="/brand/campaigns/new/ai" />}
        <div>
          <AiComposer />
          <p className="mt-3 text-xs text-muted-foreground">
            The AI turns your workspace profile and this prompt into an editable brief. Without an ANTHROPIC_API_KEY it is prepared from a template.
          </p>
        </div>
      </div>
    </>
  );
}
