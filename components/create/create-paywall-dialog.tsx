"use client";

import { X } from "lucide-react";
import { useId } from "react";
import { PlansOffer } from "@/components/plans/plans-offer";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";

/** The tariffs page, opened over create when a filled song has no credit. */
export function CreatePaywallDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="lp-plans-dialog">
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <PlansOffer
          titleId={titleId}
          titleAs="h2"
          toolbar={
            <IconButton label="Закрыть" onClick={onClose}>
              <X aria-hidden className="size-4" strokeWidth={1.75} />
            </IconButton>
          }
        />
      </div>
    </Modal>
  );
}
