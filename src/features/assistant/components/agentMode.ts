"use client";

import { useCallback, useSyncExternalStore } from "react";

// The sidebar's "Agent mode" switch, persisted per browser. On, the assistant
// grows a phone button and the sidebar a "Call Amplio" item (app-side only).
const KEY = "amplio.agent-mode";
const EVENT = "amplio:agent-mode";

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
};

export function useAgentMode(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, read, () => false);
  const set = useCallback((next: boolean) => {
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* private mode: the switch still flips for this render */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [on, set];
}
