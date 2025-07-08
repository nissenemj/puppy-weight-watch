import React from 'react'
import Navigation from '@/components/Navigation'
import EnhancedPuppyCalculator from '@/components/EnhancedPuppyCalculator'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import Breadcrumb from '@/components/Breadcrumb'
import { createCalculatorSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData'

const Calculator = () => {
  const faqs = [
    {
      question: "Kuinka laskurin ruokamäärä määräytyy?",
      answer: "Laskuri huomioi pennun nykyisen painon, rodun, iän ja aktiivisuustason. Se käyttää virallisia ruokintasuosituksia ja valmistajien annostelutaulukoita."
    },
    {
      question: "Voiko ruokamäärää jakaa useampaan ateriaan?",
      answer: "Kyllä! Pennut tarvitsevat useita pieniä aterioita päivässä. 2-4 kuukauden ikäiset pennut syövät 4-5 kertaa päivässä, vanhemmat 2-3 kertaa."
    },
    {
      question: "Pitääkö ruokamäärää säätää kasvun mukaan?",
      answer: "Kyllä, pennun ruokamäärää tulee säätää säännöllisesti kasvun ja painon mukaan. Tarkista laskurista uusi suositus viikoittain."
    },
    {
      question: "Onko laskuri tarkka kaikille roduille?",
      answer: "Laskuri antaa hyvän perussuosituksen, mutta eri rotujen tarpeet voivat vaihdella. Ota aina yhteyttä eläinlääkäriin rotukohtaisista erityistarpeista."
    }
  ];

  const breadcrumbItems = [
    { name: "Laskuri", href: "/calculator", current: true }
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
    <div className="min-h-screen bg-background pt-14">
      <SEO
        title="Pentulaskuri - Ruokamäärä"
        description="Laske koiranpentusi optimaalinen päivittäinen ruokamäärä. Huomioi rodun, iän, painon ja aktiivisuuden. Käytä virallisia annostelutaulukoita."
        keywords="pentulaskuri, ruokalaskuri, koiranpennun ruokinta, annostelu, ruokamäärä, penturuoka"
        structuredData={structuredData}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">
            Pentulaskuri - Ruokamäärä
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, painon ja aktiivisuustason.
          </p>
        </header>
        
        <EnhancedPuppyCalculator />
        
        <div className="mt-12">
          <FAQ items={faqs} />
        </div>
      </div>
    </div>
  )
}

export default Calculator