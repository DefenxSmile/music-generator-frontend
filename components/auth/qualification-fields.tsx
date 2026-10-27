"use client";

import { ChoiceRow } from "@/components/auth/choice-row";
import { SONG_FOR_OPTIONS, VISITOR_OPTIONS } from "@/utils/qualification";
import type { SongFor, VisitorKind } from "@/types/qualification";

export function QualificationFields({
  visitor,
  songFor,
  onVisitor,
  onSongFor,
}: {
  visitor: VisitorKind | null;
  songFor: SongFor | null;
  onVisitor: (value: VisitorKind | null) => void;
  onSongFor: (value: SongFor | null) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <ChoiceRow legend="Кто вы?" value={visitor} options={VISITOR_OPTIONS} onChange={onVisitor} />
      <ChoiceRow legend="Для кого песня?" value={songFor} options={SONG_FOR_OPTIONS} onChange={onSongFor} />
    </div>
  );
}
