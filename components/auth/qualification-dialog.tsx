"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { QualificationFields } from "@/components/auth/qualification-fields";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import Button from "@/components/ui/Button";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { rememberLead } from "@/utils/lead";
import {
  SONG_FOR_QUESTION,
  VISITOR_QUESTION,
  markQualificationDone,
  persistSongFor,
  persistVisitor,
  readQualificationDone,
  readSongFor,
  readVisitor,
} from "@/utils/qualification";
import { type SongFor, type VisitorKind } from "@/types/qualification";
export function QualificationDialog() {
  const pathname = usePathname();
  const status = useSessionStatus();
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"visitor" | "song">("visitor");
  const [visitor, setVisitor] = useState<VisitorKind | null>(null);
  const [songFor, setSongFor] = useState<SongFor | null>(null);
  const blocked = pathname.startsWith("/oauth") || pathname.startsWith("/auth");

  useEffect(() => {
    setVisitor(readVisitor());
    setSongFor(readSongFor());
  }, []);

  useEffect(() => {
    const next = status === "authenticated" && !blocked && !readQualificationDone();
    setOpen(next);
    if (next) setStep("visitor");
  }, [blocked, status]);

  function dismiss() {
    if (!readQualificationDone()) {
      markQualificationDone();
      rememberLead("qualified", me.data?.id ?? null);
    }
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      onClose={dismiss}
      labelledBy="qualify-dialog-title"
      className="max-h-[min(40rem,calc(100dvh-2rem))] overflow-y-auto"
    >
      <div
        aria-hidden
        className="lp-dialog-wash pointer-events-none absolute inset-x-0 top-0 h-36"
      />
      <IconButton label="Закрыть" onClick={dismiss} className="absolute right-3.5 top-3.5">
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </IconButton>
      <div className="px-7 pb-8 pt-12">
        <p className="text-center text-sm text-text-dim">
          {step === "visitor" ? "1 из 2" : "2 из 2"}
        </p>
        <h2
          id="qualify-dialog-title"
          className="mt-2 text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary"
        >
          {step === "visitor" ? VISITOR_QUESTION : SONG_FOR_QUESTION}
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
          Ответы помогут сервису развиваться. Можно не отвечать, на песню это не влияет.
        </p>
        <div className="mt-8">
          <QualificationFields
            step={step}
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
        <div className="mt-8 flex flex-col gap-3">
          {step === "song" ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setStep("visitor")}
            >
              Назад
            </Button>
          ) : null}
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => (step === "visitor" ? setStep("song") : dismiss())}
          >
            {step === "visitor" ? "Дальше" : "К песне"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
