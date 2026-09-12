import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { THREAD_STATUSES, brandNextAction, creatorNextAction } from "@/lib/collaboration-labels";
import type { CollaborationStatus } from "@/lib/collaboration-status";
import { formatDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { BriefDto, CollaborationDto, ViewerRole } from "../../schemas";
import { BrandMark } from "../BrandMark";
import { ViewBriefButton } from "../brief/ViewBriefButton";
import { StatusBadge } from "../table/StatusBadge";

type Props = { collaboration: CollaborationDto; status: CollaborationStatus; role: ViewerRole; brief: BriefDto };

export function CollaborationHeader({ collaboration: c, status, role, brief }: Props) {
  const nextAction = (role === "creator" ? creatorNextAction : brandNextAction)({ ...c, status });
  const canMessage = THREAD_STATUSES.includes(status);
  return (
    <header className="mb-6">
      <Link href={`/${role}/collaborations`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Collaborations
      </Link>
      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          {role === "creator" ? (
            <BrandMark initial={c.brandInitial} name={c.brandCompany} size="lg" />
          ) : (
            <Avatar size="lg" className="size-14">
              <AvatarImage src={c.creatorAvatarUrl} alt="" />
              <AvatarFallback>{c.creatorName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{role === "creator" ? c.brandCompany : c.creatorName}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-muted-foreground">{c.campaignName}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">{role === "creator" ? "Your net" : "Amount"}:</span> {formatCents(c.feeCents, "EUR")}
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="font-medium">Due:</span> {formatDate(c.dueDate, "no deadline")}
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="text-muted-foreground">{nextAction}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <ViewBriefButton brief={brief} />
          {canMessage ? (
            <Link href={`/${role}/messages/${c.id}`} className={buttonVariants({ variant: "outline" })}>
              <MessageCircle data-icon="inline-start" aria-hidden="true" />
              Messages
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
