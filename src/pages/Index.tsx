import React from 'react'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout, Container, Section, CardGrid, Stack } from '@/components/ui/Layout'
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

  const stats = [
    { numeric: 10000, suffix: "+", label: "Tyytyväistä käyttäjää" },
    { numeric: 50000, suffix: "+", label: "Seurattua mittausta" },
    { numeric: 98, suffix: "%", label: "Tyytyväisyysprosentti" },
    { text: "24/7", label: "Käytettävyys" }
  ];

  return (
    <MobileOptimizedLayout>
    <PageLayout variant="default" animated>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
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
      <section className="no-horizontal-scroll mobile-text-wrap responsive-media mobile-container-safe" role="banner" aria-label="Pääbanneri">
        <ScrollPanBackground src={heroMainIllustration} alt="Kuvitus: pentu kasvukäyrän ja datan edessä" panX={40} panY={20} zoom={1.04} minHeightClass="min-h-[50svh]" className="no-horizontal-scroll">
          <div className="container mx-auto text-center mobile-grid-1 mobile-container-safe mobile-text-container mobile-hero-container relative z-40">
            <motion.div initial="hidden" animate="visible" variants={entranceAnimations.staggerContainer}>
              <motion.div variants={entranceAnimations.staggerChild} className="mb-4">
                <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)] relative z-50 shadow-lg">
                  <Heart className="w-4 h-4 mr-2" /> Älykäs ja luotettava
                </Badge>
              </motion.div>
              <motion.h1 variants={entranceAnimations.staggerChild} className="text-display-1 mb-2 text-white relative z-50 font-display" id="main-heading">
                Huolellista
                <br />
                <span className="text-accent">pennun hoitoa</span>
              </motion.h1>
              <motion.p variants={entranceAnimations.staggerChild} className="text-body-xl text-white/90 max-w-2xl mx-auto relative z-50 leading-relaxed">
                Ammattitasoinen seuranta ja ohjaus pennun terveelle kasvulle ja hyvinvoinnille.
              </motion.p>
            </motion.div>
          </div>
        </ScrollPanBackground>
      </section>

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
            <Button size="lg" className="min-w-[220px]">
              Aloita seuranta – 1 min
            </Button>
          </Link>
        </div>
      </Section>

      {/* Hero Section */}
      <Section className="pt-24 pb-16 mobile-text-wrap responsive-media no-horizontal-scroll mobile-grid-1">
        <Container size="full" padding="lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
            
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
                <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)] mb-3">
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
                  <Button size="lg" className="w-full sm:w-auto">
                    <Scale className="w-5 h-5 mr-2" />
                    Aloita mittaaminen
                  </Button>
                </Link>
                
                <Link to="/calculator" aria-label="Avaa pentulaskuri – laske ruokamäärät">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Calculator className="w-5 h-5 mr-2" />
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
                />
                
                {/* Simplified floating stat */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-3 bg-white rounded-xl p-3 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Tarkkaa</div>
                      <div className="text-xs text-muted">seurantaa</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </Container>
      </Section>

      {/* Features Section */}
<<<<<<< HEAD
      <Section className="py-20 bg-[var(--color-surface-alt)] mobile-text-wrap responsive-media no-horizontal-scroll mobile-grid-1">
        <Container size="full" padding="lg">
          <div className="text-center mb-16 max-w-4xl mx-auto px-4">
            <h2 className="text-h1 mb-6">
=======
      <Section className="bg-[var(--color-surface-alt)] mobile-text-wrap responsive-media no-horizontal-scroll mobile-grid-1 mobile-container-safe mobile-card-safe" role="region" aria-labelledby="features-heading">
        <Container size="xl" padding="none">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6" id="features-heading">
>>>>>>> f438052 (fix: keep nav above hero via higher z-index)
              Kaikki mitä tarvitset
              <br />
              <span className="text-accent">pennun kasvuun</span>
            </h2>
            <p className="text-body-xl text-muted max-w-3xl mx-auto">
              Ammattimaiset työkalut koiran kehityksen seuraamiseen ja optimoimiseen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const variants = ['gradient', 'glass', 'modern', 'elevated']
              const variant = variants[index % variants.length]
              
              return (
<<<<<<< HEAD
                <Link key={index} to={feature.href}>
                  <Card variant={variant as any} className="h-full group cursor-pointer">
=======
                <Link key={index} to={feature.href} aria-label={`Siirry ${feature.title.toLowerCase()} -sivulle: ${feature.description}`}>
                  <Card variant={index === 0 ? "elevated" : "default"} className="h-full group cursor-pointer">
>>>>>>> f438052 (fix: keep nav above hero via higher z-index)
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                        index === 0 ? 'bg-white/20' : 'bg-[var(--color-primary-100)]'
                      }`}>
                        <Icon className={`w-7 h-7 ${
                          index === 0 ? 'text-white' : 'text-[var(--color-primary)]'
                        }`} />
                      </div>
                      <CardTitle className={`group-hover:text-accent transition-colors ${
                        index === 0 ? 'text-white' : ''
                      }`}>
                        {feature.title}
                      </CardTitle>
                      <CardDescription className={index === 0 ? 'text-white/80' : ''} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`flex items-center gap-2 font-medium group-hover:gap-3 transition-all ${
                        index === 0 ? 'text-white' : 'text-accent'
                      }`}>
                        <span>Tutustu</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
<<<<<<< HEAD
      <Section className="py-20 mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="full" padding="lg">
          <div className="text-center mb-12 max-w-4xl mx-auto px-4">
            <h2 className="text-h2 mb-4">Luotettu ratkaisu</h2>
=======
      <Section className="mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-text-container" role="region" aria-labelledby="stats-heading">
        <Container size="xl" padding="none">
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4" id="stats-heading">Luotettu ratkaisu</h2>
>>>>>>> f438052 (fix: keep nav above hero via higher z-index)
            <p className="text-body-lg text-muted">
              Tuhannet koiranomistajat luottavat meihin päivittäin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            {stats.map((stat, index) => {
              const variants = ['modern', 'glass', 'elevated', 'gradient']
              const variant = variants[index % variants.length]
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card variant={variant as any} className="text-center p-8 h-full">
                    <div className={`text-display-3 font-bold mb-2 ${
                      variant === 'gradient' ? 'text-white' : 'text-accent'
                    }`}>
                      {stat.text ? (
                        stat.text
                      ) : (
                        <CountUp to={stat.numeric!} suffix={stat.suffix as string} />
                      )}
                    </div>
                    <div className={`text-body-sm ${
                      variant === 'gradient' ? 'text-white/80' : 'text-muted'
                    }`}>
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Growth Chart Section */}
      <Section className="bg-[var(--color-surface-alt)] mobile-text-wrap responsive-media no-horizontal-scroll mobile-grid-1 mobile-container-safe mobile-flex-safe" role="region" aria-labelledby="growth-chart-heading">
        <Container size="xl" padding="none">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <LazyImage 
                src={growthChartHero}
                alt="Kasvukäyrä esimerkki"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>

            <div>
              <h2 className="text-h1 mb-6" id="growth-chart-heading">
                Seuraa kasvua
                <br />
                <span className="text-accent">visuaalisesti</span>
              </h2>
              
              <p className="text-body-lg text-muted mb-8">
                Näe pennun kehitys selkeillä kaavioilla ja vertaa sitä rotukohtaisiin keskiarvoihin. 
                Automaattiset hälytykset auttavat havaitsemaan poikkeamat ajoissa.
              </p>

              <Stack spacing="md" className="mb-8">
                {[
                  "Interaktiiviset kasvukäyrät",
                  "Rotukohtaiset vertailut", 
                  "Automaattiset hälytykset",
                  "Edistymisen seuranta"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
                    <span className="text-body">{item}</span>
                  </div>
                ))}
              </Stack>

              <Link to="/weight-tracker">
                <Button size="lg" className="w-full sm:w-auto">
                  Aloita seuranta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="mobile-container-safe mobile-text-container" role="region" aria-labelledby="faq-heading">
        <Container size="lg" padding="none">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6" id="faq-heading">Usein kysytyt kysymykset</h2>
            <p className="text-body-lg text-muted">
              Vastaukset yleisimpiin pennun kasvua ja ruokintaa koskeviin kysymyksiin
            </p>
          </div>
          
          <FAQ items={faqs} />
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-white mobile-text-wrap responsive-media no-horizontal-scroll mobile-container-safe mobile-text-container" role="region" aria-labelledby="cta-heading">
        <Container size="lg" padding="none">
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
        </Container>
      </Section>

      {/* Footer */}
      <Footer />
      
    </PageLayout>
    </MobileOptimizedLayout>
  )
}

export default Index
