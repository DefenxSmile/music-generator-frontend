import { describe, expect, it } from "vitest";
import {
  applyGenerationLyrics,
  composePrompt,
  descriptionDraft,
  emptySongDraft,
  promptFits,
} from "@/utils/song-draft";

describe("composePrompt", () => {
  it("expands RU style tags and always asks for Russian vocals", () => {
    expect(
      composePrompt({
        ...emptySongDraft(),
        idea: "утро в метро",
        style: "поп",
      }),
    ).toBe(
      [
        "Язык вокала: русский.",
        "Голос: женский.",
        "Стиль: upbeat Russian pop, catchy chorus.",
        "Идея:\nутро в метро",
      ].join("\n\n"),
    );
  });

  it("keeps lyrics as-is when there is no idea", () => {
    expect(
      composePrompt({
        ...emptySongDraft(),
        idea: "",
        lyrics: "куплет\nприпев",
        vocalGender: "male",
        style: "рок",
      }),
    ).toBe(
      [
        "Язык вокала: русский.",
        "Голос: мужской.",
        "Стиль: Russian pop-rock, electric guitars.",
        "Текст песни, оставь его как есть:\nкуплет\nприпев",
      ].join("\n\n"),
    );
  });
});

describe("promptFits", () => {
  it("rejects an empty draft", () => {
    expect(promptFits(descriptionDraft(""))).toBe(false);
  });

  it("accepts a short idea without style chips", () => {
    expect(promptFits(descriptionDraft("короткая поп-песня про утро"))).toBe(true);
  });
});

describe("applyGenerationLyrics", () => {
  it("fills the field when Java returns lyrics", () => {
    const draft = { ...emptySongDraft(), idea: "поп", lyrics: "напиши текст про Васю" };
    expect(applyGenerationLyrics(draft, "gen-1", "[Verse]\nВася", "")).toEqual({
      draft: { ...draft, lyrics: "[Verse]\nВася" },
      appliedForId: "gen-1",
    });
  });

  it("does not overwrite after the first apply for the same generation", () => {
    expect(
      applyGenerationLyrics(
        { ...emptySongDraft(), idea: "поп", lyrics: "моя правка" },
        "gen-1",
        "[Verse]\nВася",
        "gen-1",
      ),
    ).toBeNull();
  });
});
