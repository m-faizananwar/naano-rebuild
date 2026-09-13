"use client";

import type { BorderBeamProps } from "border-beam";
import { type ReactNode, useState } from "react";
import { Beam } from "./Beam";

// A beam that only runs while the pointer is over it (Sign up pill, chamfer CTA).
export function HoverBeam({ children, className, ...rest }: Omit<BorderBeamProps, "active" | "children"> & { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <Beam {...rest} active={hover} className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      {children}
    </Beam>
  );
}
