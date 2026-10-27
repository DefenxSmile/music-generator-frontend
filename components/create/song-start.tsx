"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { createWorkspaceHref } from "@/lib/song/generation-href";
import { persistHeroIdea, PROMPT_MAX, resolveInitialIdea } from "@/lib/lead/hero-idea";
import { rememberLead } from "@/lib/lead/lead";
import { readSongFor, songForPlaceholder } from "@/lib/lead/qualification";

/** Home is only the idea. Creating opens the workspace and does not start a song. */
export function SongStart() {
  const router = useRouter();
  const [idea, setIdea] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("Песня о нашей первой встрече летом…");

  useEffect(() => {
    const initial = resolveInitialIdea(window.location.search);
    setIdea(initial);
    if (initial) persistHeroIdea(initial);
    setPlaceholder(songForPlaceholder(readSongFor()));
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = (idea ?? "").trim();
    if (!value) return;
    persistHeroIdea(value);
    rememberLead("idea");
    router.push(createWorkspaceHref());
  }

  if (idea === null) {
    return (
      <main className="relative px-4 pb-24 pt-14 sm:pt-20 lg:pt-28">
        <div aria-hidden className="lp-stage-wash pointer-events-none absolute inset-x-0 top-0 h-[min(100dvh,52rem)]" />
        <div aria-hidden className="relative mx-auto w-full max-w-2xl">
          <span className="lp-skeleton mx-auto block h-9 w-64" />
          <span className="lp-skeleton mx-auto mt-3 block h-4 w-80 max-w-full" />
          <span className="lp-skeleton mt-8 block h-28 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  const value = idea;
  const canSubmit = value.trim().length > 0;

  return (
    <main className="relative px-4 pb-24 pt-14 sm:pt-20 lg:pt-28">
      <div aria-hidden className="lp-stage-wash pointer-events-none absolute inset-x-0 top-0 h-[min(100dvh,52rem)]" />
      <div className="relative mx-auto w-full max-w-2xl text-center">
        <h1 className="lp-section-title text-text-primary">О чём будет песня?</h1>
        <p className="lp-body mx-auto mt-3 max-w-md">Опишите идею или вставьте свой текст.</p>
        <form onSubmit={onSubmit} className="mt-8 text-left">
          <div className="lp-hero-prompt rounded-xl p-3 sm:p-4">
            <label htmlFor="song-idea" className="sr-only">
              Идея песни
            </label>
            <textarea
              id="song-idea"
              name="idea"
              rows={2}
              maxLength={PROMPT_MAX}
              value={value}
              onChange={(event) => {
                const next = event.target.value.slice(0, PROMPT_MAX);
                setIdea(next);
                persistHeroIdea(next);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && event.currentTarget.value.trim()) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={placeholder}
              autoComplete="off"
              className="block min-h-14 w-full resize-none bg-transparent px-2 py-1.5 text-base leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" disabled={!canSubmit}>
                Создать
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
