"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthFrame } from "@/components/auth-frame";
import { FormMessage, TextField } from "@/components/field";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { resetPassword } from "@/lib/api/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8 || password.length > 72) {
      setError("Пароль: от 8 до 72 символов");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (caught) {
      setError(apiErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame
      title="Новый пароль"
      footer={
        <Link href="/auth/login" className="text-text-primary underline">
          Ко входу
        </Link>
      }
    >
      {!token ? (
        <p className="text-sm leading-relaxed text-text-muted">
          В ссылке нет токена.{" "}
          <Link href="/auth/forgot-password" className="text-text-primary underline">
            Запросите письмо ещё раз
          </Link>
          .
        </p>
      ) : done ? (
        <p className="text-sm leading-relaxed text-text-muted">Пароль обновлён. Можно войти.</p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            label="Новый пароль"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            hint="От 8 до 72 символов"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <FormMessage>{error}</FormMessage> : null}
          <Button type="submit" disabled={pending}>
            Сохранить пароль
          </Button>
        </form>
      )}
    </AuthFrame>
  );
}
