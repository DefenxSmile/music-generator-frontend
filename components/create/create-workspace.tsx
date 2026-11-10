"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ResultStage } from "@/components/create/result-stage";
import { SongComposer } from "@/components/create/song-composer";
import { GenerationDetail } from "@/components/song/generation-detail";
import type { SongDraft } from "@/types/song-draft";
import { persistHeroIdea, resolveInitialIdea } from "@/utils/hero-idea";
import { descriptionDraft, persistSongDraft, readSongDraft } from "@/utils/song-draft";

const EMPTY_DRAFT: SongDraft = { idea: "", lyrics: "" };

export function CreateWorkspace() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const [draft, setDraft] = useState<SongDraft>(EMPTY_DRAFT);
  const sourceRef = useRef("");

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

  return (
    <main className="flex flex-col lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <section
        aria-label="Конструктор"
        className="lp-composer-pane flex flex-col border-b border-overlay/6 lg:h-full lg:min-h-0 lg:w-[28rem] lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-r xl:w-[34rem]"
      >
        <div className="flex flex-col p-4 sm:p-5 lg:min-h-0 lg:flex-1">
          <h1 className="sr-only">Песня</h1>
          <SongComposer draft={draft} onDraft={onDraft} />
        </div>
      </section>
      <section aria-label="Результат" className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
        <div className="flex min-h-full flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
          {id ? (
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
