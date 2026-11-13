"use client";

import type { VocalGender } from "@/types/song-draft";
import { cn } from "@/utils/cn";

const OPTIONS: ReadonlyArray<{ value: VocalGender; label: string }> = [
  { value: "female", label: "Женский" },
  { value: "male", label: "Мужской" },
];

/** Compact segmented control for vocal gender. */
export function VocalGenderPicker({
  value,
  onChange,
}: {
  value: VocalGender;
  onChange: (value: VocalGender) => void;
}) {
  return (
    <div className="px-3.5 pb-3 pt-0.5">
      <p className="lp-kicker">Голос</p>
      <div role="group" aria-label="Голос" className="lp-segment mt-2">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onChange(option.value)}
              className={cn("lp-segment-option px-3 py-1.5 text-sm font-medium")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
