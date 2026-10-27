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
        <h2
          id="qualify-dialog-title"
          className="text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary"
        >
          Два вопроса
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
          Можно не отвечать. На песню это не влияет.
        </p>
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
    </Modal>
  );
}
