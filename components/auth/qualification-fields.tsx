"use client";

import { ChoiceRow } from "@/components/auth/choice-row";
import {
  SONG_FOR_OPTIONS,
  SONG_FOR_QUESTION,
  VISITOR_OPTIONS,
  VISITOR_QUESTION,
} from "@/utils/qualification";
import type { SongFor, VisitorKind } from "@/types/qualification";

export function QualificationFields({
  step,
  visitor,
  songFor,
  onVisitor,
  onSongFor,
}: {
  step: "visitor" | "song";
  visitor: VisitorKind | null;
  songFor: SongFor | null;
  onVisitor: (value: VisitorKind | null) => void;
  onSongFor: (value: SongFor | null) => void;
}) {
  const titleId = "qualify-dialog-title";
  if (step === "visitor") {
    return (
      <ChoiceRow
        legend={VISITOR_QUESTION}
        labelledBy={titleId}
        value={visitor}
        options={VISITOR_OPTIONS}
        onChange={onVisitor}
      />
    );
  }
  return (
    <ChoiceRow
      legend={SONG_FOR_QUESTION}
      labelledBy={titleId}
      value={songFor}
      options={SONG_FOR_OPTIONS}
      onChange={onSongFor}
    />
  );
}
