import { createClient } from "@supabase/supabase-js";
import { createSafetyHandler } from "../_shared/safetyHandler.ts";
import { supabaseSafetyRepository } from "../_shared/supabaseSafety.ts";

const client = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
Deno.serve(
  createSafetyHandler(
    supabaseSafetyRepository(client),
    Deno.env.get("FEATURE_REFRESH_SECRET"),
  ),
);
