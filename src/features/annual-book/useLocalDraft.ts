import { useCallback, useEffect, useRef, useState } from "react";

export interface LocalDraftRepository<T> {
  create: () => T;
  read: () => Promise<{ draft: T; revision: number } | null>;
  write: (draft: T, expectedRevision: number) => Promise<number>;
  isConflict: (cause: unknown) => boolean;
  hasContent: (draft: T) => boolean;
}

type Mode = "loading" | "ready" | "blocked" | "session";
export function useLocalDraft<T>(repository: LocalDraftRepository<T>) {
  const [document, setDocument] = useState<T>(repository.create);
  const [mode, setMode] = useState<Mode>("loading");
  const [saved, setSaved] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [restored, setRestored] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [writing, setWriting] = useState(false);
  const inFlight = useRef(0);
  const current = useRef(document);
  const savedRef = useRef<T | null>(null);
  const modeRef = useRef<Mode>("loading");
  const revision = useRef(0);
  const generation = useRef(0);
  const mounted = useRef(false);
  const conflict = useRef(false);
  const history = useRef<T[]>([]);
  const editGroup = useRef<string | undefined>();
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [hasConflict, setHasConflict] = useState(false);

  const flush = useCallback(
    (snapshot: T) => {
      const epoch = generation.current;
      const run = async () => {
        if (
          epoch !== generation.current ||
          modeRef.current !== "ready" ||
          conflict.current ||
          snapshot === savedRef.current
        )
          return;
        try {
          inFlight.current += 1;
          if (mounted.current) setWriting(true);
          revision.current = await repository.write(snapshot, revision.current);
          savedRef.current = snapshot;
          if (mounted.current && epoch === generation.current) {
            setSaved(snapshot);
            setError("");
          }
        } catch (cause) {
          if (repository.isConflict(cause)) {
            conflict.current = true;
            if (mounted.current) setHasConflict(true);
          }
          if (mounted.current && epoch === generation.current)
            setError(
              cause instanceof Error
                ? cause.message
                : "Luonnos ei tallentunut. Yritä uudelleen.",
            );
        } finally {
          inFlight.current -= 1;
          if (mounted.current) setWriting(false);
        }
      };
      queue.current = queue.current.then(run, run);
      return queue.current;
    },
    [repository],
  );

  const reload = useCallback(async () => {
    const epoch = ++generation.current;
    modeRef.current = "loading";
    setMode("loading");
    setError("");
    await queue.current;
    try {
      const loaded = await repository.read();
      if (!mounted.current || epoch !== generation.current) return;
      const next = loaded?.draft ?? repository.create();
      current.current = next;
      savedRef.current = next;
      revision.current = loaded?.revision ?? 0;
      history.current = [];
      editGroup.current = undefined;
      conflict.current = false;
      setCanUndo(false);
      setHasConflict(false);
      setRestored(Boolean(loaded));
      setDocument(next);
      setSaved(next);
      modeRef.current = "ready";
      setMode("ready");
    } catch (cause) {
      if (mounted.current && epoch === generation.current) {
        modeRef.current = "blocked";
        setMode("blocked");
        setError(
          cause instanceof Error
            ? cause.message
            : "Luonnosta ei saatu luettua. Sitä ei korvattu.",
        );
      }
    }
  }, [repository]);

  useEffect(() => {
    mounted.current = true;
    void reload();
    return () => {
      mounted.current = false;
      if (
        modeRef.current === "ready" &&
        (current.current !== savedRef.current || inFlight.current > 0)
      )
        void flush(current.current);
    };
  }, [reload, flush]);

  useEffect(() => {
    if (mode !== "ready" || document === savedRef.current) return;
    const timer = window.setTimeout(() => void flush(document), 450);
    return () => window.clearTimeout(timer);
  }, [document, saved, mode, flush]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (
        (modeRef.current === "ready" &&
          (current.current !== savedRef.current || inFlight.current > 0)) ||
        (modeRef.current === "session" &&
          repository.hasContent(current.current))
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [repository]);

  const change = useCallback(
    (update: (draft: T) => T, group?: string, remember = true) => {
      if (modeRef.current !== "ready" && modeRef.current !== "session") return;
      const next = update(current.current);
      if (next === current.current) return;
      if (remember && (!group || editGroup.current !== group)) {
        history.current = [...history.current.slice(-19), current.current];
        setCanUndo(true);
      }
      editGroup.current = group;
      current.current = next;
      setDocument(next);
      if (!conflict.current) setError("");
    },
    [],
  );
  const undo = useCallback(() => {
    const previous = history.current.pop();
    if (
      !previous ||
      (modeRef.current !== "ready" && modeRef.current !== "session")
    )
      return;
    editGroup.current = undefined;
    current.current = previous;
    setDocument(previous);
    setCanUndo(history.current.length > 0);
  }, []);
  const continueWithoutSaving = useCallback(() => {
    generation.current += 1;
    modeRef.current = "session";
    setMode("session");
    setError("");
  }, []);
  return {
    document,
    mode,
    restored,
    canUndo,
    error,
    hasConflict,
    change,
    undo,
    reload,
    finishEdit: () => {
      editGroup.current = undefined;
    },
    retry: () => void flush(current.current),
    continueWithoutSaving,
    isSaved: mode === "ready" && document === saved && !writing,
    hasStoredDraft: revision.current > 0,
    save: async () => {
      const snapshot = current.current;
      await flush(snapshot);
      return (
        modeRef.current === "ready" &&
        !conflict.current &&
        snapshot === savedRef.current
      );
    },
  };
}
