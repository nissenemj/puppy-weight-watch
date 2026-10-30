import { useEffect, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import { AnnualBookDocument } from "./AnnualBookDocument";
import { PrintBookButton } from "./PrintBookButton";
import { buildBookPages, type AnnualBook } from "./model";

interface BookReaderProps {
  book: AnnualBook;
  pageIndex: number;
  onPageChange: (index: number) => void;
  canPrint: boolean;
}

export function BookReader({
  book,
  pageIndex,
  onPageChange,
  canPrint,
}: BookReaderProps) {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  const readingArea = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const change = () => setSpread(query.matches);
    change();
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  const pages = buildBookPages(book);
  const selected = Math.max(0, Math.min(pageIndex, pages.length - 1));
  const first =
    spread && selected > 0 && selected % 2 === 0 ? selected - 1 : selected;
  const last =
    spread && first > 0 ? Math.min(first + 1, pages.length - 1) : first;
  useEffect(() => {
    if (open)
      readingArea.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [first, open, spread]);
  const previous = () =>
    onPageChange(
      spread ? Math.max(0, first - (first === 1 ? 1 : 2)) : first - 1,
    );
  const next = () => onPageChange(last + 1);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="journal-button journal-button-secondary annual-reader-trigger"
        >
          <BookOpen size={18} aria-hidden="true" /> Avaa lukutila
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="book-reader-overlay" />
        <Dialog.Content
          className="puppy-journal book-reader"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            readingArea.current?.focus();
          }}
        >
          <header className="book-reader-toolbar">
            <div>
              <Dialog.Title>
                {book.design?.title.trim() ||
                  `${book.puppyName}: Pennun ensimmäinen vuosi`}
              </Dialog.Title>
            </div>
            <div className="book-reader-actions">
              {canPrint && <PrintBookButton book={book} compact />}
              <Dialog.Close className="journal-button journal-button-secondary">
                <X size={18} aria-hidden="true" /> Sulje
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Selaa kirjaa sivuvalikolla tai Edellinen ja Seuraava
              -painikkeilla. Lukusivujen ollessa kohdistettuina voit käyttää
              myös nuolinäppäimiä. Escape sulkee lukutilan. Omat kuvat ja
              tekstit säilyvät muuttumattomina.
            </Dialog.Description>
          </header>
          <div
            ref={readingArea}
            className="book-reader-canvas"
            role="region"
            aria-label="Kirjan lukusivut"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                (event.target as HTMLElement).closest(
                  "input,select,textarea,button,a,[contenteditable=true]",
                )
              )
                return;
              if (event.key === "ArrowLeft" && first > 0) {
                event.preventDefault();
                previous();
              }
              if (event.key === "ArrowRight" && last < pages.length - 1) {
                event.preventDefault();
                next();
              }
            }}
          >
            <div
              className={`book-reader-pages ${last > first ? "book-reader-spread" : "book-reader-single"}`}
            >
              <AnnualBookDocument book={book} pageIndex={first} />
              {last > first && (
                <AnnualBookDocument book={book} pageIndex={last} />
              )}
            </div>
          </div>
          <footer className="book-reader-controls">
            <nav className="annual-pagination" aria-label="Lukutilan sivut">
              <button
                type="button"
                className="journal-icon-button"
                aria-label="Edellinen lukusivu"
                disabled={first === 0}
                onClick={previous}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <label htmlFor={id} className="sr-only">
                Valitse lukutilan sivu
              </label>
              <select
                id={id}
                value={selected}
                onChange={(event) => onPageChange(Number(event.target.value))}
              >
                {pages.map((page, index) => (
                  <option key={page.key} value={index}>
                    {index + 1}. {page.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="journal-icon-button"
                aria-label="Seuraava lukusivu"
                disabled={last === pages.length - 1}
                onClick={next}
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </nav>
            <p
              className="annual-page-status"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {first === last
                ? `Sivu ${first + 1}`
                : `Sivut ${first + 1}–${last + 1}`}{" "}
              / {pages.length}
            </p>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
