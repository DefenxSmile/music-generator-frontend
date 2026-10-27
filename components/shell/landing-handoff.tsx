"use client";

import { useEffect } from "react";
import { acceptLandingConsent } from "@/utils/consent";
import { captureMarketingAttribution } from "@/utils/marketing-attribution";
/** Reads lp_consent and campaign params the landing puts on the first URL. */
export function LandingHandoff() {
  useEffect(() => {
    acceptLandingConsent();
    captureMarketingAttribution();
  }, []);
  return null;
}
