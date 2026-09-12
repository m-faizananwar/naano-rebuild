import type { ReactNode } from "react";
import { PublicAssistantPill } from "@/features/public/components/nav/PublicAssistantPill";
import { PublicFooter } from "@/features/public/components/nav/PublicFooter";
import { PublicNav } from "@/features/public/components/nav/PublicNav";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <PublicAssistantPill />
    </>
  );
}
