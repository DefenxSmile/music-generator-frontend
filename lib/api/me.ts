import { fetchJson } from "@/lib/api/fetch-json";

export type Me = {
  id: string;
  email: string;
  emailVerified: boolean;
  balance: number;
  createdAt: string;
};

export function fetchMe(): Promise<Me> {
  return fetchJson<Me>("/api/v1/me");
}
