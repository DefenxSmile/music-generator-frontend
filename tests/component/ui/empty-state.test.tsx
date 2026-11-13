import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("shows a title and one line", () => {
    render(<EmptyState title="Пока ни одной песни." lead="Создайте первую." />);
    expect(screen.getByRole("heading", { name: "Пока ни одной песни." })).toBeInTheDocument();
    expect(screen.getByText("Создайте первую.")).toBeInTheDocument();
  });

  it("can show a dashed slot mark for panel empties", () => {
    const { container } = render(
      <EmptyState layout="panel" mark="slot" lead="Пока нет созданных песен" />,
    );
    expect(screen.getByText("Пока нет созданных песен")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("lp-studio-idle");
    expect(container.querySelector("[aria-hidden]")?.className).toContain("border-dashed");
  });
});
