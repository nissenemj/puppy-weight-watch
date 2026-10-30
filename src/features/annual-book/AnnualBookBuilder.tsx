import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Check, RefreshCw } from "lucide-react";
import type { PuppyBook } from "@/types/dog";
import { AnnualBookPreview } from "./AnnualBookPreview";
import { PrintBookButton } from "./PrintBookButton";
import { loadBookSources, type DraftMemory } from "./sources";
import { loadBookImage } from "./images";
import { makeDraftData, restoreDraftMemories, type DraftSeed } from "./draft";
import { loadAnnualDraft } from "./draftStorage";
import { useDraftAutosave } from "./useDraftAutosave";
import { BookDesignFields } from "./BookDesignFields";
import { BookIdeas } from "./BookIdeas";
import { BookGrowthChart } from "./BookGrowthChart";
import {
  annualBookSchema,
  day,
  firstYearEnd,
  formatDay,
  type AnnualBook,
  DEFAULT_BOOK_DESIGN,
  type BookDesign,
} from "./model";

export default function AnnualBookBuilder({
  book,
  userId,
}: {
  book: PuppyBook;
  userId: string;
}) {
  const [memories, setMemories] = useState<DraftMemory[]>([]);
  const [weights, setWeights] = useState<AnnualBook["weights"]>([]);
  const [weightNotice, setWeightNotice] = useState("");
  const [includeWeights, setIncludeWeights] = useState(true);
  const [design, setDesign] = useState<BookDesign>({ ...DEFAULT_BOOK_DESIGN });
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [memoryNotice, setMemoryNotice] = useState("");
  const sourceRefresh = useRef<AbortController | null>(null);
  const [name, setName] = useState(book.title.slice(0, 40));
  const [start, setStart] = useState(
    book.birth_date && day.safeParse(book.birth_date).success
      ? book.birth_date
      : "",
  );
  const [end, setEnd] = useState(firstYearEnd(start));
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState<AnnualBook | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [seed, setSeed] = useState<DraftSeed | null>(null);
  const defaults = useRef({
    puppyName: book.title.slice(0, 40),
    start:
      book.birth_date && day.safeParse(book.birth_date).success
        ? book.birth_date
        : "",
  });
  const [restoreNotice, setRestoreNotice] = useState("");
  const [confirmReload, setConfirmReload] = useState(false);
  const draftData = useMemo(
    () => makeDraftData(name, start, end, includeWeights, memories, design),
    [name, start, end, includeWeights, memories, design],
  );
  const autosave = useDraftAutosave(book.id, userId, draftData, seed);
  const heading = useRef<HTMLHeadingElement>(null);
  const designSection = useRef<HTMLFieldSetElement>(null);
  const memorySection = useRef<HTMLFieldSetElement>(null);
  const assembleButton = useRef<HTMLButtonElement>(null);
  const focusSection = (element: HTMLElement | null) => {
    element?.focus();
    element?.scrollIntoView({ block: "start", behavior: "auto" });
  };
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const hasDraft = autosave.hasUnsavedChanges;
  const blocker = useBlocker(hasDraft);
  useEffect(() => {
    if (blocker.state === "blocked" && !hasDraft) blocker.proceed();
  }, [blocker, hasDraft]);
  useEffect(() => {
    if (!hasDraft) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasDraft]);
  useEffect(() => {
    if (error) errorMessage.current?.focus();
  }, [error]);
  useEffect(() => {
    if (preview) heading.current?.focus();
  }, [preview]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      sourceRefresh.current?.abort();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    sourceRefresh.current?.abort();
    setRefreshing(false);
    setRefreshError("");
    setMemoryNotice("");
    setLoading(true);
    setLoadError("");
    setSeed(null);
    loadBookSources(book.id, userId, controller.signal)
      .then(async (source) => {
        const saved = await loadAnnualDraft(book.id, userId, controller.signal);
        if (controller.signal.aborted) return;
        const restored = saved
          ? restoreDraftMemories(source.memories, saved.data)
          : { memories: source.memories, missing: 0 };
        const initial =
          saved?.data ??
          makeDraftData(
            defaults.current.puppyName,
            defaults.current.start,
            firstYearEnd(defaults.current.start),
            true,
            source.memories,
          );
        setName(initial.puppyName);
        setStart(initial.start);
        setEnd(initial.end);
        setIncludeWeights(initial.includeWeights);
        setDesign(initial.design);
        setMemories(restored.memories);
        setSeed({
          data: makeDraftData(
            initial.puppyName,
            initial.start,
            initial.end,
            initial.includeWeights,
            restored.memories,
            initial.design,
          ),
          revision: saved?.revision ?? 0,
          updatedAt: saved?.updatedAt ?? null,
        });
        setRestoreNotice(
          restored.missing
            ? "Osa aiemmista muistoista ei ole enää saatavilla tässä kirjassa. Muut valinnat ja tapahtumapäivät palautettiin."
            : "",
        );
        setPreview(null);
        setDirty(false);
        setError("");
        setWeights(source.weights);
        setWeightNotice(source.weightNotice);
        setTruncated(source.truncated);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setLoadError(
            cause instanceof Error
              ? cause.message
              : "Kirjan tietoja ei voitu ladata.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [book.id, userId, attempt]);

  const refreshMemories = async () => {
    sourceRefresh.current?.abort();
    const controller = new AbortController();
    sourceRefresh.current = controller;
    setRefreshing(true);
    setRefreshError("");
    try {
      const source = await loadBookSources(book.id, userId, controller.signal);
      if (controller.signal.aborted) return;
      setMemories((current) => {
        const choices = new Map(current.map((memory) => [memory.id, memory]));
        return source.memories.map((memory) => {
          const previous = choices.get(memory.id);
          return previous
            ? {
                ...memory,
                date: previous.date,
                included: previous.included,
                mishap: previous.mishap,
              }
            : memory;
        });
      });
      setWeights(source.weights);
      setWeightNotice(source.weightNotice);
      setTruncated(source.truncated);
      setDirty(true);
      setMemoryNotice(
        source.truncated
          ? "Muisto tallennettiin Muistot-osioon. Tässä näkyvät 200 vanhinta muistoa."
          : "Muisto lisätty. Valitse se alta kirjaan ja anna tapahtumapäivä. Aiemmat valintasi säilyivät.",
      );
    } catch {
      if (!controller.signal.aborted)
        setRefreshError(
          "Muisto tallentui, mutta päivitettyä muistolistaa ei voitu ladata. Yritä listan päivitystä uudelleen.",
        );
    } finally {
      if (!controller.signal.aborted) setRefreshing(false);
    }
  };

  const changeMemory = (id: string, patch: Partial<DraftMemory>) =>
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, ...patch } : memory,
      ),
    );
  const chosen = memories.filter((memory) => memory.included);
  const dated = chosen.filter(
    (memory) =>
      day.safeParse(memory.date).success &&
      memory.date >= start &&
      memory.date <= end,
  ).length;
  const periodWeights = weights.filter(
    (weight) => weight.date >= start && weight.date <= end,
  );
  const coverPhoto =
    chosen
      .filter(
        (memory) =>
          memory.content_type === "image" &&
          memory.content_url &&
          day.safeParse(memory.date).success &&
          memory.date >= start &&
          memory.date <= end,
      )
      .sort((a, b) => a.date.localeCompare(b.date))[0]?.content_url ??
    undefined;
  const assemble = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!chosen.length) {
      setError("Valitse kirjaan vähintään yksi muisto.");
      return;
    }
    const draft = {
      bookId: book.id,
      puppyName: name,
      start,
      end,
      design,
      entries: chosen.map((memory) => ({
        id: memory.id,
        date: memory.date,
        caption: memory.caption ?? "",
        mishap: memory.mishap,
      })),
      weights: includeWeights ? weights : [],
    };
    const checked = annualBookSchema.safeParse(draft);
    if (!checked.success) {
      setError(checked.error.issues[0]?.message ?? "Tarkista kirjan tiedot.");
      return;
    }
    setWorking(true);
    try {
      const entries = [];
      // Serial downloads keep peak memory modest on a phone. An inaccessible image blocks export.
      for (const memory of chosen) {
        const entry = checked.data.entries.find(
          (item) => item.id === memory.id,
        )!;
        const image =
          memory.content_type === "image" && memory.content_url
            ? await loadBookImage(memory.content_url)
            : undefined;
        if (!mounted.current) return;
        if (memory.content_type === "image" && !image)
          throw new Error(
            "Yhdeltä kuvamuistolta puuttuu kuva. Poista se valinnasta tai korjaa kuva Muistot-osiossa.",
          );
        if (memory.content_type !== "image" && !entry.caption.trim())
          throw new Error(
            "Yksi valituista muistoista on tyhjä. Lisää siihen teksti Muistot-osiossa tai poista se valinnasta.",
          );
        entries.push({ ...entry, image });
      }
      if (!mounted.current) return;
      setPreview(annualBookSchema.parse({ ...checked.data, entries }));
      setDirty(false);
      setPageIndex(0);
    } catch (cause) {
      if (mounted.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Kirjan kokoaminen epäonnistui. Yritä uudelleen.",
        );
    } finally {
      if (mounted.current) setWorking(false);
    }
  };

  return (
    <section className="annual-builder" aria-labelledby="annual-builder-title">
      <header className="annual-builder-intro">
        <div>
          <h2 id="annual-builder-title">Teidän näköinen pentuvuosi.</h2>
          <p>
            Valitse muistot ja kokoa pentuvuosi omaksi kirjaksi. Voit jatkaa
            myöhemmin.
          </p>
        </div>
      </header>
      {loading ? (
        <p role="status">Ladataan kirjan muistoja…</p>
      ) : loadError ? (
        <div role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            className="journal-button journal-button-secondary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            <RefreshCw size={16} aria-hidden="true" /> Yritä uudelleen
          </button>
        </div>
      ) : (
        <>
          <div className="annual-save-status">
            <p role="status" aria-live="polite" aria-atomic="true">
              {autosave.phase === "saving"
                ? "Tallennetaan luonnosta…"
                : autosave.phase === "offline"
                  ? "Ei verkkoyhteyttä. Muutokset tallennetaan yhteyden palattua. Pidä tämä näkymä auki."
                  : autosave.phase === "error" || autosave.phase === "conflict"
                    ? autosave.message
                    : autosave.hasUnsavedChanges
                      ? "Muutoksia tallentamatta…"
                      : autosave.updatedAt
                        ? "Tallennettu. Voit palata jatkamaan tätä kirjaa myöhemmin."
                        : "Valinnat tallentuvat automaattisesti, kun muokkaat kirjaa."}
            </p>
            <details className="annual-draft-help">
              <summary>Miten tallennus toimii?</summary>
              <p className="annual-draft-note">
                Valinnat, kirje ja tapahtumapäivät tallentuvat yksityiseen
                luonnokseen. Odota Tallennettu-viestiä ennen poistumista.
                Alkuperäiset muistot eivät muutu.
              </p>
            </details>
            {autosave.phase === "error" && (
              <button
                type="button"
                className="journal-button journal-button-secondary"
                onClick={autosave.retry}
              >
                Yritä tallennusta uudelleen
              </button>
            )}
            {autosave.phase === "conflict" && (
              <button
                type="button"
                className="journal-button journal-button-secondary"
                onClick={() => setConfirmReload(true)}
              >
                Avaa tallennettu versio
              </button>
            )}
          </div>
          {restoreNotice && <p role="status">{restoreNotice}</p>}
          {memories.length > 0 && (
            <nav
              className="annual-workflow"
              aria-label="Kirjan kokoamisen vaiheet"
            >
              <button
                type="button"
                className="journal-text-link"
                onClick={() => focusSection(designSection.current)}
              >
                Kansi ja ilme
              </button>
              <button
                type="button"
                className="journal-text-link"
                onClick={() => focusSection(memorySection.current)}
              >
                Muistot ja päivät
              </button>
              <button
                type="button"
                className="journal-text-link"
                onClick={() =>
                  focusSection(
                    preview && !dirty
                      ? heading.current
                      : assembleButton.current,
                  )
                }
              >
                Esikatselu
              </button>
            </nav>
          )}
          <BookIdeas
            bookId={book.id}
            memories={chosen.length}
            dated={dated}
            photos={
              chosen.filter((memory) => memory.content_type === "image").length
            }
            hasLetter={Boolean(design.letter.trim())}
            disabled={working || refreshing || Boolean(refreshError)}
            onMemoryAdded={() => {
              void refreshMemories();
            }}
          />
          {refreshing && <p role="status">Haetaan uutta muistoa kirjaan…</p>}
          {memoryNotice && <p role="status">{memoryNotice}</p>}
          {refreshError && (
            <div role="alert">
              <p>{refreshError}</p>
              <button
                type="button"
                className="journal-text-link"
                onClick={() => {
                  void refreshMemories();
                }}
              >
                Päivitä muistolista
              </button>
            </div>
          )}
          {truncated && (
            <p role="status">
              Näytetään 200 vanhinta muistoa. Ensimmäiseen kirjamalliin voi
              valita niistä enintään 24.
            </p>
          )}
          {!memories.length ? (
            <div className="annual-empty">
              <h3>Ensimmäinen sivu alkaa yhdestä muistosta.</h3>
              <p>
                Lisää ensin kuva tai teksti Muistot-osiossa. Sen jälkeen voit
                koota oman kirjan.
              </p>
              <Link className="journal-button" to="/puppy-book?osio=muistot">
                Siirry muistoihin
              </Link>
            </div>
          ) : (
            <form
              onSubmit={assemble}
              onChange={() => setDirty(true)}
              aria-busy={working}
            >
              <fieldset
                ref={designSection}
                tabIndex={-1}
                className="annual-design-section"
                disabled={working}
              >
                <legend>1. Tee kirjasta oman näköinen</legend>
                <BookDesignFields
                  design={design}
                  puppyName={name}
                  start={start}
                  end={end}
                  coverPhoto={coverPhoto}
                  onChange={(next) => {
                    setDesign(next);
                    setDirty(true);
                  }}
                />
              </fieldset>
              <fieldset className="annual-period-section" disabled={working}>
                <legend>2. Pennun nimi ja ajanjakso</legend>
                <div className="annual-fields">
                  <label>
                    Pennun nimi
                    <input
                      value={name}
                      name="puppy-name"
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={40}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Alkupäivä
                    <input
                      type="date"
                      value={start}
                      name="book-start"
                      autoComplete="off"
                      required
                      onChange={(event) => {
                        setStart(event.target.value);
                        setEnd(firstYearEnd(event.target.value));
                      }}
                    />
                  </label>
                  <label>
                    Loppupäivä
                    <input
                      type="date"
                      value={end}
                      name="book-end"
                      autoComplete="off"
                      min={start}
                      max={firstYearEnd(start)}
                      required
                      onChange={(event) => setEnd(event.target.value)}
                    />
                  </label>
                </div>
                <p>
                  Voit aloittaa syntymäpäivästä tai kotiintulosta. Jakso saa
                  olla enintään vuoden mittainen. Varmista myös kirjaan
                  valmiiksi haettu syntymäpäivä.
                </p>
              </fieldset>
              <fieldset
                ref={memorySection}
                tabIndex={-1}
                className="annual-memories-section"
                disabled={working}
              >
                <legend>3. Valitse hetket ja tarkista tapahtumapäivät</legend>
                <p id="annual-date-help">
                  Tallennuspäivä kertoo, milloin lisäsit muiston palveluun. Anna
                  päivä, jolloin tapahtuma oikeasti sattui. Aikajanaan
                  liitetystä muistosta ehdotamme sen tapahtumapäivää.
                </p>
                <p role="status">Valittu {chosen.length} / 24 muistoa</p>
                <ul className="annual-memory-list">
                  {memories.map((memory, index) => (
                    <li
                      key={memory.id}
                      className={
                        memory.included ? "annual-memory-selected" : ""
                      }
                    >
                      <label className="annual-checkbox">
                        <input
                          type="checkbox"
                          name={`selected-${memory.id}`}
                          checked={memory.included}
                          disabled={!memory.included && chosen.length >= 24}
                          onChange={(event) =>
                            changeMemory(memory.id, {
                              included: event.target.checked,
                            })
                          }
                        />
                        <span>
                          Muisto {index + 1}:{" "}
                          {memory.content_type === "image" ? "kuva" : "teksti"}
                        </span>
                        {memory.included && (
                          <Check size={16} aria-hidden="true" />
                        )}
                      </label>
                      <p className="annual-source-caption">
                        {memory.caption || "Kuva ilman kuvatekstiä"}
                      </p>
                      <p className="annual-upload-date">
                        Tallennettu{" "}
                        {memory.created_at &&
                        day.safeParse(memory.created_at.slice(0, 10)).success
                          ? formatDay(memory.created_at.slice(0, 10))
                          : "tuntemattomana päivänä"}
                      </p>
                      <div className="annual-memory-options">
                        <label>
                          Tapahtumapäivä, muisto {index + 1}
                          <input
                            type="date"
                            name={`event-date-${memory.id}`}
                            autoComplete="off"
                            value={memory.date}
                            required={memory.included}
                            disabled={!memory.included}
                            min={start}
                            max={end}
                            aria-describedby="annual-date-help"
                            onChange={(event) =>
                              changeMemory(memory.id, {
                                date: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="annual-checkbox">
                          <input
                            type="checkbox"
                            name={`mishap-${memory.id}`}
                            checked={memory.mishap}
                            disabled={!memory.included}
                            onChange={(event) =>
                              changeMemory(memory.id, {
                                mishap: event.target.checked,
                              })
                            }
                          />
                          <span>Kuukauden kommellus, muisto {index + 1}</span>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <fieldset className="annual-growth-section" disabled={working}>
                <legend>4. Kasvukäyrä osaksi tarinaa</legend>
                <label className="annual-checkbox">
                  <input
                    type="checkbox"
                    name="include-weights"
                    checked={includeWeights && periodWeights.length > 0}
                    disabled={!periodWeights.length}
                    onChange={(event) =>
                      setIncludeWeights(event.target.checked)
                    }
                  />
                  <span>Lisää kasvukäyrä ja painomittaukset kirjaan</span>
                </label>
                <p>{weightNotice}</p>
                {periodWeights.length > 0 ? (
                  <p>
                    {periodWeights.length}{" "}
                    {periodWeights.length === 1
                      ? "mittaus valitulta ajalta. Yksi mittaus näkyy pisteenä."
                      : "mittausta valitulta ajalta. Käyrä ja tarkka mittaustaulukko syntyvät automaattisesti."}
                  </p>
                ) : (
                  <p>
                    Valitulta ajalta ei ole mittauksia. Voit lisätä niitä
                    Kasvu-osiossa ja palata kokoamaan kirjaa.
                  </p>
                )}
                {includeWeights && periodWeights.length > 0 && (
                  <div className="annual-growth-inline">
                    <BookGrowthChart weights={periodWeights} />
                  </div>
                )}
              </fieldset>
              <button
                ref={assembleButton}
                type="submit"
                className="journal-button"
                disabled={working || refreshing}
              >
                {working
                  ? "Kootaan kirjaa ja kuvia…"
                  : preview
                    ? "Päivitä esikatselu"
                    : "Kokoa kirjan esikatselu"}
              </button>
              {working && (
                <p role="status">
                  Kootaan kirjaa. Tämä voi kestää hetken, jos valitsit monta
                  kuvaa.
                </p>
              )}
              {error && (
                <p
                  role="alert"
                  className="annual-error"
                  ref={errorMessage}
                  tabIndex={-1}
                >
                  {error}
                </p>
              )}
            </form>
          )}
          {preview && (
            <section
              className="annual-builder-result"
              aria-labelledby="annual-preview-title"
            >
              <h2 id="annual-preview-title" ref={heading} tabIndex={-1}>
                Oman kirjan esikatselu
              </h2>
              <p>
                Silloin ja nyt -sivu syntyy, kun mukana on kuvia vähintään
                kahdelta eri tapahtumapäivältä.
              </p>
              {dirty ? (
                <p role="status">
                  Valinnat ovat muuttuneet. Paina Päivitä esikatselu ennen
                  tulostamista.
                </p>
              ) : (
                <PrintBookButton book={preview} />
              )}
              <AnnualBookPreview
                book={preview}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                canPrint={!dirty}
              />
            </section>
          )}
        </>
      )}
      <AlertDialog.Root open={blocker.state === "blocked"}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="annual-leave-overlay" />
          <AlertDialog.Content
            className="puppy-journal annual-leave-dialog"
            onEscapeKeyDown={() => {
              if (blocker.state === "blocked") blocker.reset();
            }}
          >
            <AlertDialog.Title>
              Kirjan valinnat ovat tallentamatta
            </AlertDialog.Title>
            <AlertDialog.Description>
              Viimeisimpiä muutoksia ei ole vielä vahvistettu tallennetuiksi.
              Jos poistut nyt, ne voivat kadota. Aiemmin tallennettu luonnos ja
              alkuperäiset muistot säilyvät. Voit odottaa tallennuksen
              valmistumista tai palata kirjan kokoamiseen.
            </AlertDialog.Description>
            <div className="journal-book-actions">
              <AlertDialog.Cancel
                className="journal-button"
                onClick={() => {
                  if (blocker.state === "blocked") blocker.reset();
                }}
              >
                Jatka kirjan kokoamista
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className="journal-button journal-button-secondary"
                onClick={() => {
                  if (blocker.state === "blocked") blocker.proceed();
                }}
              >
                Poistu silti
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      <AlertDialog.Root open={confirmReload} onOpenChange={setConfirmReload}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="annual-leave-overlay" />
          <AlertDialog.Content className="puppy-journal annual-leave-dialog">
            <AlertDialog.Title>
              Avataanko tallennettu luonnos?
            </AlertDialog.Title>
            <AlertDialog.Description>
              Tämän välilehden tallentamattomat valinnat korvataan viimeksi
              tallennetulla versiolla. Voit peruuttaa ja koota nykyisistä
              valinnoista PDF:n ennen vaihtamista.
            </AlertDialog.Description>
            <div className="journal-book-actions">
              <AlertDialog.Cancel className="journal-button">
                Peruuta
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className="journal-button journal-button-secondary"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Lataa tallennettu luonnos
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </section>
  );
}
