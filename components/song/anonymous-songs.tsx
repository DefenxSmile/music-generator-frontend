"use client";

import { useOpenAuth } from "@/hooks/use-open-auth";
import Button from "@/components/ui/Button";

export function AnonymousSongs({ next }: { next: string }) {
  const openAuth = useOpenAuth();
  return (
    <div className="rounded-xl border border-border px-4 py-8 text-center">
      <p className="text-sm text-text-muted">Песни появятся здесь после входа.</p>
      <Button
        type="button"
        onClick={() => openAuth({ next })}
        variant="outline"
        size="sm"
        className="mt-4"
      >
        Войти
      </Button>
    </div>
  );
}
