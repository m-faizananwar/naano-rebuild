import { ErrorState } from "@/components/page/ErrorState";

export function CampaignNotFound() {
  return <ErrorState title="Campaign not found" body="This campaign does not exist or belongs to another workspace." retryHref="/brand/campaigns" />;
}
