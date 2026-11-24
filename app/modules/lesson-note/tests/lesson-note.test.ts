import { describe, expect, it } from "vitest";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { noteDraftStatus } from "../index";

describe("noteDraftStatus", () => {
  it("lets a new note be saved", () => {
    expect(noteDraftStatus("Tokens first.", "")).toEqual({
      length: 13,
      tooLong: false,
      unchanged: false,
      canSave: true,
      counter: "13 / 2,000",
    });
  });

  it("does not save an empty or whitespace-only draft", () => {
    expect(noteDraftStatus("", "").canSave).toBe(false);
    expect(noteDraftStatus("   \n", "").canSave).toBe(false);
  });

  it("does not save a draft that matches the saved note", () => {
    const status = noteDraftStatus("Same text", "Same text");
    expect(status.unchanged).toBe(true);
    expect(status.canSave).toBe(false);
  });

  it("saves an edit to an existing note", () => {
    const status = noteDraftStatus("Same text, edited", "Same text");
    expect(status.unchanged).toBe(false);
    expect(status.canSave).toBe(true);
  });

  it("allows a draft exactly at the limit", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH), "");
    expect(status.tooLong).toBe(false);
    expect(status.canSave).toBe(true);
  });

  it("blocks a draft over the limit", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH + 1), "");
    expect(status.tooLong).toBe(true);
    expect(status.canSave).toBe(false);
    expect(status.counter).toBe("2,001 / 2,000");
  });

  it("takes the limit as an argument", () => {
    expect(noteDraftStatus("abcd", "", 3)).toMatchObject({
      tooLong: true,
      counter: "4 / 3",
    });
  });
});
