"use client";

import type { KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { cn } from "@/utils/cn";
import { SONG_STYLE_CHIPS, styleHasChip, toggleStyleTag } from "@/utils/song-styles";

/** Free-form style line with short RU chips; model expansion happens in composePrompt. */
export function StyleField({
  value,
  onChange,
  onKeyDown,
  /** When nested under ComposerSection, hide the duplicate label. */
  hideLabel = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  hideLabel?: boolean;
}) {
  const ref = useAutosizeTextarea(value);

  return (
    <div className={cn("px-3.5", hideLabel ? "pb-2.5 pt-0" : "pb-3 pt-3")}>
      {hideLabel ? null : <p className="lp-kicker">Стили</p>}
      <Textarea
        ref={ref}
        id="song-style"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="поп, гитара, тёплый вокал…"
        rows={2}
        className={cn(
          "min-h-11 px-0 py-1.5 text-[0.9375rem] leading-relaxed",
          hideLabel ? "mt-0" : "mt-2",
        )}
      />
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {SONG_STYLE_CHIPS.map((chip) => {
          const active = styleHasChip(value, chip);
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onChange(toggleStyleTag(value, chip.tag))}
              className="lp-style-chip"
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}