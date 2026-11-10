import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthDialogProvider } from "@/components/auth/auth-dialog";
import { useOpenAuth } from "@/hooks/use-open-auth";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/utils/java-api", () => ({
  javaApiOrigin: vi.fn(() => ""),
}));

function OpenButton() {
  const openAuth = useOpenAuth();
  return (
    <button type="button" onClick={() => openAuth()}>
      Открыть вход
    </button>
  );
}

describe("AuthDialogProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a config error when JAVA_API_BASE_URL is missing", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <AuthDialogProvider>
          <OpenButton />
        </AuthDialogProvider>
      </QueryClientProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Открыть вход" }));
    await userEvent.click(screen.getByRole("button", { name: "Войти с Яндекс ID" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/JAVA_API_BASE_URL/);
  });
});
