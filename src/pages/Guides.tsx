import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GuideIllustration } from "@/components/GuideIllustration";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";

export default function Guides() {
  const guides = [
    {
      artwork: "home",
      title: "Pennun tuloon valmistautuminen",
      description:
        "Valmistele koti, sovi perheen arki ja kokoa perustarvikkeet. Tallenna ensimmäinen kuvasivu pentukirjaan.",
      href: "/guides/pennun-hankinnat",
      badge: "Tarkistuslista",
      color: "primary",
      features: [
        "Kotikierros",
        "Perheen arki",
        "Hankintalista",
        "Ensimmäinen kirjasivu",
      ],
    },
    {
      artwork: "feeding",
      title: "Pennun ruokintaopas",
      description: "Ravintoaineet, ruokintarutiinit ja pennun kasvu.",
      href: "/guides/puppy-guide",
      badge: "Suosittu",
      color: "primary",
      features: ["Ruokinta", "Liikunta", "Koulutus", "Terveys"],
    },
    {
      artwork: "socialization",
      title: "Sosialisaatio-opas",
      description:
        "Opettele sosialisoimaan pentusi turvallisesti ja tehokkaasti",
      href: "/guides/socialization",
      badge: "Tärkeä",
      color: "secondary",
      features: ["Muut koirat", "Ihmiset", "Ympäristöt", "Äänimaisema"],
    },
    {
      artwork: "safety",
      title: "Turvallisuusopas",
      description:
        "Ruokinnan turvallisuus, yksilöllinen neuvonta ja ajankohtaiset tiedotteet.",
      href: "/guides/safety",
      badge: "Välttämätön",
      color: "warning",
      features: ["Ruokinta", "Eläinlääkärin neuvonta", "Tiedotteet"],
    },
    {
      artwork: "feeding",
      title: "Ruokintaohjeet",
      description: "Tietoa koiranpennun ruokinnasta ja ruokamääristä",
      href: "/guides/feeding",
      badge: "Päivitetty",
      color: "success",
      features: ["Ruokamäärät", "Ruokinta-ajat", "Ruokavalio", "Herkut"],
    },
    {
      artwork: "relaxation",
      title: "Rentoutusprotokolla",
      description:
        "Karen Overallin 15 päivän ohjelma koiran rauhoittamiseen ja impulssikontrolliin",
      href: "/guides/relaxation-protocol",
      badge: "Uusi",
      color: "primary",
      features: [
        "Fysiologinen rentoutus",
        "Impulssikontrolli",
        "Reaktiivisuus",
        "15 päivän ohjelma",
      ],
    },
  ] as const;

  return (
    <div className="site-page site-guides">
      <SEO
        title="Tietopankki: oppaita pennun arkeen"
        siteName="Pentulaskuri"
        description="Pennun hankinnat, ruokinta, sosiaalistaminen, turvallisuus ja yhteisten taitojen harjoittelu. Valitse aihe ja tutustu oppaaseen."
        canonicalUrl="https://pentulaskuri.com/guides"
      />
      <PageIntro
        title="Pienet askeleet arkeen."
        description="Hankinnat, ensimmäiset yhteiset viikot ja uudet taidot. Löydä teille ajankohtainen opas."
      />
      <section aria-label="Kaikki pentuoppaat" className="site-guide-links">
        {guides.map(({ artwork, title, description, href, features }) => (
          <article className="site-guide-link" key={href}>
            <GuideIllustration
              artwork={artwork}
              decorative
              caption={false}
              sizes="(min-width: 1280px) 544px, (min-width: 768px) calc((100vw - 96px) / 2), calc(100vw - 40px)"
            />
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
              <small>{features.join(" · ")}</small>
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
      </section>
      <p className="guide-index-caption">
        Oppaiden kuvat on luotu tekoälyllä kuvitukseksi.
      </p>
      <Footer />
    </div>
  );
}
