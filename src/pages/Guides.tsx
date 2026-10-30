import { Link } from "react-router-dom";
import {
  Dog,
  Users,
  Shield,
  Utensils,
  ArrowRight,
  CheckCircle,
  Brain,
} from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";

export default function Guides() {
  const guides = [
    {
      icon: CheckCircle,
      title: "Pennun hankintalista",
      description:
        "Mitä pentu tarvitsee uuteen kotiin? Merkitse hankinnat ja tutustu valintavinkkeihin.",
      href: "/guides/pennun-hankinnat",
      badge: "Tarkistuslista",
      color: "primary",
      features: [
        "Perustarvikkeet",
        "Valintavinkit",
        "Kodin valmistelu",
        "Mainoslinkit",
      ],
    },
    {
      icon: Dog,
      title: "Pentuopas",
      description:
        "Kattava opas koiranpennun hoitamiseen, kasvatukseen ja hyvinvointiin",
      href: "/guides/puppy-guide",
      badge: "Suosittu",
      color: "primary",
      features: ["Ruokinta", "Liikunta", "Koulutus", "Terveys"],
    },
    {
      icon: Users,
      title: "Sosialisaatio-opas",
      description:
        "Opettele sosialisoimaan pentusi turvallisesti ja tehokkaasti",
      href: "/guides/socialization",
      badge: "Tärkeä",
      color: "secondary",
      features: ["Muut koirat", "Ihmiset", "Ympäristöt", "Äänimaisema"],
    },
    {
      icon: Shield,
      title: "Turvallisuusopas",
      description: "Tee kodistasi turvallinen ja mukava paikka koiranpennulle",
      href: "/guides/safety",
      badge: "Välttämätön",
      color: "warning",
      features: [
        "Kodin turvaaminen",
        "Myrkylliset kasvit",
        "Ensiapuohjeet",
        "Varusteet",
      ],
    },
    {
      icon: Utensils,
      title: "Ruokintaohjeet",
      description: "Tietoa koiranpennun ruokinnasta ja ruokamääristä",
      href: "/guides/feeding",
      badge: "Päivitetty",
      color: "success",
      features: ["Ruokamäärät", "Ruokinta-ajat", "Ruokavalio", "Herkut"],
    },
    {
      icon: Brain,
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
  ];

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
        {guides.map(({ icon: Icon, title, description, href, features }) => (
          <article className="site-guide-link" key={href}>
            <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
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
      <Footer />
    </div>
  );
}
