"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ResultStage } from "@/components/create/result-stage";
import { SongComposer } from "@/components/create/song-composer";
import { Section } from "@/components/ui/section";
import { useSessionStatus } from "@/hooks/use-session-status";
import { generationQueryOptions } from "@/requests/generations-query";
import type { SongDraft } from "@/types/song-draft";
import { persistHeroIdea, resolveInitialIdea } from "@/utils/hero-idea";
import { isActiveGenerationStatus } from "@/utils/generation-status";
import { isAuthenticated } from "@/utils/session-status";
import {
  applyGenerationLyrics,
  descriptionDraft,
  emptySongDraft,
  persistSongDraft,
  readSongDraft,
} from "@/utils/song-draft";

export function CreateWorkspace() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const status = useSessionStatus();
  const generation = useQuery(generationQueryOptions(id, isAuthenticated(status)));
  const [draft, setDraft] = useState<SongDraft>(emptySongDraft);
  const sourceRef = useRef("");
  const lyricsAppliedForId = useRef("");

  useEffect(() => {
    const hero = resolveInitialIdea(window.location.search);
    const stored = readSongDraft();
    if (stored && stored.source === hero) {
      sourceRef.current = stored.source;
      setDraft({
        idea: stored.idea,
        lyrics: stored.lyrics,
        style: stored.style,
        vocalGender: stored.vocalGender,
      });
      return;
    }
    const next = descriptionDraft(hero);
    sourceRef.current = hero;
    persistSongDraft(next, hero);
    if (hero) persistHeroIdea(hero);
    setDraft(next);
  }, []);

  useEffect(() => {
    lyricsAppliedForId.current = "";
  }, [id]);

  useEffect(() => {
    const applied = applyGenerationLyrics(
      draft,
      id,
      generation.data?.lyrics,
      lyricsAppliedForId.current,
    );
    if (!applied) return;
    lyricsAppliedForId.current = applied.appliedForId;
    if (applied.draft === draft) return;
    setDraft(applied.draft);
    persistSongDraft(applied.draft, sourceRef.current);
  }, [draft, id, generation.data?.lyrics]);

  function onDraft(next: SongDraft) {
    setDraft(next);
    persistSongDraft(next, sourceRef.current);
  }

  return (
    <main className="flex flex-col lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <section
        aria-label="Конструктор"
        className="lp-composer-pane flex max-h-[min(72dvh,40rem)] flex-col border-b border-overlay/6 lg:h-full lg:max-h-none lg:min-h-0 lg:w-[28rem] lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-r xl:w-[34rem]"
      >
        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:p-5">
          <h1 className="sr-only">Песня</h1>
          <SongComposer
            draft={draft}
            onDraft={onDraft}
            generationBusy={Boolean(
              id && generation.data && isActiveGenerationStatus(generation.data.status),
            )}
          />
        </div>
      </section>
      <section
        aria-label="Результат"
        className="flex min-h-0 min-w-0 flex-1 flex-col lg:overflow-hidden"
      >
        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:p-5">
          <Section className="flex min-h-0 flex-1 flex-col overflow-hidden border-overlay/8">
            <div className="flex shrink-0 items-center px-4 py-3">
              <h2 className="lp-kicker">Результат</h2>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              <ResultStage id={id} />
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}
