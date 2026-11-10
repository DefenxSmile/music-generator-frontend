import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormMessage } from "@/components/ui/field";

describe("FormMessage", () => {
  it("announces the message as an alert", () => {
    render(<FormMessage>Стиль и текст вместе длиннее 2000 символов.</FormMessage>);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Стиль и текст вместе длиннее 2000 символов.",
    );
  });
});
