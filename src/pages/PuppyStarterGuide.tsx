import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import SEO from "@/components/SEO";
import { PREPARATION_RETAILERS } from "@/data/retailers";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyHomeSmall from "@/assets/puppy-home-640.webp";
import {
  usePreparation,
  preparationReady,
  togglePreparation,
} from "@/features/preparation/usePreparation";
import {
  PreparationStatus,
  PreparationHome,
  PreparationMemory,
} from "@/features/preparation/PreparationSections";
import "@/styles/puppy-journal.css";

const essentials = [
  {
    id: "walk",
    title: "Panta tai valjaat ja talutushihna",
    detail:
      "Pyydä kasvattajalta kokovinkki. Sovita varusteet pennulle ja tarkista säätövara kasvun varalle.",
    tip: "Istuvuus ratkaisee enemmän kuin merkki.",
  },
  {
    id: "bowls",
    title: "Ruoka- ja vesikuppi",
    detail:
      "Valitse pennun kokoon sopivat, helposti pestävät kupit. Pienelle pennulle matala reuna voi olla kätevä.",
    tip: "Kotona jo oleva sopiva astia voi riittää alkuun.",
  },
  {
    id: "rest",
    title: "Oma rauhallinen lepopaikka",
    detail:
      "Varaa pennulle pehmeä, helposti puhdistettava alusta paikkaan, jossa se saa levätä rauhassa.",
    tip: "Kalliin pedin voi hankkia myöhemmin.",
  },
  {
    id: "food",
    title: "Tuttua ruokaa ja ruokintaohje",
    detail:
      "Selvitä etukäteen, mitä pentu on syönyt. Pyydä kasvattajalta mukaan ruokintaohje ja hanki samaa ruokaa kotiin.",
    tip: "Ruokamäärä tarkistetaan juuri kyseisen tuotteen ohjeesta.",
  },
  {
    id: "play",
    title: "Muutama pennulle sopiva lelu",
    detail:
      "Aloita pienellä valikoimalla eri tavoin leikittäviä leluja. Tarkista koko, kunto ja valmistajan käyttöohje.",
    tip: "Kaikkea ei tarvitse ostaa kerralla.",
  },
  {
    id: "care",
    title: "Kynsi- ja turkinhoitovälineet",
    detail:
      "Kysy kasvattajalta, millaiset kynsisakset ja harja sopivat pennun kokoon ja turkkiin.",
    tip: "Hanki välineet oman koiran tarpeen mukaan.",
  },
  {
    id: "clean",
    title: "Kakkapussit ja siivoustarvikkeet",
    detail:
      "Laita pussit valmiiksi ulkoiluvarusteiden lähelle. Varaa kotiin pestäviä pyyhkeitä ja sopivat siivousvälineet.",
    tip: "Arjen pienet tarvikkeet unohtuvat helposti.",
  },
  {
    id: "home",
    title: "Koti ja kotimatka valmiiksi",
    detail:
      "Siirrä vaaralliset esineet pennun ulottumattomiin. Suunnittele turvallinen kotimatka ja sovi perheen arjen käytännöistä.",
    tip: "Valmistautuminen on myös aikaa, tilaa ja yhteisiä sopimuksia.",
  },
] as const;

const partners = PREPARATION_RETAILERS;

export default function PuppyStarterGuide() {
  const preparation = usePreparation();
  const checked = preparation.document.checked;
  const ready = preparationReady(preparation);
  const shoppingCount = essentials.filter((item) =>
    checked.includes(item.id),
  ).length;

  return (
    <div className="puppy-journal starter-guide preparation-guide">
      <SEO
        title="Pennun tuloon valmistautuminen ja hankintalista"
        description="Valmistele koti, sovi perheen arki ja kokoa pennun perustarvikkeet. Tallentuva valmistautumislista ja ensimmäinen oma kuvasivu pentukirjaan."
      />
      <Link className="journal-back" to="/guides">
        <ArrowLeft size={16} aria-hidden="true" /> Takaisin oppaisiin
      </Link>

      <section className="journal-hero" aria-labelledby="starter-title">
        <div>
          <p className="journal-kicker">
            <ShoppingBag size={18} aria-hidden="true" /> Valmiina pennun tuloon
          </p>
          <h1 id="starter-title" className="journal-title">
            Pentu tulee kotiin.
          </h1>
          <p className="journal-lead">
            Tee kodista pennulle hyvä paikka. Sopikaa arjen käytännöt, kokoa
            perustarvikkeet ja tallenna ensimmäinen muisto jo odottaessa.
          </p>
          <a className="journal-button" href="#kotikierros">
            Aloita kotikierros <ArrowRight size={18} aria-hidden="true" />
          </a>
          <p className="journal-note">
            Lista on käytettävissä ilman kirjautumista.
          </p>
        </div>
        <figure className="journal-photo">
          <img
            src={puppyHome}
            srcSet={`${puppyHomeSmall} 640w, ${puppyHome} 1200w`}
            sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 100vw"
            width={1200}
            height={800}
            alt="Kuvituskuva pennusta peitolla kotona, vierellään valjaat ja vesikuppi"
            fetchPriority="high"
          />
          <figcaption>Tekoälyllä luotu kuvituskuva.</figcaption>
        </figure>
      </section>

      <nav
        className="preparation-navigation"
        aria-label="Valmistautumisoppaan osiot"
      >
        <a href="#kotikierros">Kotikierros</a>
        <a href="#perheen-arki">Perheen arki</a>
        <a href="#hankintalista">Hankintalista</a>
        <a href="#ensimmainen-sivu">Ensimmäinen kirjasivu</a>
      </nav>
      <PreparationStatus controller={preparation} />

      <aside className="journal-disclosure" aria-label="Tietoa mainoslinkeistä">
        <strong>Sisältää mainoslinkkejä.</strong> Sivun lopussa on linkkejä
        Peten Koiratarvikkeeseen ja Koiratarvike Haukkulaan. Voimme saada
        ostoksesta palkkion. Lista ei ole tuotetesti eikä kauppojen
        hintavertailu.
      </aside>

      <PreparationHome controller={preparation} />

      <div className="starter-content">
        <section
          id="hankintalista"
          tabIndex={-1}
          aria-labelledby="checklist-title"
          className="journal-anchor"
        >
          <div className="journal-section-heading">
            <div>
              <h2 id="checklist-title">Pennun hankintalista</h2>
              <p>
                Tarkista ensin, mitä teillä jo on. Merkitse valmiit kohdat. Voit
                palata täydentämään listaa myöhemmin.
              </p>
            </div>
            <p className="journal-count" role="status" aria-live="polite">
              {shoppingCount}/{essentials.length} valmiina
            </p>
          </div>
          <div className="starter-checklist">
            {essentials.map((item) => (
              <label
                className={`starter-item ${checked.includes(item.id) ? "starter-item-checked" : ""}`}
                key={item.id}
              >
                <input
                  type="checkbox"
                  name={`preparation-${item.id}`}
                  disabled={!ready}
                  checked={checked.includes(item.id)}
                  onChange={(event) =>
                    togglePreparation(
                      preparation,
                      item.id,
                      event.target.checked,
                    )
                  }
                  aria-label={item.title}
                />
                <span>
                  <strong>{item.title}</strong>
                  <span className="starter-detail">{item.detail}</span>
                  <span className="starter-tip">{item.tip}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <aside className="starter-sidebar" aria-labelledby="later-title">
          <h2 id="later-title">Nämä voivat odottaa</h2>
          <p>
            Laaja leluvalikoima, kalliit pedit ja useat samanlaiset varusteet on
            helpompi valita, kun pennun koko ja mieltymykset ovat tutumpia.
          </p>
          <hr />
          <h3>Kysy ennen ostamista</h3>
          <ul className="journal-check-list">
            <li>
              <Check size={16} aria-hidden="true" /> Onko meillä jo tähän sopiva
              tarvike?
            </li>
            <li>
              <Check size={16} aria-hidden="true" /> Sopiiko koko juuri tälle
              pennulle?
            </li>
            <li>
              <Check size={16} aria-hidden="true" /> Miten tarvike pestään ja
              huolletaan?
            </li>
          </ul>
          <a className="journal-text-link" href="#kotikierros">
            Palaa kotikierrokseen <ArrowRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>

      <PreparationMemory controller={preparation} />

      <section className="journal-section" aria-labelledby="stores-title">
        <h2 id="stores-title">Kun tiedät, mitä tarvitset</h2>
        <p>
          Vertaa sopivuutta, kokonaishintaa ja toimitusehtoja ennen tilausta.
          Nämä linkit avaavat kaupan etusivun, eivät yksittäistä suositeltua
          tuotetta.
        </p>
        <div className="starter-partners">
          {partners.map((partner) => (
            <a
              key={partner.name}
              className="starter-partner"
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <span className="journal-note">Kauppalinkki</span>
                <strong>{partner.name}</strong>
                <span>Siirry kauppaan (avautuu uuteen välilehteen)</span>
              </span>
              <ExternalLink size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="journal-callout" aria-labelledby="first-memory-title">
        <div>
          <h2 id="first-memory-title">Tältä oma pentukirja voisi näyttää.</h2>
          <p>
            Selaa kuvitettua esimerkkikirjaa ja löydä ideoita teidän yhteisen
            tarinanne tallentamiseen.
          </p>
        </div>
        <Link className="journal-button journal-button-light" to="/muistokirja">
          Katso pentukirjan esimerkki{" "}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section
        className="journal-sources"
        aria-labelledby="guide-sources-title"
      >
        <h2 id="guide-sources-title">Mihin opas perustuu?</h2>
        <p>
          Perustarvikkeiden ja kodin järjestelyn taustana ovat Kennelliiton
          Hankikoira-ohjeet. Tarkistuslistojen ryhmittely, työnjaon kentät ja
          kirjasivun idea ovat Pentulaskurin toimituksellisia valintoja. Lähteet
          tarkistettu 3.11.2026.
        </p>
        <ul>
          <li>
            <a href="https://www.hankikoira.fi/koiratietoa/koira-kotona/koiratarvikkeet">
              Hankikoira: Koiratarvikkeet
            </a>
          </li>
          <li>
            <a href="https://www.hankikoira.fi/koiratietoa/koira-kotona">
              Hankikoira: Koira kotona
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
