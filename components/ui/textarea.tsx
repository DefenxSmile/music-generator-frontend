"use client";

import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cn(
          "block w-full resize-none bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none",
          className,
        )}
      />
    );
  },
);
