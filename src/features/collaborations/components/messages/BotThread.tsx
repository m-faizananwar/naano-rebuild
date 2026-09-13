import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ViewerRole } from "../../schemas";
import { SUPPORT_BOT } from "../../ui-constants";

import { BRAND } from "@/config/brand";
// Static helper thread: the bot's greeting and one canned reply.
export function BotThread({ role }: { role: ViewerRole }) {
  return (
    <>
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Link href={`/${role}/messages`} className="lg:hidden" aria-label="Back to all messages">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground">{/* eslint-disable-next-line @next/next/no-img-element -- the product mark */}<img src="/logo.svg" alt="" className="size-full" /></span>
        <div>
          <h2 className="font-semibold">{SUPPORT_BOT.name}</h2>
          <p className="text-xs text-muted-foreground">{BRAND.name} support</p>
        </div>
      </header>
      <div className="flex-1 space-y-3 p-4">
        <p className="inline-block max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm">{SUPPORT_BOT.preview}</p>
        <br />
        <p className="inline-block max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm">{SUPPORT_BOT.reply}</p>
      </div>
      <p className="border-t p-3 text-center text-xs text-muted-foreground">{BRAND.bot} does not take replies in this build.</p>
    </>
  );
}
