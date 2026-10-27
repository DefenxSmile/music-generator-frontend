"use client";

import { Pause, Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatClock, songCoverStyle, songWaveform } from "@/lib/song/song-visual";

export function SongPlayer({
  id,
  src,
  title,
  durationHint,
}: {
  id: string;
  src: string;
  title: string;
  durationHint?: number | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationHint ?? 0);
  const [failed, setFailed] = useState(false);
  const bars = useMemo(() => songWaveform(id), [id]);
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setFailed(true));
    else audio.pause();
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        disabled={failed}
        aria-label={playing ? `Пауза: ${title}` : `Слушать: ${title}`}
        aria-pressed={playing}
        style={songCoverStyle(id)}
        className="grid size-16 shrink-0 place-items-center rounded-xl shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-overlay)_18%,transparent)] transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 sm:size-20"
      >
        <span className="grid size-10 place-items-center rounded-full bg-black/25 backdrop-blur-sm">
          {playing ? (
            <Pause className="size-4 fill-white text-white" aria-hidden />
          ) : (
            <Play className="ml-0.5 size-4 fill-white text-white" aria-hidden />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="relative h-12">
          <div aria-hidden className="flex h-full items-center gap-[2px]">
            {bars.map((value, index) => (
              <span
                key={index}
                className={cn(
                  "lp-wave-bar min-w-[2px] flex-1 rounded-[1px]",
                  index / bars.length < progress ? "bg-accent" : "bg-border-hover",
                )}
                style={{ height: `${Math.round(value * 100)}%`, animationDelay: `${index * 12}ms` }}
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={current}
            disabled={!duration || failed}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Перемотка"
            aria-valuetext={`${formatClock(current)} из ${formatClock(duration)}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs tabular-nums text-text-dim">
          <span>{formatClock(current)}</span>
          <span>{duration ? formatClock(duration) : "—:—"}</span>
        </div>
        {failed ? (
          <p role="alert" className="mt-2 text-xs text-text-muted">
            Аудио не загрузилось. Ссылка временная, обновите страницу.
          </p>
        ) : null}
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
        }}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
