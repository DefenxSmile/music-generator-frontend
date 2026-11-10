"use client";

import { ArrowUp, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";

/** A short line under the lyrics field. Java has no lyrics-only request, so the line is written into the field. */
export function LyricsPrompt({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (line: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const fieldId = useId();
  const [line, setLine] = useState("");
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    setLine("");
    inputRef.current?.focus();
    function onPointer(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-lyrics-field]")) return;
      onCloseRef.current();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function commit() {
    const value = line.trim();
    if (!value) return;
    onSubmit(value);
    setLine("");
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commit();
  }

  return (
    <div
      ref={rootRef}
      data-open={open ? "true" : "false"}
      inert={open ? undefined : true}
      className="lp-lyrics-prompt absolute inset-x-3 bottom-3 z-10 flex items-center gap-1 rounded-xl p-1.5"
    >
      <label htmlFor={fieldId} className="sr-only">
        О чём должны быть слова
      </label>
      <Input
        ref={inputRef}
        id={fieldId}
        value={line}
        onChange={(event) => setLine(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="О чём должны быть слова"
        autoComplete="off"
        className="min-w-0 flex-1 border-0 bg-transparent px-2.5 py-1.5 focus-visible:border-transparent"
      />
      <IconButton
        label="В текст"
        disabled={!line.trim()}
        onClick={commit}
        className="disabled:pointer-events-none disabled:opacity-40"
      >
        <ArrowUp aria-hidden className="size-4" strokeWidth={1.75} />
      </IconButton>
      <IconButton label="Закрыть" onClick={onClose}>
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </IconButton>
    </div>
  );
}
