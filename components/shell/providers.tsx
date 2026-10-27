"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthDialogProvider } from "@/components/auth/auth-dialog";
import { LandingHandoff } from "@/components/shell/landing-handoff";
import { QualificationDialog } from "@/components/auth/qualification-dialog";
import { ApiError } from "@/lib/api/api-error";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
}

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
