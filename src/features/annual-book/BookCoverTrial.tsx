import {
  lazy,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BookCoverPreview } from "./BookCoverPreview";
import { BookPalettePicker } from "./BookPalettePicker";
import { ScrapbookEditor } from "./ScrapbookEditor";
import { ScrapbookBackup } from "./ScrapbookBackup";
import { hasScrapbookContent } from "./scrapbook";
import { useScrapbookDraft } from "./useScrapbookDraft";
import { buildBookPages, type AnnualBook, type BookDesign } from "./model";
import "@/styles/scrapbook-editor.css";

const LazyBookReader = lazy(() =>
  import("./BookReader").then((module) => ({ default: module.BookReader })),
);
const paletteNames = { forest: "Metsä", lake: "Järvi", berry: "Marja" };

function CoverReaderUnavailable() {
  const message = useRef<HTMLDivElement>(null);
  useEffect(() => {
    message.current?.focus();
  }, []);
  return (
    <div
      ref={message}
      role="alert"
      tabIndex={-1}
      className="book-cover-trial-error"
    >
      <p>Kirjaa ei saatu ladattua. Luonnoksesi on yhä muokattavissa.</p>
      <a href="/muistokirja" className="journal-text-link">
        Katso erillinen esimerkkikirja
      </a>
    </div>
  );
}

export function BookCoverTrial() {
  const id = useId();
  const scrapbook = useScrapbookDraft();
  const { puppyName, palette } = scrapbook.document;
  const [photoBusy, setPhotoBusy] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const ready =
    (scrapbook.mode === "ready" || scrapbook.mode === "session") &&
    !scrapbook.isReplacing;
  const scrapbookPages = useMemo(
    () => scrapbook.document.pages.filter(hasScrapbookContent),
    [scrapbook.document.pages],
  );
  const name = puppyName.trim() || "Oma pentu";
  const design: BookDesign = useMemo(
    () => ({
      title: "Pennun ensimmäinen vuosi",
      palette,
      coverArt: "illustration",
      letter: "",
    }),
    [palette],
  );
  // This browser's pages only. Fictional sample stories belong in the separate sample book.
  const book: AnnualBook = useMemo(
    () => ({
      bookId: "00000000-0000-4000-8000-000000000002",
      puppyName: name,
      start: "",
      end: "",
      design,
      entries: [],
      weights: [],
    }),
    [name, design],
  );
  const pageCount = buildBookPages(book, [], scrapbookPages).length;
  useEffect(
    () => setPageIndex((index) => Math.min(index, Math.max(0, pageCount - 1))),
    [pageCount],
  );

  return (
    <section
      id="kokeile-kantta"
      className="book-cover-trial"
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <div className="book-cover-trial-heading">
        <h2 id={`${id}-title`}>Aloita yhdestä kuvasta.</h2>
        <p className="book-cover-trial-lead">
          Ota kuva tai valitse suosikki puhelimesta. Saat heti oman kirjasivun.
          Voit lisätä sanoja, vaihtaa pohjaa ja jatkaa myöhemmin.
        </p>
      </div>
      <ScrapbookEditor
        controller={scrapbook}
        onPhotoBusyChange={setPhotoBusy}
      />
      <details className="scrap-cover-settings">
        <summary>Kirjan kansi</summary>
        <div className="scrap-cover-settings-grid">
          <fieldset
            disabled={!ready || photoBusy}
            className="book-cover-trial-controls"
          >
            <label className="book-cover-trial-label" htmlFor={`${id}-name`}>
              Pennun nimi
            </label>
            <input
              id={`${id}-name`}
              name="cover-trial-puppy-name"
              type="text"
              value={puppyName}
              maxLength={40}
              autoComplete="off"
              placeholder="Pennun nimi…"
              aria-describedby={`${id}-name-hint`}
              onChange={(event) =>
                scrapbook.change(
                  (draft) => ({ ...draft, puppyName: event.target.value }),
                  "puppy-name",
                )
              }
              onBlur={scrapbook.finishEdit}
            />
            <p id={`${id}-name-hint`} className="book-cover-trial-hint">
              Nimi vaihtuu kanteen heti. Enintään 40 merkkiä.
            </p>
            <p className="book-cover-trial-label">Kansiväri</p>
            <BookPalettePicker
              value={palette}
              onChange={(value) =>
                scrapbook.change((draft) => ({ ...draft, palette: value }))
              }
            />
            <p
              role="status"
              aria-label="Kansiväri"
              className="book-cover-trial-hint"
            >
              Valittu kansiväri: {paletteNames[palette]}.
            </p>
          </fieldset>
          <div
            className="book-cover-trial-preview"
            role="region"
            aria-label="Kannen esikatselu"
          >
            <BookCoverPreview
              design={design}
              puppyName={name}
              start=""
              end=""
            />
          </div>
        </div>
      </details>
      <ScrapbookBackup controller={scrapbook} photoBusy={photoBusy} />
      <div className="book-cover-trial-footer">
        <div className="book-cover-trial-actions">
          {showReader && scrapbookPages.length ? (
            <ErrorBoundary fallback={CoverReaderUnavailable}>
              <Suspense
                fallback={
                  <p role="status" className="book-cover-trial-loading">
                    Avataan kokeilukirjaa…
                  </p>
                }
              >
                <LazyBookReader
                  book={book}
                  pageIndex={pageIndex}
                  onPageChange={setPageIndex}
                  canPrint
                  scrapbookPages={scrapbookPages}
                  triggerLabel="Selaa kokeilukirjaa"
                  initiallyOpen
                  notice="Kokeilukirja tämän selaimen luonnoksesta. Tapahtumapäiviä ei päätellä. Esimerkkikuvat on merkitty erikseen."
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <button
              type="button"
              className="journal-button journal-button-secondary"
              disabled={
                !scrapbookPages.length || photoBusy || scrapbook.isReplacing
              }
              aria-describedby={
                !scrapbookPages.length ? `${id}-reader-hint` : undefined
              }
              onClick={() => {
                setPageIndex(1);
                setShowReader(true);
              }}
            >
              <BookOpen size={18} aria-hidden="true" /> Selaa kokeilukirjaa
            </button>
          )}
          <Link to="/muistokirja" className="journal-text-link">
            Katso valmis esimerkkikirja{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        {!scrapbookPages.length && (
          <p id={`${id}-reader-hint`} className="book-cover-trial-hint">
            Lisää kuva tai omat sanat, niin voit selata kirjaasi ja tulostaa
            sen.
          </p>
        )}
        <p id={`${id}-privacy`} className="book-cover-trial-disclosure">
          Kokeilu toimii ilman kirjautumista. Kuvat, tekstit ja kansivalinnat
          tallentuvat vain tähän selaimeen. Lataa varmuuskopio ennen laitteen
          vaihtoa tai selaimen tietojen tyhjennystä. Luonnos ei siirry
          kirjautuneen käyttäjän pentukirjaan. Esimerkkikuvat ja kuvitus on
          luotu tekoälyllä.
        </p>
      </div>
    </section>
  );
}
