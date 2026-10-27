"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { createWorkspaceHref } from "@/utils/generation-href";
import { persistHeroIdea, PROMPT_MAX, resolveInitialIdea } from "@/utils/hero-idea";
import { rememberLead } from "@/utils/lead";
import { descriptionDraft, persistSongDraft } from "@/utils/song-draft";
import { readSongFor, songForPlaceholder } from "@/utils/qualification";
/** Home is only the idea. Creating opens the workspace and does not start a song. */
export function SongStart() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
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
    persistSongDraft(descriptionDraft(value), value);
    rememberLead("idea");
    router.push(createWorkspaceHref());
  }

  const value = idea;
  const canSubmit = value.trim().length > 0;
  const fieldRef = useAutosizeTextarea(value);

  return (
    <main className="relative px-4 pb-24 pt-14 sm:pt-20 lg:pt-28">
      <div
        aria-hidden
        className="lp-stage-wash pointer-events-none absolute inset-x-0 top-0 h-[min(100dvh,52rem)]"
      />
      <div className="relative mx-auto w-full max-w-2xl text-center">
        <h1 className="lp-section-title text-text-primary">О чём будет песня?</h1>
        <p className="lp-body mx-auto mt-3 max-w-md">Опишите песню, которую хотите создать.</p>
        <form onSubmit={onSubmit} className="mt-8 text-left">
          <div className="lp-hero-prompt rounded-xl p-3 sm:p-4">
            <label htmlFor="song-idea" className="sr-only">
              Описание песни
            </label>
            <Textarea
              ref={fieldRef}
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
              className="min-h-16 overflow-hidden px-2 py-1.5 text-base leading-relaxed"
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
