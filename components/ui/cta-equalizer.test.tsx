import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaEqualizer } from "@/components/ui/cta-equalizer";

describe("CtaEqualizer", () => {
  it("renders three decorative bars", () => {
    const { container } = render(<CtaEqualizer />);
    const bars = container.querySelector(".lp-eq");
    expect(bars).toHaveAttribute("aria-hidden", "true");
    expect(bars?.querySelectorAll("span")).toHaveLength(3);
  });
});
