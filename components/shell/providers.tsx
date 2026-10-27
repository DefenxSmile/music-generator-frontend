"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthDialogProvider } from "@/components/auth/auth-dialog";
import { LandingHandoff } from "@/components/shell/landing-handoff";
import { QualificationDialog } from "@/components/auth/qualification-dialog";
import { makeQueryClient } from "@/requests/query-client";
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  return (
    <QueryClientProvider client={client}>
      <AuthDialogProvider>
        <LandingHandoff />
        {children}
        <QualificationDialog />
      </AuthDialogProvider>
    </QueryClientProvider>
  );
}
