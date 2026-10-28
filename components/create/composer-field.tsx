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
  onChange,
  onKeyDown,
  action,
  footer,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  minHeightClass: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  action?: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useAutosizeTextarea(value);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 pt-3">
        <label htmlFor={id} className="text-xs font-medium text-text-dim">
          {label}
        </label>
        {action}
      </div>
      <Textarea
        ref={ref}
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "overflow-hidden px-3.5 py-3 text-[0.9375rem] leading-relaxed",
          minHeightClass,
        )}
      />
      {footer}
    </div>
  );
}
