"use client";

import { Button } from "@/components/ui/button";
import type { CreatorDto } from "../../schemas";
import { useMarketplace } from "../useMarketplace";

const STATUS_LABEL: Record<string, string> = {
  invited: "Invited",
  applied: "Applied",
  declined: "Declined",
};

type Props = { creator: CreatorDto; size?: "sm" | "default" | "lg"; className?: string; label?: string };

// "Book" opens "Your selection"; once the creator has a collaboration on the
// selected campaign the button reports that state instead.
export function BookButton({ creator, size = "sm", className, label = "Book" }: Props) {
  const { collaborationStatus, openBooking, ctx } = useMarketplace();
  const status = collaborationStatus(creator);
  if (status) {
    return (
      <Button type="button" size={size} variant="outline" disabled className={className}>
        {STATUS_LABEL[status] ?? "Booked"}
      </Button>
    );
  }
  return (
    <Button
      type="button"
      size={size}
      disabled={!ctx.selectedCampaign}
      title={ctx.selectedCampaign ? undefined : "Create a campaign to book creators"}
      onClick={() => openBooking(creator)}
      className={className}
    >
      {label}
    </Button>
  );
}
