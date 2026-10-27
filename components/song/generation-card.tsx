"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { GenerationProgress } from "@/components/song/generation-progress";
import { SongPaywall } from "@/components/song/song-paywall";
import { SongPlayer } from "@/components/song/song-player";
import { SongUnavailable } from "@/components/song/song-unavailable";
import Button from "@/components/ui/Button";
import type { Generation } from "@/types/generation";
import { formatWhen } from "@/utils/format";
import { generationStatusLabel, isActiveGenerationStatus } from "@/utils/generation-status";

const VOCAL_LANGUAGES: Record<string, string> = { ru: "русский", en: "английский" };

function songTitle(generation: Generation): string {
  return generation.caption?.trim() || generation.prompt;
}

function songMeta(generation: Generation): string[] {
  const parts: string[] = [];
  const created = formatWhen(generation.createdAt);
  if (created) parts.push(created);
  if (generation.instrumental) parts.push("Без слов");
  else if (generation.vocalLanguage) {
    parts.push(`Вокал: ${VOCAL_LANGUAGES[generation.vocalLanguage] ?? generation.vocalLanguage}`);
  }
  return parts;
}

export function GenerationCard({ generation }: { generation: Generation }) {
  const [downloadAsked, setDownloadAsked] = useState(false);
  const title = songTitle(generation);
  const caption = generation.caption?.trim() ?? "";
  const active = isActiveGenerationStatus(generation.status);
  const ready = generation.status === "READY" && Boolean(generation.audioUrl);

  return (
    <article>
      <p className="lp-eyebrow">
        {active ? "Песня в работе" : generationStatusLabel(generation.status)}
      </p>
      <h1 className="lp-section-title mt-3 line-clamp-3 text-text-primary">{title}</h1>
      <p className="mt-2 text-sm text-text-dim">{songMeta(generation).join(" · ")}</p>

      <div className="mt-6 rounded-xl border border-border bg-bg-card p-4 sm:p-6">
        {ready && generation.audioUrl ? (
          <>
            <SongPlayer
              id={generation.id}
              src={generation.audioUrl}
              title={title}
              durationHint={generation.durationSeconds}
            />
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDownloadAsked(true)}
              >
                <Download aria-hidden className="size-4" />
                Скачать
              </Button>
            </div>
            {downloadAsked ? <SongPaywall onClose={() => setDownloadAsked(false)} /> : null}
          </>
        ) : active ? (
          <GenerationProgress status={generation.status} />
        ) : (
          <SongUnavailable generation={generation} />
        )}
      </div>

      {caption ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-text-primary">Идея</h2>
          <p className="mt-2 max-w-[65ch] whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
            {generation.prompt}
          </p>
        </section>
      ) : null}

      {generation.lyrics ? (
        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-text-primary">Текст песни</h2>
          <pre className="mt-3 max-w-[65ch] whitespace-pre-wrap font-sans text-[0.9375rem] leading-relaxed text-text-primary/90">
            {generation.lyrics}
          </pre>
        </section>
      ) : null}
    </article>
  );
}
