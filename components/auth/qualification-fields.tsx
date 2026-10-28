"use client";

import { ChoiceRow } from "@/components/auth/choice-row";
import {
  CONTENT_PLACE_OPTIONS,
  CONTENT_PLACE_QUESTION,
  GIFT_OCCASION_OPTIONS,
  GIFT_OCCASION_QUESTION,
  SONG_JOB_OPTIONS,
  SONG_JOB_QUESTION,
} from "@/utils/qualification";
import type { ContentPlace, GiftOccasion, SongJob } from "@/types/qualification";

export function QualificationFields({
  step,
  songJob,
  giftOccasion,
  contentPlace,
  onSongJob,
  onGiftOccasion,
  onContentPlace,
}: {
  step: "job" | "detail";
  songJob: SongJob | null;
  giftOccasion: GiftOccasion | null;
  contentPlace: ContentPlace | null;
  onSongJob: (value: SongJob | null) => void;
  onGiftOccasion: (value: GiftOccasion | null) => void;
  onContentPlace: (value: ContentPlace | null) => void;
}) {
  const titleId = "qualify-dialog-title";
  if (step === "job") {
    return (
      <ChoiceRow
        legend={SONG_JOB_QUESTION}
        labelledBy={titleId}
        value={songJob}
        options={SONG_JOB_OPTIONS}
        onChange={onSongJob}
      />
    );
  }
  if (songJob === "content") {
    return (
      <ChoiceRow
        legend={CONTENT_PLACE_QUESTION}
        labelledBy={titleId}
        value={contentPlace}
        options={CONTENT_PLACE_OPTIONS}
        onChange={onContentPlace}
      />
    );
  }
  return (
    <ChoiceRow
      legend={GIFT_OCCASION_QUESTION}
      labelledBy={titleId}
      value={giftOccasion}
      options={GIFT_OCCASION_OPTIONS}
      onChange={onGiftOccasion}
    />
  );
}
