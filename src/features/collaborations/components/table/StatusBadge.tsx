import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_TONES, type StatusTone } from "@/lib/collaboration-labels";
import type { CollaborationStatus } from "@/lib/collaboration-status";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-brand/10 text-brand",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  danger: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, className }: { status: CollaborationStatus; className?: string }) {
  return (
    // Keyed on the status so a transition crossfades the chip in.
    <Badge key={status} variant="secondary" className={cn("animate-fade", TONE_CLASSES[STATUS_TONES[status]], "border-transparent", className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
