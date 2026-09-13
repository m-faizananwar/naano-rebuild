// Tiny event bus between the hero preload, the splash and the things that
// wait for it (nav entrance, hero card entrance). Module-level, client only.
type Listener<T> = (value: T) => void;

let heroProgress = 0;
let heroReady = false;
let splashDone = false;
const progressListeners = new Set<Listener<number>>();
const readyListeners = new Set<Listener<void>>();
const doneListeners = new Set<Listener<void>>();

export function reportHeroProgress(fraction: number) {
  heroProgress = Math.max(heroProgress, Math.min(1, fraction));
  progressListeners.forEach((l) => l(heroProgress));
}
export function markHeroReady() {
  if (heroReady) return;
  heroReady = true;
  readyListeners.forEach((l) => l());
}
export function onHeroProgress(l: Listener<number>) { progressListeners.add(l); l(heroProgress); return () => { progressListeners.delete(l); }; }
export function whenHeroReady(): Promise<void> {
  return heroReady ? Promise.resolve() : new Promise((resolve) => { readyListeners.add(() => resolve()); });
}

export function markSplashDone() {
  if (splashDone) return;
  splashDone = true;
  doneListeners.forEach((l) => l());
}
export const isSplashDone = () => splashDone;
export function onSplashDone(l: Listener<void>) {
  if (splashDone) { l(); return () => undefined; }
  doneListeners.add(l);
  return () => { doneListeners.delete(l); };
}
