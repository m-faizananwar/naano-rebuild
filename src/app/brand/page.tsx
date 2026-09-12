import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";

export const metadata: Metadata = { title: "Overview · naano" };

export default async function BrandOverviewPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return (
    <>
      <PageHeader
        title={`Hello ${viewer.firstName} 👋`}
        description={`Here is what is happening for ${viewer.brand?.company ?? "your workspace"} on Naano.`}
      />
      <EmptyState
        title="No activity yet"
        body="Find creators for your first campaign. Their posts, clicks and leads land here."
        cta={{ href: "/brand/creators", label: "Find creators" }}
      />
    </>
  );
}
