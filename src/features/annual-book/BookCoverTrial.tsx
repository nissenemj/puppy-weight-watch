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
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowRight,
  BookOpen,
  Check,
  House,
  PawPrint,
  PencilLine,
  Shuffle,
  Trees,
} from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyMishap from "@/assets/puppy-journal-sock.webp";
import puppyAdventure from "@/assets/puppy-journal-lake.webp";
import { BookCoverPreview } from "./BookCoverPreview";
import { BookPalettePicker } from "./BookPalettePicker";
import { GuidedBookTrial } from "./GuidedBookTrial";
import { hasScrapbookContent } from "./scrapbook";
import { useScrapbookDraft } from "./useScrapbookDraft";
import "@/styles/scrapbook-editor.css";
import { formatDay, type AnnualBook, type BookDesign } from "./model";

const LazyBookReader = lazy(() =>
  import("./BookReader").then((module) => ({ default: module.BookReader })),
);
const paletteNames = { forest: "Metsä", lake: "Järvi", berry: "Marja" };
const moments = [
  {
    key: "home",
    label: "Kotipäivä",
    title: "Ensimmäinen ilta kotona",
    icon: House,
    date: "2026-06-03",
    image: puppyHome,
    imageWidth: 1200,
    imageHeight: 800,
    alt: "Kuvitteellinen pentu lepää peitollaan kotona. Tekoälyllä luotu esimerkkikuva.",
    text: "Pieni nenä tutki jokaisen nurkan. Illalla nukahdit peitolle, aivan meidän viereemme.",
    ideas: [
      "Mihin pentu käpertyi ensimmäisenä iltana?",
      "Mikä on pennun lempipaikka kotona?",
      "Millainen on teidän tavallinen, hyvä aamunne?",
    ],
  },
  {
    key: "mishap",
    label: "Kommellus",
    title: "Suuri sukkaseikkailu",
    icon: PawPrint,
    date: "2026-07-03",
    image: puppyMishap,
    imageWidth: 640,
    imageHeight: 585,
    alt: "Piirretty pentu ja löytynyt sukka. Tekoälyllä luotu esimerkkikuvitus.",
    text: "Kadonnut sukka löytyi pedistäsi. Katseesi kertoi, että se oli ollut koko ajan erittäin tärkeässä tehtävässä.",
    ideas: [
      "Mitä pentu on keksinyt kantaa omaan petiinsä?",
      "Mikä pennun ilme saa sinut aina nauramaan?",
      "Mikä pieni kommellus ansaitsee oman otsikon?",
    ],
  },
  {
    key: "adventure",
    label: "Seikkailu",
    title: "Meidän pieni seikkailu",
    icon: Trees,
    date: "2026-09-03",
    image: puppyAdventure,
    imageWidth: 1000,
    imageHeight: 1000,
    alt: "Piirretty pentu järven rannalla. Tekoälyllä luotu esimerkkikuvitus.",
    text: "Löysimme uuden metsäpolun. Sinä tutkit jokaisen lehden, ja minä opin kulkemaan vähän hitaammin.",
    ideas: [
      "Mitä pentu pysähtyi tutkimaan viime retkellä?",
      "Missä kävitte ensimmäistä kertaa yhdessä?",
      "Mikä pieni löytö teki lenkistä seikkailun?",
    ],
  },
] as const;
type MomentKey = (typeof moments)[number]["key"];
type TrialPage = "cover" | "memory" | "guided";

function trialEntry(
  moment: (typeof moments)[number],
  text: string = moment.text,
) {
  return {
    id: `trial-${moment.key}`,
    date: moment.date,
    // Only the home example is a photo. Drawings are not growth comparison photos.
    image: moment.key === "home" ? moment.image : undefined,
    caption: `${moment.title}.\n${text}`,
    mishap: moment.key === "mishap",
  };
}

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
      <p>Esimerkkiaukeamaa ei saatu ladattua. Voit jatkaa kannen kokeilua.</p>
      <a href="/muistokirja" className="journal-text-link">
        Avaa esimerkkikirja omalla sivulla
      </a>
    </div>
  );
}

export function BookCoverTrial() {
  const id = useId();
  const scrapbook = useScrapbookDraft();
  const { puppyName, palette } = scrapbook.document;
  const setPuppyName = (value: string) =>
    scrapbook.change((draft) => ({ ...draft, puppyName: value }), "puppy-name");
  const setPalette = (value: BookDesign["palette"]) =>
    scrapbook.change((draft) => ({ ...draft, palette: value }));
  const [trialPage, setTrialPage] = useState<TrialPage>("cover");
  const [momentKey, setMomentKey] = useState<MomentKey>("home");
  const [drafts, setDrafts] = useState<Partial<Record<MomentKey, string>>>({});
  const [ideas, setIdeas] = useState<Partial<Record<MomentKey, number>>>({});
  const [keepsakes, setKeepsakes] = useState<
    Partial<Record<MomentKey, string>>
  >({});
  const [feedback, setFeedback] = useState("");
  const [stamp, setStamp] = useState(0);
  const guidedTab = useRef<HTMLButtonElement>(null);
  const scrapbookPages = useMemo(
    () => scrapbook.document.pages.filter(hasScrapbookContent),
    [scrapbook.document.pages],
  );
  useEffect(() => {
    if (
      scrapbook.restored &&
      scrapbook.document.pages.some(hasScrapbookContent)
    )
      setTrialPage("guided");
  }, [scrapbook.restored, scrapbook.document.pages]);
  const memoryPreview = useRef<HTMLDivElement>(null);
  const [showReader, setShowReader] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const name = puppyName.trim() || "Oma pentu";
  const moment = moments.find((item) => item.key === momentKey)!;
  const draft = drafts[momentKey] ?? "";
  const caption = draft.trim() || moment.text;
  const collectedCount = Object.keys(keepsakes).length;
  const isCollected = keepsakes[momentKey] === caption;
  const design: BookDesign = useMemo(
    () => ({
      title: "Pennun ensimmäinen vuosi",
      palette,
      coverArt: "illustration",
      letter: "",
    }),
    [palette],
  );
  // Public scrapbook pages are local browser data, separate from signed-in books.
  const book: AnnualBook = useMemo(
    () => ({
      bookId: "00000000-0000-4000-8000-000000000002",
      puppyName: name,
      start: "2026-04-01",
      end: "2027-03-31",
      design,
      entries: collectedCount
        ? moments.flatMap((item) =>
            keepsakes[item.key] === undefined
              ? []
              : [trialEntry(item, keepsakes[item.key])],
          )
        : scrapbookPages.length
          ? []
          : [trialEntry(moments[0]), trialEntry(moments[2])],
      weights: [],
    }),
    [name, design, collectedCount, keepsakes, scrapbookPages.length],
  );
  const readerLabel = scrapbookPages.length
    ? "Selaa kokeilukirjaa"
    : "Katso esimerkkiaukeamaa";

  return (
    <section
      id="kokeile-kantta"
      className="book-cover-trial"
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <div className="book-cover-trial-heading">
        <h2 id={`${id}-title`}>Kokeile kantta pennun nimellä.</h2>
        <p className="book-cover-trial-lead">
          Ota kuva, kokeile sivupohjia ja koristele oma sivu. Leikekirjan
          luonnos säilyy tässä selaimessa.
        </p>
      </div>
      {scrapbook.error && trialPage !== "guided" && (
        <p role="alert" className="book-cover-trial-error">
          {scrapbook.error}{" "}
          <button
            type="button"
            className="journal-text-link"
            onClick={() => setTrialPage("guided")}
          >
            Avaa leikekirjan tallennusvalinnat
          </button>
        </p>
      )}
      <Tabs.Root
        value={trialPage}
        onValueChange={(value) => setTrialPage(value as TrialPage)}
        className="book-cover-trial-tabs"
      >
        <Tabs.List
          aria-label="Kokeilukirjan sivut"
          className="book-cover-trial-tablist"
        >
          <Tabs.Trigger value="cover" className="book-cover-trial-tab">
            <BookOpen size={18} aria-hidden="true" /> Kansi
          </Tabs.Trigger>
          <Tabs.Trigger value="memory" className="book-cover-trial-tab">
            <PencilLine size={18} aria-hidden="true" /> Ensimmäinen hetki
          </Tabs.Trigger>
          <Tabs.Trigger
            ref={guidedTab}
            value="guided"
            className="book-cover-trial-tab"
          >
            <PawPrint size={18} aria-hidden="true" /> Leikekirja
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="cover" className="book-cover-trial-panel">
          <div className="book-cover-trial-controls">
            <label className="book-cover-trial-label" htmlFor={`${id}-name`}>
              Pennun nimi
            </label>
            <input
              id={`${id}-name`}
              name="cover-trial-puppy-name"
              type="text"
              value={puppyName}
              maxLength={40}
              disabled={
                scrapbook.mode === "loading" || scrapbook.mode === "blocked"
              }
              autoComplete="off"
              placeholder="Pennun nimi…"
              aria-describedby={`${id}-name-hint`}
              onChange={(event) => setPuppyName(event.target.value)}
              onBlur={scrapbook.finishEdit}
            />
            <p id={`${id}-name-hint`} className="book-cover-trial-hint">
              Nimi vaihtuu kanteen heti. Enintään 40 merkkiä.
            </p>
            <p className="book-cover-trial-label">Kansiväri</p>
            <BookPalettePicker value={palette} onChange={setPalette} />
            <p
              role="status"
              aria-label="Kansiväri"
              className="book-cover-trial-hint"
            >
              Valittu kansiväri: {paletteNames[palette]}.
            </p>
            <button
              type="button"
              className="journal-button book-cover-trial-open"
              onClick={() => {
                setTrialPage("guided");
                guidedTab.current?.focus();
              }}
            >
              Aloita kirja kuvasta <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
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
        </Tabs.Content>
        <Tabs.Content value="memory" className="book-cover-trial-panel">
          <form
            className="book-cover-trial-controls"
            onSubmit={(event) => {
              event.preventDefault();
              const count =
                collectedCount + (keepsakes[momentKey] === undefined ? 1 : 0);
              setKeepsakes((current) => ({ ...current, [momentKey]: caption }));
              setStamp((current) => current + 1);
              setPageIndex(1);
              setFeedback(
                `${moment.label}: hetki ${keepsakes[momentKey] === undefined ? "lisätty" : "päivitetty"} kokeilukirjaan. Kirjassa on ${count} ${count === 1 ? "hetki" : "hetkeä"}.`,
              );
              if (window.matchMedia("(max-width: 899px)").matches) {
                memoryPreview.current?.focus({ preventScroll: true });
                memoryPreview.current?.scrollIntoView({
                  block: "start",
                  behavior: "instant",
                });
              }
            }}
          >
            <fieldset className="book-cover-trial-moments">
              <legend className="book-cover-trial-label">
                Millainen hetki?
              </legend>
              <div className="book-cover-trial-moment-options">
                {moments.map(({ key, label, icon: Icon }) => (
                  <label key={key} className="book-cover-trial-moment">
                    <input
                      type="radio"
                      name={`${id}-moment`}
                      value={key}
                      checked={momentKey === key}
                      onChange={() => setMomentKey(key)}
                    />
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    <span>{label}</span>
                    <Check
                      size={14}
                      className="book-cover-trial-moment-check"
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="book-cover-trial-idea">
              <p
                id={`${id}-idea`}
                role="status"
                aria-label="Kirjoitusidea"
                aria-atomic="true"
              >
                {moment.ideas[(ideas[momentKey] ?? 0) % moment.ideas.length]}
              </p>
              <button
                type="button"
                className="book-cover-trial-idea-button"
                onClick={() =>
                  setIdeas((current) => ({
                    ...current,
                    [momentKey]: (current[momentKey] ?? 0) + 1,
                  }))
                }
              >
                <Shuffle size={16} aria-hidden="true" /> Vaihda kirjoitusideaa
              </button>
            </div>
            <label className="book-cover-trial-label" htmlFor={`${id}-memory`}>
              Yksi lause teistä
            </label>
            <textarea
              id={`${id}-memory`}
              name="cover-trial-memory"
              value={draft}
              maxLength={180}
              rows={3}
              autoComplete="off"
              placeholder="Se pieni hetki, jonka haluat muistaa…"
              aria-describedby={`${id}-idea ${id}-memory-hint ${id}-privacy`}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [momentKey]: event.target.value,
                }))
              }
            />
            <p id={`${id}-memory-hint`} className="book-cover-trial-hint">
              {draft.length}/180 merkkiä. Tyhjä kenttä käyttää esimerkkitekstiä.{" "}
              Kokeiluteksti ei tallennu omaan pentukirjaan.
            </p>
            <button
              type="submit"
              className="journal-button book-cover-trial-collect"
            >
              <PawPrint size={19} aria-hidden="true" />
              {keepsakes[momentKey] === undefined
                ? "Poimi hetki kirjaan"
                : "Päivitä hetki kirjassa"}
            </button>
            <p
              role="status"
              aria-label="Kokeilun palaute"
              aria-atomic="true"
              className="book-cover-trial-feedback"
            >
              {feedback || "Kokeile omia sanoja tai poimi valmis esimerkki."}
            </p>
          </form>
          <div
            ref={memoryPreview}
            tabIndex={-1}
            className={`book-cover-trial-preview book-cover-trial-memory annual-palette-${palette}`}
            role="region"
            aria-label="Muiston esikatselu"
          >
            <figure className="book-cover-trial-sheet">
              <p className="book-cover-trial-owner">
                {name} · Pennun ensimmäinen vuosi
              </p>
              <img
                src={moment.image}
                width={moment.imageWidth}
                height={moment.imageHeight}
                alt={moment.alt}
                loading="lazy"
                decoding="async"
                className={
                  momentKey === "home"
                    ? "book-cover-trial-photo"
                    : "book-cover-trial-drawing"
                }
              />
              <figcaption>
                <p className="book-cover-trial-date">
                  Esimerkkipäivä {formatDay(moment.date)}
                </p>
                <h3>{moment.title}</h3>
                <p className="book-cover-trial-caption">{caption}</p>
              </figcaption>
              <div className="book-cover-trial-stamp-slot">
                {isCollected ? (
                  <span key={stamp} className="book-cover-trial-stamp">
                    <PawPrint size={22} aria-hidden="true" /> Hetki poimittu{" "}
                    <Check size={16} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="book-cover-trial-paper-note">
                    Pieni hetki. Oma sivu.
                  </span>
                )}
              </div>
            </figure>
            <a
              href={`#${id}-memory`}
              className="book-cover-trial-return book-landing-text-link"
            >
              Palaa kirjoittamaan
            </a>
          </div>
        </Tabs.Content>
        <Tabs.Content
          forceMount
          value="guided"
          className="book-cover-trial-panel"
        >
          <GuidedBookTrial controller={scrapbook} />
        </Tabs.Content>
      </Tabs.Root>
      <div className="book-cover-trial-footer">
        <div className="book-cover-trial-actions">
          {showReader ? (
            <ErrorBoundary fallback={CoverReaderUnavailable}>
              <Suspense
                fallback={
                  <p role="status" className="book-cover-trial-loading">
                    Avataan esimerkkiaukeamaa…
                  </p>
                }
              >
                <LazyBookReader
                  book={book}
                  pageIndex={pageIndex}
                  onPageChange={setPageIndex}
                  canPrint={scrapbookPages.length > 0}
                  scrapbookPages={scrapbookPages}
                  triggerLabel={readerLabel}
                  initiallyOpen
                  notice={
                    scrapbookPages.length
                      ? "Kokeilukirja tämän selaimen luonnoksesta. Omien kuvien tapahtumapäiviä ei päätellä. Esimerkkikuvat on merkitty erikseen."
                      : collectedCount
                        ? "Kokeilukirja. Kuvat ja päivämäärät ovat kuvitteellisia; mukana on myös kokeilussa lisäämäsi teksti."
                        : "Esimerkin kuvat, päivämäärät ja tarinat ovat kuvitteellisia."
                  }
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <button
              type="button"
              className="journal-button journal-button-secondary"
              onClick={() => setShowReader(true)}
            >
              <BookOpen size={18} aria-hidden="true" /> {readerLabel}
            </button>
          )}
          <Link to="/puppy-book" className="journal-button">
            Aloita oma pentukirja <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <p id={`${id}-privacy`} className="book-cover-trial-disclosure">
          Kokeilu toimii ilman kirjautumista. Leikekirjan kuvat, tekstit ja
          kansivalinnat tallentuvat tähän selaimeen. Ensimmäinen hetki
          -välilehden kokeilu tyhjenee sivun päivityksessä. Kokeilut eivät
          siirry kirjautuneen käyttäjän pentukirjaan. Esimerkkikuvat ja kuvitus
          on luotu tekoälyllä.
        </p>
      </div>
    </section>
  );
}
