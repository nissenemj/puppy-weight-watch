import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import SEO from "@/components/SEO";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyHomeSmall from "@/assets/puppy-home-640.webp";
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
];

// Existing affiliate campaigns, reused without invented product prices or deep links.
const partners = [
  {
    name: "Peten Koiratarvike",
    href: "https://pin.petenkoiratarvike.com/t/t?a=1984341102&as=2037227635&t=2&tk=1",
  },
  {
    name: "Koiratarvike Haukkula",
    href: "https://to.koiratarvikehaukkula.fi/t/t?a=2005863340&as=2037227635&t=2&tk=1",
  },
];

export default function PuppyStarterGuide() {
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <div className="puppy-journal starter-guide">
      <SEO
        title="Koiranpennun hankinnat: tarkistuslista uuteen kotiin"
        description="Mitä koiranpennulle kannattaa hankkia? Käytännöllinen tarkistuslista, valintavinkit ja tilaa harkituille hankinnoille."
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
            Hyvä alku alkaa pienistä hankinnoista.
          </h1>
          <p className="journal-lead">
            Kokoa pennulle arjen perustarvikkeet. Aloita tarpeellisista ja
            täydennä, kun opit tuntemaan uuden perheenjäsenesi.
          </p>
          <a className="journal-button" href="#hankintalista">
            Avaa hankintalista <ArrowRight size={18} aria-hidden="true" />
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

      <aside className="journal-disclosure" aria-label="Tietoa mainoslinkeistä">
        <strong>Sisältää mainoslinkkejä.</strong> Sivun lopussa on linkkejä
        Peten Koiratarvikkeeseen ja Koiratarvike Haukkulaan. Voimme saada
        ostoksesta palkkion. Lista ei ole tuotetesti eikä kauppojen
        hintavertailu.
      </aside>

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
                Merkitse valmiit kohdat. Valinnat ovat käytössä tällä sivulla,
                kunnes poistut tai päivität sivun.
              </p>
            </div>
            <p className="journal-count" role="status" aria-live="polite">
              {checked.length}/{essentials.length} valmiina
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
                  checked={checked.includes(item.id)}
                  onChange={(event) =>
                    setChecked((current) =>
                      event.target.checked
                        ? [...current, item.id]
                        : current.filter((id) => id !== item.id),
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
          <Link className="journal-text-link" to="/guides/safety">
            Lue myös kodin turvallisuudesta{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </div>

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
              rel="noopener noreferrer sponsored"
            >
              <span>
                <span className="journal-note">Mainoslinkki</span>
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
          <h2 id="first-memory-title">Ensimmäinen päivä on jo muisto.</h2>
          <p>
            Tallenna pentukirjaan kuva kotiintulosta ja muutama sana yhteisen
            arjen alusta.
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
        <h2 id="guide-sources-title">Mihin lista perustuu?</h2>
        <p>
          Perustarvikkeiden taustana ovat Kennelliiton ohjeet. Sivun ryhmittely
          ja ostamisen tarkistuskysymykset ovat Pentulaskurin toimituksellisia
          valintoja. Tarkistettu 26.10.2026.
        </p>
        <ul>
          <li>
            <a href="https://www.hankikoira.fi/koiratietoa/koira-kotona/koiratarvikkeet">
              Hankikoira: Koiratarvikkeet
            </a>
          </li>
          <li>
            <a href="https://www.kennelliitto.fi/elamaa-koiran-kanssa/pentu-tulee-taloon/">
              Kennelliitto: Pentu tulee taloon
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
