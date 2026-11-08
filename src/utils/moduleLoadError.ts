/** Browsers use different messages when a lazy route's old hashed file is gone. */
export function isModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|loading (?:css )?chunk .+ failed/i.test(
    message,
  );
}
