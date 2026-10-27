import '@/styles/puppy-journal.css';
import '@/styles/puppy-book-landing.css';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  Heart,
  Calendar,
  Camera,
  Users,
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import SEO from '@/components/SEO';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import puppyBookHome from '@/assets/puppy-book-home-1200.webp';
import puppyBookHomeSmall from '@/assets/puppy-book-home-640.webp';
import puppyHome from '@/assets/puppy-home-1200.webp';
import puppyHomeSmall from '@/assets/puppy-home-640.webp';

const PuppyBookLanding: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Kuukausittainen seuranta",
      description: "Dokumentoi pennun kasvu kuukausittain 0-12 kuukauden ikään asti"
    },
    {
      icon: Award,
      title: "Virstanpylväät",
      description: "Merkkaa tärkeät hetket: ensimmäinen rokotus, sosiaalistaminen, komennot"
    },
    {
      icon: Users,
      title: "Ystäväalbumi",
      description: "Tallenna pennun kaverit ja sosiaaliset kohtaamiset"
    },
    {
      icon: Camera,
      title: "Muistogalleria",
      description: "Kuvat, videot ja tarinat pennun elämästä"
    },
    {
      icon: Heart,
      title: "Terveyspäiväkirja",
      description: "Rokotukset, madotukset ja eläinlääkärikäynnit"
    },
    {
      icon: Book,
      title: "Digitaalinen pentukirja",
      description: "Koko ensimmäinen vuosi yhdessä kirjassa"
    }
  ];

  const milestones = [
    "0-2 kuukautta: Silmien avautuminen ja ensimmäiset askeleet",
    "2-4 kuukautta: Rokotukset ja sosiaalistamisen aloitus",
    "4-6 kuukautta: Peruskomennot ja hihnakävely",
    "6-8 kuukautta: Teini-ikä ja itsenäistyminen",
    "8-12 kuukautta: Aikuistuminen ja persoonallisuuden kehitys"
  ];

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-soft page-with-navigation no-horizontal-scroll mobile-text-wrap responsive-media mobile-container-safe mobile-safe-margin">
        <SEO
          title="Pentukirja - Tallenna pennun ensimmäinen vuosi"
          description="Digitaalinen pentukirja pennun ensimmäisen vuoden dokumentointiin. Virstanpylväät, muistot, ystävät ja kasvu yhdessä paikassa."
          keywords="pentukirja, pentu, koira, muistot, virstanpylväät, kasvuseuranta, digitaalinen kirja"
        />

        <Navigation />

        <section className="puppy-journal puppy-book-intro" aria-label="Pentukirjan esittely">
          <div className="puppy-book-intro-copy">
            <h1 className="journal-title" id="main-heading">
              Pennun ensimmäinen vuosi talteen.
            </h1>
            <p className="journal-lead">
              Tallenna kuvat, muistot ja tärkeät hetket omaan pentukirjaan.
              Pienestä pennusta kasvaa yhteinen tarina.
            </p>
            <div className="puppy-book-intro-actions">
              <Link to="/puppy-book" className="journal-button">
                Aloita pentukirja
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="#puppy-book-features" className="journal-button journal-button-secondary">
                Katso ominaisuudet
              </a>
            </div>
          </div>
          <figure className="puppy-book-intro-photo">
            <img
              src={puppyBookHome}
              srcSet={`${puppyBookHomeSmall} 640w, ${puppyBookHome} 1200w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={1200}
              height={900}
              alt="Kuvituskuva kultaisennoutajan pennusta kotona, vierellään vihreä muistikirja"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Tekoälyllä luotu kuvituskuva.</figcaption>
          </figure>
        </section>

        {/* Features Section */}
        <section className="full-width-section py-20 bg-white/30 mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-card-safe focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-700" aria-labelledby="features-heading" id="puppy-book-features" tabIndex={-1}>
          <div className="full-width-content mobile-grid-1">
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playful font-bold text-gray-800 mb-4" id="features-heading">
                Miksi pentukirja? <span aria-hidden="true">✨</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pennun ensimmäinen vuosi on täynnä ihmeellisiä hetkiä.
                Älä anna niiden kadota - tallenna jokainen tärkeä hetki!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mobile-grid-1">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-orange-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Stages Section */}
        <section className="full-width-section py-20 mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-flex-safe" role="region" aria-labelledby="growth-stages-heading">
          <div className="full-width-content">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playful font-bold text-gray-800 mb-6" id="growth-stages-heading">
                  Seuraa pennun kasvua <span aria-hidden="true">📈</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Jokainen kuukausi tuo mukanaan uusia oppeja ja hetkiä.
                  Kirjaamme ylös tärkeimmät virstanpylväät jokaisesta vaiheesta.
                </p>

                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-700">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <figure className="puppy-journal puppy-book-moment-photo">
                  <img
                    src={puppyHome}
                    srcSet={`${puppyHomeSmall} 640w, ${puppyHome} 1200w`}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    width={1200}
                    height={800}
                    alt="Kuvituskuva pennusta omalla peitollaan kotona"
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Arjen pienet hetket jäävät kirjaan. Tekoälyllä luotu kuvituskuva.</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="puppy-journal container mx-auto px-4 md:px-6" aria-labelledby="memory-example-link-title">
          <div className="journal-callout">
            <div><h2 id="memory-example-link-title">Miltä pennun oma pentukirja voisi näyttää?</h2><p>Selaa kuvitteellista esimerkkikirjaa ja tutustu pennun ensimmäisestä vuodesta koottavaan pentukirjaan.</p></div>
            <Link to="/muistokirja" className="journal-button journal-button-light">Katso pentukirjan esimerkki</Link>
          </div>
        </section>

        <section className="puppy-journal full-width-section py-12" aria-labelledby="cta-heading">
          <div className="journal-callout">
            <div>
              <h2 id="cta-heading">Aloita pennun tarinan kirjoittaminen tänään.</h2>
              <p>Tallenna yhteiset hetket omaan pentukirjaan ja palaa niihin myöhemmin.</p>
            </div>
            <Link to="/puppy-book" className="journal-button journal-button-light">
              <Book size={20} aria-hidden="true" /> Luo pentukirja ilmaiseksi
            </Link>
          </div>
        </section>
      </div>
    </MobileOptimizedLayout>
  );
};

export default PuppyBookLanding;
