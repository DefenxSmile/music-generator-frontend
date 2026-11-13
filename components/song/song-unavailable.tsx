"use client";

import Button from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/media-frame";
import type { Generation } from "@/types/generation";
import { generationErrorLabel } from "@/utils/generation-status";
import { styleCoverId } from "@/utils/song-styles";

export function SongUnavailable({ generation }: { generation: Generation }) {
  const reason =
    generation.status === "EXPIRED"
      ? "Срок хранения песни истёк."
      : (generationErrorLabel(generation.errorCode) ?? "Песня не получилась.");
  const title = generation.caption?.trim() || generation.prompt || "Песня";
  const coverId = styleCoverId(generation.caption ?? generation.prompt, generation.id);

  return (
    <div className="flex items-start gap-4">
      <MediaFrame toneId={coverId} disabled className="size-24 sm:size-[7.5rem]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium leading-6 text-text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-text-muted">{reason}</p>
        <div className="lp-song-actions">
          <Button href="/create" variant="quiet" size="sm">
            Создать заново
          </Button>
        </div>
      </div>
    </div>
  );
}
