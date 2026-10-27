"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type SupportLauncherContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSupport: () => void;
};

const SupportLauncherContext = createContext<SupportLauncherContextValue | null>(null);

/** Shares the panel between the desktop button and the phone menu. */
export function SupportLauncherProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSupport = useCallback(() => setOpen(true), []);
  const value = useMemo(
    (): SupportLauncherContextValue => ({ open, setOpen, openSupport }),
    [open, openSupport],
  );
  return (
    <SupportLauncherContext.Provider value={value}>{children}</SupportLauncherContext.Provider>
  );
}

export function useOptionalSupportLauncher(): SupportLauncherContextValue | null {
  return useContext(SupportLauncherContext);
}
