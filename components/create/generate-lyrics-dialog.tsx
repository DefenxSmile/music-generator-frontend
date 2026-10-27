"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";

/** Ask for a lyrics idea, then hand that text back to the song field. */
export function GenerateLyricsDialog({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (idea: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const silentClose = useRef(false);
  const titleId = useId();
  const [idea, setIdea] = useState("");
  const fieldRef = useAutosizeTextarea(idea);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      fieldRef.current?.focus();
    }
    if (!open && node.open) {
      silentClose.current = true;
      node.close();
    }
  }, [fieldRef, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = idea.trim();
    if (!value) return;
    onGenerate(value);
    setIdea("");
  }

  return (
    <dialog
      ref={dialogRef}
      className="lp-auth-dialog lp-lyrics-dialog"
      aria-labelledby={titleId}
      onClose={() => {
        if (silentClose.current) {
          silentClose.current = false;
          return;
        }
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-lg text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-overlay/30"
      >
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-14 sm:px-7">
        <p id={titleId} className="flex flex-1 items-center justify-center px-6 text-center text-lg text-text-primary">
          Опишите, какой текст нужен
        </p>
        <form
          onSubmit={submit}
          className="flex flex-col gap-2 rounded-xl border border-overlay/10 bg-bg-card p-2 sm:flex-row sm:items-end"
        >
          <label htmlFor="lyrics-idea" className="sr-only">
            Идея текста
          </label>
          <textarea
            ref={fieldRef}
            id="lyrics-idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="Тема, повод или что должно прозвучать в словах."
            autoComplete="off"
            rows={2}
            className="max-h-40 min-h-16 w-full flex-1 resize-none overflow-y-auto bg-transparent px-2.5 py-2 text-[0.9375rem] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <Button type="submit" size="sm" disabled={!idea.trim()} className="w-full shrink-0 sm:w-auto">
            Сгенерировать текст
          </Button>
        </form>
      </div>
    </dialog>
  );
}
