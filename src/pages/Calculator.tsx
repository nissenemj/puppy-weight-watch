import React from 'react'
import Navigation from '@/components/Navigation'
import HeaderButtons from '@/components/HeaderButtons'
import EnhancedPuppyCalculator from '@/components/EnhancedPuppyCalculator'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import Breadcrumb from '@/components/Breadcrumb'
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Pentulaskuri - Ruokamäärä"
        description="Laske koiranpentusi optimaalinen päivittäinen ruokamäärä. Huomioi rodun, iän, painon ja aktiivisuuden. Käytä virallisia annostelutaulukoita."
        keywords="pentulaskuri, ruokalaskuri, koiranpennun ruokinta, annostelu, ruokamäärä, penturuoka"
        structuredData={structuredData}
      />
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <HeaderButtons showLogo={true} logoText="Pentulaskuri" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Pentulaskuri
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, painon ja aktiivisuustason.
          </p>
        </header>
        
        <EnhancedPuppyCalculator />
        
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Usein kysytyt kysymykset
            </h2>
            <p className="text-muted-foreground">
              Kattava opas koiranpennun ruokintaan ja ruokamäärien laskentaan
            </p>
          </div>
          <FAQ items={faqs} title="" />
        </section>
      </div>
    </div>
  )
}

export default Calculator