"use client";

import type { ComposerMode } from "@/utils/composer-mode";
import { cn } from "@/utils/cn";

const OPTIONS: ReadonlyArray<{ value: ComposerMode; label: string }> = [
  { value: "simple", label: "Простой" },
  { value: "advanced", label: "Расширенный" },
];

export function ComposerModeToggle({
  value,
  onChange,
}: {
  value: ComposerMode;
  onChange: (value: ComposerMode) => void;
}) {
  return (
    <div role="group" aria-label="Режим создания" className="lp-segment">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange(option.value)}
            className={cn("lp-segment-option px-3 py-1.5 text-xs font-medium")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
