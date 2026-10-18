"use client";

import { useEffect } from "react";
import { acceptLandingConsent } from "@/lib/consent";
import { captureMarketingAttribution } from "@/lib/marketing-attribution";

/** Reads lp_consent and campaign params the landing puts on the first URL. */
export function LandingHandoff() {
  useEffect(() => {
    acceptLandingConsent();
    captureMarketingAttribution();
  }, []);
  return null;
}
