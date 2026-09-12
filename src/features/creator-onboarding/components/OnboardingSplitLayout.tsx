import { Globe } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { PANEL_COPY } from "../constants";
import { LiveCard } from "./card/LiveCard";
import type { CardModel } from "./card/toCardModel";

import { BRAND } from "@/config/brand";
// naano's onboarding layout: white form column left, light panel with the
// live marketplace card right. On narrow screens the panel stacks under the form.
export function OnboardingSplitLayout({ children, card }: { children: ReactNode; card: CardModel }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-20 xl:px-28">
        <div className="flex flex-1 flex-col py-6 lg:justify-center">
          <div className="animate-section w-full max-w-md">
            <div className="flex items-center justify-between">
              <Link href="/" aria-label={`${BRAND.wordmark} home`} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
                <BrandWordmark />
              </Link>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80">
                <Globe className="size-3.5" aria-hidden="true" />
                EN
              </span>
            </div>
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
      <aside className="flex flex-col items-center bg-brand-soft/60 px-6 pb-16 pt-12 lg:px-12 lg:pt-16" aria-label="Your marketplace card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{PANEL_COPY.eyebrow}</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight">{PANEL_COPY.title}</h2>
        <p className="mt-2 max-w-md text-center text-muted-foreground">{PANEL_COPY.body}</p>
        <div className="mt-8 w-full max-w-md">
          <LiveCard model={card} />
        </div>
      </aside>
    </div>
  );
}
