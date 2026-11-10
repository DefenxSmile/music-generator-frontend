import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "@/components/ui/icon-button";

describe("IconButton", () => {
  it("names the button from the label and calls onClick", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Закрыть" onClick={onClick}>
        ×
      </IconButton>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
