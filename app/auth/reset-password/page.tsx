import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="px-4 py-12 text-sm text-text-muted">Загрузка…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
