import type { Generation } from "@/types/generation";
import { fetchJson } from "@/requests/fetch-json";
import { getAccessToken } from "@/utils/access-token";
import { DEV_ACCESS_TOKEN } from "@/utils/dev-oauth";
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
