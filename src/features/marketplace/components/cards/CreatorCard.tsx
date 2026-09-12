"use client";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CreatorDto } from "../../schemas";
import { useMarketplace } from "../useMarketplace";
import { BookButton } from "./BookButton";
import { CreatorIdentity } from "./CreatorIdentity";
import { CreatorStats } from "./CreatorStats";
import { FitPill } from "./FitPill";
import { LinkedInBadge } from "./LinkedInBadge";
import { ShortlistButton } from "./ShortlistButton";

export function CreatorCard({ creator }: { creator: CreatorDto }) {
  const { openProfile } = useMarketplace();
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border bg-background p-4 shadow-xs transition-shadow hover:shadow-md" aria-label={creator.name}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ShortlistButton creator={creator} />
          <LinkedInBadge />
        </div>
        <BookButton creator={creator} />
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="size-14 rounded-full border">
          <AvatarImage src={creator.avatarUrl} alt="" />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CreatorIdentity creator={creator} />
      </div>

      <CreatorStats creator={creator} />

      <div className="mt-auto flex items-center justify-between">
        <FitPill score={creator.fit.score} />
        <button
          type="button"
          onClick={() => openProfile(creator)}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          View profile
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
