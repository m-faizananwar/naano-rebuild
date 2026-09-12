import { Inbox, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  title: string;
  body: string;
  cta?: { href: string; label: string };
  icon?: LucideIcon;
};

export function EmptyState({ title, body, cta, icon: Icon = Inbox }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-background px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
      {cta ? (
        <Link href={cta.href} className={buttonVariants({ className: "mt-6" })}>
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}
