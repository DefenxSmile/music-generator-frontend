"use client";

import { cn } from "@/utils/cn";

export function ChoiceRow<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T | null;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T | null) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-text-primary">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option.value)}
              className={cn(
                "min-h-11 rounded-lg border px-4 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                selected
                  ? "border-accent bg-bg-elevated text-text-primary"
                  : "border-border text-text-muted hover:border-border-hover hover:text-text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
