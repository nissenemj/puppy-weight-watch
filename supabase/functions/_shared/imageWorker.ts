import {
  editStorybookImage,
  ImageFailure,
  imageCostMicros,
  PHOTO_STYLE,
  type ImageJob,
  type ImageResult,
} from "./storybook.ts";

export interface ImageRepository {
  claim(id: string): Promise<ImageJob | null>;
  saveResult(
    job: ImageJob,
    result: ImageResult,
    costMicros: number | null,
  ): Promise<void>;
  fail(id: string, code: string, uncertain: boolean): Promise<void>;
  deliver(id: string): Promise<void>;
  loadInput(job: ImageJob): Promise<Uint8Array>;
}

export async function runImageJob(
  id: string,
  repository: ImageRepository,
  apiKey: string,
  generate: typeof editStorybookImage = editStorybookImage,
): Promise<void> {
  const job = await repository.claim(id);
  if (!job) return;
  let generated = false;
  try {
    if (job.spec.style !== PHOTO_STYLE)
      throw new ImageFailure("legacy_generation_disabled", "rejected");
    const input = await repository.loadInput(job);
    const result = await generate(apiKey, job.spec, input, job.owner_id);
    generated = true;
    // Persist the result before delivery, so a Storage outage does not require a second paid generation.
    await repository.saveResult(job, result, imageCostMicros(result));
  } catch (cause) {
    const failure =
      cause instanceof ImageFailure
        ? cause
        : new ImageFailure(
            generated ? "result_persistence_failed" : "provider_uncertain",
          );
    await repository.fail(id, failure.code, failure.billing === "uncertain");
    return;
  }
  try {
    await repository.deliver(id);
  } catch {
    /* The saved payload remains available for delivery-only retry. */
  }
}
