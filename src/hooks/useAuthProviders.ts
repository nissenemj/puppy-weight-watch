import { useEffect, useState } from "react";
import {
  getEnabledAuthProviders,
  type EnabledAuthProviders,
} from "@/services/authProviderService";

export function useAuthProviders(enabled = true) {
  const [providers, setProviders] = useState<EnabledAuthProviders | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setProviders(null);
    setFailed(false);

    getEnabledAuthProviders(controller.signal).then(
      (result) => {
        if (!controller.signal.aborted) setProviders(result);
      },
      () => {
        if (!controller.signal.aborted) setFailed(true);
      },
    );

    return () => controller.abort();
  }, [enabled]);

  return { providers, failed };
}
