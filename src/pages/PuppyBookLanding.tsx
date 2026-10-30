import { Link } from "react-router-dom";
import { ArrowRight, Camera, ChartNoAxesCombined, PenLine } from "lucide-react";
import SEO from "@/components/SEO";
import { MobileOptimizedLayout } from "@/components/MobileOptimizedLayout";
import bookMockup from "@/assets/puppy-journal-books.webp";
import shoreIllustration from "@/assets/puppy-journal-shore.webp";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyHomeSmall from "@/assets/puppy-home-640.webp";
import "@/styles/puppy-journal.css";
import "@/styles/puppy-book-landing.css";

const stories = [
  {
    icon: Camera,
    title: "Kuvat ja omat sanat",
    text: "Ensimmäinen kotipäivä, lempipaikka ja se tavallinen tiistai. Lisää kuva tai kirjoita hetki talteen.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Kasvu osana tarinaa",
    text: "Painonseurannan omat mittaukset muuttuvat kasvukäyräksi. Valitse halutessasi käyrä ja tarkat mittaukset kirjaan.",
  },
  {
    icon: PenLine,
    title: "Kirje isommalle sinulle",
    text: "Mitä haluaisit muistaa tästä päivästä? Oma kirje saa paikan kirjan lopussa.",
  },
];
const steps = [
  {
    title: "Tallenna hetki",
    text: "Kuva, muutama sana tai kokonainen tarina. Yksi muisto riittää alkuun.",
  },
  {
    title: "Valitse kirjan ilme",
    text: "Oma nimi ja kansikuva, kolme kansiväriä. Lisää kasvukäyrä ja kirje, jos haluat.",
  },
  {
    title: "Selaa ja tallenna PDF",
    text: "Katsele tarinaa lukutilassa. Tallenna valmis kirja selaimen tulostusikkunasta.",
  },
];

export default function PuppyBookLanding() {
  return (
    <MobileOptimizedLayout>
      <div className="puppy-journal journal-book-landing">
        <SEO
          title="Pentukirja: pennun ensimmäinen vuosi omaksi kirjaksi"
          siteName="Pentulaskuri"
          canonicalUrl="https://pentulaskuri.com/puppy-book-landing"
          description="Kuvat, kasvun hetket ja hassut tavat omaan pentukirjaan. Valitse kirjan ilme, selaa aukeamia ja tallenna PDF. Tutustu maksuttomaan esimerkkiin."
          keywords="pentukirja, pennun ensimmäinen vuosi, koiran oma kirja, kasvuseuranta"
        />
        <section className="book-landing-hero" aria-labelledby="main-heading">
          <div className="book-landing-hero-copy">
            <h1 id="main-heading">
              Pennun ensimmäinen vuosi.
              <br />
              Teidän tarinanne.
            </h1>
            <p className="journal-lead">
              Kuvat, kasvun hetket ja hassut tavat. Tallenna ne omaan
              pentukirjaan ja kokoa niistä kirja, johon haluat palata.
            </p>
            <div className="book-landing-actions">
              <Link to="/puppy-book" className="journal-button">
                Aloita oma pentukirja{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/muistokirja" className="book-landing-text-link">
                Selaa esimerkkikirjaa{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="book-landing-free">
              Maksuton pentukirja. Omat kuvat ja tarinat.
            </p>
          </div>
          <figure className="book-landing-product">
            <img
              src={bookMockup}
              width={1200}
              height={919}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              Kuvitettu esimerkki. Kirja tallennetaan PDF-tiedostoksi ja
              tulostetaan itse.
            </figcaption>
          </figure>
        </section>

        <section
          className="book-landing-story"
          aria-labelledby="book-story-title"
        >
          <figure className="book-landing-memory">
            <img
              src={puppyHome}
              srcSet={`${puppyHomeSmall} 640w, ${puppyHome} 1200w`}
              sizes="(min-width: 900px) 45vw, 100vw"
              width={1200}
              height={800}
              alt="Kuvitettu pentu omalla peitollaan kotona"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>3.6.2026 · Nupun esimerkkikirjasta</span>
              <strong>Ensimmäinen päivä kotona.</strong>
              <p>
                Ovi aukesi ja pieni nenä tutki jokaisen nurkan. Illalla nukahdit
                peitolle, aivan meidän viereemme.
              </p>
            </figcaption>
          </figure>
          <div className="book-landing-story-copy">
            <h2 id="book-story-title">
              Pienet hetket
              <br />
              tekevät tarinan.
            </h2>
            <div className="book-landing-stories">
              {stories.map(({ icon: Icon, title, text }) => (
                <div className="book-landing-story-row" key={title}>
                  <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="book-landing-process"
          aria-labelledby="book-process-title"
        >
          <h2 id="book-process-title" className="sr-only">
            Näin oma pentukirja syntyy
          </h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="book-landing-finale"
          aria-labelledby="book-start-title"
        >
          <img
            src={shoreIllustration}
            width={1400}
            height={467}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <h2 id="book-start-title">Yksi hetki riittää alkuun.</h2>
          <p>Voit jatkaa kirjaa omaan tahtiisi.</p>
          <div className="book-landing-actions">
            <Link to="/puppy-book" className="journal-button">
              Aloita oma pentukirja <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/muistokirja" className="book-landing-text-link">
              Katso pentukirjan esimerkki
            </Link>
          </div>
        </section>
        <p className="book-landing-disclosure">
          Esimerkin Nuppu, sen tiedot ja mittaukset ovat kuvitteellisia.
          Esimerkkikuvat ja piirrokset on luotu tekoälyllä. Omaan kirjaasi
          tulevat omat kuvasi ja tekstisi.
        </p>
      </div>
    </MobileOptimizedLayout>
  );
}
