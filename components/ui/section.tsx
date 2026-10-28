import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

const ELEMENT =
  "rounded-lg border border-overlay/10 bg-bg-elevated transition-colors duration-150 focus-within:border-overlay/24";

/** A page region on the section step of the surface scale. */
export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-xl border border-overlay/10 bg-bg-card", className)}
      {...props}
    />
  );
}

/** A control sitting on a section: one step lighter. */
export function Surface({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(ELEMENT, className)} {...props} />;
}
