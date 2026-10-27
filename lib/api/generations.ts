import { fetchJson } from "@/lib/api/fetch-json";
import { getAccessToken } from "@/lib/auth/access-token";
import { DEV_ACCESS_TOKEN } from "@/lib/auth/dev-oauth";

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
  if (getAccessToken() === DEV_ACCESS_TOKEN) return Promise.resolve([]);
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
