import { describe, expect, it } from "vitest";
import {
  applyGenerationLyrics,
  composePrompt,
  descriptionDraft,
  promptFits,
} from "@/utils/song-draft";

describe("composePrompt", () => {
  it("sends idea alone when lyrics are empty", () => {
    expect(composePrompt({ idea: "утро в метро", lyrics: "" })).toBe("утро в метро");
  });

  it("keeps lyrics as-is when there is no idea", () => {
    expect(composePrompt({ idea: "", lyrics: "куплет\nприпев" })).toBe(
      "Текст песни, оставь его как есть:\nкуплет\nприпев",
    );
  });

  it("combines style and lyrics for Java create", () => {
    expect(composePrompt({ idea: "поп", lyrics: "строка" })).toBe(
      "Стиль и идея:\nпоп\n\nТекст песни, оставь его как есть:\nстрока",
    );
  });
});

describe("promptFits", () => {
  it("rejects an empty draft", () => {
    expect(promptFits(descriptionDraft(""))).toBe(false);
  });

  it("accepts a short idea", () => {
    expect(promptFits(descriptionDraft("короткая поп-песня про утро"))).toBe(true);
  });
});

describe("applyGenerationLyrics", () => {
  it("fills the field when Java returns lyrics", () => {
    expect(
      applyGenerationLyrics(
        { idea: "поп", lyrics: "напиши текст про Васю" },
        "gen-1",
        "[Verse]\nВася",
        "",
      ),
    ).toEqual({
      draft: { idea: "поп", lyrics: "[Verse]\nВася" },
      appliedForId: "gen-1",
    });
  });

  it("does not overwrite after the first apply for the same generation", () => {
    expect(
      applyGenerationLyrics(
        { idea: "поп", lyrics: "моя правка" },
        "gen-1",
        "[Verse]\nВася",
        "gen-1",
      ),
    ).toBeNull();
  });
});
