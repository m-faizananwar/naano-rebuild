"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navFor } from "./nav";

type Props = { role: "brand" | "creator"; section: "primary" | "secondary"; onNavigate?: () => void };

// Resolves the nav on the client so icon components never cross the RSC boundary as props.
export function SidebarNav({ role, section, onNavigate }: Props) {
  const pathname = usePathname();
  const root = `/${role}`;
  const items = navFor(role)[section];
  return (
    <ul className="grid gap-0.5">
      {items.map((item) => {
        const active = isActive(pathname, item.href, root);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                active && "bg-brand/10 text-brand hover:bg-brand/10 hover:text-brand",
              )}
            >
              <span className="icon-chip -m-1 inline-flex rounded-full p-1" aria-hidden="true"><item.icon className="size-4 shrink-0" /></span>
              <span className="side-label truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
