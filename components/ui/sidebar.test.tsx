import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "@/components/ui/sidebar";

describe("Sidebar", () => {
  it("renders the navigation frame", () => {
    render(<Sidebar aria-label="Основная навигация">Меню</Sidebar>);
    const frame = screen.getByRole("complementary", { name: "Основная навигация" });
    expect(frame.className).toContain("bg-bg-sidebar");
    expect(frame).toHaveTextContent("Меню");
  });
});
