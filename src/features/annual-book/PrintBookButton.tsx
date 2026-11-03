import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Printer } from "lucide-react";
import { AnnualBookDocument } from "./AnnualBookDocument";
import type { AnnualBook, GuidedBookPage } from "./model";
import type { ScrapbookPage } from "./scrapbook";
import { encodeBookImage } from "./imageEncoding";

export function PrintBookButton({
  book,
  compact = false,
  guidedPages,
  scrapbookPages,
}: {
  book: AnnualBook;
  compact?: boolean;
  guidedPages?: GuidedBookPage[];
  scrapbookPages?: ScrapbookPage[];
}) {
  const helpId = useId();
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const button = useRef<HTMLButtonElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (!printing && restoreFocus.current) {
      button.current?.focus();
      restoreFocus.current = false;
    }
  }, [printing]);
  useEffect(() => {
    if (!printing) return;
    let active = true;
    const previousTitle = document.title;
    const finish = () => {
      if (active) setPrinting(false);
    };
    window.addEventListener("afterprint", finish);
    const prepare = async () => {
      try {
        await document.fonts.ready;
        const encoded = new Map<string, string>();
        for (const image of paper.current?.querySelectorAll("img") ?? []) {
          await image.decode();
          if (!image.src.startsWith("data:image/jpeg;base64,")) {
            const source = image.src;
            const jpeg = encoded.get(source) ?? encodeBookImage(image);
            encoded.set(source, jpeg);
            image.src = jpeg;
            await image.decode();
          }
          if (!active) return;
        }
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
        if (!active) return;
        const overflowing = Array.from(
          paper.current?.querySelectorAll<HTMLElement>(".annual-sheet") ?? [],
        ).some(
          (sheet) =>
            sheet.scrollHeight > sheet.clientHeight + 2 ||
            sheet.scrollWidth > sheet.clientWidth + 2,
        );
        if (overflowing)
          throw new Error(
            scrapbookPages?.length
              ? "Sivun sisältö ei mahdu tulosteeseen. Lyhennä otsikkoa tai omia sanoja ja kokeile uudelleen. Luonnoksesi säilyy."
              : guidedPages?.length
                ? "Kuvasivun sisältö ei mahdu tulostettavalle sivulle. Lyhennä pisintä vastausta tai kuvan nimeä, päivitä kuvasivu kirjaan ja kokeile uudelleen."
                : "Teksti ei mahdu yhdelle kirjan sivulle. Lyhennä pitkää tekstiä Muistot-osiossa tai poista muisto valinnasta ja kokoa kirja uudelleen.",
          );
        document.title = `${book.puppyName} - Pentukirja`;
        window.print();
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Tulostuksen valmistelu epäonnistui. Yritä uudelleen.",
          );
          setPrinting(false);
        }
      }
    };
    void prepare();
    return () => {
      active = false;
      window.removeEventListener("afterprint", finish);
      document.title = previousTitle;
    };
  }, [printing, book, guidedPages, scrapbookPages]);
  return (
    <div className="annual-print-actions">
      <button
        ref={button}
        type="button"
        className="journal-button"
        aria-describedby={helpId}
        disabled={printing}
        onClick={() => {
          setError("");
          restoreFocus.current = true;
          setPrinting(true);
        }}
      >
        <Printer size={18} aria-hidden="true" />
        {printing ? "Valmistellaan tulostusta…" : "Tulosta tai tallenna PDF"}
      </button>
      <p id={helpId} className={compact ? "sr-only" : undefined}>
        Valitse tulostusikkunassa Tallenna PDF ja paperikooksi A5. Poista
        selaimen ylä- ja alatunnisteet. Voit myös tulostaa paperille.
      </p>
      {printing && (
        <button
          type="button"
          className="journal-text-link"
          onClick={() => setPrinting(false)}
        >
          Lopeta tulostusnäkymä
        </button>
      )}
      {error && <p role="alert">{error}</p>}
      {printing &&
        createPortal(
          <div ref={paper} className="annual-print-root">
            <AnnualBookDocument
              book={book}
              standalone
              guidedPages={guidedPages}
              scrapbookPages={scrapbookPages}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
