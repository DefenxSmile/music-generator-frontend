"use client";

import { useSyncExternalStore } from "react";
import { prefixedKey } from "@/utils/storage-prefix";

const SIGNED_IN_HINT = prefixedKey("signed_in");
const hintListeners = new Set<() => void>();

export function readSignedInHint(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SIGNED_IN_HINT) === "1";
  } catch {
    return false;
  }
}

export function writeSignedInHint(signedIn: boolean) {
  try {
    if (signedIn) window.sessionStorage.setItem(SIGNED_IN_HINT, "1");
    else window.sessionStorage.removeItem(SIGNED_IN_HINT);
  } catch {
    /* storage can be blocked */
  }
  hintListeners.forEach((listener) => listener());
}

function subscribeSignedInHint(listener: () => void) {
  hintListeners.add(listener);
  return () => hintListeners.delete(listener);
}

/** True after this tab has already seen a signed-in session. Server render stays false. */
export function useSignedInHint(): boolean {
  return useSyncExternalStore(subscribeSignedInHint, readSignedInHint, () => false);
}
