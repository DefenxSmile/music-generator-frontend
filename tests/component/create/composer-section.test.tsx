import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComposerSection } from "@/components/create/composer-section";

describe("ComposerSection", () => {
  it("shows a quiet summary when collapsed and expands on click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ComposerSection
        title="Стили"
        open={false}
        onOpenChange={onOpenChange}
        summary="поп, гитара"
      >
        <p>поле стиля</p>
      </ComposerSection>,
    );

    expect(screen.getByText("поп, гитара")).toBeInTheDocument();
    expect(screen.queryByText("поле стиля")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Стили/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <ComposerSection title="Стили" open onOpenChange={onOpenChange} summary="поп, гитара">
        <p>поле стиля</p>
      </ComposerSection>,
    );
    expect(screen.getByText("поле стиля")).toBeInTheDocument();
  });
});
