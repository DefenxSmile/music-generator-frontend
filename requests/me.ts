import type { Me } from "@/types/me";
import { fetchJson } from "@/requests/fetch-json";

export function fetchMe(): Promise<Me> {
  return fetchJson<Me>("/api/v1/me");
}
