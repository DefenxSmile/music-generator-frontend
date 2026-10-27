import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
const STAGES = [
  { label: "Пишем текст", statuses: ["PENDING", "WRITING"] },
  { label: "Проверяем", statuses: ["MODERATING"] },
  { label: "Собираем трек", statuses: ["QUEUED", "RUNNING"] },
] as const;

function stageIndex(status: string): number {
  const index = STAGES.findIndex((stage) => (stage.statuses as readonly string[]).includes(status));
  return index === -1 ? 0 : index;
}

export function GenerationProgress({ status }: { status: string }) {
  const active = stageIndex(status);

  return (
    <div role="status" aria-live="polite">
      <div className="relative h-1 overflow-hidden rounded-full bg-bg-elevated">
        <span className="lp-accent-gradient lp-generating-bar absolute inset-y-0 left-0 w-1/3 rounded-full" />
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {STAGES.map((stage, index) => {
          const done = index < active;
          const current = index === active;
          return (
            <li key={stage.label} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-xs tabular-nums",
                  done && "border-accent/60 bg-accent/10 text-accent",
                  current && "border-accent text-accent",
                  !done && !current && "border-border text-text-dim",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
              </span>
              <span className={cn(current ? "text-text-primary" : done ? "text-text-muted" : "text-text-dim")}>
                {stage.label}
                {current ? <span className="sr-only"> — сейчас</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-sm text-text-muted">Можно закрыть страницу: песня останется в списке.</p>
    </div>
  );
}
