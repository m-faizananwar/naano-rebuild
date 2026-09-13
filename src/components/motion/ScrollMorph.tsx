"use client";

import { useEffect } from "react";
import { startScrollMorph } from "@/lib/motion/scroll-morph";

// Mounts blovio's scroll-pop observer once for the whole app.
export function ScrollMorph() {
  useEffect(() => startScrollMorph(), []);
  return null;
}
