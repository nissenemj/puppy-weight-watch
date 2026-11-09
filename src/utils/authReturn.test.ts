import { afterEach, expect, it } from "vitest";
import { rememberBookReturn, takeBookReturn } from "./authReturn";
afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
it("retains the selected book step when email opens a new tab", () => {
  expect(rememberBookReturn("?next=puppy-book&osio=vuosikirja")).toBe(
    "/puppy-book?osio=vuosikirja",
  );
  sessionStorage.clear();
  expect(takeBookReturn()).toBe("/puppy-book?osio=vuosikirja");
  expect(takeBookReturn()).toBe("/");
});
it("rejects an unknown section and tampered stored destination", () => {
  expect(rememberBookReturn("?next=puppy-book&osio=//evil.example")).toBe(
    "/puppy-book",
  );
  localStorage.setItem("pentulaskuri.auth.return", "//evil.example");
  sessionStorage.clear();
  expect(takeBookReturn()).toBe("/");
});
it("returns to the book in a fresh email tab with no stored destination", () => {
  sessionStorage.clear();
  expect(takeBookReturn("?next=puppy-book")).toBe("/puppy-book");
  expect(takeBookReturn("?next=https://evil.example")).toBe("/");
});
it("returns to the book after authentication and consumes the destination", () => {
  expect(rememberBookReturn("?next=puppy-book")).toBe("/puppy-book");
  expect(takeBookReturn()).toBe("/puppy-book");
  expect(takeBookReturn()).toBe("/");
});
it.each([
  "?next=https://evil.example",
  "?next=//evil.example",
  "?next=%2Fpuppy-book",
  "",
])("rejects an arbitrary destination %s", (search) => {
  expect(rememberBookReturn(search)).toBe("/");
  expect(takeBookReturn()).toBe("/");
});
