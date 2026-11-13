import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StyleField } from "@/components/create/style-field";

describe("StyleField", () => {
  it("writes a short RU tag into the field", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StyleField value="" onChange={onChange} onKeyDown={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "Поп" }));
    expect(onChange).toHaveBeenCalledWith("поп");
  });

  it("removes the tag on a second click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StyleField value="поп" onChange={onChange} onKeyDown={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "Поп" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
