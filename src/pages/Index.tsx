import React from 'react'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import { Button } from '@/components/ui/button'
import { PageLayout, Container, Section, Stack } from '@/components/ui/Layout'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Scale, 
  Calculator, 
  Book, 
  TrendingUp, 
  Heart,
  Award,
  Users,
  Target,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { entranceAnimations, hoverAnimations, componentAnimations } from '@/animations'
import StickyHorizontalGallery from '@/components/StickyHorizontalGallery'
import CountUp from '@/components/CountUp'
import ScrollPanBackground from '@/components/ScrollPanBackground'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import LazyImage from '@/components/LazyImage'

// Import new abstract illustrations
import heroMainIllustration from '@/assets/abstract-hero-main.svg'
import growthChartHero from '@/assets/abstract-growth-chart.svg'
import growthStages from '@/assets/abstract-growth-stages.svg'
import appIcon from '@/assets/app-icon.png'

const Index = () => {
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
      description: "Seuraa pennun kasvua ja painoa visuaalisilla kaavioilla",
      href: "/weight-tracker",
      variant: "primary"
    },
    {
      icon: Calculator,
      title: "Ruokalaskuri",
      description: "Laske optimaalinen ruokamäärä pennun iän ja painon mukaan",
      href: "/calculator",
      variant: "secondary"
    },
    {
      icon: Book,
      title: "Pentukirja",
      description: "Tallenna pennun tärkeimmät hetket ja virstanpylväät",
      href: "/puppy-book",
      variant: "secondary"
    },
    {
      icon: TrendingUp,
      title: "Kasvukäyrät",
      description: "Vertaa pennun kasvua rotukohtaisiin keskiarvoihin",
      href: "/info",
      variant: "secondary"
    }
  ];

  const benefits = [
    { icon: Shield, text: "100% ilmainen käyttö" },
    { icon: Clock, text: "Nopea ja helppokäyttöinen" },
    { icon: Target, text: "Tarkat laskelmat ja seuranta" },
    { icon: Heart, text: "Suunniteltu rakkauden vuoksi" }
  ];

  const cards = [
    {
      icon: TrendingUp,
      title: "Älykkäät kasvukäyrät",
      description: "Vertaa pennun kasvua rotukohtaisiin keskiarvoihin ja seuraa kehitystä",
      href: "/weight-tracker",
      variant: "primary" as const
    },
    {
      icon: Calculator,
      title: "Tarkka ruokalaskuri",
      description: "Laske optimaalinen ruokamäärä pennun iän ja painon mukaan",
      href: "/calculator",
      badge: "Tulossa oleva ominaisuus",
      variant: "secondary" as const
    },
    {
      icon: Book,
      title: "Pentukirja",
      description: "Tallenna pennun tärkeimmät hetket, virstanpylväät ja muistot",
      href: "/puppy-book",
      cta: "Tutustu ominaisuuteen",
      variant: "accent" as const
    }
  ];

  return (
    <MobileOptimizedLayout>
      <Navigation />
    <PageLayout variant="default" animated>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="skip-link focus-enhanced"
      >
        Siirry pääsisältöön
      </a>
      <SEO
        title="Pentulaskuri - Koiran Kasvun & Ruokinnan Seuranta"
        description="Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. Seuraa painoa, ruokintaa ja kehitystä ammattimaisilla työkaluilla. Ilmainen käyttö."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus, moderni"
        structuredData={structuredData}
        url={window.location.origin}
      />

      {/* Pan Hero Section */}
      <header className="full-width-section no-horizontal-scroll mobile-text-wrap responsive-media mobile-container-safe" role="banner" aria-labelledby="main-heading">
        <ScrollPanBackground src={heroMainIllustration} alt="Kuvitus: pentu kasvukäyrän ja datan edessä" panX={40} panY={20} zoom={1.04} minHeightClass="min-h-[50svh]" className="no-horizontal-scroll">
          <div className="hero-content text-center mobile-grid-1 mobile-container-safe mobile-text-container mobile-hero-container relative z-40">
            <motion.div initial="hidden" animate="visible" variants={entranceAnimations.staggerContainer}>
              <motion.div variants={entranceAnimations.staggerChild} className="mb-4">
                <Badge className="bg-[var(--color-primary-100)] text-[var(--color-primary-600)] border-[var(--color-primary-300)] relative z-50 shadow-lg">
                  <Heart className="w-4 h-4 mr-2" /> Älykäs ja luotettava
                </Badge>
              </motion.div>
              <motion.h1 variants={entranceAnimations.staggerChild} className="text-display-1 mb-2 text-white relative z-50 font-display" id="main-heading">
                Huolellista
                <br />
                <span className="text-[var(--color-primary-500)]">pennun hoitoa</span>
              </motion.h1>
              <motion.p variants={entranceAnimations.staggerChild} className="text-body-xl text-white/90 max-w-2xl mx-auto relative z-50 leading-relaxed">
                Ammattitasoinen seuranta ja ohjaus pennun terveelle kasvulle ja hyvinvoinnille.
              </motion.p>
            </motion.div>
          </div>
        </ScrollPanBackground>
      </header>

      {/* How it works: sticky horizontal steps */}
      <Section role="region" aria-labelledby="how-it-works-heading">
        <h2 className="sr-only" id="how-it-works-heading">Miten palvelu toimii</h2>
        <StickyHorizontalGallery
          items={[
            { id: 'h1', content: (<div><h3 className="text-h2 mb-2">1. Aloita (profiili valinnainen)</h3><p className="text-muted">Voit seurata heti ilman rekisteröintiä – tallenna myöhemmin, jos haluat.</p></div>) },
            { id: 'h2', content: (<div><h3 className="text-h2 mb-2">2. Lisää paino viikoittain</h3><p className="text-muted">Syötä mittaus 10 sekunnissa. Näet muutoksen ja trendin yhdellä vilkaisulla.</p></div>) },
            { id: 'h3', content: (<div><h3 className="text-h2 mb-2">3. Laske ruokamäärä</h3><p className="text-muted">Suositus pennun iän, rodun ja aktiivisuuden mukaan. Päivitä helposti.</p></div>) },
            { id: 'h4', content: (<div><h3 className="text-h2 mb-2">4. Opas ja vinkit</h3><p className="text-muted">Selkeät ohjeet ruokintaan, sosiaalistamiseen ja turvallisuuteen.</p></div>) },
          ]}
        />

        <div className="mt-8 text-center">
          <Link to="/weight-tracker" aria-label="Aloita seuranta – siirry painonseurantaan">
            <Button size="lg" className="w-full sm:min-w-[220px] sm:w-auto touch-target focus-enhanced">
              Aloita seuranta – 1 min
            </Button>
          </Link>
        </div>
      </Section>

      {/* Hero Section */}
      <Section className="full-width-section mobile-text-wrap responsive-media no-horizontal-scroll mobile-grid-1 mobile-container-safe mobile-flex-safe" role="main" aria-labelledby="hero-heading" id="main-content">
        <div className="full-width-content">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={entranceAnimations.staggerContainer}
              className="text-left"
            >
              <motion.div
                variants={entranceAnimations.staggerChild}
                className="mb-4"
              >
                <Badge className="bg-[var(--color-primary-100)] text-[var(--color-primary-600)] border-[var(--color-primary-300)] mb-3">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Uusi ja moderni
                </Badge>
              </motion.div>

              <motion.h2 
                variants={entranceAnimations.staggerChild}
                className="text-h1 mb-4 font-display"
                id="hero-heading"
              >
                Älykkäät työkalut
                <br />
                <span className="text-accent">vastuulliseen hoitoon</span>
              </motion.h2>
              
              <motion.p 
                variants={entranceAnimations.staggerChild}
                className="text-body-lg text-muted mb-6 max-w-xl leading-relaxed"
              >
                Tiedepohjaiset mittaustyökalut ja asiantunteva ohjaus tukevat vastuullista koiranhoitoa ja pennun optimaalista kehitystä.
              </motion.p>

              <motion.div
                variants={entranceAnimations.staggerChild}
                className="flex flex-col sm:flex-row gap-3 mb-6 mobile-button"
              >
                <Link to="/weight-tracker" aria-label="Aloita pennun painonseuranta – siirry painonseurantasivulle">
                  <Button size="lg" className="w-full sm:w-auto touch-target focus-enhanced">
                    <Scale className="w-5 h-5 mr-2" aria-hidden="true" />
                    Aloita mittaaminen
                  </Button>
                </Link>
                
                <Link to="/calculator" aria-label="Avaa pentulaskuri – laske ruokamäärät">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto touch-target focus-enhanced">
                    <Calculator className="w-5 h-5 mr-2" aria-hidden="true" />
                    Ruokalaskuri
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={entranceAnimations.staggerChild}
                className="flex flex-wrap gap-4"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-body-sm text-muted">
                    <benefit.icon className="w-4 h-4 text-accent" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Hero Image - optimized and smaller */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto">
                <LazyImage 
                  src={growthStages}
                  alt="Pennun kasvuvaiheet"
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </Section>


      {/* FAQ Section */}
      <Section className="full-width-section mobile-container-safe mobile-text-container" role="region" aria-labelledby="faq-heading">
        <div className="content-narrow">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6" id="faq-heading">Usein kysytyt kysymykset</h2>
            <p className="text-body-lg text-muted">
              Vastaukset yleisimpiin pennun kasvua ja ruokintaa koskeviin kysymyksiin
            </p>
          </div>
          
          <FAQ items={faqs} />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="full-width-section bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-white mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-text-container" role="region" aria-labelledby="cta-heading">
        <div className="content-narrow">
          <div className="text-center">
            <h2 className="text-h1 mb-6" id="cta-heading">
              Aloita pennun seuranta tänään
            </h2>
            <p className="text-body-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Liity tuhansien tyytyväisten koiranomistajien joukkoon. 
              Täysin ilmainen - ei piilokustannuksia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mobile-button">
              <Link to="/weight-tracker">
                <Button 
                  size="xl" 
                  variant="secondary"
                  className="bg-white text-[var(--color-accent)] hover:bg-white/90"
                >
                  <Scale className="w-5 h-5 mr-2" />
                  Aloita ilmaiseksi
                </Button>
              </Link>
              <Link to="/info">
                <Button 
                  size="xl" 
                  variant="ghost"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Lue lisää
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Footer />
      
    </PageLayout>
    </MobileOptimizedLayout>
  )
}

export default Index