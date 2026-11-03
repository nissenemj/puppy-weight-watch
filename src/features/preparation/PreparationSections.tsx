import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, ImagePlus, House, Undo2 } from "lucide-react";
import {
  PUPPY_IMAGE_ACCEPT,
  validatePuppyImage,
} from "@/services/puppyBookStorage";
import { encodeBookImage } from "../annual-book/imageEncoding";
import { ScrapbookPageContent } from "../annual-book/ScrapbookPage";
import { documentStyles } from "../annual-book/documentStyles";
import { HOME_CHECKS, FAMILY_ROLES } from "./model";
import { addPreparationToBook } from "./addToBook";
import {
  preparationReady,
  togglePreparation,
  type PreparationController,
} from "./usePreparation";
import "@/styles/preparation-guide.css";

type Props = { controller: PreparationController };
export function PreparationStatus({ controller }: Props) {
  const mode = controller.mode;
  return (
    <div className="preparation-save">
      <p
        role="status"
        aria-label="Valmistautumisen tallennus"
        aria-live="polite"
      >
        {mode === "loading"
          ? "Avataan valmistautumislistaa…"
          : mode === "blocked"
            ? "Tallennettua valmistautumista ei saatu avattua."
            : mode === "session"
              ? "Kertakokeilu. Muutokset eivät säily sivun päivityksessä."
              : controller.error
                ? "Viimeiset muutokset eivät ole tallessa."
                : controller.isSaved
                  ? "Valmistelut tallentuvat automaattisesti tähän selaimeen."
                  : "Tallennetaan valmisteluja tähän selaimeen…"}
      </p>
      <p className="preparation-note">
        Voit palata jatkamaan samalla laitteella ja selaimella. Tiedot ja kuvat
        pysyvät tässä selaimessa.
      </p>
      {controller.error && (
        <div role="alert" className="preparation-error">
          <p>{controller.error}</p>
          {controller.hasConflict && (
            <p>
              Viimeiset muutoksesi näkyvät vielä tässä näkymässä. Tallennetun
              version avaaminen vaihtaa näkymän siihen.
            </p>
          )}
          <button
            type="button"
            className="journal-button journal-button-secondary"
            onClick={
              controller.hasConflict || mode === "blocked"
                ? () => void controller.reload()
                : controller.retry
            }
          >
            {controller.hasConflict || mode === "blocked"
              ? "Avaa tallennettu versio"
              : "Yritä tallennusta uudelleen"}
          </button>
          {mode === "blocked" && (
            <button
              type="button"
              className="journal-text-link"
              onClick={controller.continueWithoutSaving}
            >
              Jatka kertakokeiluna
            </button>
          )}
        </div>
      )}
      {controller.canUndo && (
        <button
          type="button"
          className="journal-text-link"
          disabled={!preparationReady(controller)}
          onClick={controller.undo}
        >
          <Undo2 size={16} aria-hidden="true" /> Peru viimeisin muutos
        </button>
      )}
    </div>
  );
}

export function PreparationHome({ controller }: Props) {
  const id = useId();
  const ready = preparationReady(controller);
  const count = HOME_CHECKS.filter((item) =>
    controller.document.checked.includes(item.id),
  ).length;
  return (
    <div className="preparation-home-grid">
      <section
        id="kotikierros"
        className="journal-section journal-anchor preparation-section"
        aria-labelledby="home-check-title"
        tabIndex={-1}
      >
        <div className="journal-section-heading">
          <div>
            <h2 id="home-check-title">Koti pennun korkeudelta</h2>
            <p>
              Käy koti läpi huone kerrallaan. Voit katsoa myös puhelimen
              kameralla. Aikuinen tekee turvallisuustarkistukset.
            </p>
          </div>
          <p
            className="journal-count"
            role="status"
            aria-label="Kotikierroksen edistyminen"
          >
            {count}/{HOME_CHECKS.length} tarkistettu
          </p>
        </div>
        <div className="starter-checklist">
          {HOME_CHECKS.map((item) => (
            <label
              className={`starter-item ${controller.document.checked.includes(item.id) ? "starter-item-checked" : ""}`}
              key={item.id}
            >
              <input
                type="checkbox"
                name={item.id}
                disabled={!ready}
                checked={controller.document.checked.includes(item.id)}
                onChange={(event) =>
                  togglePreparation(controller, item.id, event.target.checked)
                }
                aria-label={item.title}
              />
              <span>
                <strong>{item.title}</strong>
                <span className="starter-detail">{item.detail}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="preparation-note">
          Lista auttaa huomaamaan asioita. Tarkista järjestelyt uudelleen, kun
          opit tuntemaan oman pentusi.
        </p>
      </section>
      <section
        id="perheen-arki"
        className="journal-section journal-anchor preparation-family"
        aria-labelledby="family-title"
        tabIndex={-1}
      >
        <h2 id="family-title">Meidän perheen arki</h2>
        <p>
          Sopikaa muutama käytännön asia. Yksikin nimi tai lyhyt sopimus
          riittää. Näitä tietoja ei lisätä kirjasivulle.
        </p>
        {FAMILY_ROLES.map((role) => (
          <div className="preparation-field" key={role.key}>
            <label htmlFor={`${id}-${role.key}`}>{role.label}</label>
            <input
              id={`${id}-${role.key}`}
              name={`preparation-${role.key}`}
              type="text"
              autoComplete="off"
              maxLength={100}
              placeholder={role.placeholder}
              disabled={!ready}
              value={controller.document.family[role.key]}
              onBlur={controller.finishEdit}
              onChange={(event) =>
                controller.change(
                  (draft) => ({
                    ...draft,
                    family: { ...draft.family, [role.key]: event.target.value },
                  }),
                  `family-${role.key}`,
                )
              }
            />
          </div>
        ))}
        <p className="preparation-note">
          Kaikkia kohtia ei tarvitse täyttää. Suunnitelmaa voi täydentää myös
          pennun jo kotiuduttua.
        </p>
      </section>
    </div>
  );
}

export function PreparationMemory({ controller }: Props) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const continueLink = useRef<HTMLAnchorElement>(null);
  const revealPhoto = useRef(false);
  const alive = useRef(false);
  const sequence = useRef(0);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [bookBusy, setBookBusy] = useState(false);
  const [bookError, setBookError] = useState("");
  const [bookResult, setBookResult] = useState<string | null>(null);
  const ready = preparationReady(controller);
  const busy = photoBusy || bookBusy;
  const memory = controller.document.memory;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      sequence.current += 1;
    };
  }, []);
  useEffect(() => {
    if (!memory.image || photoBusy || !revealPhoto.current) return;
    revealPhoto.current = false;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      paper.current?.focus({ preventScroll: true });
      paper.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [memory.image, photoBusy]);
  useEffect(() => {
    if (bookResult) continueLink.current?.focus();
  }, [bookResult]);

  async function loadPhoto(file?: File) {
    if (!file || !ready || busy) return;
    const invalid = validatePuppyImage(file);
    if (invalid) {
      setPhotoError(invalid);
      return;
    }
    const ticket = ++sequence.current;
    const url = URL.createObjectURL(file);
    setPhotoBusy(true);
    setPhotoError("");
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (!alive.current || ticket !== sequence.current) return;
      const encoded = encodeBookImage(image);
      revealPhoto.current = true;
      controller.change((draft) => ({
        ...draft,
        memory: {
          ...draft.memory,
          image: encoded,
          imageSource: "own",
          imageDescription: "",
        },
      }));
    } catch {
      if (alive.current && ticket === sequence.current)
        setPhotoError(
          "Kuvaa ei voitu avata. Valitse toinen JPEG-, PNG- tai WebP-kuva. Aiempi kuvasi säilyi.",
        );
    } finally {
      URL.revokeObjectURL(url);
      if (alive.current && ticket === sequence.current) setPhotoBusy(false);
    }
  }

  async function addToBook() {
    if (!ready || busy || !memory.image || controller.mode !== "ready") return;
    setBookBusy(true);
    setBookError("");
    try {
      if (!(await controller.save()))
        throw new Error(
          "Valmistelut eivät vielä tallentuneet. Yritä tallennusta uudelleen ennen kirjaan lisäämistä.",
        );
      const result = await addPreparationToBook(memory);
      if (alive.current)
        setBookResult(
          result.alreadyAdded
            ? "Tämä sivu löytyy jo kirjaluonnoksesta. Jatka sen muokkaamista kirjassa."
            : "Kuvasivu on nyt tämän selaimen kirjaluonnoksessa. Voit jatkaa sen muokkaamista kirjassa.",
        );
    } catch (cause) {
      if (alive.current)
        setBookError(
          cause instanceof Error
            ? cause.message
            : "Sivua ei saatu lisättyä kirjaan. Yritä uudelleen. Valmistelukuvasi säilyi.",
        );
    } finally {
      if (alive.current) setBookBusy(false);
    }
  }

  return (
    <section
      id="ensimmainen-sivu"
      className="journal-section journal-anchor preparation-memory"
      aria-labelledby="preparation-memory-title"
      tabIndex={-1}
    >
      <div className="preparation-memory-intro">
        <p className="journal-kicker">
          <House size={18} aria-hidden="true" /> Ensimmäinen muisto syntyy jo
          odottaessa
        </p>
        <h2 id="preparation-memory-title">Täällä sinua odotettiin</h2>
        <p>
          Kuvaa valmiiksi tehty lepopaikka tai oma pieni pentunurkka. Lapsen
          kanssa voitte piirtää tervetulokyltin ja ottaa siitä kuvan.
        </p>
        <p>
          Kuva riittää. Muutaman oman sanan voi kirjoittaa suoraan kirjasivulle.
        </p>
        <div
          className="preparation-photo-actions"
          role="group"
          aria-label="Valmistelukuva"
          aria-busy={photoBusy}
        >
          <button
            type="button"
            className="journal-button"
            disabled={!ready || busy}
            onClick={() => camera.current?.click()}
          >
            <Camera size={19} aria-hidden="true" /> Ota kuva
          </button>
          <button
            type="button"
            className="journal-button journal-button-secondary"
            disabled={!ready || busy}
            onClick={() => picker.current?.click()}
          >
            <ImagePlus size={19} aria-hidden="true" />{" "}
            {memory.image ? "Vaihda kuva" : "Valitse kuva"}
          </button>
        </div>
        <input
          hidden
          ref={picker}
          type="file"
          name="preparation-photo"
          accept={PUPPY_IMAGE_ACCEPT}
          onChange={(event) => {
            void loadPhoto(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <input
          hidden
          ref={camera}
          type="file"
          name="preparation-camera"
          capture="environment"
          accept={PUPPY_IMAGE_ACCEPT}
          onChange={(event) => {
            void loadPhoto(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <p className="preparation-note">
          JPEG, PNG tai WebP, enintään 5 Mt. Kuva käsitellään ja tallennetaan
          tässä selaimessa.
        </p>
        {photoBusy && <p role="status">Valmistellaan kuvaa kirjasivulle…</p>}
        {photoError && (
          <p role="alert" className="preparation-error">
            {photoError}
          </p>
        )}
      </div>
      {memory.image ? (
        <div
          className="annual-document annual-palette-lake preparation-memory-preview"
          role="region"
          aria-label="Valmistelukuvan kirjasivu"
          ref={paper}
          tabIndex={-1}
        >
          <style>{documentStyles}</style>
          <article className="annual-sheet annual-page-scrapbook">
            <header>
              <p className="annual-kicker">Näin odotimme sinua</p>
              <h3>{memory.title}</h3>
            </header>
            <ScrapbookPageContent
              page={memory}
              editor={{
                onChange: (patch, group) =>
                  controller.change(
                    (draft) => ({
                      ...draft,
                      memory: { ...draft.memory, ...patch },
                    }),
                    group ? `memory-${group}` : undefined,
                  ),
                onFinish: controller.finishEdit,
                onCamera: () => camera.current?.click(),
                showQuote: false,
                disabled: !ready || busy,
              }}
            />
            <p className="annual-footer">Oman kirjasivusi esikatselu</p>
          </article>
        </div>
      ) : (
        <div className="preparation-memory-empty">
          <Camera size={42} strokeWidth={1.3} aria-hidden="true" />
          <p>Tähän syntyy ensimmäinen kirjasivusi.</p>
          <span>Aloita yhdestä omasta kuvasta.</span>
        </div>
      )}
      <div className="preparation-memory-options">
        <details className="preparation-photo-details">
          <summary>Päivä ja kuvan kuvaus (valinnaiset)</summary>
          <div className="preparation-field">
            <label htmlFor={`${id}-date`}>Tapahtumapäivä (valinnainen)</label>
            <input
              id={`${id}-date`}
              name="preparation-date"
              type="date"
              disabled={!ready || busy}
              value={memory.date}
              onBlur={controller.finishEdit}
              onChange={(event) =>
                controller.change(
                  (draft) => ({
                    ...draft,
                    memory: { ...draft.memory, date: event.target.value },
                  }),
                  "memory-date",
                )
              }
            />
          </div>
          <div className="preparation-field">
            <label htmlFor={`${id}-description`}>
              Kuvan kuvaus ruudunlukijalle (valinnainen)
            </label>
            <input
              id={`${id}-description`}
              name="preparation-description"
              type="text"
              autoComplete="off"
              maxLength={180}
              disabled={!ready || busy}
              value={memory.imageDescription}
              onBlur={controller.finishEdit}
              onChange={(event) =>
                controller.change(
                  (draft) => ({
                    ...draft,
                    memory: {
                      ...draft.memory,
                      imageDescription: event.target.value,
                    },
                  }),
                  "memory-description",
                )
              }
            />
          </div>
        </details>
        <div className="preparation-transfer" aria-busy={bookBusy}>
          <p id={`${id}-copy-hint`} className="preparation-note">
            Lisäät sivun tämän selaimen kirjaluonnokseen. Mukaan tulevat kuva,
            omat sanat ja päivä. Jatka kirjasivun muokkaamista sen jälkeen
            kirjassa. Tarkistuslistat ja perheen työnjako pysyvät tässä
            oppaassa.
          </p>
          {!bookResult && (
            <button
              type="button"
              className="journal-button"
              disabled={
                !memory.image || !ready || busy || controller.mode !== "ready"
              }
              onClick={() => void addToBook()}
              aria-describedby={`${id}-copy-hint`}
            >
              {bookBusy ? "Lisätään kirjaan…" : "Lisää kuvasivu pentukirjaan"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
          {bookError && (
            <p role="alert" className="preparation-error">
              {bookError}
            </p>
          )}
          {bookResult && (
            <>
              <p role="status">{bookResult}</p>
              <Link
                className="journal-button"
                to="/puppy-book-landing#kokeile-kantta"
                ref={continueLink}
              >
                Jatka kirjan muokkaamista{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
