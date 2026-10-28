"use client";

import { cn } from "@/utils/cn";

export function ChoiceRow<T extends string>({
  legend,
  labelledBy,
  value,
  options,
  onChange,
}: {
  legend: string;
  labelledBy?: string;
  value: T | null;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T | null) => void;
}) {
  return (
    <fieldset aria-labelledby={labelledBy}>
      {labelledBy ? null : (
        <legend className="mb-3 text-sm font-medium text-text-primary">{legend}</legend>
      )}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option.value)}
              className={cn(
                "min-h-11 w-full rounded-lg border px-3 text-center text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
