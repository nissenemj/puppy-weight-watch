import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  LockKeyhole,
} from "lucide-react";
import SEO from "@/components/SEO";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyHomeSmall from "@/assets/puppy-home-640.webp";
import "@/styles/puppy-journal.css";

const pages = ["Kansi", "Ensimmäiset päivät", "Pieniä suuria hetkiä"];
const pageKeys = ["kansi", "ensimmaiset-paivat", "hetket"];

export default function MemoryBookExample() {
  const [params, setParams] = useSearchParams();
  const pageIndex = Math.max(
    0,
    pageKeys.indexOf(params.get("sivu") || "kansi"),
  );
  const selectPage = (index: number) => {
    const next = new URLSearchParams(params);
    next.set("sivu", pageKeys[index]);
    setParams(next, { preventScrollReset: true });
  };

  return (
    <div className="puppy-journal memory-example">
      <SEO
        title="Muistokirja pennun ensimmäisestä vuodesta | Esimerkki"
        description="Selaa kuvitteellista pentumuistokirjaa. Katso, miten kuvat, tarinat ja tärkeät hetket voisivat muodostaa oman muistokirjan."
        canonicalUrl="https://pentulaskuri.com/muistokirja"
      />
      <Link className="journal-back" to="/puppy-book-landing">
        <ArrowLeft size={16} aria-hidden="true" /> Pentukirjan esittelyyn
      </Link>

      <section className="memory-intro" aria-labelledby="memory-example-title">
        <p className="journal-kicker">
          <BookOpen size={18} aria-hidden="true" /> Pentukirjasta oma
          muistokirja
        </p>
        <h1 id="memory-example-title" className="journal-title">
          Pienestä pennusta kokonainen tarina.
        </h1>
        <p className="journal-lead">
          Ensimmäinen kotipäivä, hassu tapa nukkua, yhdessä opitut asiat. Näin
          ne voisivat säilyä yhdessä kirjassa.
        </p>
      </section>

      <section aria-labelledby="sample-book-title" className="memory-showcase">
        <div className="memory-sample-note">
          <span>Esimerkkikirja</span>
          <p>
            Nuppu ja kaikki kirjan tiedot ovat kuvitteellisia. Kuvitus on luotu
            tekoälyllä.
          </p>
        </div>
        <h2 id="sample-book-title" className="sr-only">
          Nupun muistokirjan esimerkki
        </h2>
        <nav
          className="memory-page-navigation"
          aria-label="Esimerkkikirjan sivut"
        >
          {pages.map((page, index) => (
            <button
              key={page}
              type="button"
              aria-pressed={pageIndex === index}
              aria-controls="memory-sample-page"
              onClick={() => selectPage(index)}
            >
              {page}
            </button>
          ))}
        </nav>
        <div
          id="memory-sample-page"
          className="memory-paper"
          role="region"
          aria-label={pages[pageIndex]}
          aria-live="polite"
        >
          {pageIndex === 0 ? (
            <article className="memory-cover">
              <div className="memory-cover-copy">
                <span>Pennun ensimmäinen vuosi</span>
                <h3>Nupun tarina</h3>
                <p>Meidän yhteinen alku, 2026</p>
              </div>
              <img
                src={puppyHome}
                srcSet={`${puppyHomeSmall} 640w, ${puppyHome} 1200w`}
                sizes="(min-width: 768px) 640px, 100vw"
                width={1200}
                height={800}
                alt="Kuvitteellisen Nuppu-pennun kuvituskuva kotona peitolla"
                fetchPriority="high"
              />
              <p className="memory-cover-footer">
                <Heart size={17} aria-hidden="true" /> Pienet hetket, suuri
                paikka sydämessä.
              </p>
            </article>
          ) : pageIndex === 1 ? (
            <article className="memory-spread">
              <div>
                <p className="memory-date">3. kesäkuuta 2026</p>
                <h3>Tervetuloa kotiin, Nuppu.</h3>
                <p>
                  Ovi aukesi ja pieni nenä tutki jokaisen nurkan. Illalla
                  nukahdit peitolle, aivan meidän viereemme.
                </p>
                <p>
                  Ensimmäisestä päivästä muistamme tassujen pehmeän rapinan ja
                  sen, miten koti tuntui heti vähän erilaiselta.
                </p>
                <span className="memory-handwritten">Tästä se alkoi.</span>
              </div>
              <figure>
                <img
                  src={puppyHomeSmall}
                  width={640}
                  height={427}
                  alt="Esimerkkikirjan kuvitus: Nuppu lepää peitolla"
                />
                <figcaption>Ensimmäinen oma lepopaikka.</figcaption>
              </figure>
            </article>
          ) : (
            <article className="memory-moments">
              <p className="memory-date">Ensimmäisen kesän muistoja</p>
              <h3>Pieniä suuria hetkiä.</h3>
              <dl>
                <div>
                  <dt>Ensimmäinen yhteinen kävely</dt>
                  <dd>
                    Matka oli lyhyt. Nuuskittavaa riitti silti koko maailmaksi.
                  </dd>
                </div>
                <div>
                  <dt>Oma tuttu lelu</dt>
                  <dd>
                    Kaikista leluista valitsit aina saman pehmeän kaverin.
                  </dd>
                </div>
                <div>
                  <dt>Se tavallinen tiistai</dt>
                  <dd>
                    Ei tapahtunut mitään erityistä. Olit vain siinä, ja se
                    riitti.
                  </dd>
                </div>
              </dl>
              <p className="memory-handwritten">
                Tavallinenkin päivä ansaitsee tulla muistetuksi.
              </p>
            </article>
          )}
        </div>
        <div className="memory-pagination">
          <button
            type="button"
            className="journal-icon-button"
            aria-label="Edellinen esimerkkisivu"
            disabled={pageIndex === 0}
            onClick={() => selectPage(pageIndex - 1)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <p>
            {pageIndex + 1} / {pages.length}
          </p>
          <button
            type="button"
            className="journal-icon-button"
            aria-label="Seuraava esimerkkisivu"
            disabled={pageIndex === pages.length - 1}
            onClick={() => selectPage(pageIndex + 1)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="memory-offer" aria-labelledby="memory-offer-title">
        <div>
          <h2 id="memory-offer-title">
            Haluaisitko tällaisen omasta pennustasi?
          </h2>
          <p>
            Suunnittelemme ladattavaa PDF-muistokirjaa pentukirjaan
            tallentamistasi kuvista ja teksteistä. Haluamme ensin kuulla, mikä
            tekisi siitä sinulle tärkeän.
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
            Muistokirja on suunnitteilla eikä sitä voi vielä ostaa.
            Kiinnostuksesta kertominen ei sido tilaukseen.
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
            Pentukirjan käyttäminen on ilmaista. Voit tallentaa omat hetkesi,
            vaikka et hankkisi myöhemmin muistokirjaa.
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
