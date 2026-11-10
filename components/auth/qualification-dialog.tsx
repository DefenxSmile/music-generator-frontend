"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { QualificationFields } from "@/components/auth/qualification-fields";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/modal";
import { rememberLead } from "@/utils/lead";
import {
  CONTENT_PLACE_QUESTION,
  GIFT_OCCASION_QUESTION,
  SONG_JOB_QUESTION,
  markQualificationDone,
  persistContentPlace,
  persistGiftOccasion,
  persistSongJob,
  QUALIFICATION_EVERY_SESSION,
  readContentPlace,
  readGiftOccasion,
  readQualificationDone,
  readSongJob,
  songJobNeedsDetail,
} from "@/utils/qualification";
import type { ContentPlace, GiftOccasion, SongJob } from "@/types/qualification";
import { isAuthenticated, isSessionLoading } from "@/utils/session-status";

export function QualificationDialog() {
  const pathname = usePathname();
  const status = useSessionStatus();
  const me = useMe();
  const [released, setReleased] = useState(false);
  const [step, setStep] = useState<"job" | "detail">("job");
  const [songJob, setSongJob] = useState<SongJob | null>(null);
  const [giftOccasion, setGiftOccasion] = useState<GiftOccasion | null>(null);
  const [contentPlace, setContentPlace] = useState<ContentPlace | null>(null);
  const blocked = pathname.startsWith("/oauth") || pathname.startsWith("/auth");

  useEffect(() => {
    setSongJob(readSongJob());
    setGiftOccasion(readGiftOccasion());
    setContentPlace(readContentPlace());
  }, []);

  const answered = isAuthenticated(status) && !QUALIFICATION_EVERY_SESSION && readQualificationDone();
  const open = isAuthenticated(status) && !blocked && !released && !answered;

  useEffect(() => {
    if (open) setStep("job");
  }, [open]);

  useEffect(() => {
    if (blocked) {
      document.documentElement.removeAttribute("data-qualify-hold");
      return;
    }
    // Hold only while resume is in flight or questions are open — never on resume_failed.
    if (isSessionLoading(status) || open) {
      document.documentElement.setAttribute("data-qualify-hold", "");
    } else {
      document.documentElement.removeAttribute("data-qualify-hold");
    }
  }, [blocked, open, status]);

  function dismiss() {
    if (!readQualificationDone()) {
      markQualificationDone();
      rememberLead("qualified", me.data?.id ?? null);
    }
    setReleased(true);
    document.documentElement.removeAttribute("data-qualify-hold");
  }

  function chooseJob(value: SongJob | null) {
    setSongJob(value);
    persistSongJob(value);
    if (value !== "gift") setGiftOccasion(null);
    if (value !== "content") setContentPlace(null);
  }

  const detailReady = songJob === "gift" ? giftOccasion !== null : contentPlace !== null;
  const canContinue = step === "job" ? songJob !== null : detailReady;
  const counter =
    step === "detail" ? "2 из 2" : songJobNeedsDetail(songJob) ? "1 из 2" : null;
  const question =
    step === "job"
      ? SONG_JOB_QUESTION
      : songJob === "content"
        ? CONTENT_PLACE_QUESTION
        : GIFT_OCCASION_QUESTION;
  const primaryLabel =
    step === "detail" || songJob === "self" || songJob === "release" ? "К песне" : "Дальше";

  return (
    <Modal
      open={open}
      onClose={dismiss}
      dismissable={false}
      labelledBy="qualify-dialog-title"
      className="max-h-[min(40rem,calc(100dvh-2rem))] overflow-y-auto"
    >
      <div
        aria-hidden
        className="lp-dialog-wash pointer-events-none absolute inset-x-0 top-0 h-36"
      />
      {step === "detail" ? (
        <button
          type="button"
          onClick={() => setStep("job")}
          className="absolute left-3.5 top-3.5 inline-flex cursor-pointer items-center gap-0.5 rounded-lg py-1.5 pl-1.5 pr-2.5 text-sm text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronLeft aria-hidden strokeWidth={1.75} className="size-4" />
          Назад
        </button>
      ) : null}
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3.5 top-3.5 cursor-pointer rounded-lg px-2.5 py-1.5 text-sm text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Пропустить
      </button>
      <div className="px-7 pb-8 pt-12">
        <p className="min-h-5 text-center text-sm text-text-dim" aria-hidden={counter ? undefined : true}>
          {counter}
        </p>
        <h2
          id="qualify-dialog-title"
          className="mt-2 text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary"
        >
          {question}
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
          Ответы помогут сервису развиваться.
        </p>
        <div className="mt-8 min-h-[9.25rem] sm:min-h-24">
          <QualificationFields
            step={step}
            songJob={songJob}
            giftOccasion={giftOccasion}
            contentPlace={contentPlace}
            onSongJob={chooseJob}
            onGiftOccasion={(value) => {
              setGiftOccasion(value);
              persistGiftOccasion(value);
            }}
            onContentPlace={(value) => {
              setContentPlace(value);
              persistContentPlace(value);
            }}
          />
        </div>
        <div className="mt-8">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!canContinue}
            onClick={() => {
              if (step === "job" && songJobNeedsDetail(songJob)) {
                setStep("detail");
                return;
              }
              dismiss();
            }}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
