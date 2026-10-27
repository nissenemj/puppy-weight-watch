import { useEffect, useRef, useState } from "react";
import { Link, useBlocker } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { BookOpen, Check, RefreshCw } from "lucide-react";
import type { PuppyBook } from "@/types/dog";
import { AnnualBookPreview } from "./AnnualBookPreview";
import { PrintBookButton } from "./PrintBookButton";
import { loadBookSources, type DraftMemory } from "./sources";
import { loadBookImage } from "./images";
import {
  annualBookSchema,
  day,
  firstYearEnd,
  formatDay,
  type AnnualBook,
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
  const heading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const hasDraft =
    dirty || preview !== null || memories.some((memory) => memory.included);
  const blocker = useBlocker(hasDraft);
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
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    loadBookSources(book.id, userId, controller.signal)
      .then((source) => {
        if (controller.signal.aborted) return;
        setMemories(source.memories);
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

  const changeMemory = (id: string, patch: Partial<DraftMemory>) =>
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, ...patch } : memory,
      ),
    );
  const chosen = memories.filter((memory) => memory.included);
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
        <p className="journal-kicker">
          <BookOpen size={18} aria-hidden="true" /> Oma kirja
        </p>
        <h2 id="annual-builder-title">Pennun ensimmäinen vuosi</h2>
        <p>
          Valitse omasta pentukirjastasi kuvat ja tarinat. Kokoamme kannen,
          kuukausien hetket, kommellukset ja halutessasi kasvun yhdeksi
          kirjaksi.
        </p>
        <p className="annual-draft-note">
          Valinnat säilyvät tässä näkymässä välilehden sulkemiseen tai toiseen
          osioon siirtymiseen asti. Ne eivät muuta alkuperäisiä muistoja.
          Tallenna valmis kirja PDF:nä ennen poistumista.
        </p>
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
              <fieldset disabled={working}>
                <legend>1. Kirjan nimi ja ajanjakso</legend>
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
              <fieldset disabled={working}>
                <legend>2. Valitse hetket ja tarkista tapahtumapäivät</legend>
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
              <fieldset disabled={working}>
                <legend>3. Kasvu mukaan</legend>
                <label className="annual-checkbox">
                  <input
                    type="checkbox"
                    name="include-weights"
                    checked={includeWeights && weights.length > 0}
                    disabled={!weights.length}
                    onChange={(event) =>
                      setIncludeWeights(event.target.checked)
                    }
                  />
                  <span>Lisää painomittaukset kirjan lopuksi</span>
                </label>
                <p>{weightNotice}</p>
              </fieldset>
              <button
                type="submit"
                className="journal-button"
                disabled={working}
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
              Jos poistut tästä näkymästä, päivämäärä- ja sivuvalinnat
              poistuvat. Alkuperäiset muistot säilyvät pentukirjassasi. Voit
              palata ja tallentaa kirjan PDF:nä.
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
                Poistu ja hylkää valinnat
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </section>
  );
}
