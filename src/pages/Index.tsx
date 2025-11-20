import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, Calculator, Book, TrendingUp, Shield, Clock, Target, Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import { trackHeroCTAClicked, trackPageViewed } from '@/utils/analytics'
import { entranceAnimations } from '@/animations'

// Import assets
import pentulaskuriHero from '@/assets/pentulaskuri-hero.png'

const Index = () => {
  // Track page view
  useEffect(() => {
    trackPageViewed('Homepage', '/');
  }, []);

  const faqs = [
    {
      question: "Kuinka usein minun pitäisi punnita pentuni?",
      answer: "Pennut tulisi punnita viikoittain ensimmäisten kuukausien ajan. Tämä auttaa seuraamaan kasvua ja varmistamaan, että pentu kehittyy normaalisti."
    },
    {
      question: "Milloin pentu saavuttaa aikuispainonsa?",
      answer: "Pienet rodut saavuttavat aikuispainonsa noin 8-12 kuukaudessa, keskikokoiset 12-15 kuukaudessa ja suuret rodut 18-24 kuukaudessa."
    },
    {
      question: "Mikä on normaali painonnousu pennulle?",
      answer: "Terve pentu yleensä kaksinkertaistaa syntymäpainonsa ensimmäisen viikon aikana ja kolminkertaistaa sen kahden viikon ikään mennessä."
    },
    {
      question: "Voiko sovellusta käyttää ilman rekisteröitymistä?",
      answer: "Kyllä! Voit käyttää perusominaisuuksia ilman rekisteröitymistä. Rekisteröityminen mahdollistaa tietojen tallentamisen ja synkronoinnin."
    },
    {
      question: "Kuinka paljon ruokaa pentu tarvitsee painon mukaan?",
      answer: "Ruokamäärä lasketaan elopainokiloa kohden. Pienet rodut (1-5 kg): 42g/kg 6 viikon iässä, vähennetään 31g/kg 7 kuukauteen mennessä. Suuret rodut (10-20 kg): 26g/kg 6 viikon iässä, vähennetään 19g/kg 8 kuukauteen mennessä."
    }
  ];

  const structuredData = [
    createWebApplicationSchema(),
    createWeightTrackingSchema(),
    createFAQSchema(faqs)
  ];

  const features = [
    {
      icon: Scale,
      title: "Painonseuranta",
      description: "Seuraa pennun kasvua ja painoa visuaalisilla kaavioilla. Tallenna mittaukset helposti.",
      href: "/weight-tracker",
      cta: "Aloita seuranta"
    },
    {
      icon: Calculator,
      title: "Ruokalaskuri",
      description: "Laske optimaalinen ruokamäärä pennun iän, painon ja aktiivisuuden mukaan.",
      href: "/calculator",
      cta: "Laske annos"
    },
    {
      icon: Book,
      title: "Pentukirja",
      description: "Tallenna pennun tärkeimmät hetket, virstanpylväät ja muistot yhteen paikkaan.",
      href: "/puppy-book",
      cta: "Avaa kirja"
    },
    {
      icon: TrendingUp,
      title: "Kasvukäyrät",
      description: "Vertaa pennun kasvua rotukohtaisiin keskiarvoihin ja varmista terve kehitys.",
      href: "/guides",
      cta: "Lue lisää"
    }
  ];

  const benefits = [
    { icon: Shield, text: "100% ilmainen käyttö" },
    { icon: Clock, text: "Nopea ja helppokäyttöinen" },
    { icon: Target, text: "Tarkat laskelmat" },
    { icon: Heart, text: "Vastuullista hoitoa" }
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      <SEO
        title="Pentulaskuri - Koiran Kasvun & Ruokinnan Seuranta"
        description="Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. Seuraa painoa, ruokintaa ja kehitystä ammattimaisilla työkaluilla. Ilmainen käyttö."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus, moderni"
        structuredData={structuredData}
        url={window.location.origin}
      />

      {/* Hero Section */}
      <section className="relative pt-8 md:pt-16 pb-12 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-terracotta-50/50 via-stone-50 to-white" />

        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={entranceAnimations.staggerChild}>
              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm border-stone-200 text-stone-600 px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-terracotta-500" />
                Uusi ja moderni tapa seurata kasvua
              </Badge>
            </motion.div>

            <motion.h1
              variants={entranceAnimations.staggerChild}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-tight"
            >
              Älykkäät työkalut <br />
              <span className="text-terracotta-500">vastuulliseen hoitoon</span>
            </motion.h1>

            <motion.p
              variants={entranceAnimations.staggerChild}
              className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto"
            >
              Tiedepohjaiset mittaustyökalut ja asiantunteva ohjaus tukevat vastuullista koiranhoitoa ja pennun optimaalista kehitystä.
            </motion.p>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/weight-tracker"
                onClick={() => trackHeroCTAClicked('Aloita seuranta ilmaiseksi', '/weight-tracker')}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg shadow-lg shadow-terracotta-500/20">
                  <Scale className="w-5 h-5 mr-2" />
                  Aloita seuranta ilmaiseksi
                </Button>
              </Link>
              <Link to="/guides" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white/50 backdrop-blur-sm hover:bg-white">
                  Lue oppaat
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-stone-500"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sage-500" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={feature.href} className="block h-full group">
                <Card className="h-full hover:shadow-md transition-all duration-300 border-stone-200 group-hover:border-terracotta-200">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center mb-4 group-hover:bg-terracotta-50 transition-colors">
                      <feature.icon className="w-6 h-6 text-stone-600 group-hover:text-terracotta-600 transition-colors" />
                    </div>
                    <CardTitle className="group-hover:text-terracotta-700 transition-colors">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-semibold text-terracotta-600">
                      {feature.cta} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Usein kysytyt kysymykset</h2>
          <p className="text-lg text-stone-600">
            Vastaukset yleisimpiin pennun kasvua ja ruokintaa koskeviin kysymyksiin
          </p>
        </div>
        <FAQ items={faqs} />
      </section>
    </div>
  )
}

export default Index