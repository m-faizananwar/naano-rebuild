import { faker } from "@faker-js/faker";

// Fixed seed: the same rows every run, so screenshots and tests are stable.
export const SEED = 20260912;
faker.seed(SEED);
export { faker };

export function lognormal(median: number, sigma: number, min: number, max: number) {
  // Box–Muller on faker's seeded generator.
  const u1 = faker.number.float({ min: 1e-9, max: 1 });
  const u2 = faker.number.float({ min: 0, max: 1 });
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.round(Math.min(max, Math.max(min, median * Math.exp(sigma * z))));
}

export function jitter(value: number, spread: number) {
  return value * faker.number.float({ min: 1 - spread, max: 1 + spread });
}

export function pickWeighted<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = faker.number.float({ min: 0, max: total });
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

// Turns raw weights into integer percentages that sum to exactly 100.
export function toPercentMix(weights: Record<string, number>): Record<string, number> {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  const rounded = entries.map(([k, w]) => [k, Math.max(1, Math.round((w / total) * 100))] as [string, number]);
  const drift = 100 - rounded.reduce((sum, [, v]) => sum + v, 0);
  rounded.sort((a, b) => b[1] - a[1]);
  rounded[0][1] += drift;
  return Object.fromEntries(rounded);
}

export function daysAgo(days: number, hour = 10) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour, faker.number.int({ min: 0, max: 59 }), faker.number.int({ min: 0, max: 59 }), 0);
  return d;
}

export function daysFromNow(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

export function hex(length: number) {
  return faker.string.hexadecimal({ length, casing: "lower", prefix: "" });
}
