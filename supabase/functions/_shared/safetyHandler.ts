import { jsonResponse, secretMatches } from "./http.ts";
import { refreshSafety, type SafetyRepository } from "./safetyRefresh.ts";
import type { SafetySnapshot } from "./safetySources.ts";

export interface SafetyApiRepository extends SafetyRepository {
  snapshot(): Promise<SafetySnapshot>;
  claimRefresh(): Promise<boolean>;
}
export function createSafetyHandler(
  repository: SafetyApiRepository,
  refreshSecret?: string,
  fetcher: typeof fetch = fetch,
) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return jsonResponse(null, 204);
    try {
      if (request.method === "GET")
        return jsonResponse(await repository.snapshot());
      if (request.method !== "POST")
        return jsonResponse({ error: "method_not_allowed" }, 405);
      if (
        !(await secretMatches(
          request.headers.get("x-refresh-secret"),
          refreshSecret,
        ))
      )
        return jsonResponse({ error: "unauthorized" }, 401);
      if (!(await repository.claimRefresh()))
        return jsonResponse({ status: "already_running" }, 202);
      return jsonResponse({
        sources: await refreshSafety(repository, new Date(), fetcher),
      });
    } catch {
      return jsonResponse({ error: "safety_unavailable" }, 503);
    }
  };
}
