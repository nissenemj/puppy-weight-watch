import { createClient } from "@supabase/supabase-js";
import { createImageHandler } from "../_shared/imageHandler.ts";
import { supabaseImageRepository } from "../_shared/supabaseImages.ts";

const client = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
Deno.serve(
  createImageHandler(
    supabaseImageRepository(client, Deno.env.get("PUBLIC_STORAGE_ORIGIN")),
    {
      apiKey: Deno.env.get("OPENAI_API_KEY"),
      workerSecret: Deno.env.get("FEATURE_REFRESH_SECRET"),
      background: (task) => EdgeRuntime.waitUntil(task),
    },
  ),
);
