"use client";

import { useRouter } from "next/navigation";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

// Capsule geometry per cell (index 0 = the lockup): 5px protrusions at both ends.
const CAP_LEFT = ["-5px", "20%", "40%", "60%", "80%"];
const CAP_WIDTH = ["calc(20% + 5px)", "20%", "20%", "20%", "calc(20% + 5px)"];
const COLLAPSE_MS = 980;
const REVERSE_MS = 980;
const SCROLL_SETTLE_MS = 160;
const STORAGE_KEY = "glassnav:collapsed";
const CAPSULE_HALF_H = 36;

export type NavPhase = "idle" | "collapsing" | "expanding";
export type ArrivalClasses = { collapsed: string; trackFaded: string; chosen: string; faded: string };

type Input = {
  controller: RefObject<HTMLDivElement | null>;
  capsule: RefObject<HTMLDivElement | null>;
  cellCount: number;
  // class names applied imperatively for the pre-paint collapsed frame on arrival
  classes: ArrivalClasses;
};

function readArrival(cellCount: number): number | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    const index = stored === null ? NaN : Number(stored);
    return Number.isFinite(index) && index > 0 && index < cellCount ? index : null;
  } catch { return null; }
}

// The controller's behaviour: hover/focus capsule, pointer-tracked highlight,
// the forward choreography before navigation, the reverse on arrival or after
// an in-page scroll settles. Geometry goes through custom properties only.
export function useGlassNav({ controller, capsule, cellCount, classes }: Input) {
  const router = useRouter();
  const [phase, setPhase] = useState<NavPhase>("idle");
  const [chosen, setChosen] = useState<number | null>(null);
  const lock = useRef(false);
  const focused = useRef<number | null>(null);

  const setCapsule = (index: number) => {
    const cap = capsule.current;
    if (!cap) return;
    cap.style.setProperty("--cap-left", CAP_LEFT[index] ?? CAP_LEFT[0]);
    cap.style.setProperty("--cap-width", CAP_WIDTH[index] ?? CAP_WIDTH[0]);
  };

  // Reverse: the bar opens and the label travels back to its cell (dropping
  // the chosen class transitions the transform over 980ms); --dx/--dy are
  // cleared once it has settled.
  const expand = (index: number) => {
    setPhase("expanding");
    setChosen(null);
    setCapsule(0);
    window.setTimeout(() => {
      const cell = controller.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
      cell?.style.removeProperty("--dx");
      cell?.style.removeProperty("--dy");
      setPhase("idle");
      lock.current = false;
    }, REVERSE_MS);
  };

  // The label's travel to the collapsed capsule centre, measured from the live geometry.
  const placeChosen = (el: HTMLElement, cell: HTMLElement) => {
    const c = el.getBoundingClientRect();
    const b = cell.getBoundingClientRect();
    cell.style.setProperty("--dx", `${(c.left + c.width / 2 - (b.left + b.width / 2)).toFixed(1)}px`);
    cell.style.setProperty("--dy", `${(c.top - 1 + CAPSULE_HALF_H - (b.top + b.height / 2)).toFixed(1)}px`);
  };

  // Route arrival: paint the first frame collapsed on the clicked label (DOM
  // classes, before paint), then hand over to React and play the reverse.
  useLayoutEffect(() => {
    const el = controller.current;
    const index = readArrival(cellCount);
    if (!el || index === null) { setCapsule(0); return; }
    lock.current = true;
    el.classList.add(classes.collapsed, classes.trackFaded);
    el.querySelectorAll<HTMLElement>("[data-index]").forEach((cell) => {
      if (Number(cell.dataset.index) !== index) cell.classList.add(classes.faded);
      else { placeChosen(el, cell); cell.classList.add(classes.chosen); }
    });
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.remove(classes.collapsed, classes.trackFaded);
      el.querySelectorAll<HTMLElement>("[data-index]").forEach((cell) => cell.classList.remove(classes.faded, classes.chosen));
      setChosen(index);
      expand(index);
    }));
    return () => cancelAnimationFrame(raf);
    // runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Forward: lock, fade the others, travel the label to the capsule centre, collapse.
  const collapse = (index: number) => {
    const el = controller.current;
    const cell = el?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!el || !cell) return false;
    lock.current = true;
    placeChosen(el, cell);
    setChosen(index);
    setPhase("collapsing");
    return true;
  };

  const navigate = (index: number, href: string) => {
    if (lock.current) return;
    const hash = href.indexOf("#");
    const anchor = hash >= 0 ? href.slice(hash) : null;
    const samePage = anchor !== null && (href.startsWith("#") || href.slice(0, hash) === window.location.pathname);
    if (!collapse(index)) { router.push(href); return; }
    if (samePage && anchor) {
      window.setTimeout(() => {
        document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
        // the reverse once the scroll settles
        let timer = 0;
        const settle = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => { window.removeEventListener("scroll", settle); expand(index); }, SCROLL_SETTLE_MS);
        };
        window.addEventListener("scroll", settle, { passive: true });
        settle();
      }, COLLAPSE_MS);
      return;
    }
    try { sessionStorage.setItem(STORAGE_KEY, String(index)); } catch { /* storage may be blocked */ }
    window.setTimeout(() => router.push(href), COLLAPSE_MS);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = controller.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--glass-x", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--glass-y", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const hover = (index: number) => { if (!lock.current) setCapsule(index); };
  const focus = (index: number) => { focused.current = index; if (!lock.current) setCapsule(index); };
  const blur = (index: number) => {
    if (focused.current === index) focused.current = null;
    if (!lock.current && !controller.current?.matches(":hover")) setCapsule(0);
  };
  const leave = () => { if (lock.current || focused.current !== null) return; setCapsule(0); };

  return { phase, chosen, navigate, hover, focus, blur, leave, onPointerMove };
}
