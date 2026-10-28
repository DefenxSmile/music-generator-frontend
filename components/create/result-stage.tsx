"use client";

import Button from "@/components/ui/Button";

export function ResultStage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <p className="text-center text-sm text-text-dim">Пока нет созданных песен</p>
      <Button
        type="button"
        variant="quiet"
        className="mt-3"
        onClick={() => document.getElementById("song-style")?.focus()}
      >
        К идее
      </Button>
    </div>
  );
}
