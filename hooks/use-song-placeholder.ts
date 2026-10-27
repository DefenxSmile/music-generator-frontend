"use client";

import { useHydrated } from "@/hooks/use-hydrated";
import { readSongFor, songForPlaceholder } from "@/utils/qualification";

/** One example, read after hydration so a reload does not swap in another sentence. */
export function useSongPlaceholder(): string {
  const hydrated = useHydrated();
  if (!hydrated) return "";
  return songForPlaceholder(readSongFor());
}
