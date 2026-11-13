export type VocalGender = "female" | "male";

export type SongDraft = {
  idea: string;
  lyrics: string;
  /** Free-form style line; chips append tags into this field. */
  style: string;
  vocalGender: VocalGender;
};
