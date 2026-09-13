"use client";

import { BorderBeam, type BorderBeamProps } from "border-beam";
import { useReducedMotion } from "./useReducedMotion";

// border-beam with the app's defaults: colorful, light theme, off under
// reduced motion. Pass `active={false}` for hover-only beams and flip it on.
export function Beam({ active = true, colorVariant = "colorful", theme = "light", ...rest }: BorderBeamProps) {
  const reduced = useReducedMotion();
  return <BorderBeam {...rest} colorVariant={colorVariant} theme={theme} active={active && !reduced} />;
}
