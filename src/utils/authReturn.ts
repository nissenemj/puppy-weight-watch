const key = "pentulaskuri.auth.return";
const sections = [
  "muistot",
  "kuukaudet",
  "aikajana",
  "virstanpylvaat",
  "kasvu",
  "vuosikirja",
  "satukuvat",
];
function bookDestination(search: string): string | null {
  const params = new URLSearchParams(search);
  if (params.get("next") !== "puppy-book") return null;
  const section = params.get("osio");
  return (
    "/puppy-book" +
    (section && sections.includes(section) ? `?osio=${section}` : "")
  );
}
/** Only a known application destination is stored, never an arbitrary redirect. */
export function rememberBookReturn(search: string): string {
  const destination = bookDestination(search);
  // Email links commonly open a new tab. Only a fixed book route is shared.
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      if (destination) window[name].setItem(key, destination);
      else window[name].removeItem(key);
    } catch {
      /* Login remains usable when browser storage is unavailable. */
    }
  }
  return destination ?? "/";
}
export function takeBookReturn(search = ""): string {
  let destination = bookDestination(search);
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      const value = window[name].getItem(key);
      window[name].removeItem(key);
      const valid =
        value === "puppy-book" || value === "/puppy-book"
          ? "/puppy-book"
          : sections
              .map((section) => `/puppy-book?osio=${section}`)
              .find((route) => route === value);
      destination ??= valid ?? null;
    } catch {
      /* A valid callback destination can still be used. */
    }
  }
  return destination ?? "/";
}
