import { supabase } from "@/integrations/supabase/client";
import {
  draftDataSchema,
  draftSignature,
  type DraftData,
  type SavedDraft,
} from "./draft";

const columns = "book_id,owner_id,payload,revision,updated_at";
export class DraftConflictError extends Error {
  constructor() {
    super(
      "Luonnosta on muutettu toisessa välilehdessä tai laitteessa. Avaa tallennettu versio ennen jatkamista.",
    );
    this.name = "DraftConflictError";
  }
}

async function requireOwner(userId: string) {
  const { data, error } = await supabase.auth.getUser();
  if (error || data.user?.id !== userId)
    throw new Error(
      "Kirjaudu uudelleen sisään, jotta luonnos voidaan tallentaa.",
    );
}

function decodeDraft(
  row: {
    book_id: string;
    owner_id: string;
    payload: unknown;
    revision: number;
    updated_at: string;
  },
  bookId: string,
  userId: string,
): SavedDraft {
  const data = draftDataSchema.safeParse(row.payload);
  if (
    row.book_id !== bookId ||
    row.owner_id !== userId ||
    !data.success ||
    !Number.isSafeInteger(row.revision) ||
    row.revision < 1 ||
    !Number.isFinite(Date.parse(row.updated_at))
  )
    throw new Error(
      "Tallennettua luonnosta ei voitu avata turvallisesti. Sen tietoja ei korvattu.",
    );
  return { data: data.data, revision: row.revision, updatedAt: row.updated_at };
}

export async function loadAnnualDraft(
  bookId: string,
  userId: string,
  signal: AbortSignal,
): Promise<SavedDraft | null> {
  await requireOwner(userId);
  const { data, error } = await supabase
    .from("annual_book_drafts")
    .select(columns)
    .eq("book_id", bookId)
    .eq("owner_id", userId)
    .abortSignal(signal)
    .maybeSingle();
  if (error)
    throw new Error(
      "Tallennetun luonnoksen lataus epäonnistui. Tarkista yhteys ja yritä uudelleen.",
    );
  return data ? decodeDraft(data, bookId, userId) : null;
}

export async function saveAnnualDraft(
  bookId: string,
  userId: string,
  draft: DraftData,
  revision: number,
): Promise<SavedDraft> {
  const checked = draftDataSchema.safeParse(draft);
  if (!checked.success)
    throw new Error(
      "Luonnoksen tiedot ovat virheelliset. Tarkista kirjan valinnat ennen tallentamista.",
    );
  const payload = checked.data;
  await requireOwner(userId);
  // A normal upsert could silently overwrite a newer draft from another tab.
  const result =
    revision === 0
      ? await supabase
          .from("annual_book_drafts")
          .insert({ book_id: bookId, owner_id: userId, payload, revision: 1 })
          .select(columns)
          .single()
      : await supabase
          .from("annual_book_drafts")
          .update({ payload, revision: revision + 1 })
          .eq("book_id", bookId)
          .eq("owner_id", userId)
          .eq("revision", revision)
          .select(columns)
          .maybeSingle();
  if (result.error?.code === "23505" || (!result.error && !result.data))
    throw new DraftConflictError();
  if (result.error || !result.data)
    throw new Error(
      "Luonnoksen tallennus epäonnistui. Valinnat ovat yhä tässä näkymässä. Yritä uudelleen ennen poistumista.",
    );
  const saved = decodeDraft(result.data, bookId, userId);
  if (saved.revision !== revision + 1) throw new DraftConflictError();
  if (draftSignature(saved.data) !== draftSignature(payload))
    throw new Error(
      "Tallennusta ei voitu vahvistaa. Säilytä tämä näkymä auki ja yritä uudelleen.",
    );
  return saved;
}
