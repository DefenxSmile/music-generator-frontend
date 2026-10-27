import { Music2 } from "lucide-react";

export function ResultStage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <span aria-hidden className="lp-empty-disc relative grid size-[4.5rem] place-items-center rounded-full">
        <span className="size-3 rounded-full bg-bg shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-overlay)_8%,transparent)]" />
        <Music2 className="absolute size-6 translate-x-2.5 text-accent" strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-center text-sm text-text-dim">Пока нет созданных песен</p>
    </div>
  );
}
