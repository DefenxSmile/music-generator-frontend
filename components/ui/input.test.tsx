import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders a labelled text field and reports typing", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Имя" value="" onChange={onChange} />);
    const field = screen.getByRole("textbox", { name: "Имя" });
    expect(field.className).toContain("bg-bg-elevated");
    await userEvent.type(field, "а");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards a ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input aria-label="Имя" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Имя" }));
  });
});
