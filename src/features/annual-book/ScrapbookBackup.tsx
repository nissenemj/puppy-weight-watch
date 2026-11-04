import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, Upload } from "lucide-react";
import {
  backupFilename,
  createScrapbookBackup,
  readScrapbookBackup,
} from "./scrapbookBackupFile";
import { readPreviousScrapbook } from "./scrapbookStorage";
import type { ScrapbookDraft } from "./scrapbook";
import type { ScrapbookController } from "./useScrapbookDraft";

export function ScrapbookBackup({
  controller,
  photoBusy,
}: {
  controller: ScrapbookController;
  photoBusy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pending, setPending] = useState<ScrapbookDraft | null>(null);
  const [previous, setPrevious] = useState<ScrapbookDraft | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recoveryVersion, setRecoveryVersion] = useState(0);
  const picker = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const reading = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const ready = controller.mode === "ready" || controller.mode === "session";
  const busy = checking || photoBusy || controller.isReplacing;
  const mayRestore =
    ready &&
    !busy &&
    !controller.hasConflict &&
    (controller.isSaved || controller.mode === "session");

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      reading.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!open || controller.mode !== "ready") return;
    let current = true;
    void readPreviousScrapbook()
      .then((record) => {
        if (current) setPrevious(record?.draft ?? null);
      })
      .catch(() => {
        if (current) setPrevious(null);
      });
    return () => {
      current = false;
    };
  }, [open, recoveryVersion, controller.mode]);

  async function choose(file?: File) {
    if (!file || !ready || photoBusy || controller.isReplacing) return;
    reading.current?.abort();
    const request = new AbortController();
    reading.current = request;
    setChecking(true);
    setError("");
    setMessage("");
    try {
      const draft = await readScrapbookBackup(file, request.signal);
      if (alive.current && !request.signal.aborted) setPending(draft);
    } catch (cause) {
      if (alive.current && !request.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "Tiedostoa ei voitu lukea. Nykyinen luonnos säilyi.",
        );
    } finally {
      if (alive.current && reading.current === request) setChecking(false);
    }
  }

  function download() {
    setError("");
    try {
      const blob = new Blob([createScrapbookBackup(controller.document)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupFilename(controller.document.puppyName);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "Varmuuskopion lataus käynnistetty. Tarkista tiedosto laitteesi latauksista.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Varmuuskopiota ei voitu ladata. Luonnosta ei muutettu.",
      );
    }
  }

  async function restore() {
    if (!pending || !mayRestore) return;
    const success = await controller.restore(pending);
    if (!alive.current) return;
    if (success) {
      setPending(null);
      setRecoveryVersion((value) => value + 1);
      setMessage(
        controller.mode === "session"
          ? "Kirja avattu kertakokeiluun. Lataa varmuuskopio ennen sivulta poistumista."
          : "Varmuuskopio palautettu ja tallennettu tähän selaimeen. Aiemman tallennetun kirjan voi palauttaa alta.",
      );
    }
  }

  return (
    <details
      className="scrap-backup"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Varmuuskopio ja palautus</summary>
      <p>
        Lataa muokattava kopio kirjastasi toiselle laitteelle tai talteen.
        Tiedosto sisältää kuvat ja tekstit. Säilytä se yksityisesti. PDF-tuloste
        ei ole muokattava varmuuskopio.
      </p>
      <div className="scrap-backup-actions">
        <button
          type="button"
          className="journal-button journal-button-secondary"
          disabled={!ready || busy}
          onClick={download}
        >
          <Download size={18} aria-hidden="true" /> Lataa varmuuskopio
        </button>
        <button
          type="button"
          className="journal-button journal-button-secondary"
          disabled={!ready || busy}
          onClick={(event) => {
            opener.current = event.currentTarget;
            picker.current?.click();
          }}
        >
          <Upload size={18} aria-hidden="true" /> Avaa varmuuskopio
        </button>
      </div>
      <input
        ref={picker}
        type="file"
        hidden
        accept=".json,application/json"
        aria-label="Valitse pentukirjan varmuuskopio"
        onChange={(event) => {
          void choose(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      {previous && controller.mode === "ready" && (
        <button
          type="button"
          className="journal-text-link"
          disabled={busy}
          onClick={(event) => {
            opener.current = event.currentTarget;
            setError("");
            setPending(previous);
          }}
        >
          Palauta ennen viimeisintä palautusta tallennettu kirja
        </button>
      )}
      <p role="status" aria-label="Varmuuskopion tila">
        {checking ? "Tarkistetaan tiedostoa ja kuvia…" : message}
      </p>
      {error && <p role="alert">{error}</p>}
      <Dialog.Root
        open={Boolean(pending)}
        onOpenChange={(value) => {
          if (!value && !controller.isReplacing) setPending(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="scrap-ideas-overlay" />
          <Dialog.Content
            className="puppy-journal scrap-backup-dialog"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              cancelButton.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus();
            }}
            onEscapeKeyDown={(event) => {
              if (controller.isReplacing) event.preventDefault();
            }}
            onPointerDownOutside={(event) => {
              if (controller.isReplacing) event.preventDefault();
            }}
          >
            <Dialog.Title>
              Korvataanko tämän selaimen kirjaluonnos?
            </Dialog.Title>
            <Dialog.Description>
              Avattava kirja: {pending?.puppyName.trim() || "Oma pentu"}.{" "}
              {pending?.pages.length} sivua,{" "}
              {pending?.pages.filter((page) => page.image).length} kuvaa. Kuvien
              järjestys, tekstit ja alkuperäiset tapahtumapäivät säilyvät.
            </Dialog.Description>
            <p>
              {controller.mode === "session"
                ? "Kertakokeilu ei tallennu selaimeen. Voit ladata nykyisestä kirjasta varmuuskopion ennen palautusta."
                : "Nykyinen tallennettu kirja säilytetään palautusvarana tässä selaimessa. Voit myös perua ja ladata siitä oman varmuuskopion."}
            </p>
            {!mayRestore && !controller.isReplacing && (
              <p role="status">
                Odota kuvan käsittelyä ja luonnoksen tallentumista. Jos
                tallennus epäonnistuu, peru palautus ja lataa nykyinen luonnos
                varmuuskopioksi.
              </p>
            )}
            {controller.error && <p role="alert">{controller.error}</p>}
            <div className="scrap-backup-actions">
              <Dialog.Close
                ref={cancelButton}
                className="journal-button journal-button-secondary"
                disabled={controller.isReplacing}
              >
                Peru palautus
              </Dialog.Close>
              <button
                type="button"
                className="journal-button"
                disabled={!mayRestore}
                onClick={() => void restore()}
              >
                {controller.isReplacing
                  ? "Palautetaan…"
                  : "Korvaa luonnos varmuuskopiolla"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </details>
  );
}
