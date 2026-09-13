"use client";

// The call stays open as an overlay while navigation intents change the route
// under it: the app layout reads this flag, not the /call page.
const KEY = "amplio.call";
const RETURN = "amplio.call.return";
const EVENT = "amplio:call";

export const callSession = {
  isActive: () => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  },
  start: (returnTo: string) => {
    try {
      sessionStorage.setItem(KEY, "1");
      sessionStorage.setItem(RETURN, returnTo);
    } catch {
      /* private mode */
    }
    window.dispatchEvent(new Event(EVENT));
  },
  end: () => {
    let back = "";
    try {
      back = sessionStorage.getItem(RETURN) ?? "";
      sessionStorage.removeItem(KEY);
      sessionStorage.removeItem(RETURN);
    } catch {
      /* private mode */
    }
    window.dispatchEvent(new Event(EVENT));
    return back;
  },
  subscribe: (cb: () => void) => {
    window.addEventListener(EVENT, cb);
    return () => window.removeEventListener(EVENT, cb);
  },
};
