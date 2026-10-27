"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { refreshAccessToken } from "@/lib/api/fetch-json";
import { takeAuthNext } from "@/lib/auth/auth-next";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    refreshAccessToken().then((token) => {
      if (cancelled) return;
      if (!token) {
        setFailed(true);
        return;
      }
      router.replace(takeAuthNext());
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!failed) return <Loading label="Входим" />;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="lp-section-title text-text-primary">Не получилось войти</h1>
      <p className="lp-body mt-3 max-w-[36ch]">Яндекс или VK не открыли сессию. Попробуйте ещё раз.</p>
      <Link href="/?auth=1" className="mt-8 inline-block text-sm text-text-primary underline decoration-border underline-offset-4">
        Вернуться ко входу
      </Link>
    </main>
  );
}
