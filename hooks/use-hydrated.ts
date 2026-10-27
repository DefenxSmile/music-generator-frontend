"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False while hydrating, so late Suspense boundaries render the same HTML as the server. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
