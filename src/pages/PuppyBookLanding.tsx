import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
import ScrollPanBackground from '@/components/ScrollPanBackground';
import LazyImage from '@/components/LazyImage';
import heroIllustration from '@/assets/hero-illustration.png';
import puppyWaveGif from '@/assets/puppy-wave-gif.png';
import growthStages from '@/assets/growth-stages.png';

const PuppyBookLanding: React.FC = () => {
  const reduceMotion = useReducedMotion();
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
      title: "Digitaalinen muistokirja",
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

        {/* Hero Section with pan background */}
        <section className="full-width-section relative py-8 overflow-hidden rounded-2xl mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-flex-safe" aria-label="Pentukirjan esittely">
          <ScrollPanBackground src={heroIllustration} alt="" panX={40} panY={20} zoom={1.04} minHeightClass="min-h-[50svh]" className="no-horizontal-scroll" overlayClassName="relative inset-auto min-h-[inherit] w-full items-center px-4 py-8 sm:p-8">
            <div className="hero-content relative z-30 w-full min-w-0">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.6 }}
                  className="min-w-0"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playful font-bold text-white mb-6 drop-shadow" id="main-heading">
                    Pennun Ensimmäinen Vuosi 🐶
                  </h1>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Luo ainutlaatuinen muistokirja pennustasi. Tallenna virstanpylväitä,
                    muistoja ja seuraa kasvua henkilökohtaisessa pentukirjassa.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                    <Link to="/puppy-book" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-center text-base font-semibold text-terracotta-700 shadow-lg transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 motion-reduce:transition-none">
                      Aloita pentukirja
                      <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                    </Link>

                    <a
                      href="#puppy-book-features"
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-white/80 px-6 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 motion-reduce:transition-none"
                    >
                      Katso ominaisuudet
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.2 }}
                  className="hidden lg:flex items-center justify-center"
                  aria-hidden="true"
                >
                  <motion.div
                    className="bg-white rounded-2xl p-4 shadow-lg"
                    animate={reduceMotion ? { y: 0, rotate: 0 } : {
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={reduceMotion ? { duration: 0 } : {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <LazyImage
                      src={puppyWaveGif}
                      alt=""
                      className="w-32 h-32 rounded-xl"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden="true" />
          </ScrollPanBackground>
        </section>

        {/* Features Section */}
        <section className="full-width-section py-20 bg-white/30 mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-card-safe focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-700" aria-labelledby="features-heading" id="puppy-book-features" tabIndex={-1}>
          <div className="full-width-content mobile-grid-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playful font-bold text-gray-800 mb-4" id="features-heading">
                Miksi pentukirja? ✨
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pennun ensimmäinen vuosi on täynnä ihmeellisiä hetkiä.
                Älä anna niiden kadota - tallenna jokainen tärkeä hetki!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mobile-grid-1">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Stages Section */}
        <section className="full-width-section py-20 mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-flex-safe" role="region" aria-labelledby="growth-stages-heading">
          <div className="full-width-content">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playful font-bold text-gray-800 mb-6" id="growth-stages-heading">
                  Seuraa pennun kasvua 📈
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Jokainen kuukausi tuo mukanaan uusia oppeja ja hetkiä.
                  Kirjaamme ylös tärkeimmät virstanpylväät jokaisesta vaiheesta.
                </p>

                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{milestone}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <LazyImage
                  src={growthStages}
                  alt="Infograafi pennun kasvuvaiheista 0-12 kuukauden ikään, näyttää tärkeimmät virstanpylväät"
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="full-width-section py-20 bg-gradient-warm text-white mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-text-container" role="region" aria-labelledby="cta-heading">
          <div className="content-narrow text-center mobile-button mobile-container-safe mobile-text-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playful font-bold mb-6" id="cta-heading">
                Aloita pennun tarinan kirjoittaminen tänään! 📖
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Luo ainutlaatuinen muistokirja, jota koko perhe voi täyttää ja josta voitte nauttia vuosien ajan.
              </p>

              <Link to="/puppy-book">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                >
                  <Book className="w-6 h-6" />
                  Luo pentukirja ilmaiseksi
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </MobileOptimizedLayout>
  );
};

export default PuppyBookLanding;
