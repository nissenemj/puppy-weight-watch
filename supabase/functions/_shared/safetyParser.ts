import { parseHTML } from "linkedom";
import type { SafetyItem, SafetyKind, SafetySource } from "./safetySources.ts";

const MONTHS = [
  "tammikuuta",
  "helmikuuta",
  "maaliskuuta",
  "huhtikuuta",
  "toukokuuta",
  "kesäkuuta",
  "heinäkuuta",
  "elokuuta",
  "syyskuuta",
  "lokakuuta",
  "marraskuuta",
  "joulukuuta",
];
const clean = (value: string | null | undefined) =>
  (value ?? "").replace(/\s+/g, " ").trim();

export function officialUrl(value: string, base: string): string | null {
  try {
    const url = new URL(value, base);
    if (
      url.origin !== "https://www.ruokavirasto.fi" ||
      !url.pathname.startsWith("/elaimet/") ||
      url.username ||
      url.password
    )
      return null;
    url.hash = "";
    url.search = "";
    return url.href;
  } catch {
    return null;
  }
}

export function sourceDate(value: string, now: Date): string | null {
  const text = clean(value).toLowerCase();
  const finnish = text.match(/^(\d{1,2})\.\s*(\p{L}+)\s+(\d{4})$/u);
  const numeric = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!finnish && !numeric) return null;
  const day = Number((finnish ?? numeric)![1]);
  const month = finnish ? MONTHS.indexOf(finnish[2]) : Number(numeric![2]) - 1;
  const year = Number((finnish ?? numeric)![3]);
  const date = new Date(Date.UTC(year, month, day));
  if (
    month < 0 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day ||
    date.getTime() > now.getTime()
  )
    return null;
  return date.toISOString();
}

export function relevantToDogs(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  // Generic words such as "warning", "feed" or "veterinarian" do not establish dog relevance.
  return /\bkoir(?:a|an|at|ien|ia|ille|illa|issa|iin|ista|asta|aruok|anruok)|lemmikk|purulu|puruluit|raivotau|rabies|penikkatau|parvovirus|ekinokokk|leptospiro/u.test(
    text,
  );
}

export function classifyOfficialTitle(title: string): SafetyKind {
  if (/takaisinveto|vetää.*pois|vedetään.*pois/i.test(title)) return "recall";
  if (/varoittaa|varoitus/i.test(title)) return "warning";
  if (
    /raivotau|rabies|penikkatau|parvo|ekinokokk|leptospiro|tautitilan|tautitapau/i.test(
      title,
    )
  )
    return "disease";
  return "notice";
}

export function parseOfficialPage(
  html: string,
  source: SafetySource,
  now: Date,
): SafetyItem[] {
  const { document } = parseHTML(html);
  if (!document.querySelector("main")) throw new Error("source_layout_changed");
  const cards = [
    ...document.querySelectorAll(
      ".content-list-block__card-item, .content-list-block__list-item",
    ),
  ];
  if (!cards.length) throw new Error("source_layout_changed");
  let recognized = 0;
  const items = new Map<string, SafetyItem>();
  for (const card of cards) {
    const anchor = card.querySelector(
      "a.content-list-block__card-item-link, a.content-list-block__link",
    );
    const title = clean(
      card.querySelector(".content-list-block__title")?.textContent ??
        anchor?.textContent,
    );
    const url = officialUrl(anchor?.getAttribute("href") ?? "", source.url);
    if (!anchor || !title || title.length > 500 || !url || url === source.url)
      continue;
    recognized++;
    const description = [
      ...card.querySelectorAll("p:not(.content-list-block__date)"),
    ]
      .map((p) => p.textContent)
      .join(" ");
    if (!relevantToDogs(title, description)) continue;
    items.set(url, {
      id: url,
      source_id: source.id,
      title,
      url,
      published_at: sourceDate(
        card.querySelector(".content-list-block__date")?.textContent ?? "",
        now,
      ),
      kind: classifyOfficialTitle(title),
      region: null,
    });
  }
  if (!recognized) throw new Error("source_layout_changed");
  return [...items.values()];
}

/** Public callers cannot supply a destination. Every redirect is checked before fetching. */
export async function fetchOfficialPage(
  source: SafetySource,
  previous: { etag?: string | null; last_modified?: string | null },
  fetcher: typeof fetch = fetch,
): Promise<{
  html: string | null;
  etag: string | null;
  lastModified: string | null;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const headers = new Headers({
      Accept: "text/html",
      "User-Agent":
        "PentulaskuriSafety/1.0 (+https://www.pentulaskuri.com/contact)",
    });
    if (previous.etag) headers.set("If-None-Match", previous.etag);
    if (previous.last_modified)
      headers.set("If-Modified-Since", previous.last_modified);
    let url: string = source.url;
    for (let redirects = 0; redirects <= 2; redirects++) {
      const response = await fetcher(url, {
        headers,
        redirect: "manual",
        signal: controller.signal,
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const next = officialUrl(response.headers.get("Location") ?? "", url);
        if (!next || redirects === 2)
          throw new Error("source_redirect_rejected");
        url = next;
        continue;
      }
      const etag = response.headers.get("ETag");
      const lastModified = response.headers.get("Last-Modified");
      if (response.status === 304)
        return {
          html: null,
          etag: etag ?? previous.etag ?? null,
          lastModified: lastModified ?? previous.last_modified ?? null,
        };
      if (
        !response.ok ||
        !response.headers.get("Content-Type")?.includes("text/html") ||
        !response.body
      )
        throw new Error("source_fetch_failed");
      if (Number(response.headers.get("Content-Length")) > 1_048_576)
        throw new Error("source_too_large");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let bytes = 0,
        html = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          if (bytes > 1_048_576) throw new Error("source_too_large");
          html += decoder.decode(value, { stream: true });
        }
        html += decoder.decode();
      } finally {
        await reader.cancel();
      }
      return { html, etag, lastModified };
    }
    throw new Error("source_redirect_rejected");
  } finally {
    clearTimeout(timer);
  }
}
