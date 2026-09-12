import { Globe } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { NaanoWordmark } from "@/components/NaanoWordmark";
import { CreatorCardPreview } from "./CreatorCardPreview";

type Props = {
  children: ReactNode;
  panelTitle: string;
  panelBody: string;
  panelFootnote?: string;
  // "brand": solid blue panel (login, register, brand sign-up).
  // "card": light panel with the live marketplace-card preview (creator sign-up).
  panelVariant?: "brand" | "card";
  panelEyebrow?: string;
};

function BrandPanel({ panelTitle, panelBody, panelFootnote }: Pick<Props, "panelTitle" | "panelBody" | "panelFootnote">) {
  return (
    <aside className="hidden flex-col justify-center bg-brand px-16 text-brand-foreground lg:flex xl:px-24">
      <h2 className="text-4xl font-bold tracking-tight">{panelTitle}</h2>
      <p className="mt-5 max-w-md text-lg/relaxed opacity-90">{panelBody}</p>
      {panelFootnote ? <p className="mt-8 text-sm opacity-75">{panelFootnote}</p> : null}
    </aside>
  );
}

function CardPanel({ panelTitle, panelBody, panelEyebrow }: Pick<Props, "panelTitle" | "panelBody" | "panelEyebrow">) {
  return (
    <aside className="hidden flex-col items-center bg-brand-soft/60 px-12 pt-16 lg:flex">
      {panelEyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{panelEyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight">{panelTitle}</h2>
      <p className="mt-2 max-w-md text-center text-muted-foreground">{panelBody}</p>
      <CreatorCardPreview className="mt-8" />
    </aside>
  );
}

// naano's register/login layout: white form column left, blue panel right.
export function AuthSplitLayout({ children, panelVariant = "brand", ...panel }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-24 xl:px-32">
        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between">
              <Link href="/" aria-label="naano home" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
                <NaanoWordmark />
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
      {panelVariant === "card" ? <CardPanel {...panel} /> : <BrandPanel {...panel} />}
    </div>
  );
}
