import React from 'react'
import Footer from '@/components/Footer'
import EnhancedPuppyCalculator from '@/components/EnhancedPuppyCalculator'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import Breadcrumb from '@/components/Breadcrumb'
import { PageLayout, Container, Section } from '@/components/ui/Layout'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Badge } from '@/components/ui/badge'
import { Calculator as CalculatorIcon, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { entranceAnimations } from '@/animations'
import { createCalculatorSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData'
import ScrollPanBackground from '@/components/ScrollPanBackground'
import StickyHorizontalGallery from '@/components/StickyHorizontalGallery'
import CountUp from '@/components/CountUp'
import heroIllustration from '@/assets/hero-illustration.png'

const Calculator = () => {
  const faqs = [
    {
      question: "Kuinka paljon ruokaa pentu tarvitsee painon mukaan?",
      answer: "Ruokamäärä lasketaan elopainokiloa kohden. Pienet rodut (1-5 kg): 42g/kg 6 viikon iässä, vähennetään 31g/kg 7 kuukauteen mennessä. Suuret rodut (10-20 kg): 26g/kg 6 viikon iässä, vähennetään 19g/kg 8 kuukauteen mennessä. Esimerkki: 4kg, 5kk ikäinen pentu tarvitsee noin 136g päivässä."
    },
    {
      question: "Kuinka monta kertaa päivässä pentua tulisi ruokkia?",
      answer: "7-10 viikkoa: 4 kertaa päivässä. 3-4 kuukautta: 3 kertaa päivässä. 4-6 kuukautta: 3 kertaa päivässä. 6-7 kuukautta: 2 kertaa päivässä. Vuoden ikäisenä: 1-2 kertaa päivässä. Sopiva ruokintaväli on noin 4 tuntia."
    },
    {
      question: "Tulisiko kuivaruoan nappulat turvottaa pennulle?",
      answer: "Kyllä, turvottaminen on suositeltavaa pennuille, joiden hampaat ovat vielä kehittymässä. Kuivaruoan nappuloilla menee 'jokunen tunti turvota'. Lämpimällä vedellä turvottaminen on nopeampaa. Turvottaminen varmistaa riittävän nesteyden saannin."
    },
    {
      question: "Milloin voin lopettaa nappuloiden turvottamisen?",
      answer: "Noin 5 kuukauden iässä voi lopettaa pienen koiran ruoan kostuttamisen. Hampaiden vaihtuminen tapahtuu 3-7 kuukauden ikäisenä. Siirtymä tehdään asteittain: ensin turvotettuna, sitten maistellen kuivia, lopulta kokonaan kuivina kun hampaat ovat kehittyneet riittävästi."
    },
    {
      question: "Kuinka paljon raakaruokaa pentu tarvitsee?",
      answer: "Raakaruokinnassa pentu syö keskimäärin 2,5-3% oletetusta aikuispainosta. Määrät ovat aina suuntaa antavia ja ruokamäärää tulee säätää pennun painokehityksen mukaan. Seuraa pennun kasvua ja säädä määriä tarpeen mukaan."
    },
    {
      question: "Miten seurata pennun ruokamäärien riittävyyttä?",
      answer: "Seuraa pennun painokehitystä ja säädä ruokamäärää tarpeen mukaan. Pentu tulisi pitää hoikkana ja hyvässä kunnossa. Kylkiluut tulee tuntua kevyesti ihon ja ohuen rasvakerroksen alta. Tarjoa ruokaa tiettyinä ruoka-aikoina noin 15 minuutin ajan."
    },
    {
      question: "Miksi pennulle ei voi antaa aikuisen koiran ruokaa?",
      answer: "Penturuoka sisältää enemmän energiaa ja proteiinia kuin aikuisen koiran ruoka. Aikuisten koirien ruoka on pennulle liian kevyttä nopeaan kasvuun ja kehitykseen. Valitse pennulle aina laadukas, lihapitoinen penturuoka, joka tukee optimaalista kasvua."
    },
    {
      question: "Mitä hyötyä kuivien nappuloiden syömisestä on?",
      answer: "Kuivat nappulat auttavat tukemaan suuhygieniaa nappuloiden mekaanisen harjausvaikutuksen ansiosta. Aikuinen koira voi syödä kuivaruokaa kuivana, kunhan vettä on jatkuvasti saatavilla. Kuivat nappulat ovat parempia koiran hampaille kuin turvonneet."
    }
  ];

  const breadcrumbItems = [
    { name: "Pentulaskuri", href: "/calculator", current: true }
  ];

  const structuredData = [
    createCalculatorSchema(),
    createFAQSchema(faqs),
    createBreadcrumbSchema([
      { name: "Etusivu", url: window.location.origin },
      { name: "Pentulaskuri", url: `${window.location.origin}/calculator` }
    ])
  ];

  return (
    <MobileOptimizedLayout>
    <PageLayout variant="full-width" animated className="no-horizontal-scroll mobile-text-wrap responsive-media">
      <SEO
        title="Pentulaskuri - Ruokamäärä"
        description="Laske koiranpentusi optimaalinen päivittäinen ruokamäärä. Huomioi rodun, iän, painon ja aktiivisuuden. Käytä virallisia annostelutaulukoita."
        keywords="pentulaskuri, ruokalaskuri, koiranpennun ruokinta, annostelu, ruokamäärä, penturuoka"
        structuredData={structuredData}
      />
      
      {/* Hero Section with pan background - FULL WIDTH */}
      <ScrollPanBackground
        src={heroIllustration}
        alt="Koiranpentu ja laskentataulukko - pentulaskurin kuva"
        panX={60}
        panY={30}
        zoom={1.06}
        minHeightClass="min-h-[70svh]"
        className="w-full"
      >
        <div className="w-full px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
          >
            <motion.div variants={entranceAnimations.staggerChild} className="mb-4 flex justify-center">
              <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)]">
                <CalculatorIcon className="w-4 h-4 mr-2" />
                Tarkka laskenta
              </Badge>
            </motion.div>
            <motion.h1 variants={entranceAnimations.staggerChild} className="text-display-1 mb-4">
              Pentulaskuri
              <br />
              <span className="text-accent">Ruokamäärät</span>
            </motion.h1>
            <motion.p variants={entranceAnimations.staggerChild} className="text-body-xl text-muted max-w-3xl mx-auto">
              Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, painon ja aktiivisuustason.
            </motion.p>
            <motion.div variants={entranceAnimations.staggerChild} className="mt-6 flex items-center justify-center gap-6 text-body-sm text-muted mobile-flex-wrap">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>Tarkat tulokset</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Ammattimaiset suositukset</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </ScrollPanBackground>

      {/* How it works: FULL WIDTH */}
      <div className="w-full py-12">
        <StickyHorizontalGallery
          items={[
            { id: '1', content: (<div><h3 className="text-h2 mb-2">1. Rotu & ikä</h3><p className="text-muted">Valitse rotu tai sekarotu ja ikä viikoissa.</p></div>) },
            { id: '2', content: (<div><h3 className="text-h2 mb-2">2. Paino</h3><p className="text-muted">Syötä ajantasainen paino ja aktiivisuustaso.</p></div>) },
            { id: '3', content: (<div><h3 className="text-h2 mb-2">3. Kasvukäyrä</h3><p className="text-muted">Saat yksilöllisen kasvukäyrän ja vertailun.</p></div>) },
            { id: '4', content: (<div><h3 className="text-h2 mb-2">4. Ruokamäärä</h3><p className="text-muted">Näet päivittäisen ruokasuosituksen ja jaon aterioihin.</p></div>) },
          ]}
        />
      </div>

      {/* Breadcrumb - FULL WIDTH */}
      <div className="w-full py-4 border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      {/* Calculator Section - FULL WIDTH */}
      <div className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 text-center mb-12">
            <div>
              <p className="text-5xl font-semibold"><CountUp to={12000} suffix="+" /></p>
              <p className="mt-2 text-muted">laskentaa/kk</p>
            </div>
            <div>
              <p className="text-5xl font-semibold"><CountUp to={86} suffix="%" /></p>
              <p className="mt-2 text-muted">hyödyksi koettu</p>
            </div>
            <div>
              <p className="text-5xl font-semibold"><CountUp to={250} suffix="+" /></p>
              <p className="mt-2 text-muted">rotupohjaa</p>
            </div>
          </div>
          <EnhancedPuppyCalculator />
        </div>
      </div>
        
      {/* FAQ Section - FULL WIDTH */}
      <div className="w-full py-20 bg-[var(--color-surface-alt)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6">Usein kysytyt kysymykset</h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Kattava opas koiranpennun ruokintaan ja ruokamäärien laskentaan
            </p>
          </div>
          <FAQ items={faqs} />
        </div>
      </div>

      {/* Footer - FULL WIDTH */}
      <Footer />
      
    </PageLayout>
    </MobileOptimizedLayout>
  )
}

export default Calculator