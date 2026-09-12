import Link from "next/link";

export type CampaignTabKey = "collaborations" | "brief" | "shortlist" | "analytics";

const TABS: Array<{ key: CampaignTabKey; label: string; path: string }> = [
  { key: "collaborations", label: "Collaborations", path: "" },
  { key: "brief", label: "Brief", path: "/brief" },
  { key: "shortlist", label: "Shortlist", path: "/shortlist" },
  { key: "analytics", label: "Analytics", path: "/analytics" },
];

export function tabPath(tab: CampaignTabKey) {
  return TABS.find((t) => t.key === tab)?.path ?? "";
}

export function CampaignTabs({ campaignId, active }: { campaignId: string; active: CampaignTabKey }) {
  return (
    <nav aria-label="Campaign sections" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <ul className="flex gap-1 border-b">
        {TABS.map((tab) => (
          <li key={tab.key}>
            <Link
              href={`/brand/campaigns/${campaignId}${tab.path}`}
              aria-current={tab.key === active ? "page" : undefined}
              className="inline-block border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:text-foreground"
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
