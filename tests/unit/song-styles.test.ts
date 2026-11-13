import { describe, expect, it } from "vitest";
import {
  expandStyleForPrompt,
  SONG_STYLE_CHIPS,
  styleCoverId,
  toggleStyleTag,
} from "@/utils/song-styles";

describe("song styles", () => {
  it("toggles short RU tags without dumping English into the field", () => {
    expect(toggleStyleTag("", "поп")).toBe("поп");
    expect(toggleStyleTag("поп", "баллада")).toBe("поп, баллада");
    expect(toggleStyleTag("поп, баллада", "поп")).toBe("баллада");
  });

  it("removes a legacy English chip dump when the RU chip is pressed again", () => {
    expect(toggleStyleTag("upbeat Russian pop, catchy chorus", "поп")).toBe("");
  });

  it("expands short tags for the model prompt", () => {
    expect(expandStyleForPrompt("поп, гитара")).toBe(
      "upbeat Russian pop, catchy chorus, гитара",
    );
  });

  it("maps style text to a cover wash id for the result row", () => {
    expect(SONG_STYLE_CHIPS.length).toBeGreaterThanOrEqual(8);
    expect(styleCoverId("баллада, soft piano", "gen-1")).toBe("ballad");
    expect(styleCoverId("", "gen-1")).toBe("gen-1");
  });
});
