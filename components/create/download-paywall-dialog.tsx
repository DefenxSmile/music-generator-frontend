"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PlansOffer } from "@/components/plans/plans-offer";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { markDownloadOfferSeen, shouldOpenDownloadOffer } from "@/utils/download-offer";

/**
 * Download paywall in one dialog: tariffs first, then the same shell swaps to the
 * one-time pack offer if the user dismisses without buying.
 */
export function DownloadPaywallDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const [step, setStep] = useState<"plans" | "offer">("plans");
  const stepRef = useRef(step);
  const offer = step === "offer";
  stepRef.current = step;

  useEffect(() => {
    if (open) setStep("plans");
  }, [open]);

  useEffect(() => {
    if (open && step === "offer") markDownloadOfferSeen();
  }, [open, step]);

  function goToOfferOrClose() {
    if (stepRef.current === "plans" && shouldOpenDownloadOffer()) {
      setStep("offer");
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={goToOfferOrClose}
      onEscape={
        step === "plans"
          ? () => {
              if (shouldOpenDownloadOffer()) setStep("offer");
              else onClose();
            }
          : undefined
      }
      labelledBy={titleId}
      className="lp-plans-dialog"
    >
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <PlansOffer
          key={step}
          titleId={titleId}
          titleAs="h2"
          mode={offer ? "download-offer" : "default"}
          onDecline={offer ? onClose : undefined}
          toolbar={
            <IconButton label="Закрыть" onClick={goToOfferOrClose}>
              <X aria-hidden className="size-4" strokeWidth={1.75} />
            </IconButton>
          }
        />
      </div>
    </Modal>
  );
}
