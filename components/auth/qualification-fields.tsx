"use client";

import { cn } from "@/lib/cn";
import { SONG_FOR_OPTIONS, VISITOR_OPTIONS, type SongFor, type VisitorKind } from "@/lib/lead/qualification";

function ChoiceRow<T extends string>({
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
                "min-h-11 rounded-lg border px-4 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]",
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

export function QualificationFields({
  visitor,
  songFor,
  onVisitor,
  onSongFor,
}: {
  visitor: VisitorKind | null;
  songFor: SongFor | null;
  onVisitor: (value: VisitorKind | null) => void;
  onSongFor: (value: SongFor | null) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <ChoiceRow legend="Кто вы?" value={visitor} options={VISITOR_OPTIONS} onChange={onVisitor} />
      <ChoiceRow legend="Для кого песня?" value={songFor} options={SONG_FOR_OPTIONS} onChange={onSongFor} />
    </div>
  );
}
