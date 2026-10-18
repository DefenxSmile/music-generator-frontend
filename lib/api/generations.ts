import { fetchJson } from "@/lib/api/fetch-json";

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

export function listGenerations(): Promise<Generation[]> {
  return fetchJson<Generation[]>("/api/v1/generations");
}

export function fetchGeneration(id: string): Promise<Generation> {
  return fetchJson<Generation>(`/api/v1/generations/${id}`);
}

export function createGeneration(prompt: string, idempotencyKey: string): Promise<Generation> {
  return fetchJson<Generation>("/api/v1/generations", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ prompt }),
  });
}
