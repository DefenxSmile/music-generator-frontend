"use client";

import { createContext, useContext } from "react";
import type { OpenAuthOptions } from "@/types/auth";

export const OpenAuthContext = createContext<(options?: OpenAuthOptions) => void>(() => {});

export function useOpenAuth(): (options?: OpenAuthOptions) => void {
  return useContext(OpenAuthContext);
}
