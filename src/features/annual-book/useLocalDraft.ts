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
  const [isReplacing, setIsReplacing] = useState(false);
  const replacing = useRef(false);
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
      if (replacing.current) return queue.current;
      const epoch = generation.current;
      const run = async () => {
        if (
          epoch !== generation.current ||
          replacing.current ||
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
    if (replacing.current) return;
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
        replacing.current ||
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
      if (replacing.current) return;
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
    if (replacing.current) return;
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
    if (replacing.current) return;
    generation.current += 1;
    modeRef.current = "session";
    setMode("session");
    setError("");
  }, []);

  const replace = async (
    next: T,
    write: LocalDraftRepository<T>["write"] = repository.write,
  ): Promise<boolean> => {
    if (replacing.current) return false;
    if (modeRef.current === "session") {
      history.current = [...history.current.slice(-19), current.current];
      editGroup.current = undefined;
      current.current = next;
      setDocument(next);
      setCanUndo(true);
      return true;
    }
    // A restore may replace only an acknowledged draft, never unsaved edits.
    if (
      modeRef.current !== "ready" ||
      conflict.current ||
      current.current !== savedRef.current ||
      inFlight.current > 0
    )
      return false;
    replacing.current = true;
    setIsReplacing(true);
    const epoch = ++generation.current;
    try {
      await queue.current;
      const nextRevision = await write(next, revision.current);
      history.current = [...history.current.slice(-19), current.current];
      editGroup.current = undefined;
      current.current = next;
      savedRef.current = next;
      revision.current = nextRevision;
      if (mounted.current && epoch === generation.current) {
        setDocument(next);
        setSaved(next);
        setCanUndo(true);
        setRestored(true);
        setError("");
      }
      return true;
    } catch (cause) {
      if (repository.isConflict(cause)) {
        conflict.current = true;
        if (mounted.current) setHasConflict(true);
      }
      if (mounted.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Varmuuskopiota ei palautettu. Nykyinen luonnos säilyi.",
        );
      return false;
    } finally {
      replacing.current = false;
      if (mounted.current) setIsReplacing(false);
    }
  };
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
    replace,
    isReplacing,
    finishEdit: () => {
      editGroup.current = undefined;
    },
    retry: () => void flush(current.current),
    continueWithoutSaving,
    isSaved: mode === "ready" && document === saved && !writing && !isReplacing,
    hasStoredDraft: revision.current > 0,
    save: async () => {
      if (replacing.current) return false;
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
