import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Heart,
  ImagePlus,
  MessageCircle,
  PawPrint,
  Plus,
  Star,
  Undo2,
  Lightbulb,
} from "lucide-react";
import {
  PUPPY_IMAGE_ACCEPT,
  validatePuppyImage,
} from "@/services/puppyBookStorage";
import examplePhoto from "@/assets/puppy-book-home-640.webp";
import { encodeBookImage } from "./imageEncoding";
import { documentStyles } from "./documentStyles";
import { GrowingBookField, ScrapbookPageContent } from "./ScrapbookPage";
import { ScrapbookIdeas, ScrapbookIdeaPrompt } from "./ScrapbookIdeas";
import {
  chooseScrapbookTopic,
  hasScrapbookContent,
  newScrapbookPage,
  SCRAPBOOK_LAYOUTS,
  scrapbookLayoutNames,
  type ScrapbookPage,
} from "./scrapbook";
import type { ScrapbookController } from "./useScrapbookDraft";

export function ScrapbookEditor({
  controller,
}: {
  controller: ScrapbookController;
}) {
  const { document, mode, change, finishEdit } = controller;
  const id = useId();
  const page = document.pages.find(
    (item) => item.id === document.selectedPageId,
  )!;
  const index = document.pages.indexOf(page);
  const ready = mode === "ready" || mode === "session";
  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quotePages, setQuotePages] = useState<string[]>([]);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const ideaOpener = useRef<HTMLButtonElement | null>(null);
  const ideaChosen = useRef(false);
  const picker = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const paper = useRef<HTMLElement>(null);
  const sequence = useRef(0);
  const alive = useRef(true);
  const revealPaper = () =>
    window.requestAnimationFrame(() => {
      if (!alive.current) return;
      paper.current?.focus({ preventScroll: true });
      paper.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  const openIdeas = (event: MouseEvent<HTMLButtonElement>) => {
    ideaOpener.current = event.currentTarget;
    ideaChosen.current = false;
    setIdeasOpen(true);
  };
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      sequence.current += 1;
    };
  }, []);
  useEffect(() => {
    sequence.current += 1;
    setBusy(false);
    setPhotoError("");
  }, [page.id]);

  const patch = (patch: Partial<ScrapbookPage>, group?: string) =>
    change(
      (draft) => ({
        ...draft,
        pages: draft.pages.map((item) =>
          item.id === page.id ? { ...item, ...patch } : item,
        ),
      }),
      group ? `${page.id}-${group}` : undefined,
    );
  async function loadPhoto(file?: File, example = false) {
    if (!example && !file) return;
    const invalid = file && validatePuppyImage(file);
    if (invalid) {
      setPhotoError(invalid);
      return;
    }
    const ticket = ++sequence.current;
    const targetId = page.id;
    const url = file ? URL.createObjectURL(file) : examplePhoto;
    setBusy(true);
    setPhotoError("");
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (!alive.current || ticket !== sequence.current) return;
      const encoded = encodeBookImage(image);
      change((draft) => ({
        ...draft,
        pages: draft.pages.map((item) =>
          item.id === targetId
            ? {
                ...item,
                image: encoded,
                imageSource: example ? "example" : "own",
                imageDescription: example
                  ? "Tekoälyllä luotu esimerkkikuva: pentu kirjan vieressä."
                  : "",
              }
            : item,
        ),
      }));
      setFeedback("Kuva on sivulla. Kokeile pohjaa tai lisää tarra.");
      if (window.matchMedia("(max-width: 899px)").matches) {
        paper.current?.focus({ preventScroll: true });
        paper.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    } catch {
      if (alive.current && ticket === sequence.current)
        setPhotoError(
          "Kuvaa ei voitu avata. Valitse toinen JPEG-, PNG- tai WebP-kuva. Aiempi sivusi säilyi.",
        );
    } finally {
      if (file) URL.revokeObjectURL(url);
      if (alive.current && ticket === sequence.current) setBusy(false);
    }
  }
  const select = (pageId: string) => {
    change((draft) => ({ ...draft, selectedPageId: pageId }), undefined, false);
    setFeedback("Kirjasivu avattu. Voit jatkaa sen muokkaamista.");
    revealPaper();
  };
  function move(direction: -1 | 1) {
    change((draft) => {
      const pages = [...draft.pages];
      [pages[index], pages[index + direction]] = [
        pages[index + direction],
        pages[index],
      ];
      return { ...draft, pages };
    });
    setFeedback(
      `Sivu siirrettiin ${direction < 0 ? "aikaisemmaksi" : "myöhemmäksi"} kirjassa. Voit perua muutoksen.`,
    );
  }
  return (
    <section className="scrap-editor" aria-label="Leikekirjan kokoaminen">
      <div className="scrap-editor-top">
        <div
          className="scrap-photo-actions"
          role="group"
          aria-label="Kuva kirjasivulle"
          aria-busy={busy}
        >
          <button
            type="button"
            className="journal-button"
            disabled={!ready || busy}
            onClick={() => camera.current?.click()}
          >
            <Camera size={20} aria-hidden="true" /> Ota kuva
          </button>
          <button
            type="button"
            className="journal-button journal-button-secondary"
            disabled={!ready || busy}
            onClick={() => picker.current?.click()}
          >
            <ImagePlus size={20} aria-hidden="true" />{" "}
            {page.image ? "Vaihda kuva" : "Valitse kuva"}
          </button>
        </div>
        <button
          type="button"
          className="journal-text-link scrap-open-ideas"
          disabled={!ready || busy}
          onClick={openIdeas}
        >
          <Lightbulb size={18} aria-hidden="true" /> Kuvausideat
        </button>
        <p
          className="scrap-save-status"
          role="status"
          aria-label="Leikekirjan tallennus"
          aria-live="polite"
        >
          {mode === "loading"
            ? "Avataan selaimen luonnosta…"
            : mode === "blocked"
              ? "Luonnosta ei saatu avattua."
              : mode === "session"
                ? "Kertakokeilu. Muutokset eivät säily sivun päivityksessä."
                : controller.error
                  ? "Luonnos ei ole tallessa."
                  : controller.isSaved
                    ? controller.hasStoredDraft
                      ? "Luonnos tallessa tässä selaimessa."
                      : "Aloita kuvasta. Oma sivu syntyy heti."
                    : "Tallennetaan tähän selaimeen…"}
        </p>
        {controller.error && (
          <div className="scrap-storage-error" role="alert">
            <p>{controller.error}</p>
            {mode === "blocked" ? (
              <>
                <button
                  type="button"
                  className="journal-text-link"
                  onClick={() => void controller.reload()}
                >
                  Yritä luonnoksen avaamista uudelleen
                </button>
                <button
                  type="button"
                  className="journal-text-link"
                  onClick={controller.continueWithoutSaving}
                >
                  Jatka tallentamatta
                </button>
              </>
            ) : controller.hasConflict ? (
              <>
                <p>
                  Tässä näkymässä tallentamatta jääneet muutokset korvautuvat,
                  jos lataat tallennetun luonnoksen.
                </p>
                <button
                  type="button"
                  className="journal-text-link"
                  onClick={() => void controller.reload()}
                >
                  Lataa tallennettu luonnos
                </button>
              </>
            ) : (
              <button
                type="button"
                className="journal-text-link"
                onClick={controller.retry}
              >
                Yritä tallentaa uudelleen
              </button>
            )}
          </div>
        )}
        <input
          ref={picker}
          type="file"
          accept={PUPPY_IMAGE_ACCEPT}
          hidden
          name="scrapbook-photo"
          aria-label="Valitse kirjasivun kuva"
          onChange={(event) => {
            void loadPhoto(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <input
          ref={camera}
          type="file"
          accept={PUPPY_IMAGE_ACCEPT}
          capture="environment"
          hidden
          name="scrapbook-camera"
          aria-label="Ota kirjasivun kuva"
          onChange={(event) => {
            void loadPhoto(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        {photoError && (
          <p className="scrap-photo-error" role="alert">
            {photoError}
          </p>
        )}
        {busy && <p role="status">Valmistellaan kuvaa tässä selaimessa…</p>}
        {!page.image && (
          <button
            type="button"
            className="book-cover-trial-idea-button"
            disabled={!ready || busy}
            onClick={() => void loadPhoto(undefined, true)}
          >
            Kokeile esimerkkikuvalla
          </button>
        )}
      </div>

      <div
        className="scrap-layout-picker"
        role="group"
        aria-label="Kirjasivun pohja"
      >
        <p className="scrap-tool-label">Vaihda pohjaa</p>
        <div className="scrap-layout-options">
          {SCRAPBOOK_LAYOUTS.map((layout) => (
            <button
              key={layout}
              type="button"
              aria-pressed={page.layout === layout}
              disabled={!ready}
              onClick={() => {
                if (layout !== page.layout) patch({ layout });
                setFeedback(
                  `${scrapbookLayoutNames[layout]} valittu. Kuva, tekstit ja tapahtumapäivä säilyivät.`,
                );
              }}
            >
              <span
                className={`scrap-layout-mini scrap-layout-mini-${layout}`}
                aria-hidden="true"
              >
                <span>
                  {page.image && (
                    <img src={page.image} alt="" width={60} height={50} />
                  )}
                </span>
              </span>
              <span>{scrapbookLayoutNames[layout]}</span>
              {page.layout === layout && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`annual-document annual-palette-${document.palette} scrap-editor-canvas`}
      >
        <style>{documentStyles}</style>
        <article
          ref={paper}
          className="annual-sheet annual-page-scrapbook scrap-editing-paper"
          tabIndex={-1}
          aria-label="Oma kirjasivu"
        >
          <header className="annual-page-header">
            <p className="annual-kicker">
              {document.puppyName.trim() || "Oma pentu"} · Oma pentukirja
            </p>
            <h3 className="sr-only">Muokattava kirjasivu</h3>
            <label htmlFor={`${id}-title`} className="sr-only">
              Kirjasivun otsikko
            </label>
            <GrowingBookField
              id={`${id}-title`}
              name="scrapbook-title"
              className="scrap-inline-title"
              value={page.title}
              maxLength={60}
              autoComplete="off"
              disabled={!ready}
              placeholder="Oman hetken otsikko…"
              onChange={(event) =>
                patch({ title: event.target.value }, "title")
              }
              onBlur={finishEdit}
            />
          </header>
          <ScrapbookPageContent
            page={page}
            editor={{
              onChange: patch,
              onFinish: finishEdit,
              onCamera: () => camera.current?.click(),
              showQuote: quotePages.includes(page.id),
              disabled: !ready || busy,
            }}
          />
          <p className="scrap-page-indicator">
            {hasScrapbookContent(page)
              ? "Sivu on mukana kokeilukirjassa."
              : "Lisää kuva tai omat sanat. Sivu tulee mukaan kirjaan heti."}
          </p>
        </article>
      </div>

      <div className="scrap-editor-extras">
        <div
          className="scrap-sticker-options"
          role="group"
          aria-label="Kirjasivun tarra"
        >
          <p className="scrap-tool-label">Lisää tarra</p>
          {(
            [
              ["paw", "Tassu", PawPrint],
              ["heart", "Sydän", Heart],
              ["star", "Tähti", Star],
            ] as const
          ).map(([sticker, label, Icon]) => (
            <button
              type="button"
              key={sticker}
              disabled={!ready}
              aria-pressed={page.sticker === sticker}
              onClick={() => {
                patch({ sticker: page.sticker === sticker ? "none" : sticker });
                setFeedback(
                  page.sticker === sticker
                    ? "Tarra poistettu. Voit perua muutoksen."
                    : `${label} lisätty kirjasivulle.`,
                );
              }}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="book-cover-trial-idea-button"
          disabled={!ready}
          onClick={() => {
            setQuotePages((current) =>
              current.includes(page.id) ? current : [...current, page.id],
            );
            window.requestAnimationFrame(() => {
              const field = paper.current?.querySelector<HTMLTextAreaElement>(
                '[name="scrapbook-quote"]',
              );
              field?.focus({ preventScroll: true });
              field?.scrollIntoView({ block: "center", behavior: "instant" });
            });
          }}
        >
          <MessageCircle size={19} aria-hidden="true" />{" "}
          {page.quote || quotePages.includes(page.id)
            ? "Muokkaa puhekuplaa"
            : "Lisää puhekupla"}
        </button>
        <ScrapbookIdeaPrompt
          key={`${page.id}-${page.topic}`}
          topic={page.topic}
          disabled={!ready || busy}
          onOpenIdeas={openIdeas}
        />
        <details className="scrap-page-details">
          <summary>Päivä ja kuvan kuvaus</summary>
          <label htmlFor={`${id}-date`}>Tapahtumapäivä (valinnainen)</label>
          <input
            id={`${id}-date`}
            name="scrapbook-date"
            type="date"
            disabled={!ready}
            value={page.date}
            onChange={(event) => patch({ date: event.target.value }, "date")}
            onBlur={finishEdit}
          />
          <p>
            Jätä tyhjäksi, jos et muista päivää. Tallennuspäivää ei käytetä
            tapahtumapäivänä.
          </p>
          <label htmlFor={`${id}-description`}>
            Kuvan kuvaus ruudunlukijalle (valinnainen)
          </label>
          <input
            id={`${id}-description`}
            name="scrapbook-description"
            type="text"
            autoComplete="off"
            maxLength={180}
            disabled={!ready}
            value={page.imageDescription}
            placeholder="Mitä kuvassa näkyy?…"
            onChange={(event) =>
              patch({ imageDescription: event.target.value }, "description")
            }
            onBlur={finishEdit}
          />
          {page.image && (
            <button
              type="button"
              className="journal-text-link"
              disabled={!ready || busy}
              onClick={() => {
                patch({ image: undefined });
                setFeedback(
                  "Kuva poistettiin sivulta. Tekstit säilyivät. Voit perua poiston.",
                );
              }}
            >
              Poista kuva sivulta
            </button>
          )}
        </details>
        <button
          type="button"
          className="journal-button journal-button-secondary scrap-undo"
          disabled={!ready || !controller.canUndo}
          onClick={() => {
            controller.undo();
            setFeedback("Edellinen muutos peruttu.");
            revealPaper();
          }}
        >
          <Undo2 size={19} aria-hidden="true" /> Peru muutos
        </button>
        <p
          role="status"
          aria-label="Leikekirjan palaute"
          aria-atomic="true"
          className="scrap-feedback"
        >
          {feedback ||
            "Kokeile rohkeasti. Pohjan ja tarrojen vaihtamisen voi aina perua."}
        </p>
      </div>

      <div className="scrap-book-pages">
        <div className="scrap-pages-heading">
          <h3>Kirjan sivut</h3>
          <button
            type="button"
            className="journal-button journal-button-secondary"
            disabled={!ready || busy || document.pages.length >= 24}
            onClick={() => {
              const next = newScrapbookPage(page.layout);
              change((draft) => ({
                ...draft,
                pages: [...draft.pages, next],
                selectedPageId: next.id,
              }));
              setFeedback("Uusi sivu odottaa kuvaa. Aiemmat sivut säilyivät.");
              revealPaper();
            }}
          >
            <Plus size={19} aria-hidden="true" /> Uusi sivu
          </button>
        </div>
        <ol aria-label="Leikekirjan sivut">
          {document.pages.map((item, position) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={!ready || busy}
                aria-current={item.id === page.id ? "page" : undefined}
                aria-label={`Avaa sivu ${position + 1}: ${item.title.trim() || "Oma kuvahetki"}`}
                onClick={() => select(item.id)}
              >
                {item.image ? (
                  <img src={item.image} alt="" width={80} height={60} />
                ) : (
                  <Camera size={24} aria-hidden="true" />
                )}
                <span>Sivu {position + 1}</span>
              </button>
            </li>
          ))}
        </ol>
        <div
          className="scrap-page-actions"
          role="group"
          aria-label="Valitun sivun järjestys"
        >
          <button
            type="button"
            className="book-cover-trial-idea-button"
            disabled={!ready || busy || index === 0}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={18} aria-hidden="true" /> Aikaisemmaksi
          </button>
          <button
            type="button"
            className="book-cover-trial-idea-button"
            disabled={!ready || busy || index === document.pages.length - 1}
            onClick={() => move(1)}
          >
            Myöhemmäksi <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="book-cover-trial-idea-button"
            disabled={!ready || busy}
            onClick={() => {
              change((draft) => {
                const remaining = draft.pages.filter(
                  (item) => item.id !== page.id,
                );
                const pages = remaining.length
                  ? remaining
                  : [newScrapbookPage(page.layout)];
                return {
                  ...draft,
                  pages,
                  selectedPageId: pages[Math.min(index, pages.length - 1)].id,
                };
              });
              setFeedback(
                "Sivu poistettiin kokeilukirjasta. Voit palauttaa sen Peru muutos -painikkeella.",
              );
              revealPaper();
            }}
          >
            Poista tämä sivu
          </button>
        </div>
        <p className="scrap-local-note">
          Kuvat ja leikekirjan luonnos tallennetaan vain tähän selaimeen. JPEG,
          PNG tai WebP, enintään 5 Mt/kuva. Kokeiluun mahtuu 24 sivua. Ne eivät
          siirry kirjautuneen käyttäjän pentukirjaan.
        </p>
      </div>
      <ScrapbookIdeas
        open={ideasOpen}
        onOpenChange={setIdeasOpen}
        selected={page.topic}
        onChoose={(topic) => {
          if (!ready || busy) return;
          if (topic !== page.topic) patch(chooseScrapbookTopic(page, topic));
          ideaChosen.current = true;
          setIdeasOpen(false);
          setFeedback(
            "Kuvausidea valittu. Kuvasi, omat tekstisi ja tapahtumapäivä säilyivät.",
          );
        }}
        onCloseFocus={() => {
          if (ideaChosen.current) revealPaper();
          else ideaOpener.current?.focus();
        }}
      />
    </section>
  );
}
