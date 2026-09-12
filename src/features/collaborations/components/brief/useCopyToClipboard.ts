"use client";

import { useCallback } from "react";
import { toast } from "sonner";

// Clipboard write with a toast either way; the drawer's two copy buttons share it.
export function useCopyToClipboard() {
  return useCallback(async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(done);
    } catch {
      toast.error("Your browser blocked the clipboard. Select the brief and copy it by hand.");
    }
  }, []);
}
