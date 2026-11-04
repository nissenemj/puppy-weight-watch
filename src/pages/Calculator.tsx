import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";
import AdvancedFoodCalculator from "@/components/AdvancedFoodCalculator";
import AdultFoodCalculator from "@/components/AdultFoodCalculator";
import "@/styles/adult-food.css";
import VeterinaryDisclaimer from "@/components/VeterinaryDisclaimer";
import { trackPageViewed } from "@/utils/analytics";

const MANUFACTURER_LINKS = {
  kuivaruoat: [
    { name: "Brit", url: "https://brit-petfood.com/en/products/dogs/" },
    {
      name: "Hau-Hau Champion",
      url: "https://hauhau.fi/blogs/koiran-ruokinta/",
    },
    { name: "Royal Canin", url: "https://royalcanin.com/fi/dogs/products/" },
    { name: "Josera", url: "https://josera.de/hund/futter/" },
    { name: "Eukanuba", url: "https://eukanuba.com/fi/dogs/" },
    { name: "Hill's", url: "https://hillspet.fi/dog-food" },
  ],
  raakaruoat: [
    { name: "MUSH", url: "https://mush.fi/koiranruoka/penturuoka/" },
    { name: "SMAAK", url: "https://smaak.fi/koiranruoka/" },
    { name: "Best-In", url: "https://best-in.fi/koiranruokinta/" },
    { name: "Kennelpakaste", url: "https://kennelpakaste.fi/" },
  ],
  markaruoat: [
    { name: "Dagsmark", url: "https://dagsmarkpetfood.fi/blogs/oppaat/" },
  ],
};

export default function Calculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const adult = searchParams.get("vaihe") === "aikuinen";
  useEffect(() => {
    trackPageViewed("Calculator", "/calculator");
  }, []);
  return (
    <div className="site-page site-tool site-food-page">
      <SEO
        title="Ruokalaskuri pennulle ja aikuiselle koiralle"
        siteName="Pentulaskuri"
        description="Arvioi pennun tai aikuisen koiran päiväannosta. Näe laskennan perusteet ja valmistajan ohje."
        canonicalUrl="https://pentulaskuri.com/calculator"
      />
      <PageIntro
        title="Ruokamäärät arkeen."
        description="Valitse pentu tai aikuinen koira ja käytössä oleva ruoka. Näet annoksen sekä laskennan perusteet."
      />
      <div className="dog-life-stage">
        <label htmlFor="food-life-stage">Koiran elämänvaihe</label>
        <select
          id="food-life-stage"
          name="dog-life-stage"
          value={adult ? "aikuinen" : "pentu"}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams);
            if (event.target.value === "aikuinen")
              next.set("vaihe", "aikuinen");
            else next.delete("vaihe");
            setSearchParams(next, { replace: true, preventScrollReset: true });
          }}
        >
          <option value="pentu">Pentu, kasvu on vielä kesken</option>
          <option value="aikuinen">Aikuinen, täysikasvuinen koira</option>
        </select>
      </div>
      {adult ? <AdultFoodCalculator /> : <AdvancedFoodCalculator user={null} />}
      <section
        className="site-manufacturers"
        aria-labelledby="manufacturer-title"
      >
        <h2 id="manufacturer-title">Ruokavalmistajien ohjeet</h2>
        <p>
          Tarkista valitun tuotteen ajantasainen annosteluohje pakkauksesta tai
          valmistajalta. Tuotteiden koostumus ja annostelu voivat vaihdella.
        </p>
        <div className="site-manufacturer-links">
          {Object.values(MANUFACTURER_LINKS)
            .flat()
            .map((m) => (
              <a
                key={m.name}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {m.name}
                <ExternalLink size={16} aria-hidden="true" />
                <span className="sr-only"> (avautuu uuteen välilehteen)</span>
              </a>
            ))}
        </div>
      </section>
      <VeterinaryDisclaimer variant="compact" />
      <Footer />
    </div>
  );
}
