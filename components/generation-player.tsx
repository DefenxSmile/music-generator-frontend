"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function GenerationPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn("rounded-xl p-px", playing ? "lp-accent-gradient" : "bg-border")}>
      <div className="rounded-[11px] bg-bg-card p-3">
        <audio
          controls
          preload="none"
          src={src}
          className="w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          Плеер недоступен в этом браузере.
        </audio>
      </div>
    </div>
  );
}
