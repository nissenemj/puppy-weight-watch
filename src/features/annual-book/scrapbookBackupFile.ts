import { z } from "zod";
import { BOOK_IMAGE_MAX_EDGE } from "./imageEncoding";
import { scrapbookDraftSchema, type ScrapbookDraft } from "./scrapbook";

export const MAX_BACKUP_BYTES = 25 * 1024 * 1024;
const backupSchema = z
  .object({
    format: z.literal("pentulaskuri-scrapbook-backup"),
    version: z.literal(1),
    createdAt: z.string().datetime(),
    draft: scrapbookDraftSchema,
  })
  .strict();

export function createScrapbookBackup(draft: ScrapbookDraft, now = new Date()) {
  const checked = backupSchema.parse({
    format: "pentulaskuri-scrapbook-backup",
    version: 1,
    createdAt: now.toISOString(),
    draft,
  });
  const text = JSON.stringify(checked);
  if (new Blob([text]).size > MAX_BACKUP_BYTES)
    throw new Error("Varmuuskopio on liian suuri. Enimmäiskoko on 25 Mt.");
  return text;
}

export function parseScrapbookBackup(text: string): ScrapbookDraft {
  if (new Blob([text]).size > MAX_BACKUP_BYTES)
    throw new Error(
      "Tiedosto on liian suuri. Valitse enintään 25 Mt:n varmuuskopio.",
    );
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(
      "Tiedosto on keskeneräinen tai sitä ei voi lukea. Valitse Pentulaskurista ladattu varmuuskopio.",
    );
  }
  const checked = backupSchema.safeParse(value);
  if (!checked.success)
    throw new Error(
      "Tiedosto ei ole tuettu Pentulaskurin varmuuskopio tai sen tiedot ovat virheellisiä. Nykyistä luonnosta ei muutettu.",
    );
  for (const page of checked.data.draft.pages) {
    if (page.image && !hasBookImageSignature(page.image))
      throw new Error(
        "Varmuuskopion kuva ei vastaa ilmoitettua JPEG-, PNG- tai WebP-muotoa. Nykyistä luonnosta ei muutettu.",
      );
  }
  return checked.data.draft;
}

export function hasBookImageSignature(data: string): boolean {
  const match = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(data);
  if (!match) return false;
  try {
    const bytes = atob(match[2]);
    if (match[1] === "jpeg") return bytes.startsWith("\xff\xd8\xff");
    if (match[1] === "png") return bytes.startsWith("\x89PNG\r\n\x1a\n");
    return bytes.startsWith("RIFF") && bytes.slice(8, 12) === "WEBP";
  } catch {
    return false;
  }
}

function validateImage(source: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const finish = (error?: Error) => {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      image.onload = image.onerror = null;
      image.src = "";
      if (error) reject(error);
      else resolve();
    };
    const abort = () => finish(new DOMException("Keskeytetty", "AbortError"));
    const timer = window.setTimeout(
      () =>
        finish(
          new Error(
            "Kuvan tarkistus kesti liian kauan. Valitse toinen varmuuskopio.",
          ),
        ),
      10_000,
    );
    image.onload = () => {
      const valid =
        image.naturalWidth > 0 &&
        image.naturalHeight > 0 &&
        Math.max(image.naturalWidth, image.naturalHeight) <=
          BOOK_IMAGE_MAX_EDGE;
      finish(
        valid
          ? undefined
          : new Error(
              "Varmuuskopion kuvan koko ei ole tuettu. Nykyistä luonnosta ei muutettu.",
            ),
      );
    };
    image.onerror = () =>
      finish(
        new Error(
          "Varmuuskopion kuvaa ei voi avata. Nykyistä luonnosta ei muutettu.",
        ),
      );
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else image.src = source;
  });
}

export async function readScrapbookBackup(
  file: File,
  signal: AbortSignal,
): Promise<ScrapbookDraft> {
  if (file.size > MAX_BACKUP_BYTES)
    throw new Error(
      "Tiedosto on liian suuri. Valitse enintään 25 Mt:n varmuuskopio.",
    );
  const text = await file.text();
  signal.throwIfAborted();
  const draft = parseScrapbookBackup(text);
  const images = new Set(
    draft.pages
      .map((page) => page.image)
      .filter((image): image is string => Boolean(image)),
  );
  for (const image of images) {
    signal.throwIfAborted();
    await validateImage(image, signal);
  }
  return draft;
}

export function backupFilename(name: string, now = new Date()) {
  const safe = name
    .trim()
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${safe || "oma"}-${now.toISOString().slice(0, 10)}.pentukirja.json`;
}
