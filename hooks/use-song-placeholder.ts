"use client";

import { useSyncExternalStore } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { songPlaceholder, subscribeSongAnswers } from "@/utils/qualification";

/** One example, read after hydration so a reload does not swap in another sentence. */
export function useSongPlaceholder(): string {
  const hydrated = useHydrated();
  const value = useSyncExternalStore(subscribeSongAnswers, songPlaceholder, () => "");
  if (!hydrated) return "";
  return value;
}
