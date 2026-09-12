import { Badge } from "@/components/ui/badge";
import type { CollaborationStatus } from "@/lib/collaboration-status";
import { COLLAB_STATUS_LABEL } from "../../constants";

const VARIANT: Record<CollaborationStatus, "default" | "secondary" | "outline" | "destructive"> = {
  invited: "outline",
  applied: "outline",
  accepted: "secondary",
  declined: "destructive",
  draft_submitted: "default",
  changes_requested: "secondary",
  approved: "secondary",
  scheduled: "secondary",
  live: "default",
  paid: "secondary",
};

export function StatusBadge({ status }: { status: CollaborationStatus }) {
  return <Badge variant={VARIANT[status]}>{COLLAB_STATUS_LABEL[status]}</Badge>;
}
