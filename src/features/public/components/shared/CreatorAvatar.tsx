import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";

type Props = { name: string; src?: string | null; className?: string };

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Avatar with an initials fallback; the seed uses remote SVG avatars, the
// static fallbacks have none.
export function CreatorAvatar({ name, src, className }: Props) {
  return (
    <Avatar className={cn("bg-brand-soft", className)}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="bg-brand-soft text-xs font-semibold text-brand">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
