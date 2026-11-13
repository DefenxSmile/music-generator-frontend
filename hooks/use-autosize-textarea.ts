"use client";

import { useLayoutEffect, useRef } from "react";

/** Grow a textarea to its text; stop at CSS max-height and scroll inside. */
export function useAutosizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const field = node;

    function fit() {
      field.style.height = "auto";
      const max = Number.parseFloat(getComputedStyle(field).maxHeight);
      const next = field.scrollHeight;
      if (Number.isFinite(max) && max > 0) {
        field.style.height = `${Math.min(next, max)}px`;
        field.style.overflowY = next > max ? "auto" : "hidden";
        return;
      }
      field.style.height = `${next}px`;
      field.style.overflowY = "hidden";
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);

  return ref;
}
