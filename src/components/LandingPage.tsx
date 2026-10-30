import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Scale,
  Utensils,
  ShoppingBag,
  Shield,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import puppyHome from "@/assets/puppy-home-1200.webp";
import puppyHomeSmall from "@/assets/puppy-home-640.webp";
import bookMockup from "@/assets/puppy-journal-books.webp";
import { createWebApplicationSchema } from "@/utils/structuredData";
import { trackHeroCTAClicked, trackPageViewed } from "@/utils/analytics";

const tools = [
  {
    icon: Scale,
    title: "Painonseuranta",
    text: "Kirjaa pennun paino ja seuraa muutosta mittaus kerrallaan.",
    link: "Aloita painonseuranta",
    href: "/weight-tracker",
  },
  {
    icon: Utensils,
    title: "Ruokalaskuri",
    text: "Arvioi päiväannosta valitun ruoan ja pennun tietojen perusteella.",
    link: "Siirry ruokalaskuriin",
    href: "/calculator",
  },
  {
    icon: BookOpen,
    title: "Pentukirja",
    text: "Kuvat, hassut tavat ja kasvun hetket pennun omaksi tarinaksi.",
    link: "Tutustu pentukirjaan",
    href: "/puppy-book-landing",
  },
];
const guides = [
  {
    icon: ShoppingBag,
    title: "Pennun hankintalista",
    text: "Mitä uuteen kotiin tarvitaan? Merkitse omat hankinnat ja vertaile vaihtoehtoja.",
    href: "/guides/pennun-hankinnat",
  },
  {
    icon: HeartHandshake,
    title: "Yhteinen arki",
    text: "Tutustu pentuoppaaseen ja löydä aiheita ensimmäisiin yhteisiin viikkoihin.",
    href: "/guides/puppy-guide",
  },
  {
    icon: Shield,
    title: "Turvallinen koti",
    text: "Käy läpi kodin turvallisuutta ja pennun ympäristöä.",
    href: "/guides/safety",
  },
];

export default function LandingPage() {
  useEffect(() => {
    trackPageViewed("Homepage", "/");
  }, []);
  return (
    <div className="site-page site-home">
      <SEO
        title="Pentulaskuri: pennun kasvu, ruokinta ja oma pentukirja"
        siteName="Pentulaskuri"
        description="Seuraa pennun painoa, arvioi ruokamäärää ja tallenna yhteiset hetket omaan pentukirjaan. Työkaluja ja oppaita pennun arkeen."
        canonicalUrl="https://pentulaskuri.com/"
        structuredData={createWebApplicationSchema()}
      />
      <section className="site-home-hero" aria-labelledby="home-title">
        <div>
          <h1 id="home-title">Hyvä alku yhteiselle elämälle.</h1>
          <p className="site-home-lead">
            Seuraa pennun painoa, arvioi ruokamäärää ja tallenna yhteiset
            hetket. Kaikki samassa paikassa.
          </p>
          <div className="site-home-actions">
            <Button
              asChild
              onClick={() =>
                trackHeroCTAClicked("Aloita painonseuranta", "/weight-tracker")
              }
            >
              <Link to="/weight-tracker">
                Aloita painonseuranta{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Link to="/puppy-book-landing" className="site-link">
              Tutustu pentukirjaan <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="site-home-photo">
          <img
            src={puppyHome}
            srcSet={`${puppyHomeSmall} 640w, ${puppyHome} 1200w`}
            sizes="(min-width:1024px) 50vw,100vw"
            width={1200}
            height={800}
            alt="Kuvitettu kultaisennoutajan pentu peitollaan kotona"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>Tekoälyllä luotu kuvituskuva.</figcaption>
        </figure>
      </section>
      <section className="site-tool-links" aria-label="Pennun arjen työkalut">
        {tools.map(({ icon: Icon, title, text, link, href }) => (
          <article className="site-tool-link" key={href}>
            <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link to={href} className="site-link">
                {link}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="site-book-feature" aria-labelledby="home-book-title">
        <img
          src={bookMockup}
          width={1200}
          height={919}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div>
          <h2 id="home-book-title">
            Aivan pieni. Jo niin paljon muistettavaa.
          </h2>
          <p>
            Tavallinen tiistai, ensimmäinen kotipäivä ja sukkavarkaan kommellus.
            Kokoa omat kuvat ja sanat pentukirjaksi, johon haluat palata.
          </p>
          <Link to="/muistokirja" className="site-link">
            Selaa esimerkkikirjaa <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="text-sm mt-3">
            Kirja tallennetaan PDF-tiedostoksi. Kuvitettu esimerkki.
          </p>
        </div>
      </section>
      <section
        className="site-guide-section"
        aria-labelledby="home-guides-title"
      >
        <h2 id="home-guides-title">Pienet askeleet arkeen.</h2>
        <div className="site-guide-links">
          {guides.map(({ icon: Icon, title, text, href }) => (
            <article className="site-guide-link" key={href}>
              <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link
                  to={href}
                  className="site-link"
                  aria-label={`Avaa opas: ${title}`}
                >
                  Avaa opas <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
