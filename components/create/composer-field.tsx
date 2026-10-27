"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Surface } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { cn } from "@/utils/cn";

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
    <Surface>
      <label htmlFor={id} className="block px-3.5 pt-3 text-sm font-medium text-text-primary">
        {label}
      </label>
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
      {footer ? <div className="px-3 pb-3">{footer}</div> : null}
    </Surface>
  );
}
