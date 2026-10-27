import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section, Surface } from "@/components/ui/section";

describe("Section", () => {
  it("renders a region on the section surface", () => {
    render(<Section aria-label="Песни">Список</Section>);
    const region = screen.getByRole("region", { name: "Песни" });
    expect(region.className).toContain("bg-bg-card");
    expect(region).toHaveTextContent("Список");
  });
});

describe("Surface", () => {
  it("renders a lighter control surface", () => {
    render(<Surface>Поле</Surface>);
    const surface = screen.getByText("Поле");
    expect(surface.className).toContain("bg-bg-elevated");
    expect(surface.tagName).toBe("DIV");
  });
});
