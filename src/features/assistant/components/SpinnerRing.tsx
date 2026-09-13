// naano's dashed-ring glyph on the left of the pill; rotates while thinking.
export function SpinnerRing({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={spinning ? "size-5 shrink-0 animate-spin-slow motion-reduce:animate-none" : "size-5 shrink-0"}
      style={{ animationDuration: spinning ? "2.4s" : undefined }}
    >
      <circle cx="12" cy="12" r="8.5" strokeDasharray="4 4.2" />
    </svg>
  );
}
