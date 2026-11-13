import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComposerField } from "@/components/create/composer-field";

describe("ComposerField", () => {
  it("caps lyrics growth so the field can scroll instead of eating the panel", () => {
    render(
      <ComposerField
        id="song-lyrics"
        label="Текст песни"
        value={"строка\n".repeat(40)}
        placeholder=""
        minHeightClass="min-h-16"
        maxHeightClass="max-h-48"
        onChange={() => undefined}
        onKeyDown={() => undefined}
      />,
    );

    const field = screen.getByRole("textbox", { name: "Текст песни" });
    expect(field.className).toContain("max-h-48");
    expect(field.className).toContain("overscroll-contain");
  });
});
