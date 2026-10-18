"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AuthFrame } from "@/components/auth-frame";
import { FormMessage, TextAreaField, TextField } from "@/components/field";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { registerAccount } from "@/lib/api/auth";
import { persistHeroIdea, PROMPT_MAX, resolveInitialIdea } from "@/lib/hero-idea";

function passwordProblem(password: string): string | null {
  if (password.length < 8 || password.length > 72) return "Пароль: от 8 до 72 символов";
  return null;
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idea, setIdea] = useState("");
  const [showIdea, setShowIdea] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  useEffect(() => {
    const initial = resolveInitialIdea(window.location.search);
    setIdea(initial);
    if (initial) {
      setShowIdea(true);
      persistHeroIdea(initial);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const localError = passwordProblem(password);
    if (localError) {
      setError(localError);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const created = await registerAccount(email.trim(), password);
      setDoneEmail(created.email);
    } catch (caught) {
      setError(apiErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  if (doneEmail) {
    return (
      <AuthFrame
        title="Проверьте почту"
        footer={
          <Link href="/auth/login" className="text-text-primary underline">
            Перейти ко входу
          </Link>
        }
      >
        <p className="text-sm leading-relaxed text-text-muted">
          Письмо ушло на {doneEmail}. Подтвердите почту по ссылке из письма, затем войдите. Регистрация
          сессию не открывает.
        </p>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      title="Регистрация"
      footer={
        <Link href="/auth/login" className="text-text-primary underline">
          Уже есть почта — войти
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {showIdea ? (
          <TextAreaField
            label="Идея песни"
            hint="Она уже сохранена. После входа заново вводить не нужно."
            value={idea}
            maxLength={PROMPT_MAX}
            onChange={(event) => {
              const next = event.target.value.slice(0, PROMPT_MAX);
              setIdea(next);
              persistHeroIdea(next);
            }}
          />
        ) : null}
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
          Зарегистрироваться
        </Button>
      </form>
    </AuthFrame>
  );
}
