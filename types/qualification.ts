/** Why this visit wants a song. Java has no field for this yet, so it stays in the browser. */
export type SongJob = "gift" | "self" | "content" | "release";

/** Only asked when the song is a gift. */
export type GiftOccasion = "birthday" | "love" | "joke" | "other";

/** Only asked when the song is for a clip or a post. */
export type ContentPlace = "clip" | "post" | "ad";
