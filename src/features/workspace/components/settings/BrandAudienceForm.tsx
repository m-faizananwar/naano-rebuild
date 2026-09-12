"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, REGIONS } from "../../constants";
import type { BrandAudienceInput } from "../../schemas";
import { updateBrandAudience } from "../../server/actions";
import { ChipSelect } from "./ChipSelect";

export function BrandAudienceForm({ defaults, icps }: { defaults: BrandAudienceInput; icps: Array<{ title: string; description: string }> }) {
  const router = useRouter();
  const [industries, setIndustries] = useState<string[]>(defaults.targetIndustries);
  const [regions, setRegions] = useState<string[]>(defaults.targetRegions);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const result = await updateBrandAudience({
      targetIndustries: industries as BrandAudienceInput["targetIndustries"],
      targetRegions: regions as BrandAudienceInput["targetRegions"],
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Audience saved");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target: ICP</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {icps.map((icp, i) => (
            <li key={icp.title} className="rounded-xl border p-3">
              <p className="text-xs font-semibold text-brand">ICP {i + 1}</p>
              <p className="font-medium">{icp.title}</p>
              <p className="mt-1 line-clamp-4 text-xs text-muted-foreground">{icp.description}</p>
            </li>
          ))}
          {icps.length === 0 ? <li className="text-sm text-muted-foreground">No ICPs yet — they come from onboarding.</li> : null}
        </ul>
      </div>
      <ChipSelect label="Target industries" options={INDUSTRIES} value={industries} onChange={setIndustries} />
      <ChipSelect label="Target regions" options={REGIONS} value={regions} onChange={setRegions} />
      <div>
        <Button type="button" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}
