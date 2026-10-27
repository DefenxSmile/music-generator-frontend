"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Loading } from "@/components/ui/loading";
import { useSessionStatus } from "@/hooks/use-session-status";
import { safeNext, takeAuthNext } from "@/utils/auth-next";
export default function QualifyPage() {
  return (
    <Suspense fallback={<Loading label="Открываем вопросы" />}>
      <QualifyRedirect />
    </Suspense>
  );
}

/** Old address. Questions open in a dialog on the page the person was heading to. */
function QualifyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useSessionStatus();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "anonymous") {
      const next = searchParams.get("next");
      router.replace(next ? `/?auth=1&next=${encodeURIComponent(safeNext(next))}` : "/?auth=1");
      return;
    }
    const queryNext = searchParams.get("next");
    router.replace(queryNext ? safeNext(queryNext) : takeAuthNext());
  }, [router, searchParams, status]);

  return <Loading label="Открываем вопросы" />;
}
