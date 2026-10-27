export type Generation = {
  id: string;
  status: string;
  prompt: string;
  caption: string | null;
  lyrics: string | null;
  durationSeconds: number | null;
  vocalLanguage: string | null;
  instrumental: boolean | null;
  errorCode: string | null;
  audioUrl: string | null;
  audioUrlExpiresAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};
