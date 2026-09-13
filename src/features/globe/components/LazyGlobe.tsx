"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// CreatorGlobe (framer-motion + cobe) as its own client-only chunk, so neither
// library rides in a route's first load; cobe itself loads only in view.
const CreatorGlobe = dynamic(() => import("./CreatorGlobe").then((m) => m.CreatorGlobe), { ssr: false, loading: () => null });

export function LazyGlobe(props: ComponentProps<typeof CreatorGlobe>) {
  return <CreatorGlobe {...props} />;
}
