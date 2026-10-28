"use client";

import { Download, LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { CreatePaywallDialog } from "@/components/create/create-paywall-dialog";
import { PreviewPlayerBar } from "@/components/create/preview-player-bar";
import Button from "@/components/ui/Button";
import type { SongDraft } from "@/types/song-draft";
import { cn } from "@/utils/cn";
import { isActiveGenerationStatus } from "@/utils/generation-status";
import { formatClock, songCoverStyle } from "@/utils/song-visual";

const VARIANTS = [
  { id: "preview-variant-1", duration: 152 },
  { id: "preview-variant-2", duration: 164 },
] as const;

type Variant = (typeof VARIANTS)[number];

function songTitle(draft: SongDraft): string {
  const line = (draft.idea.trim() || draft.lyrics.trim()).split("\n").find((part) => part.trim());
  const title = line?.trim() ?? "";
  if (!title) return "Новая песня";
  return title.length > 72 ? `${title.slice(0, 72).trimEnd()}…` : title;
}

function styleCaption(draft: SongDraft): string {
  const ideaLines = draft.idea
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);
  const lyricLine = draft.lyrics.trim().split("\n").find((part) => part.trim())?.trim() ?? "";
  const ideaLine = ideaLines[0] ?? "";
  const extraIdea = ideaLines.slice(1).join(" ");
  const caption = lyricLine && lyricLine !== ideaLine ? lyricLine : extraIdea;
  if (!caption) return "";
  return caption.length > 96 ? `${caption.slice(0, 96).trimEnd()}…` : caption;
}

export function GenerationPreview({ draft, status }: { draft: SongDraft; status: string }) {
  const title = songTitle(draft);
  const style = styleCaption(draft);
  const active = isActiveGenerationStatus(status);
  const [plansOpen, setPlansOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const selected = VARIANTS.find((variant) => variant.id === selectedId) ?? null;

  useEffect(() => {
    if (active) {
      setSelectedId(null);
      setPlaying(false);
      setCurrent(0);
    }
  }, [active]);

  useEffect(() => {
    if (!selected) return;
    document.documentElement.setAttribute("data-player", "");
    return () => document.documentElement.removeAttribute("data-player");
  }, [selected]);

  useEffect(() => {
    if (!playing || !selected) return;
    const timer = window.setInterval(() => {
      setCurrent((value) => {
        const next = Math.round((value + 0.25) * 100) / 100;
        if (next >= selected.duration) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing, selected]);

  function choose(variant: Variant) {
    if (selectedId === variant.id) {
      setPlaying((value) => !value);
      return;
    }
    setSelectedId(variant.id);
    setCurrent(0);
    setPlaying(true);
  }

  function step(direction: -1 | 1) {
    const index = VARIANTS.findIndex((variant) => variant.id === selectedId);
    const next = VARIANTS[(index + direction + VARIANTS.length) % VARIANTS.length];
    if (!next) return;
    setSelectedId(next.id);
    setCurrent(0);
    setPlaying(true);
  }

  return (
    <div className={selected ? "pb-28" : undefined}>
      <ul aria-busy={active} className="flex flex-col">
        {VARIANTS.map((variant) => (
          <PreviewRow
            key={variant.id}
            variant={variant}
            title={title}
            style={style}
            active={active}
            playing={playing && selectedId === variant.id}
            onPlay={() => choose(variant)}
            onDownload={() => setPlansOpen(true)}
          />
        ))}
      </ul>
      {active ? <p className="sr-only">Собираем два варианта</p> : null}
      {selected ? (
        <PreviewPlayerBar
          title={title}
          coverId={selected.id}
          current={current}
          duration={selected.duration}
          playing={playing}
          onToggle={() => setPlaying((value) => !value)}
          onSeek={setCurrent}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
      <CreatePaywallDialog open={plansOpen} onClose={() => setPlansOpen(false)} />
    </div>
  );
}

function PreviewRow({
  variant,
  title,
  style,
  active,
  playing,
  onPlay,
  onDownload,
}: {
  variant: Variant;
  title: string;
  style: string;
  active: boolean;
  playing: boolean;
  onPlay: () => void;
  onDownload: () => void;
}) {
  return (
    <li className="border-b border-overlay/8 py-4">
      <div className="flex items-center gap-3">
        {active ? (
          <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-bg-elevated">
            <LoaderCircle aria-hidden className="lp-spin size-5 text-text-muted" strokeWidth={1.75} />
          </span>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={playing ? `Пауза: ${title}` : `Слушать: ${title}`}
            aria-pressed={playing}
            style={songCoverStyle(variant.id)}
            className="grid size-14 shrink-0 place-items-center rounded-lg shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-overlay)_18%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="grid size-8 place-items-center rounded-full bg-black/25 backdrop-blur-sm">
              {playing ? (
                <Pause aria-hidden className="size-3.5 fill-white text-white" />
              ) : (
                <Play aria-hidden className="ml-0.5 size-3.5 fill-white text-white" />
              )}
            </span>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex h-6 min-w-0 items-center">
            <span className="truncate text-[0.9375rem] font-medium text-text-primary">{title}</span>
          </p>
          <p className="mt-0.5 flex h-5 min-w-0 items-center gap-2 text-xs text-text-muted">
            {style ? <span className="min-w-0 truncate">{style}</span> : null}
            {style ? (
              <span aria-hidden className="text-text-dim">
                ·
              </span>
            ) : null}
            <span className="shrink-0 tabular-nums">{formatClock(variant.duration)}</span>
          </p>
          <div
            className={cn("mt-1 flex gap-1", active && "invisible")}
            aria-hidden={active || undefined}
          >
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
