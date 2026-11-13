import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComposerModeToggle } from "@/components/create/composer-mode-toggle";

describe("ComposerModeToggle", () => {
  it("switches between simple and advanced", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ComposerModeToggle value="simple" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Расширенный" }));
    expect(onChange).toHaveBeenCalledWith("advanced");
  });
});
