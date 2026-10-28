"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GenerationPreview } from "@/components/create/generation-preview";
import { ResultStage } from "@/components/create/result-stage";
import { SongComposer } from "@/components/create/song-composer";
import { GenerationDetail } from "@/components/song/generation-detail";
import type { SongDraft } from "@/types/song-draft";
import { persistHeroIdea, resolveInitialIdea } from "@/utils/hero-idea";
import { descriptionDraft, persistSongDraft, readSongDraft } from "@/utils/song-draft";

const EMPTY_DRAFT: SongDraft = { idea: "", lyrics: "" };
const PREVIEW = process.env.NODE_ENV === "development";
const PREVIEW_STEPS = [
  { status: "MODERATING", at: 1800 },
  { status: "RUNNING", at: 3600 },
  { status: "READY", at: 5400 },
] as const;

export function CreateWorkspace() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const [draft, setDraft] = useState<SongDraft>(EMPTY_DRAFT);
  const [preview, setPreview] = useState<{ token: number; draft: SongDraft; status: string } | null>(
    null,
  );
  const sourceRef = useRef("");
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!preview) return;
    const timers = PREVIEW_STEPS.map((step) =>
      window.setTimeout(() => {
        setPreview((current) =>
          current && current.token === preview.token ? { ...current, status: step.status } : current,
        );
      }, step.at),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [preview?.token]);

  useEffect(() => {
    const hero = resolveInitialIdea(window.location.search);
    const stored = readSongDraft();
    if (stored && stored.source === hero) {
      sourceRef.current = stored.source;
      setDraft({ idea: stored.idea, lyrics: stored.lyrics });
      return;
    }
    const next = descriptionDraft(hero);
    sourceRef.current = hero;
    persistSongDraft(next, hero);
    if (hero) persistHeroIdea(hero);
    setDraft(next);
  }, []);

  function onDraft(next: SongDraft) {
    setDraft(next);
    persistSongDraft(next, sourceRef.current);
  }

  function onPreview(next: SongDraft) {
    setPreview({ token: Date.now(), draft: next, status: "WRITING" });
    resultRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <main className="flex flex-col lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <section
        aria-label="Конструктор"
        className="lp-composer-pane flex flex-col border-b border-overlay/6 lg:h-full lg:min-h-0 lg:w-[28rem] lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-r xl:w-[34rem]"
      >
        <div className="flex flex-col p-4 sm:p-5 lg:min-h-0 lg:flex-1">
          <h1 className="sr-only">Песня</h1>
          <SongComposer
            draft={draft}
            onDraft={onDraft}
            onPreview={PREVIEW ? onPreview : undefined}
            previewBusy={preview !== null && preview.status !== "READY"}
          />
        </div>
      </section>
      <section
        ref={resultRef}
        aria-label="Результат"
        className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-y-auto"
      >
        <div className="flex min-h-full flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
          {preview ? (
            <GenerationPreview draft={preview.draft} status={preview.status} />
          ) : id ? (
            <>
              <h2 className="mb-4 text-sm font-semibold text-text-primary">Результат</h2>
              <GenerationDetail />
            </>
          ) : (
            <ResultStage />
          )}
        </div>
      </section>
    </main>
  );
}
