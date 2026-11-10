import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders a labelled multiline field and reports typing", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="Текст песни" value="" onChange={onChange} />);
    const field = screen.getByRole("textbox", { name: "Текст песни" });
    expect(field.tagName).toBe("TEXTAREA");
    expect(field.className).toContain("bg-transparent");
    await userEvent.type(field, "а");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards a ref to the textarea", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea aria-label="Текст песни" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Текст песни" }));
  });
});
