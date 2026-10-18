"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useLogout, useMe, useSessionStatus } from "@/components/session";
import { creditsLabel } from "@/lib/credits";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Создать" },
  { href: "/generations", label: "Песни" },
  { href: "/plans", label: "Тарифы" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const status = useSessionStatus();
  const me = useMe();
  const logout = useLogout();
  const [leaving, setLeaving] = useState(false);

  async function onLogout() {
    setLeaving(true);
    try {
      await logout();
    } finally {
      setLeaving(false);
    }
  }

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-text-primary">
            AI Music
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(active ? "text-text-primary" : "text-text-muted hover:text-text-primary")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            {status === "authenticated" && me.data ? (
              <>
                <span className="text-text-muted">{me.data.email}</span>
                <span className="text-text-primary">{creditsLabel(me.data.balance)}</span>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={leaving}
                  className="text-text-muted hover:text-text-primary disabled:opacity-40"
                >
                  Выйти
                </button>
              </>
            ) : status === "loading" ? (
              <span className="text-text-dim">Проверяем вход…</span>
            ) : (
              <>
                <Link href="/auth/login" className="text-text-muted hover:text-text-primary">
                  Войти
                </Link>
                <Link href="/auth/register" className="text-text-primary">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
