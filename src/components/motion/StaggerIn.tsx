"use client";

import { type ComponentPropsWithoutRef, type ElementType, useEffect, useRef } from "react";
import { stagger } from "@/lib/motion/anime";

type Props<T extends ElementType> = { as?: T; replayKey?: string | number; each?: number } & ComponentPropsWithoutRef<T>;

// Direct children rise in one after another (30ms apart by default) on mount
// and again whenever `replayKey` changes — a filter, a page, a tab. Goes
// through src/lib/motion/anime so reduced motion is one switch.
export function StaggerIn<T extends ElementType = "div">({ as, replayKey, each, children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = stagger(el.children, { each });
    return () => handle.cancel();
  }, [replayKey, each]);
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}
