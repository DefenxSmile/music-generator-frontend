import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="px-4 py-12 text-sm text-text-muted">Загрузка…</p>}>
      <LoginForm />
    </Suspense>
  );
}
