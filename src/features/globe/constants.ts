// cobe globe in the product palette: near-white base, deep-teal markers, no tint.
export const GLOBE = {
  dark: 0,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.96, 0.95, 0.93] as [number, number, number],
  markerColor: [0.09, 0.35, 0.4] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  theta: 0.25,
  pixelRatio: 2,
} as const;
export const GLOBE_SPIN_PER_FRAME = 0.0035;
export const MARKER_SIZE = { min: 0.03, max: 0.08 } as const;
// Drag: pointer px → radians, and how fast the flick decays (≈1s to rest at 60fps).
export const DRAG_RADIANS_PER_PX = 0.005;
export const INERTIA_DECAY = 0.94;
export const INERTIA_STOP = 0.0002;
