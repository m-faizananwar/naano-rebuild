// Emoji flag from an ISO 3166-1 alpha-2 code. The seed uses "UK", which is
// not ISO; the flag lives under GB.
const ALIASES: Record<string, string> = { UK: "GB" };
const REGIONAL_INDICATOR_OFFSET = 0x1f1e6;
const CODE_LENGTH = 2;
const CHAR_A = 65;

export function countryFlag(code: string): string {
  const iso = (ALIASES[code.toUpperCase()] ?? code.toUpperCase()).trim();
  if (iso.length !== CODE_LENGTH || !/^[A-Z]{2}$/.test(iso)) return "";
  return String.fromCodePoint(...[...iso].map((c) => REGIONAL_INDICATOR_OFFSET + c.charCodeAt(0) - CHAR_A));
}

const COUNTRY_NAMES: Record<string, string> = {
  FR: "France",
  UK: "United Kingdom",
  GB: "United Kingdom",
  US: "United States",
  DE: "Germany",
  PK: "Pakistan",
  IN: "India",
  NL: "Netherlands",
  ES: "Spain",
  IT: "Italy",
  BE: "Belgium",
  CH: "Switzerland",
  PT: "Portugal",
  SE: "Sweden",
  CA: "Canada",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}
