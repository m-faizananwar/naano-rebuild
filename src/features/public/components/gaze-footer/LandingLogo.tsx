import { BRAND } from "@/config/brand";

// Our wordmark in the footer's logo slot: the same 169×40 viewBox as the
// Logoipsum svg so it takes the slot's width and position unchanged.
export function LandingLogo() {
  return (
    <svg aria-hidden="true" width="169" height="40" viewBox="0 0 169 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="40" height="40" rx="10" fill="currentColor" />
      <text x="20" y="29" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="26" fontWeight="700" fill="white">a</text>
      <text x="50" y="31" fontFamily="Inter, system-ui, sans-serif" fontSize="34" fontWeight="700" letterSpacing="-1" fill="currentColor">{BRAND.wordmark}</text>
    </svg>
  );
}
