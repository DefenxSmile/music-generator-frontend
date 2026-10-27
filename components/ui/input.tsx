"use client";

import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "block w-full rounded-lg border border-overlay/10 bg-bg-elevated px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-overlay/24",
        className,
      )}
    />
  );
});
