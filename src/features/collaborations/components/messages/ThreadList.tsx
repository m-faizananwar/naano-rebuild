"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { CampaignOption, ThreadDto, ViewerRole } from "../../schemas";
import { COPY, NAANOBOT_THREAD_ID } from "../../ui-constants";
import { NaanoBotItem } from "./NaanoBotItem";
import { ThreadListItem } from "./ThreadListItem";

type Props = { threads: ThreadDto[]; role: ViewerRole; activeId: string | null; campaigns: CampaignOption[] };

export function ThreadList({ threads, role, activeId, campaigns }: Props) {
  const [query, setQuery] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter(
      (t) =>
        (!campaignId || t.campaignId === campaignId) &&
        (!q || `${t.counterpartName} ${t.campaignName}`.toLowerCase().includes(q)),
    );
  }, [threads, query, campaignId]);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 p-4">
        <h1 className="text-2xl font-semibold tracking-tight">All messages</h1>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input type="search" aria-label="Search conversations" placeholder="Search conversations" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        {campaigns.length > 0 ? (
          <select
            aria-label="Campaign"
            className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <ul className="flex-1 overflow-y-auto">
        <NaanoBotItem role={role} active={activeId === NAANOBOT_THREAD_ID} />
        {visible.map((t) => (
          <ThreadListItem key={t.collaborationId} thread={t} role={role} active={activeId === t.collaborationId} />
        ))}
      </ul>
      {threads.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{COPY.brandThreadsEmptyTitle}</p>
          <p className="mt-1">{role === "brand" ? COPY.brandThreadsEmptyBody : COPY.creatorThreadsEmptyBody}</p>
        </div>
      ) : visible.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No conversation matches.</p>
      ) : null}
    </div>
  );
}
