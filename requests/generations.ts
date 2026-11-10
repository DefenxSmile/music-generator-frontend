import type { Generation } from "@/types/generation";
import { fetchJson } from "@/requests/fetch-json";

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
