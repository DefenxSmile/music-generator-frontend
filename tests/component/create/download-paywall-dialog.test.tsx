import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DownloadPaywallDialog } from "@/components/create/download-paywall-dialog";
import { prefixedKey } from "@/utils/storage-prefix";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
  useSearchParams: () => new URLSearchParams("id=gen-1"),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const KEY = prefixedKey("download_oto_v2");

afterEach(() => {
  window.localStorage.removeItem(KEY);
});

function renderDialog(onClose = vi.fn()) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <DownloadPaywallDialog open onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
}

describe("DownloadPaywallDialog", () => {
  it("swaps to the discounted tariffs in the same dialog after dismiss", async () => {
    const user = userEvent.setup();
    const onClose = renderDialog();

    expect(screen.getByRole("heading", { name: "Тарифы" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Закрыть" }));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Скачайте песню со скидкой" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Забрать со скидкой" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Нет, спасибо" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes without a second step when the offer was already shown", async () => {
    window.localStorage.setItem(KEY, "1");
    const user = userEvent.setup();
    const onClose = renderDialog();

    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("heading", { name: "Скачайте песню со скидкой" })).toBeNull();
  });
});
