import { describe, expect, it } from "vitest";
import { newScrapbookDraft, newScrapbookPage } from "./scrapbook";
import {
  backupFilename,
  createScrapbookBackup,
  hasBookImageSignature,
  MAX_BACKUP_BYTES,
  parseScrapbookBackup,
} from "./scrapbookBackupFile";

const jpeg = "data:image/jpeg;base64,/9j/AA==";
function example() {
  const draft = newScrapbookDraft();
  const second = {
    ...newScrapbookPage("poster"),
    date: "2024-02-29",
    caption: "Lelu tuli kotiin.",
    image: jpeg,
    quote: "Minun!",
    sticker: "heart" as const,
    imageDescription: "Oma kuva lelusta.",
  };
  return {
    ...draft,
    puppyName: "Sisu",
    palette: "berry" as const,
    pages: [second, draft.pages[0]],
    selectedPageId: second.id,
  };
}
describe("editable scrapbook backup", () => {
  it("round trips exact pages, author order, original/unknown dates, image, name, palette and selection", () => {
    const draft = example();
    expect(parseScrapbookBackup(createScrapbookBackup(draft))).toEqual(draft);
    expect(
      parseScrapbookBackup(createScrapbookBackup(draft)).pages[1].date,
    ).toBe("");
  });
  it.each([{ version: 9 }, { unexpected: "no" }, { format: "other-app" }])(
    "rejects unsupported formats, versions and unknown properties",
    (patch) => {
      const value = JSON.parse(createScrapbookBackup(example()));
      expect(() =>
        parseScrapbookBackup(JSON.stringify({ ...value, ...patch })),
      ).toThrow(/tuettu/);
    },
  );
  it.each([
    { date: "2026-02-30" },
    { caption: "x".repeat(141) },
    { image: "https://example.invalid/photo.jpg" },
    { image: "data:image/svg+xml;base64,PHN2Zz4=" },
    { image: "data:image/jpeg;base64,PHN2Zz4=" },
  ])("rejects invalid page data without modifying the input", (patch) => {
    const value = JSON.parse(createScrapbookBackup(example()));
    Object.assign(value.draft.pages[0], patch);
    const text = JSON.stringify(value);
    expect(() => parseScrapbookBackup(text)).toThrow();
    expect(JSON.stringify(value)).toBe(text);
  });
  it("rejects duplicate IDs and unknown selected IDs", () => {
    const value = JSON.parse(createScrapbookBackup(example()));
    value.draft.pages[1].id = value.draft.pages[0].id;
    expect(() => parseScrapbookBackup(JSON.stringify(value))).toThrow();
    const other = JSON.parse(createScrapbookBackup(example()));
    other.draft.selectedPageId = crypto.randomUUID();
    expect(() => parseScrapbookBackup(JSON.stringify(other))).toThrow();
  });
  it("rejects incomplete JSON and oversized files before parsing", () => {
    expect(() => parseScrapbookBackup('{"format":')).toThrow(/keskeneräinen/);
    expect(() =>
      parseScrapbookBackup(" ".repeat(MAX_BACKUP_BYTES + 1)),
    ).toThrow(/liian suuri/);
  });
  it("checks declared image type against the bytes", () => {
    expect(hasBookImageSignature(jpeg)).toBe(true);
    expect(
      hasBookImageSignature("data:image/png;base64,iVBORw0KGgoAAA=="),
    ).toBe(true);
    expect(
      hasBookImageSignature("data:image/webp;base64,UklGRgAAAABXRUJQ"),
    ).toBe(true);
    expect(hasBookImageSignature("data:image/png;base64,/9j/AA==")).toBe(false);
    expect(hasBookImageSignature("data:image/jpeg;base64,%%%%")).toBe(false);
  });
  it("creates a safe portable filename", () => {
    expect(
      backupFilename("../../Sisu / tassut", new Date("2026-11-04T12:00:00Z")),
    ).toBe("Sisu-tassut-2026-11-04.pentukirja.json");
  });
});
