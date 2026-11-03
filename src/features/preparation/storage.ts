import { z } from "zod";
import { preparationSchema, type PreparationDraft } from "./model";

export const PREPARATION_DATABASE = "pentulaskuri-local-preparation";
const STORE = "drafts";
const KEY = "preparation";
const recordSchema = z
  .object({
    revision: z.number().int().positive(),
    draft: preparationSchema,
  })
  .strict();
export type SavedPreparation = z.infer<typeof recordSchema>;
export class PreparationConflict extends Error {
  constructor() {
    super(
      "Toinen välilehti tallensi uudemman luonnoksen. Lataa tallennettu luonnos ennen jatkamista.",
    );
  }
}
function parseRecord(value: unknown): SavedPreparation | null {
  if (value === undefined) return null;
  const checked = recordSchema.safeParse(value);
  if (!checked.success)
    throw new Error(
      "Tallennettu luonnos on eri versiota tai sitä ei voitu lukea. Sitä ei korvattu.",
    );
  return checked.data;
}
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error("Selaimen luonnostallennus ei ole käytettävissä."));
      return;
    }
    const request = indexedDB.open(PREPARATION_DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () =>
      reject(
        new Error(
          "Selaimen luonnosta ei saatu avattua. Tarkista selaimen tallennustilan käyttöoikeus.",
        ),
      );
    request.onblocked = () =>
      reject(
        new Error(
          "Toinen välilehti estää luonnoksen avaamisen. Sulje vanha kokeiluvälilehti ja yritä uudelleen.",
        ),
      );
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}
export async function readPreparation(): Promise<SavedPreparation | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, "readonly");
    const request = transaction.objectStore(STORE).get(KEY);
    transaction.oncomplete = () => {
      db.close();
      try {
        resolve(parseRecord(request.result));
      } catch (error) {
        reject(error);
      }
    };
    transaction.onabort = transaction.onerror = () => {
      db.close();
      reject(
        new Error("Luonnosta ei voitu lukea. Tallennettuja kuvia ei muutettu."),
      );
    };
  });
}
export async function writePreparation(
  draft: PreparationDraft,
  expectedRevision: number,
): Promise<number> {
  const checked = preparationSchema.safeParse(draft);
  if (!checked.success)
    throw new Error(
      "Luonnosta ei voitu tallentaa. Tarkista sivujen tekstit ja päivämäärät.",
    );
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    const store = transaction.objectStore(STORE);
    const request = store.get(KEY);
    let failure: Error | undefined;
    let nextRevision = 0;
    request.onsuccess = () => {
      try {
        const current = parseRecord(request.result);
        if ((current?.revision ?? 0) !== expectedRevision)
          throw new PreparationConflict();
        nextRevision = expectedRevision + 1;
        store.put({ revision: nextRevision, draft: checked.data }, KEY);
      } catch (error) {
        failure =
          error instanceof DOMException
            ? new Error(
                "Luonnos ei tallentunut. Selaimen tallennustila voi olla täynnä tai estetty. Kuvasi ovat edelleen tässä näkymässä.",
              )
            : error instanceof Error
              ? error
              : new Error("Tallennus epäonnistui.");
        transaction.abort();
      }
    };
    transaction.oncomplete = () => {
      db.close();
      resolve(nextRevision);
    };
    transaction.onabort = transaction.onerror = () => {
      db.close();
      reject(
        failure ??
          new Error(
            "Luonnos ei tallentunut. Selaimen tallennustila voi olla täynnä. Kuvasi ovat edelleen tässä näkymässä.",
          ),
      );
    };
  });
}
