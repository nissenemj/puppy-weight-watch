import React from 'react'
import Footer from '@/components/Footer'
import EnhancedPuppyCalculator from '@/components/EnhancedPuppyCalculator'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import Breadcrumb from '@/components/Breadcrumb'
import { PageLayout, Container, Section } from '@/components/ui/Layout'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Badge } from '@/components/ui/badge'
import { Calculator, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { entranceAnimations } from '@/animations'
import { createCalculatorSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData'

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
    <PageLayout variant="default" animated>
      <SEO
        title="Pentulaskuri - Ruokamäärä"
        description="Laske koiranpentusi optimaalinen päivittäinen ruokamäärä. Huomioi rodun, iän, painon ja aktiivisuuden. Käytä virallisia annostelutaulukoita."
        keywords="pentulaskuri, ruokalaskuri, koiranpennun ruokinta, annostelu, ruokamäärä, penturuoka"
        structuredData={structuredData}
      />
      
      {/* Hero Section */}
      <Section className="pt-24 pb-12 bg-gradient-to-b from-[var(--color-surface-alt)] to-[var(--color-surface)]">
        <Container size="lg" padding="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="text-center"
          >
            <motion.div variants={entranceAnimations.staggerChild} className="mb-6">
              <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)] mb-4">
                <Calculator className="w-4 h-4 mr-2" />
                Tarkka laskenta
              </Badge>
            </motion.div>

            <motion.h1 
              variants={entranceAnimations.staggerChild}
              className="text-display-1 mb-6"
            >
              Pentulaskuri
              <br />
              <span className="text-accent">Ruokamäärät</span>
            </motion.h1>
            
            <motion.p 
              variants={entranceAnimations.staggerChild}
              className="text-body-xl text-muted max-w-3xl mx-auto mb-8"
            >
              Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, 
              painon ja aktiivisuustason. Käytä virallisia annostelutaulukoita.
            </motion.p>

            <motion.div 
              variants={entranceAnimations.staggerChild}
              className="flex items-center justify-center gap-6 text-body-sm text-muted"
            >
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
        </Container>
      </Section>

      {/* Breadcrumb */}
      <Section className="py-4 border-b border-[var(--color-border)]">
        <Container size="lg" padding="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </Section>
      
      {/* Calculator Section */}
      <Section className="py-16">
        <Container size="lg" padding="lg">
          <EnhancedPuppyCalculator />
        </Container>
      </Section>
        
      {/* FAQ Section */}
      <Section className="py-20 bg-[var(--color-surface-alt)]">
        <Container size="lg" padding="lg">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6">Usein kysytyt kysymykset</h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Kattava opas koiranpennun ruokintaan ja ruokamäärien laskentaan
            </p>
          </div>
          <FAQ items={faqs} />
        </Container>
      </Section>

      {/* Footer */}
      <Footer />
      
    </PageLayout>
    </MobileOptimizedLayout>
  )
}

export default Calculator