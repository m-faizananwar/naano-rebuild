import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getViewer } from "@/features/auth/server/session";
import { BrandAudienceForm } from "@/features/workspace/components/settings/BrandAudienceForm";
import { BrandProfileForm } from "@/features/workspace/components/settings/BrandProfileForm";
import { TeamAccessPanel } from "@/features/workspace/components/settings/TeamAccessPanel";
import { getBrandSettings } from "@/features/workspace/server/settings-queries";
import type { BrandAudienceInput } from "@/features/workspace/schemas";

export const metadata: Metadata = { title: "Settings · naano" };

export default async function BrandSettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  const settings = await getBrandSettings(viewer.brand.id);
  if (!settings) redirect("/login");
  const { tab } = await searchParams;
  return (
    <>
      <PageHeader eyebrow="Naano workspace" title="Settings" description="Manage your company profile and the audience you want to reach." />
      <Tabs defaultValue={tab === "audience" || tab === "team" ? tab : "profile"}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="team">Team &amp; access</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="rounded-2xl border bg-background p-5">
          <BrandProfileForm defaults={{ company: settings.company, website: settings.website, valueProp: settings.valueProp }} />
        </TabsContent>
        <TabsContent value="audience" className="rounded-2xl border bg-background p-5">
          <BrandAudienceForm
            defaults={{ targetIndustries: settings.targetIndustries, targetRegions: settings.targetRegions } as BrandAudienceInput}
            icps={settings.icps}
          />
        </TabsContent>
        <TabsContent value="team" className="rounded-2xl border bg-background p-5">
          <TeamAccessPanel owner={settings.owner} />
        </TabsContent>
      </Tabs>
    </>
  );
}
