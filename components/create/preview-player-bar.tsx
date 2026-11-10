"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { MediaFrame } from "@/components/ui/media-frame";
import { formatClock } from "@/utils/song-visual";

/** Rounded player inset from the screen edges. The played part sits between the times. */
export function PreviewPlayerBar({
  title,
  coverId,
  current,
  duration,
  playing,
  onToggle,
  onSeek,
  onPrevious,
  onNext,
}: {
  title: string;
  coverId: string;
  current: number;
  duration: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (seconds: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  return (
    <div className="lp-player-bar">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(9rem,1.6fr)_minmax(0,1fr)] items-center gap-3 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <MediaFrame toneId={coverId} className="size-10" />
          <span className="truncate text-sm font-medium text-text-primary">{title}</span>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-1">
          <div className="flex items-center">
            <IconButton label="Предыдущая" onClick={onPrevious}>
              <SkipBack aria-hidden className="size-4" strokeWidth={1.75} />
            </IconButton>
            <button
              type="button"
              onClick={onToggle}
              aria-label={playing ? `Пауза: ${title}` : `Слушать: ${title}`}
              aria-pressed={playing}
              className="grid size-10 place-items-center rounded-full bg-text-primary text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {playing ? (
                <Pause aria-hidden className="size-4 fill-current" />
              ) : (
                <Play aria-hidden className="ml-0.5 size-4 fill-current" />
              )}
            </button>
            <IconButton label="Следующая" onClick={onNext}>
              <SkipForward aria-hidden className="size-4" strokeWidth={1.75} />
            </IconButton>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="w-9 shrink-0 text-right text-xs tabular-nums text-text-muted">
              {formatClock(current)}
            </span>
            <label className="relative block h-3 min-w-0 flex-1 cursor-pointer">
              <span className="sr-only">Перемотка</span>
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-overlay/35" />
              <span
                className="lp-accent-gradient absolute top-1/2 left-0 h-0.5 -translate-y-1/2"
                style={{ width: `${progress * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={current}
                aria-valuetext={`${formatClock(current)} из ${formatClock(duration)}`}
                onChange={(event) => onSeek(Number(event.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <span className="w-9 shrink-0 text-xs tabular-nums text-text-muted">{formatClock(duration)}</span>
          </div>
        </div>
        <span aria-hidden />
      </div>
    </div>
  );
}
