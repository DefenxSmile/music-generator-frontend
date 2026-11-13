import { LoaderCircle, Pause, Play } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { coverTone } from "@/utils/song-visual";

/**
 * One frame for a song cover, a clip poster, and a social still.
 * Color wash by id until a picture is passed as children.
 */
export function MediaFrame({
  toneId,
  corner,
  busy = false,
  playing = false,
  disabled = false,
  onClick,
  label,
  className,
  children,
}: {
  toneId?: string;
  corner?: string;
  busy?: boolean;
  playing?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const tinted = Boolean(toneId) && !children;
  const style: CSSProperties | undefined = tinted && toneId ? coverTone(toneId) : undefined;
  const face = (
    <>
      {children ? <span className="absolute inset-0">{children}</span> : null}
      {children ? null : busy ? (
        <LoaderCircle
          aria-hidden
          className={cn("lp-spin size-5", tinted ? "text-white/80" : "text-text-muted")}
          strokeWidth={1.75}
        />
      ) : null}
      {onClick && !busy ? (
        <span className="absolute bottom-2 left-2 grid size-7 place-items-center rounded-full bg-black/45">
          {playing ? (
            <Pause aria-hidden className="size-3 fill-white text-white" />
          ) : (
            <Play aria-hidden className="ml-px size-3 fill-white text-white" />
          )}
        </span>
      ) : null}
      {corner ? (
        <span
          className={cn(
            "absolute right-2.5 bottom-3.5 text-[0.6875rem] tabular-nums leading-none",
            tinted ? "text-white/80" : "text-text-dim",
          )}
        >
          {corner}
        </span>
      ) : null}
    </>
  );
  const classes = cn(
    "relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-overlay/10 bg-bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    playing && "border-accent/70",
    disabled && "opacity-50",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={playing}
        style={style}
        className={classes}
      >
        {face}
      </button>
    );
  }

  return (
    <span aria-hidden style={style} className={classes}>
      {face}
    </span>
  );
}
