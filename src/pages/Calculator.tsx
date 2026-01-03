import React, { useEffect } from 'react';
import Footer from '@/components/Footer';
import AdvancedFoodCalculator from '@/components/AdvancedFoodCalculator';
import SEO from '@/components/SEO';
import FAQ from '@/components/FAQ';
import VeterinaryDisclaimer from '@/components/VeterinaryDisclaimer';
import RelatedContent from '@/components/RelatedContent';
import { createCalculatorSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData';
import { trackPageViewed } from '@/utils/analytics';
import { Calculator as CalculatorIcon, CheckCircle, ExternalLink, Bone, Drumstick } from 'lucide-react';
import { motion } from 'framer-motion';
import { entranceAnimations } from '@/animations';
import { Badge } from '@/components/ui/badge';
import MeshBackground from '@/components/MeshBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Manufacturer feeding guide links
const MANUFACTURER_LINKS = {
  kuivaruoat: [
    { name: 'Brit', url: 'https://brit-petfood.com/en/products/dogs/' },
    { name: 'Hau-Hau Champion', url: 'https://hauhau.fi/blogs/koiran-ruokinta/' },
    { name: 'Royal Canin', url: 'https://royalcanin.com/fi/dogs/products/' },
    { name: 'Josera', url: 'https://josera.de/hund/futter/' },
    { name: 'Eukanuba', url: 'https://eukanuba.com/fi/dogs/' },
    { name: "Hill's", url: 'https://hillspet.fi/dog-food' },
  ],
  raakaruoat: [
    { name: 'MUSH', url: 'https://mush.fi/koiranruoka/penturuoka/' },
    { name: 'SMAAK', url: 'https://smaak.fi/koiranruoka/' },
    { name: 'Best-In', url: 'https://best-in.fi/koiranruokinta/' },
    { name: 'Kennelpakaste', url: 'https://kennelpakaste.fi/' },
  ],
  markaruoat: [
    { name: 'Dagsmark', url: 'https://dagsmarkpetfood.fi/blogs/oppaat/' },
  ],
};

const Calculator = () => {
  useEffect(() => {
    trackPageViewed('Calculator', '/calculator');
  }, []);

  const faqs = [{
    question: "Kuinka paljon ruokaa pentu tarvitsee painon mukaan?",
    answer: "Ruokamäärä lasketaan elopainokiloa kohden. Pienet rodut (1-5 kg): 42g/kg 6 viikon iässä, vähennetään 31g/kg 7 kuukauteen mennessä. Suuret rodut (10-20 kg): 26g/kg 6 viikon iässä, vähennetään 19g/kg 8 kuukauteen mennessä. Esimerkki: 4kg, 5kk ikäinen pentu tarvitsee noin 136g päivässä."
  }, {
    question: "Kuinka monta kertaa päivässä pentua tulisi ruokkia?",
    answer: "7-10 viikkoa: 4 kertaa päivässä. 3-4 kuukautta: 3 kertaa päivässä. 4-6 kuukautta: 3 kertaa päivässä. 6-7 kuukautta: 2 kertaa päivässä. Vuoden ikäisenä: 1-2 kertaa päivässä. Sopiva ruokintaväli on noin 4 tuntia."
  }, {
    question: "Tulisiko kuivaruoan nappulat turvottaa pennulle?",
    answer: "Kyllä, turvottaminen on suositeltavaa pennuille, joiden hampaat ovat vielä kehittymässä. Kuivaruoan nappuloilla menee 'jokunen tunti turvota'. Lämpimällä vedellä turvottaminen on nopeampaa. Turvottaminen varmistaa riittävän nesteyden saannin."
  }, {
    question: "Milloin voin lopettaa nappuloiden turvottamisen?",
    answer: "Noin 5 kuukauden iässä voi lopettaa pienen koiran ruoan kostuttamisen. Hampaiden vaihtuminen tapahtuu 3-7 kuukauden ikäisenä. Siirtymä tehdään asteittain: ensin turvotettuna, sitten maistellen kuivia, lopulta kokonaan kuivina kun hampaat ovat kehittyneet riittävästi."
  }, {
    question: "Kuinka paljon raakaruokaa pentu tarvitsee?",
    answer: "Raakaruokinnassa pentu syö keskimäärin 2,5-3% oletetusta aikuispainosta. Määrät ovat aina suuntaa antavia ja ruokamäärää tulee säätää pennun painokehityksen mukaan. Seuraa pennun kasvua ja säädä määriä tarpeen mukaan."
  }, {
    question: "Miten seurata pennun ruokamäärien riittävyyttä?",
    answer: "Seuraa pennun painokehitystä ja säädä ruokamäärää tarpeen mukaan. Pentu tulisi pitää hoikkana ja hyvässä kunnossa. Kylkiluut tulee tuntua kevyesti ihon ja ohuen rasvakerroksen alta. Tarjoa ruokaa tiettyinä ruoka-aikoina noin 15 minuutin ajan."
  }, {
    question: "Miksi pennulle ei voi antaa aikuisen koiran ruokaa?",
    answer: "Penturuoka sisältää enemmän energiaa ja proteiinia kuin aikuisen koiran ruoka. Aikuisten koirien ruoka on pennulle liian kevyttä nopeaan kasvuun ja kehitykseen. Valitse pennulle aina laadukas, lihapitoinen penturuoka, joka tukee optimaalista kasvua."
  }, {
    question: "Mitä hyötyä kuivien nappuloiden syömisestä on?",
    answer: "Kuivat nappulat auttavat tukemaan suuhygieniaa nappuloiden mekaanisen harjausvaikutuksen ansiosta. Aikuinen koira voi syödä kuivaruokaa kuivana, kunhan vettä on jatkuvasti saatavilla. Kuivat nappulat ovat parempia koiran hampaille kuin turvonneet."
  }];

  const structuredData = [
    createCalculatorSchema(),
    createFAQSchema(faqs),
    createBreadcrumbSchema([{
      name: "Etusivu",
      url: window.location.origin
    }, {
      name: "Pentulaskuri",
      url: `${window.location.origin}/calculator`
    }])
  ];

  return (
    <div className="min-h-screen flex flex-col gap-16 pb-20">
      <SEO
        title="Pentulaskuri - Ruokamäärä"
        description="Laske koiranpentusi optimaalinen päivittäinen ruokamäärä. Huomioi rodun, iän, painon ja aktiivisuuden. Käytä virallisia annostelutaulukoita."
        keywords="pentulaskuri, ruokalaskuri, koiranpennun ruokinta, annostelu, ruokamäärä, penturuoka"
        structuredData={structuredData}
      />

      <MeshBackground variant="default" />

      {/* Hero Section - pt-20/pt-24 for fixed navigation */}
      <section className="relative pt-20 md:pt-24 pb-12 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="max-w-3xl mx-auto space-y-6"
          >
            <motion.div variants={entranceAnimations.staggerChild}>
              <Badge variant="secondary" className="bg-white border-stone-200 text-stone-600 px-4 py-1.5 text-sm shadow-sm">
                <CalculatorIcon className="w-3.5 h-3.5 mr-2 text-terracotta-500" />
                Tarkka ruokalaskuri
              </Badge>
            </motion.div>

            <motion.h1
              variants={entranceAnimations.staggerChild}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight"
            >
              Pentulaskuri <br />
              <span className="text-terracotta-500">Ruokamäärät</span>
            </motion.h1>

            <motion.p
              variants={entranceAnimations.staggerChild}
              className="text-lg text-stone-600 leading-relaxed max-w-xl mx-auto"
            >
              Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, painon ja aktiivisuustason.
            </motion.p>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="flex flex-wrap justify-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-stone-600 font-medium">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span>Tarkat tulokset</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 font-medium">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span>Ammattimaiset suositukset</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="container px-4 md:px-6 mx-auto max-w-4xl">
        <AdvancedFoodCalculator user={null} />
      </section>

      {/* Manufacturer Feeding Guides Section */}
      <section className="container px-4 md:px-6 mx-auto max-w-4xl">
        <Card variant="frosted" className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2">
              Valmistajien Viralliset Annosohjeet
            </CardTitle>
            <CardDescription className="text-base text-stone-600 max-w-2xl mx-auto">
              Tarkista aina ruokamäärä valmistajan virallisesta annostelutaulukosta,
              koska energiatiheys vaihtelee tuotteittain (1200–1800 kcal/kg).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kuivaruoat */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <Bone className="w-5 h-5 text-terracotta-500" />
                  <h3>Kuivaruoat</h3>
                </div>
                <ul className="space-y-2">
                  {MANUFACTURER_LINKS.kuivaruoat.map((manufacturer) => (
                    <li key={manufacturer.name}>
                      <a
                        href={manufacturer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-stone-600 hover:text-terracotta-600 transition-colors group py-1"
                      >
                        <span className="group-hover:underline">{manufacturer.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Raakaruoat */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <Drumstick className="w-5 h-5 text-terracotta-500" />
                  <h3>Raakaruoat</h3>
                </div>
                <ul className="space-y-2">
                  {MANUFACTURER_LINKS.raakaruoat.map((manufacturer) => (
                    <li key={manufacturer.name}>
                      <a
                        href={manufacturer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-stone-600 hover:text-terracotta-600 transition-colors group py-1"
                      >
                        <span className="group-hover:underline">{manufacturer.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Märkäruoat */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <Bone className="w-5 h-5 text-terracotta-500" />
                  <h3>Märkäruoat</h3>
                </div>
                <ul className="space-y-2">
                  {MANUFACTURER_LINKS.markaruoat.map((manufacturer) => (
                    <li key={manufacturer.name}>
                      <a
                        href={manufacturer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-stone-600 hover:text-terracotta-600 transition-colors group py-1"
                      >
                        <span className="group-hover:underline">{manufacturer.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-stone-500 text-center mt-6 pt-4 border-t border-stone-200">
              Nämä linkit johtavat valmistajien omille sivuille. Pentulaskuri.com ei vastaa ulkoisten sivustojen sisällöstä.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Veterinary Disclaimer - E-E-A-T */}
      <section className="container px-4 md:px-6 mx-auto max-w-3xl">
        <VeterinaryDisclaimer />
      </section>

      {/* FAQ Section */}
      <section className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Usein kysytyt kysymykset</h2>
          <p className="text-lg text-stone-600">
            Kattava opas koiranpennun ruokintaan ja ruokamäärien laskentaan
          </p>
        </div>
        <FAQ items={faqs} />
      </section>

      {/* Related Content - Internal Linking */}
      <section className="container px-4 md:px-6 mx-auto max-w-3xl">
        <RelatedContent
          title="Hyödyllisiä työkaluja ja oppaita"
          items={[
            {
              title: 'Painonseuranta',
              description: 'Seuraa pennun kasvua ja kehitystä graafeilla',
              href: '/weight-tracker',
              icon: 'scale'
            },
            {
              title: 'Ruokintaopas',
              description: 'Kattava opas pennun ruokintaan ja ruokavalintoihin',
              href: '/guides/feeding',
              icon: 'book'
            },
            {
              title: 'Turvallisuusopas',
              description: 'Varmista kotisi turvallisuus pennulle',
              href: '/guides/safety',
              icon: 'shield'
            }
          ]}
        />
      </section>

      <Footer />
    </div>
  );
};

export default Calculator;