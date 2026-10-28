import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("calls onClick and stays a button", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Создать</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Создать" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Создать
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Создать" });
    expect(button).toBeDisabled();
    expect(button.className).toContain("lp-cta-quiet");
    expect(button.className).not.toContain("opacity-40");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses the accent only on the large primary action", () => {
    const { rerender } = render(<Button size="lg">Создать песню</Button>);
    const primary = screen.getByRole("button", { name: "Создать песню" });
    expect(primary.className).toContain("lp-accent-gradient");
    expect(primary.querySelector(".lp-eq")).toBeNull();

    rerender(
      <Button variant="outline" size="lg">
        Выбрать тариф
      </Button>,
    );
    const outline = screen.getByRole("button", { name: "Выбрать тариф" });
    expect(outline.className).not.toContain("lp-accent-gradient");
  });

  it("renders an in-app link and an external link", () => {
    const { rerender } = render(<Button href="/plans">Тарифы</Button>);
    expect(screen.getByRole("link", { name: "Тарифы" })).toHaveAttribute("href", "/plans");

    rerender(<Button href="https://example.com/song">Слушать</Button>);
    const external = screen.getByRole("link", { name: "Слушать" });
    expect(external).toHaveAttribute("href", "https://example.com/song");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
  });
});
