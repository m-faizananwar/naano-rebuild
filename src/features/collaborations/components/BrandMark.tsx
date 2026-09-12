import { cn } from "cn";

type Props = { initial: string; name: string; size?: "sm" | "md" | "lg"; className?: string };

const SIZES = { sm: "size-8 text-sm", md: "size-10 text-base", lg: "size-14 text-xl" } as const;

// The brand "logo": its initial in a rounded square, like naano's cards.
export function BrandMark({ initial, name, size = "md", className }: Props) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-foreground font-semibold text-background",
        SIZES[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
