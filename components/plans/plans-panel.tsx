"use client";

import { PlansOffer } from "@/components/plans/plans-offer";

export function PlansPanel() {
  return (
    <main className="relative px-4 pb-16 pt-10 sm:pt-14">
      <div
        aria-hidden
        className="lp-stage-wash pointer-events-none absolute inset-x-0 top-0 h-[min(100dvh,52rem)]"
      />
      <div className="relative mx-auto w-full max-w-5xl">
        <PlansOffer />
      </div>
    </main>
  );
}
