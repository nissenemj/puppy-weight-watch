import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ChartNoAxesCombined,
  BookOpen,
  Printer,
  Sparkles,
} from "lucide-react";
import illustration from "@/assets/puppy-book-journey-v1.webp";
import "@/styles/book-journey.css";

type Section = "memories" | "growth" | "images" | "annual";
export function BookJourney({
  onSectionChange,
  onAddMemory,
  compact = false,
}: {
  onSectionChange?: (section: Section) => void;
  onAddMemory?: () => void;
  compact?: boolean;
}) {
  const id = useId();
  const [printHelp, setPrintHelp] = useState(false);
  const [expanded, setExpanded] = useState(!compact);
  const steps = [
    {
      title: "Tassut kotiin",
      eyebrow: "1 · Aloita tänään",
      text: "Ensimmäinen päivä tai ihan tavallinen tiistai. Lisää yksi kuva ja lause: mitä pieni nenä tänään löysi? Päivä tulee valmiiksi, ja voit muuttaa sitä.",
      label: "Lisää ensimmäinen muisto",
      section: "memories" as const,
      icon: Camera,
    },
    {
      title: "Oho, sinähän kasvat!",
      eyebrow: "2 · Palaa pitkin vuotta",
      text: "Valitse kuukaudesta yksi lempihetki. Tallenna oma painomittaus ja nappaa talteen lelut, uniasennot ja pienet kommellukset. Yksi hetki kerrallaan riittää.",
      label: "Kirjaa kasvun hetki",
      section: "growth" as const,
      icon: ChartNoAxesCombined,
    },
    {
      title: "Sukansyöjästä päähenkilöksi",
      eyebrow: "3 · Kokoa vuoden tarina",
      text: "Avaa Oma kirja. Valitse kansi, ajanjakso ja lempimuistot. Voit ottaa mukaan kasvukäyrän ja kirjoittaa kirjeen isommalle koirallesi. Esikatsele ennen tulostusta.",
      label: "Avaa Oma kirja",
      section: "annual" as const,
      icon: BookOpen,
    },
    {
      title: "Tassut kasvoivat. Tarina jäi.",
      eyebrow: "4 · Kirja omaan syliin",
      text: "Vuoden lopussa tai jo ensimmäisten muistojen jälkeen: tallenna PDF, tulosta kotona tai selvitä painattaminen. Pienistä hetkistä tuli teidän oma kirjanne.",
      label: "Näin tallennat ja tulostat",
      section: "annual" as const,
      icon: Printer,
    },
  ];
  return (
    <section
      className={`book-journey ${compact ? "book-journey-compact" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="book-journey-intro">
        <div>
          <p className="book-journey-kicker">Pienet tassut. Suuri tarina.</p>
          <h2 id={`${id}-title`}>Näin pennun vuodesta tulee oma kirja.</h2>
          <p>
            Et tarvitse täydellisiä kuvia etkä kirjailijan taitoja. Aloita
            yhdestä hetkestä ja anna kirjan kasvaa pennun mukana.
          </p>
        </div>
        {compact && (
          <button
            type="button"
            className="journal-button journal-button-secondary"
            aria-expanded={expanded}
            aria-controls={`${id}-steps`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Piilota kuvitettu ohje" : "Näytä kuvitettu ohje"}
          </button>
        )}
      </header>
      {expanded && (
        <ol id={`${id}-steps`} className="book-journey-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <div
                className={`book-journey-picture book-journey-picture-${index}`}
                role="img"
                aria-label={
                  [
                    "Pentu saapuu kotiin ja saa ensimmäisen kuvansa.",
                    "Pentu kasvaa, kuvia ja painomittauksia kertyy vuoden varrelta.",
                    "Omat muistot ja hauska satukuva kootaan kirjan sivuille.",
                    "Kasvanut koira lepää valmiin kirjan ja tulostimen vieressä.",
                  ][index]
                }
                style={{ backgroundImage: `url(${illustration})` }}
              />
              <div className="book-journey-chapter">
                <p className="book-journey-kicker">{step.eyebrow}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {index === 3 ? (
                  <button
                    type="button"
                    className="book-journey-action"
                    aria-expanded={printHelp}
                    aria-controls={`${id}-print`}
                    onClick={() => setPrintHelp(!printHelp)}
                  >
                    {step.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : onSectionChange ? (
                  <button
                    type="button"
                    className="book-journey-action"
                    onClick={() =>
                      index === 0 && onAddMemory
                        ? onAddMemory()
                        : onSectionChange(step.section)
                    }
                  >
                    {step.label}
                    <step.icon size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    className="book-journey-action"
                    to={`/puppy-book?osio=${index === 0 ? "muistot" : index === 1 ? "kasvu" : "vuosikirja"}`}
                  >
                    {step.label}
                    <step.icon size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="book-journey-bottom">
        <p>
          <Sparkles size={18} aria-hidden="true" /> Pieni väliseikkailu: tee
          koirastasi satuhahmo ja lisää valmis kuva kirjan muistoihin.
        </p>
        {onSectionChange ? (
          <button
            type="button"
            className="book-journey-action"
            onClick={() => onSectionChange("images")}
          >
            Kokeile satukuvaa
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <Link className="book-journey-action" to="/satukuvat">
            Kokeile satukuvaa
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      {printHelp && (
        <div
          id={`${id}-print`}
          className="book-journey-print"
          role="region"
          aria-label="Kirjan tallennus ja tulostus"
        >
          <h3>Näin tarina pääsee paperille</h3>
          <ol>
            <li>
              Avaa <strong>Oma kirja</strong>, valitse muistot ja kokoa
              esikatselu. Voit tehdä pienen kirjan jo nyt ja jatkaa vuoden
              aikana.
            </li>
            <li>
              Valitse <strong>Tulosta tai tallenna PDF</strong>. Valitse
              selaimen tulostusikkunassa <strong>Tallenna PDF</strong> ja
              paperikooksi <strong>A5</strong>. Poista selaimen ylä- ja
              alatunnisteet.
            </li>
            <li>
              Tarkista PDF:n kaikki sivut. Voit tulostaa kotona tai pyytää
              painotalolta arvion. Varmista painotalon tiedosto-, kuva-,
              marginaali- ja sidontavaatimukset sekä hinta ennen tilausta.
              Painatusta ei vielä tilata Pentulaskurin kautta.
            </li>
          </ol>
          <p>
            Pentukirjan muistot ja Oma kirja -osion valinnat tallentuvat
            tilillesi. Erillinen kansikokeilu ja sen kirjaluonnos tallentuvat
            tämän selaimen muistiin: ota siitä varmuuskopio ennen laitteen
            vaihtoa.
          </p>
          {onSectionChange ? (
            <button
              type="button"
              className="journal-button"
              onClick={() => onSectionChange("annual")}
            >
              Kokoa omista muistoista
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <Link className="journal-button" to="/puppy-book?osio=vuosikirja">
              Kokoa omista muistoista
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
