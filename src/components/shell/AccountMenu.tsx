"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navFor } from "./nav";
import { SignOutButton } from "./SignOutButton";
import { initialsOf, type ShellViewer } from "./viewer";

export function AccountMenu({ viewer }: { viewer: ShellViewer }) {
  const items = navFor(viewer.role).account;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <Avatar className="size-9">
          {viewer.avatarUrl ? <AvatarImage src={viewer.avatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-foreground text-xs font-semibold text-background">{initialsOf(viewer)}</AvatarFallback>
        </Avatar>
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block font-medium">
              {viewer.firstName} {viewer.lastName}
            </span>
            <span className="block text-xs font-normal text-muted-foreground">{viewer.workspace}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
              <item.icon aria-hidden="true" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {viewer.preview ? null : (
          <>
            <DropdownMenuSeparator />
            <div className="px-1 py-0.5">
              <SignOutButton
                csrfToken={viewer.csrfToken}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
