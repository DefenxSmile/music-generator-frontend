"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefixedKey } from "@/utils/storage-prefix";

/** One prompt per browser session. Timing matches ViralThumblify. */
export const SUPPORT_NUDGE_SESSION_KEY = prefixedKey("support_nudge_seen");
const TIME_ON_SITE_MS = 60_000;
const IDLE_MS = 45_000;
const CHECK_INTERVAL_MS = 5_000;
const ACTIVITY_THROTTLE_MS = 1_000;

type UseSupportProactiveNudgeParams = {
  enabled?: boolean;
  isWidgetOpen: boolean;
  hasSubmitted: boolean;
  isLauncherVisible: boolean;
};

type UseSupportProactiveNudgeResult = {
  showNudge: boolean;
  markNudgeHandled: () => void;
};

function readNudgeSeen(): boolean {
  try {
    return sessionStorage.getItem(SUPPORT_NUDGE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeNudgeSeen(): void {
  try {
    sessionStorage.setItem(SUPPORT_NUDGE_SESSION_KEY, "1");
  } catch {
    /* sessionStorage blocked */
  }
}

export function useSupportProactiveNudge({
  enabled = true,
  isWidgetOpen,
  hasSubmitted,
  isLauncherVisible,
}: UseSupportProactiveNudgeParams): UseSupportProactiveNudgeResult {
  const [showNudge, setShowNudge] = useState(false);
  const [isHandled, setIsHandled] = useState(readNudgeSeen);
  const isHandledRef = useRef(isHandled);
  const isWidgetOpenRef = useRef(isWidgetOpen);
  const hasSubmittedRef = useRef(hasSubmitted);
  isHandledRef.current = isHandled;
  isWidgetOpenRef.current = isWidgetOpen;
  hasSubmittedRef.current = hasSubmitted;

  const markNudgeHandled = useCallback(() => {
    writeNudgeSeen();
    isHandledRef.current = true;
    setIsHandled(true);
    setShowNudge(false);
  }, []);

  useEffect(() => {
    if (isWidgetOpen || hasSubmitted) setShowNudge(false);
  }, [hasSubmitted, isWidgetOpen]);

  useEffect(() => {
    if (!enabled || !isLauncherVisible || isHandled || isWidgetOpen || hasSubmitted) {
      setShowNudge(false);
      return;
    }
    if (showNudge) return;
    const mountedAt = Date.now();
    let lastActivityAt = mountedAt;
    let pausedMs = 0;
    let pauseStartedAt: number | null = null;
    let lastThrottledActivityAt = 0;
    function getPausedMs(now: number): number {
      const activePause = pauseStartedAt !== null ? now - pauseStartedAt : 0;
      return pausedMs + activePause;
    }
    function shouldBlock(): boolean {
      return isHandledRef.current || isWidgetOpenRef.current || hasSubmittedRef.current;
    }
    function markActivity(force = false): void {
      const now = Date.now();
      if (!force && now - lastThrottledActivityAt < ACTIVITY_THROTTLE_MS) return;
      lastThrottledActivityAt = now;
      lastActivityAt = now;
    }
    function onVisibilityChange(): void {
      const now = Date.now();
      if (document.hidden) {
        if (pauseStartedAt === null) pauseStartedAt = now;
        return;
      }
      if (pauseStartedAt !== null) {
        pausedMs += now - pauseStartedAt;
        pauseStartedAt = null;
        markActivity(true);
      }
    }
    function onActivity(): void {
      markActivity();
    }
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", onVisibilityChange);
    const intervalId = window.setInterval(() => {
      if (shouldBlock() || document.hidden) return;
      const tickAt = Date.now();
      const timeOnSite = tickAt - mountedAt - getPausedMs(tickAt);
      const idleFor = tickAt - lastActivityAt;
      if (timeOnSite >= TIME_ON_SITE_MS || idleFor >= IDLE_MS) {
        setShowNudge(true);
        window.clearInterval(intervalId);
      }
    }, CHECK_INTERVAL_MS);
    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, onActivity));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [enabled, hasSubmitted, isHandled, isLauncherVisible, isWidgetOpen, showNudge]);

  return { showNudge, markNudgeHandled };
}
