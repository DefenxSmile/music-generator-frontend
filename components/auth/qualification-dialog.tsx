"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QualificationFields } from "@/components/auth/qualification-fields";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import Button from "@/components/ui/Button";
import { rememberLead } from "@/utils/lead";
import { markQualificationDone, persistSongFor, persistVisitor, readQualificationDone, readSongFor, readVisitor } from "@/utils/qualification";
import { type SongFor, type VisitorKind } from "@/types/qualification";
export function QualificationDialog() {
  const pathname = usePathname();
  const status = useSessionStatus();
  const me = useMe();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const silentClose = useRef(false);
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState<VisitorKind | null>(null);
  const [songFor, setSongFor] = useState<SongFor | null>(null);
  const blocked = pathname.startsWith("/oauth") || pathname.startsWith("/auth");

  useEffect(() => {
    setVisitor(readVisitor());
    setSongFor(readSongFor());
  }, []);

  useEffect(() => {
    setOpen(status === "authenticated" && !blocked && !readQualificationDone());
  }, [blocked, status]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      node.focus({ preventScroll: true });
    }
    if (!open && node.open) {
      silentClose.current = true;
      node.close();
    }
  }, [open]);

  function dismiss() {
    if (!readQualificationDone()) {
      markQualificationDone();
      rememberLead("qualified", me.data?.id ?? null);
    }
    setOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className="lp-auth-dialog max-h-[min(40rem,calc(100dvh-2rem))] overflow-y-auto"
      aria-labelledby="qualify-dialog-title"
      onClose={() => {
        if (silentClose.current) {
          silentClose.current = false;
          return;
        }
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div
        aria-hidden
        className="lp-dialog-wash pointer-events-none absolute inset-x-0 top-0 h-36"
      />
      <button
        type="button"
        onClick={dismiss}
        aria-label="Закрыть"
        className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-lg text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-overlay/30"
      >
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
      <div className="px-7 pb-8 pt-12">
        <h2 id="qualify-dialog-title" className="text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary">
          Два вопроса
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">Можно не отвечать. На песню это не влияет.</p>
        <div className="mt-8">
          <QualificationFields
            visitor={visitor}
            songFor={songFor}
            onVisitor={(value) => {
              setVisitor(value);
              persistVisitor(value);
            }}
            onSongFor={(value) => {
              setSongFor(value);
              persistSongFor(value);
            }}
          />
        </div>
        <Button type="button" size="lg" className="mt-8 w-full" onClick={dismiss}>
          К песне
        </Button>
      </div>
    </dialog>
  );
}
