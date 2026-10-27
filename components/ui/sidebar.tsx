import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

/** The inset navigation frame. Navigation items stay in the shell. */
export function Sidebar({ className, ...props }: ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-overlay/10 bg-bg-sidebar shadow-[0_28px_70px_-36px_rgba(0,0,0,0.9)]",
        className,
      )}
      {...props}
    />
  );
}
