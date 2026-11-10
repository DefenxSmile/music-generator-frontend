"use client";

import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DownloadPaywallDialog } from "@/components/create/download-paywall-dialog";
import { PreviewPlayerBar } from "@/components/create/preview-player-bar";
import { SongUnavailable } from "@/components/song/song-unavailable";
import Button from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/media-frame";
import type { Generation } from "@/types/generation";
import { cn } from "@/utils/cn";
import { isActiveGenerationStatus } from "@/utils/generation-status";
import { formatClock } from "@/utils/song-visual";

/** Landing promises two vocal takes; Java still returns one audio — both rows share it until the API splits. */
function variantIds(generationId: string): [string, string] {
  return [generationId, `${generationId}-b`];
}

function pauseAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    audio.pause();
  } catch {
    /* jsdom */
  }
}

function songTitle(generation: Generation): string {
  const caption = generation.caption?.trim();
  if (caption) return caption.length > 72 ? `${caption.slice(0, 72).trimEnd()}…` : caption;
  const line = generation.prompt.split("\n").find((part) => part.trim())?.trim() ?? "";
  if (!line) return "Новая песня";
  return line.length > 72 ? `${line.slice(0, 72).trimEnd()}…` : line;
}

function styleCaption(generation: Generation): string {
  const lyricLine =
    generation.lyrics
      ?.split("\n")
      .map((part) => part.trim())
      .find((part) => part && !part.startsWith("[")) ?? "";
  const promptLine = generation.prompt.split("\n").find((part) => part.trim())?.trim() ?? "";
  const caption = lyricLine && lyricLine !== promptLine ? lyricLine : "";
  if (!caption) return "";
  return caption.length > 96 ? `${caption.slice(0, 96).trimEnd()}…` : caption;
}

export function GenerationResult({ generation }: { generation: Generation }) {
  const title = songTitle(generation);
  const style = styleCaption(generation);
  const active = isActiveGenerationStatus(generation.status);
  const ready = generation.status === "READY" && Boolean(generation.audioUrl);
  const failed = !active && !ready;
  const durationHint = generation.durationSeconds ?? 0;
  const ids = variantIds(generation.id);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationHint);
  const [failedAudio, setFailedAudio] = useState(false);

  useEffect(() => {
    setDuration(durationHint);
  }, [durationHint, generation.id]);

  useEffect(() => {
    if (active || failed) {
      setSelectedId(null);
      setPlaying(false);
      setCurrent(0);
      pauseAudio(audioRef.current);
    }
  }, [active, failed, generation.id]);

  useEffect(() => {
    if (!selectedId) return;
    document.documentElement.setAttribute("data-player", "");
    return () => document.documentElement.removeAttribute("data-player");
  }, [selectedId]);

  function playFromGesture(audio: HTMLAudioElement | null) {
    if (!audio) {
      setFailedAudio(true);
      return;
    }
    void audio.play().catch(() => setFailedAudio(true));
    setPlaying(true);
  }

  function togglePlayback() {
    if (!ready || failedAudio) return;
    const audio = audioRef.current;
    if (playing) {
      pauseAudio(audio);
      setPlaying(false);
      return;
    }
    playFromGesture(audio);
  }

  function choose(id: string) {
    if (!ready || failedAudio) return;
    if (selectedId === id) {
      togglePlayback();
      return;
    }
    const audio = audioRef.current;
    setSelectedId(id);
    setCurrent(0);
    if (audio) audio.currentTime = 0;
    playFromGesture(audio);
  }

  function step(direction: -1 | 1) {
    if (!selectedId || !ready || failedAudio) return;
    const index = ids.indexOf(selectedId as (typeof ids)[number]);
    const next = ids[(index + direction + ids.length) % ids.length];
    if (!next) return;
    const audio = audioRef.current;
    setSelectedId(next);
    setCurrent(0);
    if (audio) audio.currentTime = 0;
    playFromGesture(audio);
  }

  function seek(seconds: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = seconds;
    setCurrent(seconds);
  }

  if (failed) {
    return <SongUnavailable generation={generation} />;
  }

  return (
    <div className={selectedId ? "pb-28" : undefined}>
      <ul aria-busy={active} className="flex flex-col">
        {ids.map((id) => (
          <ResultRow
            key={id}
            id={id}
            title={title}
            style={style}
            duration={duration || durationHint}
            active={active}
            playing={playing && selectedId === id}
            onPlay={() => choose(id)}
            onDownload={() => setPaywallOpen(true)}
          />
        ))}
      </ul>
      {active ? <p className="sr-only">Собираем два варианта</p> : null}
      {failedAudio ? (
        <p role="alert" className="mt-3 text-sm text-text-muted">
          Аудио не загрузилось. Ссылка временная, обновите страницу.
        </p>
      ) : null}
      {selectedId && ready ? (
        <PreviewPlayerBar
          title={title}
          coverId={selectedId}
          current={current}
          duration={duration || durationHint}
          playing={playing}
          onToggle={togglePlayback}
          onSeek={seek}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
      {ready && generation.audioUrl ? (
        <audio
          ref={audioRef}
          src={generation.audioUrl}
          preload="metadata"
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration;
            if (Number.isFinite(value)) setDuration(value);
          }}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setCurrent(0);
          }}
          onError={() => setFailedAudio(true)}
        />
      ) : null}
      <DownloadPaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}

function ResultRow({
  id,
  title,
  style,
  duration,
  active,
  playing,
  onPlay,
  onDownload,
}: {
  id: string;
  title: string;
  style: string;
  duration: number;
  active: boolean;
  playing: boolean;
  onPlay: () => void;
  onDownload: () => void;
}) {
  const clock = duration > 0 ? formatClock(duration) : "—:—";

  return (
    <li className="border-b border-overlay/8 py-4">
      <div className="flex items-start gap-4">
        <MediaFrame
          toneId={id}
          corner={active ? undefined : clock}
          busy={active}
          playing={playing}
          onClick={active ? undefined : onPlay}
          label={playing ? `Пауза: ${title}` : `Слушать: ${title}`}
          className="size-24 sm:size-[7.5rem]"
        />
        <div className="min-w-0 flex-1">
          <p className="flex min-h-7 min-w-0 items-center">
            <span className="truncate text-lg font-medium leading-6 text-text-primary">{title}</span>
          </p>
          <p className="mt-0.5 flex h-5 min-w-0 items-center gap-2 text-xs text-text-muted">
            {style ? <span className="min-w-0 truncate">{style}</span> : null}
            {style ? (
              <span aria-hidden className="text-text-dim">
                ·
              </span>
            ) : null}
            <span className="shrink-0 tabular-nums">{clock}</span>
          </p>
          <div className={cn("lp-song-actions", active && "invisible")} aria-hidden={active || undefined}>
            <Button href="/release" variant="quiet" size="sm" disabled={active}>
              Выпустить
            </Button>
            <Button type="button" variant="quiet" size="sm" disabled={active} onClick={onDownload}>
              <Download aria-hidden className="size-3.5" strokeWidth={1.75} />
              Скачать
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function GenerationResultSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Загружаем песню" className="flex flex-col">
      {[0, 1].map((index) => (
        <li key={index} className="border-b border-overlay/8 py-4">
          <div className="flex items-start gap-4">
            <span className="lp-skeleton size-24 shrink-0 rounded-[var(--radius-xl)] sm:size-[7.5rem]" />
            <div className="min-w-0 flex-1 space-y-2">
              <span className="lp-skeleton block h-6 w-2/3 rounded-md" />
              <span className="lp-skeleton block h-4 w-1/3 rounded-md" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
