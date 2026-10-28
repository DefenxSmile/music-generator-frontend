"use client";

import Button from "@/components/ui/Button";

/** Empty result: one quiet line and a step back to the idea field. */
export function ResultStage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <p className="text-center text-sm text-text-dim">Пока нет созданных песен</p>
      <Button
        type="button"
        variant="quiet"
        size="sm"
        className="mt-3"
        onClick={() => document.getElementById("song-style")?.focus()}
      >
        К идее
      </Button>
    </div>
  );
}
