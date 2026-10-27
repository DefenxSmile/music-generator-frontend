import { fetchJson } from "@/lib/api/fetch-json";
import { getAccessToken } from "@/lib/auth/access-token";
import { DEV_ACCESS_TOKEN, readDevOauth } from "@/lib/auth/dev-oauth";

export type Me = {
  id: string;
  email: string;
  emailVerified: boolean;
  balance: number;
  createdAt: string;
};

export function fetchMe(): Promise<Me> {
  if (getAccessToken() === DEV_ACCESS_TOKEN) {
    const provider = readDevOauth() === "vk" ? "vk" : "yandex";
    return Promise.resolve({
      id: "dev",
      email: provider === "vk" ? "dev-vk@example.com" : "dev-yandex@example.com",
      emailVerified: true,
      balance: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  }
  return fetchJson<Me>("/api/v1/me");
}
