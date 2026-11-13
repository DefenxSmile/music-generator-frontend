import { describe, expect, it } from "vitest";
import { resolveComposerMode } from "@/utils/composer-mode";

describe("resolveComposerMode", () => {
  it("keeps the stored simple mode when lyrics are empty", () => {
    expect(resolveComposerMode("", "simple")).toBe("simple");
    expect(resolveComposerMode("  ", "advanced")).toBe("advanced");
  });

  it("opens advanced when the draft already has lyrics", () => {
    expect(resolveComposerMode("[Verse]\nстрока", "simple")).toBe("advanced");
  });
});
