"use client";

import { useLayoutEffect, useRef } from "react";

/** Grow a textarea to its text so the field itself never scrolls. */
export function useAutosizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const field = node;

    function fit() {
      field.style.height = "auto";
      field.style.height = `${field.scrollHeight}px`;
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);

  return ref;
}
