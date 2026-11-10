import type { ReactNode } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siApplemusic,
  siDeezer,
  siFacebook,
  siInstagram,
  siNeteasecloudmusic,
  siPandora,
  siShazam,
  siSoundcloud,
  siSpotify,
  siTidal,
  siTiktok,
  siVk,
  siYoutube,
  siYoutubemusic,
} from "simple-icons";
import { cn } from "@/utils/cn";
import { RELEASE_PLATFORMS } from "@/utils/release-platforms";

type Mark = {
  bg: string;
  radius: "full" | "lg";
  glyph: ReactNode;
};

const PALETTE = [
  "#FF5A5F",
  "#FF7A4D",
  "#FFCC00",
  "#1ED760",
  "#25D1DA",
  "#2F6BFF",
  "#7A5CFF",
  "#DD2A7B",
  "#111111",
  "#FF0033",
];

/**
 * Bright platform badges. Known brands use Simple Icons (CC0);
 * the rest get a stable colorful letter tile.
 */
export function PlatformMark({ id, className }: { id: string; className?: string }) {
  const mark = MARKS[id] ?? fallbackMark(id);
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center overflow-hidden",
        mark.radius === "full" ? "rounded-full" : "rounded-[0.4rem]",
        className,
      )}
      style={{ background: mark.bg }}
    >
      <svg viewBox="0 0 24 24" className="size-[0.95rem]" fill="none">
        {mark.glyph}
      </svg>
    </span>
  );
}

function simpleMark(icon: SimpleIcon, radius: "full" | "lg" = "lg"): Mark {
  const bg = `#${icon.hex}`;
  const dark = isLightHex(icon.hex);
  return {
    bg,
    radius,
    glyph: <path fill={dark ? "#111" : "#fff"} d={icon.path} />,
  };
}

function isLightHex(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function fallbackMark(id: string): Mark {
  const name = RELEASE_PLATFORMS.find((item) => item.id === id)?.name ?? id;
  const letter = (name.trim().charAt(0) || "?").toUpperCase();
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }
  const bg = PALETTE[hash % PALETTE.length];
  const dark = bg === "#FFCC00" || bg === "#1ED760" || bg === "#25D1DA";
  return {
    bg,
    radius: "lg",
    glyph: (
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill={dark ? "#111" : "#fff"}
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-golos), sans-serif"
      >
        {letter}
      </text>
    ),
  };
}

/** Brands without a fitting Simple Icon keep a short local glyph. */
const CUSTOM: Record<string, Mark> = {
  yandex: {
    bg: "#FFCC00",
    radius: "full",
    glyph: (
      <path
        fill="#111"
        d="M12 5.2 14.9 12l1.35 3.5h-1.75l-.4-1.15h-3.2L10.5 15.5H8.75L12 5.2Zm0 4.05-.95 2.7h1.9L12 9.25Z"
      />
    ),
  },
  zvuk: {
    bg: "#2F6BFF",
    radius: "full",
    glyph: (
      <>
        <path
          fill="#fff"
          d="M7.2 13.9c0-.7.35-1.35.9-1.75L12 9.4l3.9 2.75c.55.4.9 1.05.9 1.75 0 1.2-1 2.2-2.2 2.2H9.4c-1.2 0-2.2-1-2.2-2.2Z"
        />
        <path fill="#fff" d="M9.5 7.4h5v1.35h-5z" />
      </>
    ),
  },
};

const MARKS: Record<string, Mark> = {
  ...CUSTOM,
  vk: simpleMark(siVk, "lg"),
  spotify: simpleMark(siSpotify, "full"),
  apple: simpleMark(siApplemusic, "lg"),
  youtube: simpleMark(siYoutubemusic, "full"),
  "youtube-content-id": simpleMark(siYoutube, "lg"),
  deezer: simpleMark(siDeezer, "lg"),
  tidal: simpleMark(siTidal, "lg"),
  pandora: simpleMark(siPandora, "lg"),
  shazam: simpleMark(siShazam, "full"),
  tiktok: simpleMark(siTiktok, "lg"),
  instagram: simpleMark(siInstagram, "lg"),
  soundcloud: simpleMark(siSoundcloud, "lg"),
  "facebook-video": simpleMark(siFacebook, "full"),
  "facebook-fingerprint": simpleMark(siFacebook, "full"),
  netease: simpleMark(siNeteasecloudmusic, "lg"),
};
