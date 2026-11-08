import { describe, expect, it } from "vitest";
import { isModuleLoadError } from "./moduleLoadError";
describe("route module failures", () => {
  it.each([
    "Failed to fetch dynamically imported module: /assets/InfoHome-old.js",
    "Importing a module script failed.",
    "error loading dynamically imported module",
    "Loading chunk 42 failed.",
  ])("recognizes the browser failure: %s", (message) =>
    expect(isModuleLoadError(new TypeError(message))).toBe(true),
  );
  it("does not misclassify an ordinary application error", () =>
    expect(isModuleLoadError(new Error("Invalid form"))).toBe(false));
});
