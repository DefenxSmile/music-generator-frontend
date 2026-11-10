import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("shows a title and one line", () => {
    render(<EmptyState title="Пока ни одной песни." lead="Создайте первую." />);
    expect(screen.getByRole("heading", { name: "Пока ни одной песни." })).toBeInTheDocument();
    expect(screen.getByText("Создайте первую.")).toBeInTheDocument();
    expect(document.querySelector(".lp-empty-disc")).toBeNull();
  });
});
