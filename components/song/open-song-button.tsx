"use client";

import { useOpenAuth } from "@/hooks/use-open-auth";
import Button from "@/components/ui/Button";

export function OpenSongButton({ next }: { next: string }) {
  const openAuth = useOpenAuth();
  return (
    <Button type="button" onClick={() => openAuth({ next })} variant="outline" size="sm">
      Войти
    </Button>
  );
}
