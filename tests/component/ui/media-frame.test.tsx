import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaFrame } from "@/components/ui/media-frame";
import { coverTone } from "@/utils/song-visual";

describe("coverTone", () => {
  it("gives a stable wash for the same song", () => {
    expect(coverTone("preview-variant-1")).toEqual(coverTone("preview-variant-1"));
    expect(coverTone("preview-variant-1").backgroundImage).toContain("linear-gradient");
  });
});

describe("MediaFrame", () => {
  it("keeps the wash and duration without a letter mark", () => {
    render(
      <MediaFrame
        toneId="preview-variant-1"
        corner="2:32"
        onClick={() => undefined}
        label="Слушать: Море"
      />,
    );
    const button = screen.getByRole("button", { name: "Слушать: Море" });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("2:32")).toBeInTheDocument();
    expect(screen.queryByText("Море")).toBeNull();
    expect(button.getAttribute("style") ?? "").toContain("linear-gradient");
  });
});
