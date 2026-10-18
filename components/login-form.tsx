"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage, TextField } from "@/components/field";
import { AuthFrame } from "@/components/auth-frame";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { loginAccount } from "@/lib/api/auth";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await loginAccount(email.trim(), password);
      router.push(safeNext(searchParams.get("next")));
    } catch (caught) {
      setError(apiErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame
      title="Вход"
      footer={
        <>
          <Link href="/auth/register" className="text-text-primary underline">
            Регистрация
          </Link>
          {" · "}
          <Link href="/auth/forgot-password" className="text-text-primary underline">
            Не помню пароль
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label="Почта"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <FormMessage>{error}</FormMessage> : null}
        <Button type="submit" disabled={pending}>
          Войти
        </Button>
      </form>
    </AuthFrame>
  );
}
