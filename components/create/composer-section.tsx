"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Accordion block inside the create panel — one open section at a time is optional. */
export function ComposerSection({
  title,
  open,
  onOpenChange,
  summary,
  hero = false,
  children,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quiet one-line preview when collapsed. */
  summary?: string;
  /** Idea-level weight: more air, stronger title. */
  hero?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-3.5 text-left outline-none transition-colors duration-150 hover:bg-overlay/[0.03] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-overlay/30",
          hero ? "py-3" : "py-2.5",
        )}
      >
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block transition-colors duration-150",
              open || hero
                ? "text-sm font-medium text-text-primary"
                : "lp-kicker",
            )}
          >
            {title}
          </span>
          {!open && summary ? (
            <span className="mt-1 block truncate text-sm text-text-muted">{summary}</span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-0.5 size-4 shrink-0 text-text-dim transition-transform duration-150",
            open && "rotate-180 text-text-muted",
          )}
          strokeWidth={1.75}
        />
      </button>
      {open ? <div className="pb-1.5">{children}</div> : null}
    </div>
  );
}
