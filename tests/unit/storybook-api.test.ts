// @vitest-environment node
import { beforeAll, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import {
  editStorybookImage,
  imageCostMicros,
  ImageFailure,
  PHOTO_STYLE,
  type ImageJob,
  type StorybookSpec,
} from "../../supabase/functions/_shared/storybook";
import { sanitizePhotoPng } from "../../supabase/functions/_shared/imageInput";
import { validateStorybookPhoto } from "../../src/utils/prepareStorybookPhoto";
import { runImageJob } from "../../supabase/functions/_shared/imageWorker";
import {
  createImageHandler,
  type ImageApiRepository,
} from "../../supabase/functions/_shared/imageHandler";

const owner = "10000000-0000-4000-8000-000000000001",
  other = "10000000-0000-4000-8000-000000000002",
  jobId = "20000000-0000-4000-8000-000000000001";
const spec: StorybookSpec = {
  style: PHOTO_STYLE,
  scene: "princess",
  inputPath: `${owner}/${jobId}.png`,
  notes: "Violetti mekko",
};
const job: ImageJob = {
  id: jobId,
  owner_id: owner,
  request_id: "30000000-0000-4000-8000-000000000001",
  spec,
  status: "queued",
  object_path: null,
  error_code: null,
  created_at: "2026-11-08T09:00:00Z",
  started_at: null,
};
let png: Uint8Array;
beforeAll(async () => {
  png = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: "#eee9e1" },
  })
    .png()
    .toBuffer();
});

describe("fixed image provider request", () => {
  it("sends one fixed-size PNG request and a hashed safety identifier, with measured cost", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ b64_json: Buffer.from(png).toString("base64") }],
            usage: {
              input_tokens: 100,
              output_tokens: 2000,
              input_tokens_details: { image_tokens: 80, text_tokens: 20 },
            },
          }),
          { headers: { "x-request-id": "request-fixture" } },
        ),
      );
    const result = await editStorybookImage(
      "test-key",
      spec,
      png,
      owner,
      fetcher,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://api.openai.com/v1/images/edits",
    );
    const body: FormData = fetcher.mock.calls[0][1].body;
    expect(Object.fromEntries(body)).toMatchObject({
      model: "gpt-image-2.6-flare",
      n: "1",
      quality: "low",
      complexity: "low",
      size: "1024x1024",
      output_format: "png",
    });
    expect(body.get("prompt")).toContain("fairy-tale princess");
    expect(body.get("prompt")).toContain("Violetti mekko");
    expect(body.get("safety_identifier")).toMatch(/^[0-9a-f]{64}$/);
    expect(body.get("safety_identifier")).not.toContain(owner);
    const photo = body.get("image[]") as File;
    expect(photo.name).toBe("dog.png");
    expect(Buffer.from(await photo.arrayBuffer())).toEqual(Buffer.from(png));
    expect(Buffer.from(result.png)).toEqual(Buffer.from(png));
    expect(imageCostMicros(result)).toBe(60740);
    expect(
      imageCostMicros({
        inputTokens: 100,
        imageInputTokens: null,
        outputTokens: 2000,
      }),
    ).toBeNull();
  });
  it("does not retry a timeout, provider refusal or ambiguous response", async () => {
    const network = vi.fn().mockRejectedValue(new Error("connection reset"));
    await expect(
      editStorybookImage("test-key", spec, png, owner, network),
    ).rejects.toMatchObject({
      code: "provider_uncertain",
      billing: "uncertain",
    });
    expect(network).toHaveBeenCalledTimes(1);
    const refused = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ error: { code: "moderation_blocked" } }),
          { status: 400 },
        ),
      );
    await expect(
      editStorybookImage("test-key", spec, png, owner, refused),
    ).rejects.toMatchObject({ code: "moderation_blocked" });
    expect(refused).toHaveBeenCalledTimes(1);
  });
});

describe("reference image normalization", () => {
  it("allows common dog-photo formats and rejects oversized, empty and unsupported files", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"])
      expect(
        validateStorybookPhoto(new File(["photo"], "photo", { type })),
      ).toBeNull();
    expect(
      validateStorybookPhoto(
        new File(["photo"], "photo.svg", { type: "image/svg+xml" }),
      ),
    ).toContain("JPG");
    expect(
      validateStorybookPhoto(new File([], "empty.png", { type: "image/png" })),
    ).toContain("tyhjä");
    expect(
      validateStorybookPhoto(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "huge.jpg", {
          type: "image/jpeg",
        }),
      ),
    ).toContain("5 Mt");
  });
  it("strips metadata without changing the decoded image and rejects corrupt input", async () => {
    const original = await sharp(png)
      .withMetadata({ exif: { IFD0: { Artist: "Private photo owner" } } })
      .png()
      .toBuffer();
    const clean = sanitizePhotoPng(original);
    expect(
      Buffer.from(clean).includes(Buffer.from("Private photo owner")),
    ).toBe(false);
    expect((await sharp(clean).metadata()).exif).toBeUndefined();
    expect(
      (await sharp(clean).raw().toBuffer()).equals(
        await sharp(original).raw().toBuffer(),
      ),
    ).toBe(true);
    const broken = new Uint8Array(clean);
    broken[broken.length - 1] ^= 1;
    expect(() => sanitizePhotoPng(broken)).toThrow("invalid_input_image");
    expect(() => sanitizePhotoPng(new Uint8Array(10))).toThrow(
      "invalid_input_image",
    );
  });
  it("does not accept an oversized decoded image", async () => {
    const large = await sharp({
      create: { width: 1025, height: 10, channels: 4, background: "white" },
    })
      .png()
      .toBuffer();
    expect(() => sanitizePhotoPng(large)).toThrow("invalid_input_image");
  });
});

describe("generation and delivery lifecycle", () => {
  it("claims only once even when the same request starts two workers", async () => {
    let claimed = false;
    const repository = {
      loadInput: vi.fn(async () => png),
      claim: vi.fn(async () => {
        if (claimed) return null;
        claimed = true;
        return job;
      }),
      saveResult: vi.fn(),
      fail: vi.fn(),
      deliver: vi.fn(),
    };
    const generate = vi
      .fn()
      .mockResolvedValue({
        png,
        inputTokens: 100,
        outputTokens: 2000,
        requestId: null,
      });
    await Promise.all([
      runImageJob(jobId, repository, "test-key", generate),
      runImageJob(jobId, repository, "test-key", generate),
    ]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(repository.saveResult).toHaveBeenCalledTimes(1);
    expect(repository.deliver).toHaveBeenCalledTimes(1);
  });
  it("persists bytes before delivery and does not regenerate on a storage outage", async () => {
    const calls: string[] = [];
    const repository = {
      loadInput: vi.fn(async () => png),
      claim: async () => job,
      saveResult: vi.fn(async () => {
        calls.push("persist");
      }),
      fail: vi.fn(),
      deliver: vi.fn(async () => {
        calls.push("deliver");
        throw new Error("storage down");
      }),
    };
    const generate = vi
      .fn()
      .mockResolvedValue({
        png,
        inputTokens: 100,
        outputTokens: 2000,
        requestId: null,
      });
    await runImageJob(jobId, repository, "test-key", generate);
    expect(calls).toEqual(["persist", "deliver"]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(repository.fail).not.toHaveBeenCalled();
  });
  it("holds an uncertain charge and never marks an unknown provider result ready", async () => {
    const repository = {
      loadInput: vi.fn(async () => png),
      claim: async () => job,
      saveResult: vi.fn(),
      fail: vi.fn(),
      deliver: vi.fn(),
    };
    await runImageJob(
      jobId,
      repository,
      "test-key",
      vi.fn().mockRejectedValue(new ImageFailure("provider_uncertain")),
    );
    expect(repository.fail).toHaveBeenCalledWith(
      jobId,
      "provider_uncertain",
      true,
    );
    expect(repository.deliver).not.toHaveBeenCalled();
  });
  it("releases the reservation when a source image expires before any provider call", async () => {
    const repository = {
      loadInput: vi
        .fn()
        .mockRejectedValue(new ImageFailure("input_expired", "rejected")),
      claim: async () => job,
      saveResult: vi.fn(),
      fail: vi.fn(),
      deliver: vi.fn(),
    };
    const generate = vi.fn();
    await runImageJob(jobId, repository, "test-key", generate);
    expect(generate).not.toHaveBeenCalled();
    expect(repository.fail).toHaveBeenCalledWith(jobId, "input_expired", false);
  });
});

function repositoryFixture(): ImageApiRepository {
  return {
    authenticate: vi.fn(async (token) =>
      token === "owner"
        ? { id: owner, verified: true }
        : token === "unverified"
          ? { id: owner, verified: false }
          : token === "other"
            ? { id: other, verified: true }
            : null,
    ),
    access: vi.fn(async () => true),
    reserve: vi.fn(async () => job),
    list: vi.fn(async () => []),
    get: vi.fn(async (user) => (user === owner ? job : null)),
    signedUrl: vi.fn(async () => "https://storage.example/image.png"),
    attach: vi.fn(async () => jobId),
    pending: vi.fn(async () => []),
    loadInput: vi.fn(async () => png),
    reserveInput: vi.fn(async () => spec.inputPath),
    cleanupInputs: vi.fn(),
    claim: vi.fn(async () => null),
    saveResult: vi.fn(),
    fail: vi.fn(),
    deliver: vi.fn(),
  };
}
function post(body: unknown, token?: string, suffix = "") {
  return new Request(`https://app.example/storybook-images${suffix}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("image HTTP authorization", () => {
  it("rejects unsigned, unverified and client-selected model requests before reservation", async () => {
    const repo = repositoryFixture();
    const handler = createImageHandler(repo, {
      apiKey: "test-key",
      background: () => undefined,
    });
    expect(
      (await handler(post({ requestId: job.request_id, spec }))).status,
    ).toBe(401);
    expect(
      (await handler(post({ requestId: job.request_id, spec }, "unverified")))
        .status,
    ).toBe(403);
    expect(
      (
        await handler(
          post(
            { requestId: job.request_id, spec, model: "another-model" },
            "owner",
          ),
        )
      ).status,
    ).toBe(400);
    expect(repo.reserve).not.toHaveBeenCalled();
  });
  it("does not reveal another owner's job or create a public image URL", async () => {
    const repo = repositoryFixture();
    const handler = createImageHandler(repo, {
      apiKey: "test-key",
      background: () => undefined,
    });
    const response = await handler(
      new Request(`https://app.example/storybook-images?id=${jobId}`, {
        headers: { Authorization: "Bearer other" },
      }),
    );
    expect(response.status).toBe(404);
    expect(repo.signedUrl).not.toHaveBeenCalled();
  });
  it("retries only delivery for the verified owner", async () => {
    const repo = repositoryFixture();
    vi.mocked(repo.get).mockResolvedValue({
      ...job,
      status: "delivery_failed",
    });
    const handler = createImageHandler(repo, {
      apiKey: "test-key",
      background: () => undefined,
    });
    expect((await handler(post({ jobId }, "owner", "/delivery"))).status).toBe(
      200,
    );
    expect(repo.deliver).toHaveBeenCalledWith(jobId);
    expect(repo.claim).not.toHaveBeenCalled();
    expect(repo.reserve).not.toHaveBeenCalled();
  });
  it("keeps scheduled worker access separate from user authentication", async () => {
    const repo = repositoryFixture();
    const handler = createImageHandler(repo, {
      apiKey: "test-key",
      workerSecret: "x".repeat(32),
      background: () => undefined,
    });
    expect((await handler(post({}, "owner", "/work"))).status).toBe(401);
    expect(repo.pending).not.toHaveBeenCalled();
  });
  it("requires confirmed authentication for photo reservations and reports expired input separately", async () => {
    const repo = repositoryFixture();
    const handler = createImageHandler(repo, {
      apiKey: "test-key",
      background: () => undefined,
    });
    expect(
      (await handler(post({ inputId: jobId }, undefined, "/input"))).status,
    ).toBe(401);
    expect(
      (await handler(post({ inputId: jobId }, "unverified", "/input"))).status,
    ).toBe(403);
    expect(repo.reserveInput).not.toHaveBeenCalled();
    vi.mocked(repo.reserveInput).mockRejectedValue(new Error("input_expired"));
    expect(
      (await handler(post({ inputId: jobId }, "owner", "/input"))).status,
    ).toBe(410);
    expect(repo.reserve).not.toHaveBeenCalled();
  });
});
