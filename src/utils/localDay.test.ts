import { expect, it } from "vitest";
import { localDay } from "./localDay";
it("uses the local calendar day near midnight", () => {
  expect(localDay(new Date(2026, 10, 9, 0, 15))).toBe("2026-11-09");
  expect(localDay(new Date(2026, 10, 9, 23, 50))).toBe("2026-11-09");
});
it("keeps unknown timestamps empty", () => {
  expect(localDay("")).toBe("");
  expect(localDay("not-a-date")).toBe("");
});
