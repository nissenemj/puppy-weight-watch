import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { day, type AnnualBook } from "./model";

type MemoryRow = Database["public"]["Tables"]["memories"]["Row"];
export type SourceMemory = Pick<
  MemoryRow,
  | "id"
  | "caption"
  | "content_type"
  | "content_url"
  | "created_at"
  | "timeline_entry_id"
  | "tags"
>;
export type DraftMemory = SourceMemory & {
  date: string;
  included: boolean;
  mishap: boolean;
};

export function makeDraftMemories(
  memories: SourceMemory[],
  dates: ReadonlyMap<string, string>,
): DraftMemory[] {
  return memories.map((memory) => {
    const linked = memory.timeline_entry_id
      ? dates.get(memory.timeline_entry_id)
      : undefined;
    return {
      ...memory,
      // created_at records an upload, not the day the remembered event happened.
      date: linked && day.safeParse(linked).success ? linked : "",
      included: false,
      mishap: (memory.tags ?? []).some(
        (tag) => tag.toLocaleLowerCase("fi") === "kommellus",
      ),
    };
  });
}

export async function loadBookSources(
  bookId: string,
  userId: string,
  signal: AbortSignal,
) {
  const { data: session, error: authError } = await supabase.auth.getUser();
  if (authError || session.user?.id !== userId)
    throw new Error("Kirjaudu uudelleen sisään ennen kirjan kokoamista.");
  const { data: owned, error: bookError } = await supabase
    .from("puppy_books")
    .select("owner_id,dog_id")
    .eq("id", bookId)
    .eq("owner_id", userId)
    .abortSignal(signal)
    .single();
  if (bookError || !owned || owned.owner_id !== userId)
    throw new Error("Kirjan käyttöoikeutta ei voitu varmistaa.");
  const { data, error } = await supabase
    .from("memories")
    .select(
      "id,caption,content_type,content_url,created_at,timeline_entry_id,tags",
    )
    .eq("book_id", bookId)
    .order("created_at", { ascending: true })
    .limit(201)
    .abortSignal(signal);
  if (error)
    throw new Error(
      "Muistojen lataus epäonnistui. Tarkista yhteys ja yritä uudelleen.",
    );
  const memories = (data ?? []).slice(0, 200);
  const linkedIds = [
    ...new Set(
      memories.flatMap((memory) =>
        memory.timeline_entry_id ? [memory.timeline_entry_id] : [],
      ),
    ),
  ];
  const dates = new Map<string, string>();
  if (linkedIds.length) {
    const timeline = await supabase
      .from("timeline_entries")
      .select("id,entry_date")
      .eq("book_id", bookId)
      .in("id", linkedIds)
      .abortSignal(signal);
    if (timeline.error)
      throw new Error("Tapahtumapäivien lataus epäonnistui. Yritä uudelleen.");
    for (const entry of timeline.data ?? [])
      dates.set(entry.id, entry.entry_date);
  }
  let weights: AnnualBook["weights"] = [];
  let weightNotice =
    "Kirjaa ei ole yhdistetty painonseurannan koiraan. Painot eivät ole mukana.";
  if (owned.dog_id) {
    const result = await supabase
      .from("weight_entries")
      .select("date,weight")
      .eq("dog_id", owned.dog_id)
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .limit(401)
      .abortSignal(signal);
    if (result.error || (result.data?.length ?? 0) > 400) {
      weightNotice =
        "Painoja ei voitu ottaa mukaan. Voit koota kirjan kuvista ja teksteistä.";
    } else {
      weights = (result.data ?? [])
        .filter(
          (row) =>
            day.safeParse(row.date).success &&
            Number.isFinite(row.weight) &&
            row.weight > 0 &&
            row.weight <= 200,
        )
        .map((row) => ({ date: row.date, kg: row.weight }));
      weightNotice = weights.length
        ? "Mukana ovat tämän koiran omat mittaukset valitulta ajalta. Ennusteita ei lisätä."
        : "Tälle koiralle ei löytynyt painomittauksia.";
    }
  }
  return {
    memories: makeDraftMemories(memories, dates),
    weights,
    weightNotice,
    truncated: (data?.length ?? 0) > 200,
  };
}
