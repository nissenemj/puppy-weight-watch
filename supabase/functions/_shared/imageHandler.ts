import { z } from "zod";
import {
  attachImageRequest,
  createImageRequest,
  createInputRequest,
  type ImageJob,
  type StorybookSpec,
} from "./storybook.ts";
import { jsonResponse, readSmallJson, secretMatches } from "./http.ts";
import { runImageJob, type ImageRepository } from "./imageWorker.ts";

export interface ImageApiRepository extends ImageRepository {
  authenticate(
    token: string,
  ): Promise<{ id: string; verified: boolean } | null>;
  access(owner: string): Promise<boolean>;
  reserve(
    owner: string,
    request: string,
    spec: StorybookSpec,
  ): Promise<ImageJob>;
  list(owner: string): Promise<ImageJob[]>;
  get(owner: string, id: string): Promise<ImageJob | null>;
  signedUrl(job: ImageJob): Promise<string>;
  attach(owner: string, job: string, book: string): Promise<string>;
  pending(): Promise<ImageJob[]>;
  reserveInput(owner: string, id: string): Promise<string>;
  cleanupInputs(): Promise<void>;
}
const uuid = z.string().uuid();
const PUBLIC_ERRORS = [
  "pilot_closed",
  "daily_limit",
  "pilot_limit",
  "budget_limit",
  "job_in_progress",
  "email_not_verified",
  "request_conflict",
  "book_or_image_not_found",
  "input_limit",
  "input_missing",
  "input_expired",
];

export function createImageHandler(
  repository: ImageApiRepository,
  options: {
    apiKey?: string;
    workerSecret?: string;
    background: (task: Promise<void>) => void;
  },
) {
  const present = async (job: ImageJob) => ({
    ...job,
    signed_url: job.status === "ready" ? await repository.signedUrl(job) : null,
  });
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return jsonResponse(null, 204);
    const url = new URL(request.url);
    const action = url.pathname.split("/").filter(Boolean).at(-1);
    try {
      if (request.method === "POST" && action === "work") {
        if (
          !(await secretMatches(
            request.headers.get("x-refresh-secret"),
            options.workerSecret,
          ))
        )
          return jsonResponse({ error: "unauthorized" }, 401);
        await repository.cleanupInputs();
        const pending = await repository.pending();
        // Only queued jobs can call the provider. Delivery retries only reuse saved bytes.
        await Promise.all(
          pending.map(async (job) => {
            if (job.status === "queued" && options.apiKey)
              await runImageJob(job.id, repository, options.apiKey);
            else if (job.status === "processing")
              await repository.fail(job.id, "worker_interrupted", true);
            else if (
              job.status === "delivery_pending" ||
              job.status === "delivery_failed"
            )
              await repository.deliver(job.id).catch(() => undefined);
          }),
        );
        return jsonResponse({ processed: pending.length });
      }
      const token = request.headers
        .get("authorization")
        ?.match(/^Bearer (.+)$/i)?.[1];
      const user = token ? await repository.authenticate(token) : null;
      if (!user) return jsonResponse({ error: "authentication_required" }, 401);
      if (request.method === "GET") {
        const id = url.searchParams.get("id");
        if (id) {
          if (!uuid.safeParse(id).success)
            return jsonResponse({ error: "invalid_request" }, 400);
          let job = await repository.get(user.id, id);
          if (!job) return jsonResponse({ error: "not_found" }, 404);
          if (
            job.status === "processing" &&
            job.started_at &&
            Date.now() - Date.parse(job.started_at) > 4 * 60_000
          ) {
            await repository.fail(job.id, "worker_interrupted", true);
            job = (await repository.get(user.id, id)) ?? job;
          }
          return jsonResponse({ job: await present(job) });
        }
        const [access, jobs] = await Promise.all([
          repository.access(user.id),
          repository.list(user.id),
        ]);
        return jsonResponse({
          available: !!options.apiKey && access && user.verified,
          reason: !options.apiKey
            ? "not_configured"
            : !user.verified
              ? "email_not_verified"
              : !access
                ? "pilot_closed"
                : null,
          jobs: await Promise.all(jobs.map(present)),
        });
      }
      if (request.method !== "POST")
        return jsonResponse({ error: "method_not_allowed" }, 405);
      const body = await readSmallJson(request);
      if (action === "input") {
        const parsed = createInputRequest.safeParse(body);
        if (!parsed.success)
          return jsonResponse({ error: "invalid_request" }, 400);
        if (!options.apiKey)
          return jsonResponse({ error: "not_configured" }, 503);
        if (!user.verified)
          return jsonResponse({ error: "email_not_verified" }, 403);
        return jsonResponse({
          path: await repository.reserveInput(user.id, parsed.data.inputId),
        });
      }
      if (action === "book") {
        const parsed = attachImageRequest.safeParse(body);
        if (!parsed.success)
          return jsonResponse({ error: "invalid_request" }, 400);
        return jsonResponse({
          memory_id: await repository.attach(
            user.id,
            parsed.data.jobId,
            parsed.data.bookId,
          ),
        });
      }
      if (action === "delivery") {
        const parsed = z.object({ jobId: uuid }).strict().safeParse(body);
        if (!parsed.success)
          return jsonResponse({ error: "invalid_request" }, 400);
        const job = await repository.get(user.id, parsed.data.jobId);
        if (!job) return jsonResponse({ error: "not_found" }, 404);
        if (
          job.status === "delivery_failed" ||
          job.status === "delivery_pending"
        )
          await repository.deliver(job.id);
        return jsonResponse({
          job: await present((await repository.get(user.id, job.id)) ?? job),
        });
      }
      const parsed = createImageRequest.safeParse(body);
      if (!parsed.success)
        return jsonResponse({ error: "invalid_request" }, 400);
      if (!options.apiKey)
        return jsonResponse({ error: "not_configured" }, 503);
      if (!user.verified)
        return jsonResponse({ error: "email_not_verified" }, 403);
      const job = await repository.reserve(
        user.id,
        parsed.data.requestId,
        parsed.data.spec,
      );
      if (job.status === "queued")
        options.background(
          runImageJob(job.id, repository, options.apiKey).catch(
            () => undefined,
          ),
        );
      return jsonResponse(
        { job: await present(job) },
        job.status === "ready" ? 200 : 202,
      );
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      const code = PUBLIC_ERRORS.find((code) => message.includes(code));
      const status =
        code === "request_conflict" || code === "job_in_progress"
          ? 409
          : code === "book_or_image_not_found" || code === "input_missing"
            ? 404
            : code === "input_expired"
              ? 410
              : code === "email_not_verified" || code === "pilot_closed"
                ? 403
                : code
                  ? 429
                  : message === "invalid_request"
                    ? 400
                    : 503;
      return jsonResponse(
        {
          error:
            code ??
            (message === "invalid_request"
              ? "invalid_request"
              : "image_service_unavailable"),
        },
        status,
      );
    }
  };
}
