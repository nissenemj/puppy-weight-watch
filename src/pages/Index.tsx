import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, Calculator, Book, TrendingUp, Shield, Clock, Target, Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import MeshBackground from '@/components/MeshBackground'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import { trackHeroCTAClicked, trackPageViewed } from '@/utils/analytics'
import { entranceAnimations } from '@/animations'


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
      answer: "Terve pentu yleensä kaksinkertaist AA syntymäpainonsa ensimmäisen viikon aikana ja kolminkertaistaa sen kahden viikon ikään mennessä."
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
    <div className="min-h-screen flex flex-col gap-16 pb-20">
      <SEO
        title="Pentulaskuri - Koiran Kasvun & Ruokinnan Seuranta"
        description="Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. Seuraa painoa, ruokintaa ja kehitystä ammattimaisilla työkaluilla. Ilmainen käyttö."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kas vu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus, moderni"
        structuredData={structuredData}
        url={window.location.origin}
      />

      {/* Video Hero Section - pt-16/pt-20 for fixed navigation */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-start justify-end overflow-hidden pt-16 md:pt-20">
        {/* Video Background */}
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={(e) => {
            // Pysäytä viimeiseen ruutuun
            const video = e.currentTarget;
            video.currentTime = video.duration;
          }}
        >
          <source src="/videos/Video_Generation_Complete.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay - tummennus oikeaan laitaan tekstin taakse */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />

        {/* Hero Content - sijoitettu oikeaan yläkulmaan */}
        <div className="relative z-10 max-w-lg text-right pt-12 md:pt-24 pr-4 md:pr-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={entranceAnimations.staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={entranceAnimations.staggerChild} className="flex justify-end">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-terracotta-300" />
                Uusi ja moderni tapa seurata kasvua
              </Badge>
            </motion.div>

            <motion.h1
              variants={entranceAnimations.staggerChild}
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Älykkäät työkalut <br />
              <span className="text-terracotta-300">vastuulliseen hoitoon</span>
            </motion.h1>

            <motion.p
              variants={entranceAnimations.staggerChild}
              className="text-base md:text-lg text-white/90 leading-relaxed"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              Tiedepohjaiset mittaustyökalut ja asiantunteva ohjaus tukevat vastuullista koiranhoitoa.
            </motion.p>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="flex flex-col sm:flex-row items-end justify-end gap-3 pt-2"
            >
              <Link
                to="/weight-tracker"
                onClick={() => trackHeroCTAClicked('Aloita seuranta ilmaiseksi', '/weight-tracker')}
              >
                <Button size="lg" className="h-12 px-6 text-base shadow-lg shadow-terracotta-500/30">
                  <Scale className="w-5 h-5 mr-2" />
                  Aloita seuranta
                </Button>
              </Link>
              <Link to="/guides">
                <Button variant="outline" size="lg" className="h-12 px-6 text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  Lue oppaat
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="pt-4 flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm font-medium text-white/80"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta-300" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mesh Background for rest of page */}
      <MeshBackground variant="default" />

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