"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { writeSignedInHint } from "@/hooks/use-signed-in-hint";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { queryKeys } from "@/requests/query-keys";

/** Quiet strip when cookie resume failed — hold is already released. */
export function SessionResumeBanner() {
  const status = useSessionStatus();
  const openAuth = useOpenAuth();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  if (status !== "resume_failed") return null;

  async function retry() {
    if (busy) return;
    setBusy(true);
    try {
      const token = await refreshAccessToken();
      if (token) {
        writeSignedInHint(true);
        queryClient.setQueryData(queryKeys.session, token);
        await queryClient.invalidateQueries();
        return;
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="status" className="border-b border-overlay/8 bg-card px-4 py-3 text-center sm:px-6">
      <p className="text-sm text-text-muted">
        Не удалось восстановить вход. Обновите или войдите снова.
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" size="sm" disabled={busy} onClick={() => void retry()}>
          {busy ? "Пробуем" : "Повторить"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="quiet"
          onClick={() => openAuth({ intent: "enter" })}
        >
          Войти
        </Button>
      </div>
    </div>
  );
}
