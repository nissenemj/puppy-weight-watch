import { z } from "zod";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "@/integrations/supabase/client";
import {
  SAFETY_SOURCES,
  type SafetySnapshot,
  type SourceCheck,
} from "../../supabase/functions/_shared/safetySources";
export {
  SAFETY_SOURCES,
  SAFETY_GUIDES,
} from "../../supabase/functions/_shared/safetySources";
export type {
  SafetySnapshot,
  SafetyItem,
  SourceCheck,
} from "../../supabase/functions/_shared/safetySources";

const officialLink = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.origin === "https://www.ruokavirasto.fi" &&
      url.pathname.startsWith("/elaimet/") &&
      !url.username &&
      !url.password
    );
  });
const date = z.string().datetime().nullable();
const snapshotSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        source_id: z.enum(["ruokavirasto-rehut", "ruokavirasto-elaimet"]),
        title: z.string().min(1).max(500),
        url: officialLink,
        published_at: date,
        kind: z.enum(["recall", "warning", "disease", "notice"]),
        region: z.string().nullable(),
      }),
    )
    .max(500),
  checks: z
    .array(
      z.object({
        source_id: z.enum(["ruokavirasto-rehut", "ruokavirasto-elaimet"]),
        last_attempt_at: date,
        last_success_at: date,
        status: z.enum(["never", "ok", "error"]),
        error_code: z.string().nullable(),
      }),
    )
    .max(2),
});

export async function fetchSafetyNews(
  signal?: AbortSignal,
): Promise<SafetySnapshot> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 12_000);
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/safety-news`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(
        "Tiedotteiden päivitystä ei saatu tarkistettua. Voit avata viranomaisen sivut alla olevista linkeistä.",
      );
    return snapshotSchema.parse(await response.json());
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

export function sourceIsCurrent(
  check: SourceCheck | undefined,
  now = Date.now(),
): boolean {
  if (!check || check.status !== "ok" || !check.last_success_at) return false;
  const source = SAFETY_SOURCES.find((source) => source.id === check.source_id);
  const age = now - Date.parse(check.last_success_at);
  return (
    !!source && age >= 0 && age <= (source.intervalMinutes * 2 + 5) * 60_000
  );
}
