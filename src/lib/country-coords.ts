// Approximate centroids for the countries the seed uses (lat, lng), so a
// creator-count-by-country list can be plotted without a geo dependency.
/* eslint-disable no-magic-numbers -- a coordinate table */
export const COUNTRY_COORDS: Record<string, [number, number]> = {
  FR: [46.6, 2.4],
  UK: [54.3, -2.9],
  GB: [54.3, -2.9],
  US: [39.8, -98.6],
  DE: [51.1, 10.4],
  PK: [30.4, 69.3],
  IN: [22.4, 79.1],
  NL: [52.2, 5.5],
  ES: [40.3, -3.7],
  IT: [42.5, 12.6],
  BE: [50.6, 4.7],
  CH: [46.8, 8.2],
  PT: [39.6, -8.0],
  SE: [62.2, 16.3],
  CA: [56.1, -106.3],
  IE: [53.4, -8.0],
  AT: [47.5, 14.5],
  DK: [56.1, 9.5],
  NO: [64.6, 11.5],
  FI: [64.0, 26.0],
  PL: [51.9, 19.1],
  AU: [-25.7, 134.5],
  BR: [-10.8, -52.9],
  AE: [23.9, 54.3],
  SG: [1.35, 103.8],
};
/* eslint-enable no-magic-numbers */

export type CountryCount = { code: string; count: number };
export type GlobeMarker = { code: string; count: number; location: [number, number]; size: number };

const MIN_SIZE = 0.03;
const MAX_SIZE = 0.08;

// Marker size scales with the country's share of the largest count.
export function globeMarkers(countries: CountryCount[]): GlobeMarker[] {
  const max = Math.max(1, ...countries.map((c) => c.count));
  return countries
    .map((c) => ({ ...c, location: COUNTRY_COORDS[c.code.toUpperCase()] }))
    .filter((c): c is CountryCount & { location: [number, number] } => Boolean(c.location))
    .map((c) => ({ code: c.code.toUpperCase(), count: c.count, location: c.location, size: MIN_SIZE + (MAX_SIZE - MIN_SIZE) * Math.sqrt(c.count / max) }));
}
