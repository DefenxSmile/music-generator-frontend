"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { cn } from "@/utils/cn";

const SECTION =
  "rounded-xl border border-overlay/10 bg-bg-elevated shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-overlay)_6%,transparent)] transition-colors duration-150 focus-within:border-accent/45";

/** One surface: the label sits in the field, and the text has no box of its own. */
export function ComposerField({
  id,
  label,
  value,
  placeholder,
  minHeightClass,
  onChange,
  onKeyDown,
  footer,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  minHeightClass: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  footer?: ReactNode;
}) {
  const ref = useAutosizeTextarea(value);

  return (
    <div className={SECTION}>
      <label htmlFor={id} className="block px-3.5 pt-3 text-sm font-medium text-text-primary">
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "block w-full resize-none overflow-hidden bg-transparent px-3.5 py-3 text-[0.9375rem] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none",
          minHeightClass,
        )}
      />
      {footer ? <div className="px-3 pb-3">{footer}</div> : null}
    </div>
  );
}
