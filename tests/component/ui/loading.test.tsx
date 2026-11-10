import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loading } from "@/components/ui/loading";

describe("Loading", () => {
  it("exposes the step label and hides the wordmark", () => {
    render(<Loading label="Входим" />);
    expect(screen.getByRole("status", { name: "Входим" })).toBeInTheDocument();
    expect(screen.getByText("AI Music")).toHaveAttribute("aria-hidden", "true");
  });
});
