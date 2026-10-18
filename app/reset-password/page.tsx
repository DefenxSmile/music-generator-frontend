"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LegacyResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token")?.trim() ?? "";
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    router.replace(`/auth/reset-password${query}`);
  }, [router, searchParams]);

  return <p className="px-4 py-12 text-sm text-text-muted">Открываем сброс пароля…</p>;
}

/** Java mail builds `{publicUrl}/reset-password?token=`. The screen lives at `/auth/reset-password`. */
export default function LegacyResetPasswordPage() {
  return (
    <Suspense fallback={<p className="px-4 py-12 text-sm text-text-muted">Открываем сброс пароля…</p>}>
      <LegacyResetPasswordRedirect />
    </Suspense>
  );
}
