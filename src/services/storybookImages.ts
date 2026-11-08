import { z } from "zod";
import {
  supabase,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "@/integrations/supabase/client";
import {
  imageJobSchema,
  type StorybookSpec,
} from "../../supabase/functions/_shared/storybook";

const jobSchema = imageJobSchema.extend({
  signed_url: z.string().url().nullable(),
});
export type StorybookJob = z.infer<typeof jobSchema>;
const ERRORS: Record<string, string> = {
  authentication_required: "Kirjaudu sisään ennen kuvien luontia.",
  email_not_verified: "Vahvista sähköpostiosoitteesi ennen kuvien luontia.",
  pilot_closed:
    "Satukuvat ovat rajatussa kokeilussa. Tililläsi ei vielä ole käyttöoikeutta.",
  not_configured:
    "Kuvapalvelun yhteys ei ole vielä käytössä. Voit tutustua kuvatilanteisiin alla.",
  daily_limit:
    "Päivän kahden kuvapyynnön raja on täynnä. Voit ladata aiemmat kuvasi.",
  pilot_limit:
    "Ensimmäisen kokeilun kuvamäärä on täynnä. Aiemmat kuvasi säilyvät käytettävissä.",
  budget_limit:
    "Kuvien luonti on tauolla käyttörajan tai tarkistettavan pyynnön vuoksi. Aiemmat kuvasi säilyvät käytettävissä.",
  job_in_progress: "Edellinen kuvapyyntö on vielä käsittelyssä.",
  request_conflict:
    "Tällä pyynnöllä on jo eri kuvan tiedot. Päivitä näkymä ennen uutta kuvaa.",
  book_or_image_not_found: "Kirjaa tai kuvaa ei löydy tältä tililtä.",
  input_limit:
    "Päivän lähtökuvien raja on täynnä. Voit jatkaa huomenna tai ladata aiemmat kuvasi.",
  input_missing: "Lähtökuvaa ei löydy. Valitse kuva uudelleen.",
  input_expired: "Lähtökuvan säilytysaika päättyi. Valitse kuva uudelleen.",
  input_upload_failed:
    "Lähtökuvan lähetys ei onnistunut. Voit yrittää uudelleen samalla kuvalla.",
};
export interface StorybookClient {
  list(
    signal?: AbortSignal,
  ): Promise<{
    available: boolean;
    reason: string | null;
    jobs: StorybookJob[];
  }>;
  get(id: string, signal?: AbortSignal): Promise<StorybookJob>;
  uploadPhoto(photo: Blob, inputId: string): Promise<string>;
  create(requestId: string, spec: StorybookSpec): Promise<StorybookJob>;
  retryDelivery(id: string): Promise<StorybookJob>;
  attach(id: string, bookId: string): Promise<void>;
}

export function storybookMessage(code: string | null): string {
  return (
    ERRORS[code ?? ""] ??
    "Kuvapalvelua ei saatu tavoitettua. Tarkista pyynnön tila ennen uuden kuvan luontia."
  );
}
export class StorybookApiError extends Error {
  constructor(public code: string) {
    super(storybookMessage(code));
  }
}

export function makeStorybookClient(
  options: {
    baseUrl?: string;
    publishableKey?: string;
    token?: () => Promise<string | null>;
  } = {},
): StorybookClient {
  const base =
    options.baseUrl ?? `${SUPABASE_URL}/functions/v1/storybook-images`;
  const token =
    options.token ??
    (async () =>
      (await supabase.auth.getSession()).data.session?.access_token ?? null);
  const request = async (
    suffix: string,
    body?: unknown,
    signal?: AbortSignal,
  ) => {
    const accessToken = await token();
    if (!accessToken)
      throw new Error(storybookMessage("authentication_required"));
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) abort();
    const timeout = setTimeout(abort, 20_000);
    try {
      const response = await fetch(`${base}${suffix}`, {
        method: body ? "POST" : "GET",
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: options.publishableKey ?? SUPABASE_PUBLISHABLE_KEY,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
      });
      const data: unknown = await response.json();
      if (!response.ok)
        throw new StorybookApiError(
          z.object({ error: z.string() }).safeParse(data).data?.error ??
            "image_service_unavailable",
        );
      return data;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  };
  return {
    async uploadPhoto(photo, inputId) {
      if (
        photo.type !== "image/png" ||
        !photo.size ||
        photo.size > 5 * 1024 * 1024
      )
        throw new Error("Lähtökuvan valmistelu epäonnistui.");
      const { path } = z
        .object({
          path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.png$/i),
        })
        .parse(await request("/input", { inputId }));
      const accessToken = await token();
      if (!accessToken) throw new StorybookApiError("authentication_required");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        apikey: options.publishableKey ?? SUPABASE_PUBLISHABLE_KEY,
      };
      const storage = `${new URL(base).origin}/storage/v1/object`;
      try {
        const response = await fetch(`${storage}/storybook-inputs/${path}`, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "image/png",
            "Cache-Control": "max-age=300",
          },
          body: photo,
          signal: AbortSignal.timeout(30_000),
        });
        if (response.ok) return path;
      } catch {
        /* Verify a potentially successful upload before retrying its stable path. */
      }
      try {
        const existing = await fetch(
          `${storage}/authenticated/storybook-inputs/${path}`,
          { headers, cache: "no-store", signal: AbortSignal.timeout(20_000) },
        );
        if (existing.ok) {
          const bytes = await existing.arrayBuffer();
          if (bytes.byteLength <= 5 * 1024 * 1024) {
            const [actual, expected] = await Promise.all([
              crypto.subtle.digest("SHA-256", bytes),
              photo
                .arrayBuffer()
                .then((bytes) => crypto.subtle.digest("SHA-256", bytes)),
            ]);
            if (
              new Uint8Array(actual).every(
                (value, index) => value === new Uint8Array(expected)[index],
              )
            )
              return path;
          }
        }
      } catch {
        /* No generation request has been made yet. */
      }
      throw new StorybookApiError("input_upload_failed");
    },
    async list(signal) {
      return z
        .object({
          available: z.boolean(),
          reason: z.string().nullable(),
          jobs: z.array(jobSchema).max(12),
        })
        .parse(await request("", undefined, signal));
    },
    async get(id, signal) {
      return z
        .object({ job: jobSchema })
        .parse(
          await request(`?id=${encodeURIComponent(id)}`, undefined, signal),
        ).job;
    },
    async create(requestId, spec) {
      return z
        .object({ job: jobSchema })
        .parse(await request("", { requestId, spec })).job;
    },
    async retryDelivery(id) {
      return z
        .object({ job: jobSchema })
        .parse(await request("/delivery", { jobId: id })).job;
    },
    async attach(id, bookId) {
      z.object({ memory_id: z.string().uuid() }).parse(
        await request("/book", { jobId: id, bookId }),
      );
    },
  };
}
export const storybookClient = makeStorybookClient();

export async function downloadStorybookImage(
  client: StorybookClient,
  id: string,
): Promise<void> {
  const job = await client.get(id);
  if (!job.signed_url || job.status !== "ready")
    throw new Error("Kuva ei ole vielä ladattavissa.");
  const response = await fetch(job.signed_url, { cache: "no-store" });
  if (!response.ok)
    throw new Error("Kuvan lataaminen epäonnistui. Yritä latausta uudelleen.");
  const blob = await response.blob();
  if (
    blob.type !== "image/png" ||
    blob.size > 5 * 1024 * 1024 ||
    blob.size === 0
  )
    throw new Error("Kuvatiedostoa ei voitu ladata.");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pentulaskuri-satukuva.png";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
