import {
  SAFETY_SOURCES,
  type SafetyItem,
  type SourceCheck,
} from "./safetySources.ts";
import { fetchOfficialPage, parseOfficialPage } from "./safetyParser.ts";

export interface SafetyRepository {
  checks(): Promise<SourceCheck[]>;
  save(
    sourceId: string,
    items: SafetyItem[] | null,
    check: SourceCheck,
  ): Promise<void>;
}

export async function refreshSafety(
  repository: SafetyRepository,
  now = new Date(),
  fetcher: typeof fetch = fetch,
) {
  const previous = await repository.checks();
  return await Promise.all(
    SAFETY_SOURCES.map(async (source) => {
      const old = previous.find((check) => check.source_id === source.id);
      const time = now.toISOString();
      if (
        old?.last_attempt_at &&
        now.getTime() - Date.parse(old.last_attempt_at) <
          source.intervalMinutes * 60_000
      )
        return { source: source.id, status: "not_due" };
      try {
        const page = await fetchOfficialPage(source, old ?? {}, fetcher);
        if (page.html === null && !old?.last_success_at)
          throw new Error("source_invalid_304");
        const items =
          page.html === null ? null : parseOfficialPage(page.html, source, now);
        await repository.save(source.id, items, {
          source_id: source.id,
          last_attempt_at: time,
          last_success_at: time,
          status: "ok",
          error_code: null,
          etag: page.etag,
          last_modified: page.lastModified,
          item_count: items?.length ?? old?.item_count ?? 0,
        });
        return { source: source.id, status: "ok" };
      } catch (cause) {
        const code =
          cause instanceof Error && /^source_[a-z0-9_]+$/.test(cause.message)
            ? cause.message
            : "source_fetch_failed";
        // A failed parse or fetch never removes the last successful items or timestamp.
        await repository.save(source.id, null, {
          ...old,
          source_id: source.id,
          last_attempt_at: time,
          last_success_at: old?.last_success_at ?? null,
          status: "error",
          error_code: code,
        });
        return { source: source.id, status: "error" };
      }
    }),
  );
}
