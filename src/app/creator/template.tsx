import type { ReactNode } from "react";
import { RouteEnter } from "@/components/motion/RouteEnter";

// Remounts on every navigation inside this shell: the page pops in.
export default function Template({ children }: { children: ReactNode }) {
  return <RouteEnter>{children}</RouteEnter>;
}
