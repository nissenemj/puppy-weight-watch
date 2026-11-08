import type { SupabaseClient } from "@supabase/supabase-js";
import type { SafetyApiRepository } from "./safetyHandler.ts";
import type { SafetyItem, SourceCheck } from "./safetySources.ts";

export function supabaseSafetyRepository(
  client: SupabaseClient,
): SafetyApiRepository {
  const checks = async () => {
    const { data, error } = await client
      .from("safety_source_checks")
      .select("*");
    if (error || !data) throw new Error("checks_unavailable");
    return data as SourceCheck[];
  };
  return {
    checks,
    async snapshot() {
      const [sourceChecks, result] = await Promise.all([
        checks(),
        client
          .from("safety_news_items")
          .select("*")
          .order("published_at", { ascending: false, nullsFirst: false })
          .limit(500),
      ]);
      if (result.error || !result.data) throw new Error("items_unavailable");
      return { checks: sourceChecks, items: result.data as SafetyItem[] };
    },
    async claimRefresh() {
      const { data, error } = await client.rpc("claim_safety_refresh");
      if (error) throw error;
      return data === true;
    },
    async save(sourceId, items, check) {
      const { error } = await client.rpc("save_safety_source", {
        p_source: sourceId,
        p_items: items,
        p_check: check,
      });
      if (error) throw error;
    },
  };
}
