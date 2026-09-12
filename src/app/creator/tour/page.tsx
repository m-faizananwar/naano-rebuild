import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Guided tour · naano" };

export default function CreatorTourPage() {
  return (
    <>
      <PageHeader title="Guided tour" description="Five steps through your creator workspace: your card, opportunities, collaborations, analytics and earnings." />
      <EmptyState
        title="The tour starts on the Overview"
        body="Each step points at the screen it explains."
        cta={{ href: "/creator", label: "Start on Overview" }}
      />
    </>
  );
}
