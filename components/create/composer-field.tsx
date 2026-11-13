"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { cn } from "@/utils/cn";

/** A section inside the composer panel. The label is quiet, and the text has no box of its own. */
export function ComposerField({
  id,
  label,
  value,
  placeholder,
  minHeightClass,
  maxHeightClass,
  onChange,
  onKeyDown,
  action,
  footer,
  hideLabel = false,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  minHeightClass: string;
  /** Cap growth; the field scrolls vertically past this height. */
  maxHeightClass?: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  action?: ReactNode;
  footer?: ReactNode;
  /** When nested under ComposerSection, the section title is enough. */
  hideLabel?: boolean;
}) {
  const ref = useAutosizeTextarea(value);

  return (
    <div>
      {hideLabel && !action ? null : (
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-3.5",
            hideLabel ? "pt-0" : "pt-3",
          )}
        >
          {hideLabel ? (
            <span className="min-w-0" />
          ) : (
            <label htmlFor={id} className="lp-kicker min-w-0 truncate">
              {label}
            </label>
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <Textarea
        ref={ref}
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={hideLabel ? label : undefined}
        className={cn(
          "px-3.5 text-[0.9375rem] leading-relaxed",
          hideLabel ? "py-2" : "py-3",
          maxHeightClass ? "overscroll-contain" : "overflow-hidden",
          minHeightClass,
          maxHeightClass,
        )}
      />
      {footer}
    </div>
  );
}
