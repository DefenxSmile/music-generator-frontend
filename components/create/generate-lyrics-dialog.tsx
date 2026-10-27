"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { Surface } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";

/** Lyrics are written in this window, then committed into the song field. */
export function GenerateLyricsDialog({
  open,
  lyrics,
  onClose,
  onCommit,
}: {
  open: boolean;
  lyrics: string;
  onClose: () => void;
  onCommit: (lyrics: string) => void;
}) {
  const wasOpen = useRef(false);
  const titleId = useId();
  const [draft, setDraft] = useState(lyrics);
  const [idea, setIdea] = useState("");
  const ideaRef = useAutosizeTextarea(idea);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setDraft(lyrics);
      setIdea("");
    }
    wasOpen.current = open;
  }, [lyrics, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = idea.trim();
    if (!value) return;
    setDraft((current) => {
      const base = current.trim();
      if (!base || base === value) return value;
      return `${base}\n\n${value}`;
    });
    setIdea("");
    draftRef.current?.focus();
  }

  function commit() {
    const value = draft.trim();
    if (!value) return;
    onCommit(value);
  }

  const hasDraft = draft.trim().length > 0;
  const hasIdea = idea.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="lp-lyrics-dialog"
      initialFocus={ideaRef}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2">
          <h2
            id={titleId}
            className="min-w-0 flex-1 text-base font-semibold tracking-tight text-text-primary"
          >
            Текст песни
          </h2>
          <IconButton label="Закрыть" onClick={onClose}>
            <X aria-hidden className="size-4" strokeWidth={1.75} />
          </IconButton>
        </div>
        <label htmlFor="lyrics-draft" className="sr-only">
          Текст песни
        </label>
        <Textarea
          ref={draftRef}
          id="lyrics-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Слова появятся здесь."
          autoComplete="off"
          className="min-h-48 flex-1 text-[1.0625rem] leading-relaxed"
        />
        <Surface className="p-2">
          <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label htmlFor="lyrics-idea" className="sr-only">
              Идея текста
            </label>
            <Textarea
              ref={ideaRef}
              id="lyrics-idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Тема, повод или что должно прозвучать в словах."
              autoComplete="off"
              rows={2}
              className="max-h-40 min-h-16 flex-1 overflow-y-auto px-2.5 py-2 text-[0.9375rem] leading-relaxed"
            />
            <Button
              type="submit"
              variant={hasIdea ? "primary" : "outline"}
              size="sm"
              disabled={!hasIdea}
              className="w-full shrink-0 sm:w-auto"
            >
              Сгенерировать текст
            </Button>
          </form>
        </Surface>
        <Button
          type="button"
          variant={hasDraft && !hasIdea ? "primary" : "outline"}
          size="lg"
          disabled={!hasDraft}
          onClick={commit}
          className="min-h-12 w-full"
        >
          В песню
        </Button>
      </div>
    </Modal>
  );
}
