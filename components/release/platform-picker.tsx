"use client";

import { Check } from "lucide-react";
import { PlatformMark } from "@/components/release/platform-mark";
import { cn } from "@/utils/cn";
import { STREAM_PLATFORMS, UGC_PLATFORMS, type ReleasePlatform } from "@/utils/release-platforms";

function PlatformChip({
  platform,
  selected,
  onToggle,
}: {
  platform: ReleasePlatform;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-11 items-center gap-2.5 rounded-lg border px-3 pr-9 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected
          ? "border-overlay/35 bg-bg-elevated text-text-primary"
          : "border-transparent bg-transparent text-text-dim hover:border-overlay/15 hover:bg-overlay/5 hover:text-text-muted",
      )}
    >
      <PlatformMark id={platform.id} className={cn("size-7", selected ? "" : "opacity-55")} />
      <span className={cn("min-w-0 truncate", selected ? "font-medium" : "")}>{platform.name}</span>
      {selected ? (
        <span
          aria-hidden
          className="absolute top-1/2 right-2.5 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-overlay/15 text-text-primary"
        >
          <Check className="size-3" strokeWidth={2.25} />
        </span>
      ) : null}
    </button>
  );
}

function PlatformGroup({
  title,
  note,
  platforms,
  selectedIds,
  onChange,
}: {
  title: string;
  note?: string;
  platforms: ReleasePlatform[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const selectedCount = platforms.filter((item) => selectedIds.includes(item.id)).length;

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    );
  }

  function setAll(on: boolean) {
    const ids = platforms.map((item) => item.id);
    if (on) {
      onChange([...new Set([...selectedIds, ...ids])]);
      return;
    }
    onChange(selectedIds.filter((id) => !ids.includes(id)));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          {note ? (
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-dim">{note}</p>
          ) : null}
        </div>
        <p className="text-xs tabular-nums text-text-dim">
          Выбрано: {selectedCount}/{platforms.length}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAll(true)}
          className="text-xs text-text-dim transition-colors duration-150 hover:text-text-primary"
        >
          Выбрать все
        </button>
        <span aria-hidden className="text-xs text-text-dim">
          ·
        </span>
        <button
          type="button"
          onClick={() => setAll(false)}
          className="text-xs text-text-dim transition-colors duration-150 hover:text-text-primary"
        >
          Убрать все
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {platforms.map((platform) => (
          <PlatformChip
            key={platform.id}
            platform={platform}
            selected={selectedIds.includes(platform.id)}
            onToggle={() => toggle(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function PlatformPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <PlatformGroup
        title="Стриминговые площадки"
        note="Сначала площадки СНГ, дальше — мир. Полный каталог дистрибьютора обычно больше сотни; здесь основной пакет для черновика."
        platforms={STREAM_PLATFORMS}
        selectedIds={selectedIds}
        onChange={onChange}
      />
      <PlatformGroup
        title="UGC и соцсети"
        note="Часть площадок принимает только полностью авторский материал. Для ИИ-песни список может сузиться позже."
        platforms={UGC_PLATFORMS}
        selectedIds={selectedIds}
        onChange={onChange}
      />
    </div>
  );
}
