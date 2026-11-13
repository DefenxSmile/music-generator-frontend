"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { VocalGenderPicker } from "@/components/create/vocal-gender-picker";
import type { VocalGender } from "@/types/song-draft";
import { cn } from "@/utils/cn";

/** Collapsible extras — gender lives here, not in the main create path. */
export function AdvancedOptions({
  vocalGender,
  onVocalGender,
}: {
  vocalGender: VocalGender;
  onVocalGender: (value: VocalGender) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="text-xs font-medium text-text-dim">Расширенные настройки</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 text-text-dim transition-transform duration-150",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>
      {open ? <VocalGenderPicker value={vocalGender} onChange={onVocalGender} /> : null}
    </div>
  );
}
