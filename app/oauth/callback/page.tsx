"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { apiErrorMessage } from "@/requests/api-error";
import { exchangeOauthCode } from "@/requests/auth";
import { takeAuthNext } from "@/types/auth-next";
import { clearOauthCallbackCode, readAndClearOauthCallbackCode } from "@/utils/oauth-callback-code";

/**
 * Survives React Strict Mode remounts.
 * Kept after success so a late remount does not show a false "no code" error.
 */
let exchangeInFlight: Promise<string> | null = null;

function ensureOauthExchange(): Promise<string> {
  if (exchangeInFlight) return exchangeInFlight;

  const code = readAndClearOauthCallbackCode();
  if (!code) {
    return Promise.reject(new Error("Нет кода входа. Начните вход с Яндекса ещё раз."));
  }

  // Clear stash only after Java accepts the code — keep it if the network fails.
  exchangeInFlight = exchangeOauthCode(code).then((token) => {
    clearOauthCallbackCode();
    return token;
  });
  return exchangeInFlight;
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    ensureOauthExchange()
      .then(() => {
        if (!cancelled) router.replace(takeAuthNext());
      })
      .catch((err: unknown) => {
        exchangeInFlight = null;
        if (!cancelled) setError(apiErrorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!error) return <Loading label="Входим" />;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="lp-section-title text-text-primary">Не получилось войти</h1>
      <p className="lp-body mt-3 max-w-[36ch]">{error}</p>
      <p className="mt-3 max-w-[36ch] text-sm text-text-dim">
        Код Яндекса действует пару минут и сгорает после обмена.
      </p>
      <Link
        href="/?auth=1"
        className="mt-8 inline-block text-sm text-text-primary underline decoration-border underline-offset-4"
      >
        Вернуться ко входу
      </Link>
    </main>
  );
}
