import { useCallback, useEffect, useRef, useState } from "react";
import { draftSignature, type DraftData, type DraftSeed } from "./draft";
import { DraftConflictError, saveAnnualDraft } from "./draftStorage";

export const AUTOSAVE_DELAY = 750;
type Phase =
  | "idle"
  | "waiting"
  | "saving"
  | "saved"
  | "offline"
  | "error"
  | "conflict";
type SaveState = { phase: Phase; updatedAt: string | null; message?: string };
type Session = {
  seed: DraftSeed;
  active: boolean;
  writing: boolean;
  blocked: boolean;
  unconfirmed: boolean;
  revision: number;
  acknowledged: string;
  latest: DraftData;
  timer?: ReturnType<typeof setTimeout>;
  save: () => Promise<void>;
  retry: () => void;
};

export function useDraftAutosave(
  bookId: string,
  userId: string,
  data: DraftData,
  seed: DraftSeed | null,
) {
  const sessionRef = useRef<Session | null>(null);
  const [state, setState] = useState<SaveState>({
    phase: "idle",
    updatedAt: null,
  });

  useEffect(() => {
    if (!seed) return;
    const session: Session = {
      seed,
      active: true,
      writing: false,
      blocked: false,
      unconfirmed: false,
      revision: seed.revision,
      acknowledged: draftSignature(seed.data),
      latest: seed.data,
      save: async () => {},
      retry: () => {},
    };
    sessionRef.current = session;
    let updatedAt = seed.updatedAt;
    const publish = (phase: Phase, message?: string) => {
      if (session.active) setState({ phase, updatedAt, message });
    };
    session.save = async () => {
      clearTimeout(session.timer);
      if (
        !session.active ||
        session.writing ||
        session.blocked ||
        (!session.unconfirmed &&
          draftSignature(session.latest) === session.acknowledged)
      )
        return;
      if (!navigator.onLine) {
        publish("offline");
        return;
      }
      const sent = session.latest;
      session.writing = true;
      session.unconfirmed = true;
      publish("saving");
      try {
        const saved = await saveAnnualDraft(
          bookId,
          userId,
          sent,
          session.revision,
        );
        session.revision = saved.revision;
        session.acknowledged = draftSignature(sent);
        session.unconfirmed = false;
        updatedAt = saved.updatedAt;
        if (draftSignature(session.latest) === session.acknowledged)
          publish("saved");
        else if (session.active) {
          publish("waiting");
          session.timer = setTimeout(() => {
            void session.save();
          }, AUTOSAVE_DELAY);
        }
      } catch (cause) {
        session.blocked =
          cause instanceof DraftConflictError || navigator.onLine;
        publish(
          cause instanceof DraftConflictError
            ? "conflict"
            : !navigator.onLine
              ? "offline"
              : "error",
          cause instanceof Error
            ? cause.message
            : "Luonnoksen tallennus epäonnistui. Yritä uudelleen.",
        );
      } finally {
        session.writing = false;
      }
    };
    session.retry = () => {
      if (!session.active) return;
      session.blocked = false;
      void session.save();
    };
    publish(seed.updatedAt ? "saved" : "idle");
    const online = () => {
      if (!session.blocked) void session.save();
    };
    window.addEventListener("online", online);
    return () => {
      session.active = false;
      clearTimeout(session.timer);
      window.removeEventListener("online", online);
    };
  }, [bookId, userId, seed]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!seed || session?.seed !== seed || !session.active) return;
    session.latest = data;
    clearTimeout(session.timer);
    if (session.writing || session.blocked) return;
    if (!session.unconfirmed && draftSignature(data) === session.acknowledged) {
      setState((current) => ({
        ...current,
        phase: current.updatedAt ? "saved" : "idle",
      }));
      return;
    }
    setState((current) => ({
      ...current,
      phase: navigator.onLine ? "waiting" : "offline",
    }));
    session.timer = setTimeout(() => {
      void session.save();
    }, AUTOSAVE_DELAY);
  }, [data, seed]);

  const retry = useCallback(() => sessionRef.current?.retry(), []);
  const session = sessionRef.current;
  const acknowledged =
    session?.seed === seed
      ? session.acknowledged
      : seed && draftSignature(seed.data);
  // Even reverting to the old values must wait for an in-flight write to settle.
  const hasUnsavedChanges = Boolean(
    seed &&
      (draftSignature(data) !== acknowledged ||
        (session?.seed === seed && session.unconfirmed)),
  );
  return { ...state, hasUnsavedChanges, retry };
}
