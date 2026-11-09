import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { ImageApiRepository } from "./imageHandler.ts";
import {
  ImageFailure,
  PHOTO_STYLE,
  imageJobSchema,
  imageUsageSchema,
  pngFromBase64,
  type ImageJob,
} from "./storybook.ts";
import { sanitizePhotoPng } from "./imageInput.ts";

const IMAGE_BUCKET = "generated-storybook";
const sha256 = async (bytes: Uint8Array): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));
  return [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};
const base64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192)
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
};

export function supabaseImageRepository(
  client: SupabaseClient,
  publicStorageOrigin?: string,
): ImageApiRepository {
  const rpc = async (
    name: string,
    args: Record<string, unknown> = {},
  ): Promise<unknown> => {
    const { data, error } = await client.rpc(name, args);
    if (error) throw new Error(error.message);
    return data;
  };
  const getInternal = async (id: string): Promise<ImageJob | null> => {
    const { data, error } = await client
      .from("image_jobs")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw new Error("job_unavailable");
    return data ? imageJobSchema.parse(data) : null;
  };
  const uploadOnce = async (
    bucket: string,
    path: string,
    bytes: Uint8Array,
  ): Promise<void> => {
    const { error } = await client.storage.from(bucket).upload(path, bytes, {
      contentType: "image/png",
      cacheControl: "300",
      upsert: false,
    });
    if (!error) return;
    // A previous upload may have succeeded before its response was lost. Verify its bytes.
    const existing = await client.storage.from(bucket).download(path);
    if (
      existing.error ||
      !existing.data ||
      existing.data.size > 5 * 1024 * 1024 ||
      (await sha256(new Uint8Array(await existing.data.arrayBuffer()))) !==
        (await sha256(bytes))
    )
      throw new Error("image_upload_failed");
  };
  const purge = async (owner: string, id: string) => {
    const { error } = await client.storage
      .from(IMAGE_BUCKET)
      .remove([`${owner}/${id}.png`]);
    if (error) throw new Error("image_deletion_pending");
    await rpc("finish_storybook_deletion", { p_job: id });
  };
  const cleanupOrphanedCopies = async () => {
    const paths = z
      .array(
        z.object({
          path: z
            .string()
            .regex(
              /^[0-9a-f-]{36}\/books\/[0-9a-f-]{36}\/satukuva-[0-9a-f-]{36}\.png$/i,
            ),
        }),
      )
      .max(20)
      .parse(await rpc("orphaned_storybook_copies"));
    if (!paths.length) return;
    const { error } = await client.storage
      .from("puppy-books")
      .remove(paths.map((item) => item.path));
    if (error) throw new Error("book_copy_cleanup_pending");
  };
  return {
    async authenticate(token) {
      const { data, error } = await client.auth.getUser(token);
      const user = data?.user;
      return error || !user?.id || !user.email || user.is_anonymous
        ? null
        : { id: user.id, verified: !!user.email_confirmed_at };
    },
    async access(owner) {
      return (await rpc("storybook_access", { p_owner: owner })) === true;
    },
    async usage(owner) {
      return imageUsageSchema.parse(
        await rpc("storybook_usage", { p_owner: owner }),
      );
    },
    async remove(owner, id) {
      await rpc("request_storybook_deletion", { p_owner: owner, p_job: id });
      try {
        await purge(owner, id);
        return "deleted";
      } catch {
        return "pending";
      } // The durable tombstone is retried by the minute worker.
    },
    async rate(owner, id, rating) {
      await rpc("rate_storybook_image", {
        p_owner: owner,
        p_job: id,
        p_rating: rating,
      });
    },
    async cleanupDeleted() {
      const { data, error } = await client
        .from("image_jobs")
        .select("id,owner_id")
        .not("deleted_at", "is", null)
        .is("purged_at", null)
        .limit(10);
      if (error || !data) throw new Error("image_deletion_cleanup_unavailable");
      const results = await Promise.allSettled(
        data.map((row) => purge(row.owner_id, row.id)),
      );
      await cleanupOrphanedCopies();
      if (results.some((result) => result.status === "rejected"))
        throw new Error("image_deletion_pending");
    },
    async reserveInput(owner, id) {
      const path = await rpc("reserve_storybook_input", {
        p_owner: owner,
        p_id: id,
      });
      if (path !== `${owner}/${id}.png`) throw new Error("input_missing");
      return path;
    },
    async loadInput(job) {
      if (
        job.spec.style !== PHOTO_STYLE ||
        !job.spec.inputPath.startsWith(`${job.owner_id}/`)
      )
        throw new ImageFailure("input_missing", "rejected");
      const { data, error } = await client
        .from("storybook_inputs")
        .select("expires_at")
        .eq("owner_id", job.owner_id)
        .eq("path", job.spec.inputPath)
        .maybeSingle();
      if (error) throw new ImageFailure("input_unavailable", "rejected");
      if (!data) throw new ImageFailure("input_missing", "rejected");
      if (Date.parse(data.expires_at) <= Date.now())
        throw new ImageFailure("input_expired", "rejected");
      const image = await client.storage
        .from("storybook-inputs")
        .download(job.spec.inputPath);
      if (image.error || !image.data || image.data.size > 5 * 1024 * 1024)
        throw new ImageFailure("input_unavailable", "rejected");
      return sanitizePhotoPng(new Uint8Array(await image.data.arrayBuffer()));
    },
    async cleanupInputs() {
      const paths = z
        .array(
          z.object({
            path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.png$/i),
          }),
        )
        .max(20)
        .parse(await rpc("expired_storybook_inputs"));
      if (!paths.length) return;
      const { error } = await client.storage
        .from("storybook-inputs")
        .remove(paths.map((item) => item.path));
      if (error) throw new Error("input_cleanup_failed");
      await rpc("finish_storybook_input_cleanup", {
        p_paths: paths.map((item) => item.path),
      });
    },
    async reserve(owner, request, spec) {
      return imageJobSchema.parse(
        await rpc("reserve_storybook_image", {
          p_owner: owner,
          p_request: request,
          p_spec: spec,
        }),
      );
    },
    async claim(id) {
      const data = await rpc("claim_storybook_image", { p_id: id });
      return data ? imageJobSchema.parse(data) : null;
    },
    async list(owner) {
      const { data, error } = await client
        .from("image_jobs")
        .select("*")
        .eq("owner_id", owner)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw new Error("jobs_unavailable");
      return z.array(imageJobSchema).parse(data);
    },
    async get(owner, id) {
      const job = await getInternal(id);
      return job?.owner_id === owner ? job : null;
    },
    async signedUrl(job) {
      if (!(await getInternal(job.id))) throw new Error("not_found");
      const expected = `${job.owner_id}/${job.id}.png`;
      if (job.status !== "ready" || job.object_path !== expected)
        throw new Error("image_not_ready");
      const { data, error } = await client.storage
        .from(IMAGE_BUCKET)
        .createSignedUrl(expected, 60, {
          download: "pentulaskuri-satukuva.png",
        });
      if (error || !data?.signedUrl) throw new Error("image_link_unavailable");
      if (!publicStorageOrigin) return data.signedUrl;
      const publicUrl = new URL(publicStorageOrigin);
      if (
        publicUrl.username ||
        publicUrl.password ||
        publicUrl.pathname !== "/" ||
        publicUrl.search ||
        publicUrl.hash ||
        !(
          publicUrl.protocol === "https:" ||
          (publicUrl.protocol === "http:" &&
            ["127.0.0.1", "localhost"].includes(publicUrl.hostname))
        )
      )
        throw new Error("invalid_storage_origin");
      const signed = new URL(data.signedUrl);
      return `${publicUrl.origin}${signed.pathname}${signed.search}`;
    },
    async saveResult(job, result, costMicros) {
      await rpc("store_storybook_result", {
        p_id: job.id,
        p_png: base64(result.png),
        p_sha256: await sha256(result.png),
        p_cost: costMicros,
        p_provider_request: result.requestId,
      });
    },
    async fail(id, code, uncertain) {
      await rpc("fail_storybook_image", {
        p_id: id,
        p_code: code,
        p_uncertain: uncertain,
      });
    },
    async deliver(id) {
      const job = await getInternal(id);
      if (!job || !["delivery_pending", "delivery_failed"].includes(job.status))
        return;
      try {
        const payload = z
          .object({ png_base64: z.string(), sha256: z.string() })
          .parse(await rpc("storybook_payload", { p_id: id }));
        const bytes = pngFromBase64(payload.png_base64);
        if ((await sha256(bytes)) !== payload.sha256)
          throw new Error("image_integrity_error");
        const path = `${job.owner_id}/${job.id}.png`;
        await uploadOnce(IMAGE_BUCKET, path, bytes);
        await rpc("finish_storybook_delivery", {
          p_id: id,
          p_path: path,
          p_success: true,
        });
      } catch {
        await rpc("finish_storybook_delivery", {
          p_id: id,
          p_path: "",
          p_success: false,
        });
        throw new Error("image_delivery_failed");
      }
    },
    async attach(owner, id, book) {
      const job = await getInternal(id);
      const target = await client
        .from("puppy_books")
        .select("id")
        .eq("id", book)
        .eq("owner_id", owner)
        .maybeSingle();
      if (
        !job ||
        job.owner_id !== owner ||
        job.status !== "ready" ||
        job.object_path !== `${owner}/${id}.png` ||
        target.error ||
        !target.data
      )
        throw new Error("book_or_image_not_found");
      const image = await client.storage
        .from(IMAGE_BUCKET)
        .download(job.object_path);
      if (image.error || !image.data || image.data.size > 5 * 1024 * 1024)
        throw new Error("image_unavailable");
      await uploadOnce(
        "puppy-books",
        `${owner}/books/${book}/satukuva-${id}.png`,
        new Uint8Array(await image.data.arrayBuffer()),
      );
      try {
        return z
          .string()
          .uuid()
          .parse(
            await rpc("attach_storybook_image", {
              p_owner: owner,
              p_job: id,
              p_book: book,
            }),
          );
      } catch (cause) {
        try {
          await cleanupOrphanedCopies();
        } catch {
          console.warn("storybook_book_copy_cleanup_pending");
        }
        throw cause;
      }
    },
    async pending() {
      const cutoff = new Date(Date.now() - 4 * 60_000).toISOString();
      const now = new Date().toISOString();
      const { data, error } = await client
        .from("image_jobs")
        .select("*")
        .is("deleted_at", null)
        .or(
          `status.eq.queued,and(status.eq.processing,started_at.lt.${cutoff}),and(status.in.(delivery_pending,delivery_failed),next_delivery_at.lte.${now},delivery_attempts.lt.10)`,
        )
        .order("created_at")
        .limit(2);
      if (error) throw new Error("jobs_unavailable");
      return z.array(imageJobSchema).parse(data);
    },
  };
}
