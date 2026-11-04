import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  LockKeyhole,
} from "lucide-react";
import SEO from "@/components/SEO";
import { AnnualBookPreview } from "@/features/annual-book/AnnualBookPreview";
import { PrintBookButton } from "@/features/annual-book/PrintBookButton";
import {
  exampleBook,
  exampleBookPages,
  exampleScrapbookPages,
} from "@/features/annual-book/exampleBook";
import "@/styles/puppy-journal.css";

export default function MemoryBookExample() {
  const [params, setParams] = useSearchParams();
  const preview = useRef<HTMLDivElement>(null);
  const [contentsOpen, setContentsOpen] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setContentsOpen(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const pageIndex = Math.max(
    0,
    exampleBookPages.findIndex(
      (item) => item.slug === (params.get("sivu") || "kansi"),
    ),
  );
  const selectPage = (index: number) => {
    const next = new URLSearchParams(params);
    next.set("sivu", exampleBookPages[index].slug);
    setParams(next, { preventScrollReset: true });
  };

  return (
    <div className="puppy-journal memory-example">
      <SEO
        title="Pentukirja: pennun ensimmäinen vuosi"
        siteName="Pentulaskuri"
        description="Tee pentukirja pennun ensimmäisestä vuodesta. Selaa esimerkkiä: omat kuvat, Silloin ja nyt, kuukauden kommellus ja kasvun hetket yhdessä kirjassa."
        canonicalUrl="https://pentulaskuri.com/muistokirja"
      />
      <Link className="journal-back" to="/puppy-book-landing">
        <ArrowLeft size={16} aria-hidden="true" /> Pentukirjan esittelyyn
      </Link>

      <section className="memory-intro" aria-labelledby="memory-example-title">
        <p className="journal-kicker">
          <BookOpen size={18} aria-hidden="true" /> Selaa esimerkkikirjaa
        </p>
        <h1 id="memory-example-title" className="journal-title">
          Pieni pentu.
          <br />
          Kokonainen tarina.
        </h1>
        <p className="journal-lead">
          Tassunjälki, lempilelu nimeltä Ankka ja yksi kadonnut sukka. Nupun
          kuvitteellinen pentuvuosi näyttää, mitä yhdestä kuvasta ja muutamasta
          omasta sanasta voi syntyä.
        </p>
      </section>

      <section aria-labelledby="sample-book-title" className="memory-showcase">
        <div className="memory-sample-note">
          <span>Esimerkkikirja</span>
          <p>
            Nuppu ja kaikki kirjan tiedot ovat kuvitteellisia. Kuvitus on luotu
            tekoälyllä. Silloin ja nyt -kuvat havainnollistavat taittoa, eivät
            oikean pennun kasvua.
          </p>
        </div>
        <h2 id="sample-book-title" className="sr-only">
          Nupun pentukirjan esimerkki
        </h2>
        <div className="memory-reader-layout">
          <details
            className="memory-contents"
            open={contentsOpen}
            onToggle={(event) => setContentsOpen(event.currentTarget.open)}
          >
            <summary>
              Kirjan sivut{" "}
              <span>
                {pageIndex + 1} / {exampleBookPages.length}
              </span>
            </summary>
            <nav
              className="memory-page-navigation"
              aria-label="Esimerkkikirjan sivut"
            >
              {exampleBookPages.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-label={item.label}
                  aria-pressed={pageIndex === index}
                  aria-controls="memory-sample-page"
                  onClick={() => {
                    selectPage(index);
                    if (!window.matchMedia("(min-width: 1024px)").matches)
                      setContentsOpen(false);
                    window.requestAnimationFrame(() => {
                      preview.current?.focus({ preventScroll: true });
                      preview.current
                        ?.querySelector(".annual-sheet")
                        ?.scrollIntoView({
                          block: "start",
                          behavior: "instant",
                        });
                    });
                  }}
                >
                  <span className="memory-page-thumb" aria-hidden="true">
                    {item.page.scrapbook?.image ||
                    item.page.entries[0]?.image ? (
                      <img
                        src={
                          item.page.scrapbook?.image ||
                          item.page.entries[0]?.image
                        }
                        alt=""
                        width={36}
                        height={48}
                        loading="lazy"
                      />
                    ) : (
                      <BookOpen size={19} />
                    )}
                  </span>
                  <span>
                    {item.label}
                    <small>Sivu {index + 1}</small>
                  </span>
                </button>
              ))}
            </nav>
          </details>
          <div
            ref={preview}
            tabIndex={-1}
            id="memory-sample-page"
            role="region"
            aria-label={exampleBookPages[pageIndex].label}
          >
            <AnnualBookPreview
              book={exampleBook}
              pageIndex={pageIndex}
              onPageChange={selectPage}
              scrapbookPages={exampleScrapbookPages}
              notice="Kuvitteellinen esimerkkikirja. Kaikki kuvat ja kuvitukset on luotu tekoälyllä. Mittaukset ovat esimerkkilukuja."
            />
          </div>
        </div>
        <PrintBookButton
          book={exampleBook}
          scrapbookPages={exampleScrapbookPages}
        />
      </section>

      <section className="memory-offer" aria-labelledby="memory-offer-title">
        <div>
          <h2 id="memory-offer-title">
            Haluaisitko tällaisen omasta pennustasi?
          </h2>
          <p>
            Kokeile ensin yhtä omaa kuvaa leikekirjassa. Valitse kuvausidea,
            kirjoita halutessasi muutama sana ja selaa omaa sivuasi kirjassa.
            Kirjautuneen käyttäjän pentukirjassa voit myös tallentaa muistoja,
            seurata painoa ja koota vuosikirjan.
          </p>
          <ul className="journal-check-list">
            <li>
              <Check size={18} aria-hidden="true" /> Omat kuvat, muistot ja
              tärkeät hetket
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Yhteen sopiva kansi ja
              sivujen taitto
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Ladattava tiedosto omaan
              käyttöön
            </li>
          </ul>
          <Link
            className="journal-button"
            to="/puppy-book-landing#kokeile-kantta"
          >
            Kokeile omalla kuvalla <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="memory-price">
          <p>Hintaehdotus kertamaksulle</p>
          <strong>
            {new Intl.NumberFormat("fi-FI", {
              style: "currency",
              currency: "EUR",
            }).format(14.9)}
          </strong>
          <p>
            Maksullinen laajempi pentukirja on suunnitteilla eikä sitä voi vielä
            ostaa. Kiinnostuksesta kertominen ei sido tilaukseen.
          </p>
          <Link className="journal-button" to="/contact?aihe=muistokirja">
            Kerro kiinnostuksesta <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        className="journal-callout"
        aria-labelledby="save-memories-title"
      >
        <div>
          <h2 id="save-memories-title">Aloita muistoista jo tänään.</h2>
          <p>
            Pentukirjan käyttäminen on ilmaista. Voit tallentaa omat hetkesi, ja
            koota niistä kirjan selaimen PDF-tallennuksella.
          </p>
          <p className="memory-privacy">
            <LockKeyhole size={16} aria-hidden="true" /> Esimerkkikirja ei käytä
            kenenkään yksityisiä kuvia tai tietoja.
          </p>
        </div>
        <Link className="journal-button journal-button-light" to="/puppy-book">
          Avaa oma pentukirja <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
