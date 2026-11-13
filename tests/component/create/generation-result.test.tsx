import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GenerationResult } from "@/components/create/generation-result";
import type { Generation } from "@/types/generation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
  useSearchParams: () => new URLSearchParams("id=gen-1"),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
});

function generation(partial: Partial<Generation> = {}): Generation {
  return {
    id: "gen-1",
    status: "RUNNING",
    prompt: "upbeat Russian pop",
    caption: "upbeat Russian pop-rock",
    lyrics: "[Verse 1]\nВася",
    durationSeconds: 152,
    vocalLanguage: "ru",
    instrumental: false,
    errorCode: null,
    audioUrl: null,
    audioUrlExpiresAt: null,
    expiresAt: null,
    createdAt: "2026-11-11T00:36:00Z",
    ...partial,
  };
}

function renderResult(value: Generation) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <GenerationResult generation={value} />
    </QueryClientProvider>,
  );
}

describe("GenerationResult", () => {
  it("shows one busy cover, visible status, and a generating rail", () => {
    const { container } = renderResult(generation());
    expect(screen.getAllByText("Собираем трек").length).toBeGreaterThan(0);
    expect(screen.getAllByText("upbeat Russian pop-rock")).toHaveLength(1);
    expect(screen.queryByText("Песня в работе")).toBeNull();
    expect(container.querySelector(".lp-status-rail")).not.toBeNull();
  });

  it("unlocks quiet actions when audio is ready", () => {
    renderResult(
      generation({
        status: "READY",
        audioUrl: "https://example.com/track.mp3",
      }),
    );
    expect(screen.getAllByRole("link", { name: "Выпустить" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Скачать" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Слушать:/ })).toHaveLength(1);
  });

  it("keeps a song-shaped failed row with a quiet retry", () => {
    renderResult(
      generation({
        status: "FAILED",
        errorCode: "GENERATION_FAILED",
        audioUrl: null,
        caption: "Сломалось",
      }),
    );
    expect(screen.getByText("Сломалось")).toBeInTheDocument();
    expect(screen.getByText("Не получилось собрать песню")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Создать заново" })).toBeVisible();
  });
});
