"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthFrame } from "@/components/auth-frame";
import { FormMessage, TextField } from "@/components/field";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { forgotPassword } from "@/lib/api/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (caught) {
      setError(apiErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame
      title="Восстановить пароль"
      footer={
        <Link href="/auth/login" className="text-text-primary underline">
          Вернуться ко входу
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm leading-relaxed text-text-muted">
          Если такая почта зарегистрирована, письмо со ссылкой уже отправлено.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            label="Почта"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {error ? <FormMessage>{error}</FormMessage> : null}
          <Button type="submit" disabled={pending}>
            Отправить ссылку
          </Button>
        </form>
      )}
    </AuthFrame>
  );
}
