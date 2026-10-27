"use client";

import { Music2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GenerationDetail } from "@/components/song/generation-detail";
import { GenerationList } from "@/components/song/generation-list";
import { SongComposer } from "@/components/create/song-composer";
import { createWorkspaceHref } from "@/lib/song/generation-href";
import { persistHeroIdea, resolveInitialIdea } from "@/lib/lead/hero-idea";

export function CreateWorkspace() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const [idea, setIdea] = useState<string | null>(null);

  useEffect(() => {
    const initial = resolveInitialIdea(window.location.search);
    setIdea(initial);
    if (initial) persistHeroIdea(initial);
  }, []);

  return (
    <main className="flex flex-col lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <section aria-label="Конструктор" className="border-b border-overlay/6 lg:w-[22.5rem] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="p-4 sm:p-5">
          <h1 className="sr-only">Песня</h1>
          {idea === null ? (
            <div aria-hidden className="flex flex-col gap-3">
              <span className="lp-skeleton h-44 w-full rounded-xl" />
              <span className="lp-skeleton h-12 w-full rounded-lg" />
            </div>
          ) : (
            <SongComposer initialIdea={idea} />
          )}
        </div>
      </section>
      <section aria-label="Результат и история" className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
        <div className="flex min-h-full flex-col gap-8 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex min-h-[22rem] flex-1 flex-col">
            {id ? (
              <>
                <h2 className="mb-4 text-sm font-semibold text-text-primary">Результат</h2>
                <GenerationDetail />
              </>
            ) : (
              <ResultStage />
            )}
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold text-text-primary">История</h2>
            <GenerationList
              hrefFor={createWorkspaceHref}
              selectedId={id}
              authNext={createWorkspaceHref()}
              emptyAction={false}
              signIn={false}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ResultStage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <span
        aria-hidden
        className="lp-empty-disc relative grid size-[4.5rem] place-items-center rounded-full"
      >
        <span className="size-3 rounded-full bg-bg shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-overlay)_8%,transparent)]" />
        <Music2 className="absolute size-6 translate-x-2.5 text-accent" strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-center text-sm text-text-dim">Пока нет созданных песен</p>
    </div>
  );
}
