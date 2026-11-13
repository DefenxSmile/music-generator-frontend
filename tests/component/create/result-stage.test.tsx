import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResultStage } from "@/components/create/result-stage";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import * as generations from "@/requests/generations";
import type { Generation } from "@/types/generation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/hooks/use-session-status", () => ({
  useSessionStatus: vi.fn(),
}));

vi.mock("@/hooks/use-signed-in-hint", () => ({
  useSignedInHint: vi.fn(),
}));

vi.mock("@/requests/generations", () => ({
  listGenerations: vi.fn(),
  fetchGeneration: vi.fn(),
}));

function generation(partial: Partial<Generation> = {}): Generation {
  return {
    id: "gen-1",
    status: "READY",
    prompt: "поп про море",
    caption: "Море",
    lyrics: null,
    durationSeconds: 120,
    vocalLanguage: "ru",
    instrumental: false,
    errorCode: null,
    audioUrl: "https://example.com/a.mp3",
    audioUrlExpiresAt: null,
    expiresAt: null,
    createdAt: "2026-11-11T00:36:00Z",
    ...partial,
  };
}

function renderStage(id = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ResultStage id={id} />
    </QueryClientProvider>,
  );
}

describe("ResultStage", () => {
  beforeEach(() => {
    vi.mocked(useSessionStatus).mockReturnValue("anonymous");
    vi.mocked(useSignedInHint).mockReturnValue(false);
    vi.mocked(generations.listGenerations).mockReset();
    vi.mocked(generations.fetchGeneration).mockReset();
  });

  it("uses the shared empty kit with a step back to the idea", () => {
    renderStage();
    expect(screen.getByText("Пока нет созданных песен")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "К идее" })).toBeVisible();
  });

  it("shows recent songs as workspace rows when signed in", async () => {
    vi.mocked(useSessionStatus).mockReturnValue("authenticated");
    vi.mocked(useSignedInHint).mockReturnValue(true);
    vi.mocked(generations.listGenerations).mockResolvedValue([
      generation({ id: "a", caption: "Первая" }),
      generation({ id: "b", caption: "Вторая", status: "RUNNING", audioUrl: null }),
    ]);

    renderStage();

    expect(await screen.findByRole("link", { name: /Первая/ })).toHaveAttribute(
      "href",
      "/create?id=a",
    );
    expect(screen.getByRole("link", { name: /Вторая/ })).toHaveAttribute("href", "/create?id=b");
    expect(screen.getByText("Собираем трек")).toBeInTheDocument();
  });

  it("loads the focused generation with visible status while running", async () => {
    vi.mocked(useSessionStatus).mockReturnValue("authenticated");
    vi.mocked(useSignedInHint).mockReturnValue(true);
    vi.mocked(generations.fetchGeneration).mockResolvedValue(
      generation({ status: "RUNNING", audioUrl: null, caption: "В работе" }),
    );

    renderStage("gen-1");

    expect(await screen.findByText("В работе")).toBeInTheDocument();
    expect(screen.getAllByText("Собираем трек").length).toBeGreaterThan(0);
  });
});
