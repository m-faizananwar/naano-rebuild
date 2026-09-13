// The seed's avatar source (scripts/seed/creators.ts avatarFor), shared with the
// UI so anything that only has a name still shows a picture. Deterministic:
// the same name always draws the same face. Pure.
const DICEBEAR = "https://api.dicebear.com/9.x";
const CREATOR_BG = "e8eefc,dbe4ff,eef2ff";
const BRAND_BG = "0d0c0b";

export function avatarFor(seed: string): string {
  return `${DICEBEAR}/notionists/svg?seed=${encodeURIComponent(seed.trim().toLowerCase())}&backgroundColor=${CREATOR_BG}`;
}

// Brand marks: an abstract shape mark seeded by the company name, in ink.
export function brandMarkFor(company: string): string {
  return `${DICEBEAR}/shapes/svg?seed=${encodeURIComponent(company.trim().toLowerCase())}&backgroundColor=${BRAND_BG}`;
}
