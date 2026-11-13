export type SongStyleChip = {
  id: string;
  /** Chip button label (UI). */
  label: string;
  /** Short token written into the style field. */
  tag: string;
  /** Expanded English phrase for the model prompt. */
  prompt: string;
};

/** Quick tags under the style field — short RU tokens, expanded at submit. */
export const SONG_STYLE_CHIPS: readonly SongStyleChip[] = [
  { id: "pop", label: "Поп", tag: "поп", prompt: "upbeat Russian pop, catchy chorus" },
  { id: "ballad", label: "Баллада", tag: "баллада", prompt: "warm Russian ballad, soft piano" },
  { id: "rock", label: "Рок", tag: "рок", prompt: "Russian pop-rock, electric guitars" },
  { id: "hiphop", label: "Хип-хоп", tag: "хип-хоп", prompt: "Russian hip-hop, modern beat" },
  { id: "rap", label: "Рэп", tag: "рэп", prompt: "Russian rap, rhythmic flow" },
  {
    id: "electronic",
    label: "Электроника",
    tag: "электроника",
    prompt: "Russian electronic pop, synths",
  },
  {
    id: "yard",
    label: "Дворовая",
    tag: "дворовая",
    prompt: "nostalgic Russian yard song, acoustic guitar",
  },
  {
    id: "chanson",
    label: "Шансон",
    tag: "шансон",
    prompt: "Russian chanson, storytelling vocal",
  },
  {
    id: "dance",
    label: "Танцевальная",
    tag: "танцевальная",
    prompt: "Russian dance-pop, club beat",
  },
  { id: "kids", label: "Детская", tag: "детская", prompt: "cheerful Russian kids song" },
] as const;

function splitStyleParts(value: string): string[] {
  return value
    .replace(/\r\n/g, "\n")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function chipForPart(part: string): SongStyleChip | undefined {
  const lower = part.toLowerCase();
  return SONG_STYLE_CHIPS.find(
    (item) =>
      item.tag.toLowerCase() === lower ||
      item.label.toLowerCase() === lower ||
      item.prompt.toLowerCase() === lower ||
      item.id === lower,
  );
}

export function styleHasChip(current: string, chip: SongStyleChip): boolean {
  const lower = current.toLowerCase();
  if (lower.includes(chip.prompt.toLowerCase())) return true;
  return splitStyleParts(current).some((part) => {
    const token = part.toLowerCase();
    return token === chip.tag.toLowerCase() || token === chip.label.toLowerCase();
  });
}

function removeChipFromStyle(current: string, chip: SongStyleChip): string {
  let value = current.replace(/\r\n/g, "\n");
  const prompt = chip.prompt;
  const at = value.toLowerCase().indexOf(prompt.toLowerCase());
  if (at >= 0) {
    value = `${value.slice(0, at)}${value.slice(at + prompt.length)}`;
  }
  return splitStyleParts(value)
    .filter((part) => {
      const token = part.toLowerCase();
      return token !== chip.tag.toLowerCase() && token !== chip.label.toLowerCase();
    })
    .join(", ");
}

/** Append or remove a chip tag; keeps free-typed fragments. */
export function toggleStyleTag(current: string, tag: string): string {
  const next = tag.trim();
  const value = current.replace(/\r\n/g, "\n").trim();
  if (!next) return value;
  const chip = chipForPart(next) ?? {
    id: next,
    label: next,
    tag: next,
    prompt: next,
  };
  if (styleHasChip(value, chip)) return removeChipFromStyle(value, chip);
  if (!value) return chip.tag;
  return `${value}, ${chip.tag}`;
}

/** Expand short RU tags (and legacy English chip dumps) into model style text. */
export function expandStyleForPrompt(style: string): string {
  const parts = splitStyleParts(style);
  if (!parts.length) return "";
  return parts.map((part) => chipForPart(part)?.prompt ?? part).join(", ");
}

/** Stable cover wash id for the result row from style text. */
export function styleCoverId(style: string, fallbackId: string): string {
  const normalized = style.trim().toLowerCase();
  if (!normalized) return fallbackId;
  const chip = SONG_STYLE_CHIPS.find(
    (item) =>
      normalized.includes(item.tag.toLowerCase()) ||
      normalized.includes(item.label.toLowerCase()) ||
      normalized.includes(item.prompt.toLowerCase()) ||
      normalized.includes(item.id),
  );
  return chip?.id ?? fallbackId;
}

/** Migrate the short-lived styleId draft field into free-form style text. */
export function songStyleByLegacyId(styleId: string): string | undefined {
  return SONG_STYLE_CHIPS.find((item) => item.id === styleId)?.tag;
}
