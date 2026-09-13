import type { ReactNode } from "react";
import { PublicAssistantPill } from "@/features/public/components/nav/PublicAssistantPill";
import { PublicFooter } from "@/features/public/components/nav/PublicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <PublicAssistantPill />
    </>
  );
}
