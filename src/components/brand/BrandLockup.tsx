import { cn } from "cn";
import { BRAND } from "@/config/brand";
import { BrandMark } from "./BrandMark";

type Size = "sm" | "md" | "lg";

// Mark height ≈ the wordmark's cap-to-descender height plus a little; gap ~.35em.
const SIZES: Record<Size, { mark: number; text: string }> = {
  sm: { mark: 22, text: "text-[1.25rem]" },
  md: { mark: 28, text: "text-[1.6rem]" },
  lg: { mark: 40, text: "text-[2.25rem]" },
};

type Props = { size?: Size; className?: string; wordClassName?: string; markClassName?: string };

// Mark + "Amplio" in Cormorant Garamond 500 (loaded once in the root layout as
// --font-cormorant). Colour inherits: ink in the app and nav, the footer's teal
// in the footer, white on dark hover states.
export function BrandLockup({ size = "md", className, wordClassName, markClassName }: Props) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] leading-none", s.text, className)}>
      <BrandMark size={s.mark} className={markClassName} />
      <span className={cn("font-[family-name:var(--font-cormorant)] font-medium tracking-normal", wordClassName)}>{BRAND.wordmark}</span>
    </span>
  );
}
