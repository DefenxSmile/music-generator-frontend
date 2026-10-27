"use client";

import Button from "@/components/ui/Button";
import { generationErrorLabel } from "@/utils/generation-status";
import type { Generation } from "@/types/generation";

export function SongUnavailable({ generation }: { generation: Generation }) {
  const reason =
    generation.status === "EXPIRED"
      ? "Срок хранения песни истёк."
      : (generationErrorLabel(generation.errorCode) ?? "Песня не получилась.");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-primary">{reason}</p>
      <Button href="/create" variant="outline" size="sm">
        Создать заново
      </Button>
    </div>
  );
}
