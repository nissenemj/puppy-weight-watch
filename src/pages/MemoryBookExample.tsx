import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  LockKeyhole,
} from "lucide-react";
import SEO from "@/components/SEO";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyLater from "@/assets/puppy-book-home-1200.webp";
import { AnnualBookPreview } from "@/features/annual-book/AnnualBookPreview";
import { PrintBookButton } from "@/features/annual-book/PrintBookButton";
import type { AnnualBook } from "@/features/annual-book/model";
import "@/styles/puppy-journal.css";

const pages = [
  "Kansi",
  "Silloin ja nyt",
  "Ensimmäiset päivät",
  "Kuukauden kommellus",
  "Pieniä suuria hetkiä",
  "Kasvu",
  "Mittaukset",
  "Kirje pennulle",
];
const pageKeys = [
  "kansi",
  "silloin-ja-nyt",
  "ensimmaiset-paivat",
  "kommellus",
  "hetket",
  "kasvu",
  "mittaukset",
  "kirje",
];
// Illustrative fixture only. These are not a real puppy's photos or measurements.
const exampleBook: AnnualBook = {
  bookId: "00000000-0000-4000-8000-000000000001",
  puppyName: "Nuppu",
  start: "2026-04-01",
  end: "2027-03-31",
  design: {
    title: "Nupun pentuvuosi",
    palette: "lake",
    coverArt: "photo",
    letter:
      "Pieni Nuppu,\n\nhaluan muistaa sen, miten katsot meitä ennen jokaista yhteistä retkeä. Tavallisista päivistä on tullut vähän hauskempia sinun kanssasi.\n\nToivon meille monta uutta metsäpolkua, kiireettömiä aamuja ja aikaa opetella yhdessä. Saat kasvaa omaan tahtiisi. Me olemme tässä.",
  },
  entries: [
    {
      id: "home",
      date: "2026-06-03",
      image: puppyHome,
      caption:
        "Tervetuloa kotiin, Nuppu.\nOvi aukesi ja pieni nenä tutki jokaisen nurkan. Illalla nukahdit peitolle, aivan meidän viereemme.",
      mishap: false,
    },
    {
      id: "sock",
      date: "2026-07-12",
      caption:
        "Sukkavarkaan tunnustus\nPyykkikorista löytyi aarre. Kannoin sitä ylpeästi ympäri olohuonetta. Sukka palautui omistajalleen, ja sain tilalle oman lelun.",
      mishap: true,
    },
    {
      id: "autumn",
      date: "2026-09-03",
      image: puppyLater,
      caption:
        "Pieniä suuria hetkiä.\nEnsimmäinen yhteinen kävely, oma tuttu lelu ja se tavallinen tiistai. Tänäänkin olit siinä, ja se riitti.",
      mishap: false,
    },
  ],
  weights: [
    { date: "2026-06-03", kg: 4.2 },
    { date: "2026-07-03", kg: 6.5 },
    { date: "2026-09-03", kg: 10.8 },
  ],
};

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
          Ensimmäinen kotipäivä, hassu tapa nukkua, yhdessä opitut asiat. Astu
          Nupun kuvitteelliseen pentuvuoteen. Avaa lukutila ja käännä sivua.
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
          role="region"
          aria-label={pages[pageIndex]}
        >
          <AnnualBookPreview
            book={exampleBook}
            pageIndex={pageIndex}
            onPageChange={selectPage}
          />
        </div>
        <PrintBookButton book={exampleBook} />
      </section>

      <section className="memory-offer" aria-labelledby="memory-offer-title">
        <div>
          <h2 id="memory-offer-title">
            Haluaisitko tällaisen omasta pennustasi?
          </h2>
          <p>
            Voit kokeilla omista kuvista ja teksteistä koottavaa perusmallia
            maksutta omassa pentukirjassasi. Valitse oma kansiväri, lisää
            kasvukäyrä ja kirjoita kirje pennullesi. Suunnittelemme myöhemmin
            myös laajempaa kirjaa.
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
