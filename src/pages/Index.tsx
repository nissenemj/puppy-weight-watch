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

// Import new hero illustrations
import heroMainIllustration from '@/assets/hero-main-illustration.png'
import growthChartHero from '@/assets/growth-chart-hero.png'
import growthStages from '@/assets/growth-stages.png'

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
      <SEO
        title="Pentulaskuri - Koiran Kasvun & Ruokinnan Seuranta"
        description="Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. Seuraa painoa, ruokintaa ja kehitystä ammattimaisilla työkaluilla. Ilmainen käyttö."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus, moderni"
        structuredData={structuredData}
        url={window.location.origin}
      />

      {/* Pan Hero Section */}
      <section className="pb-4 no-horizontal-scroll mobile-text-wrap responsive-media">
        <ScrollPanBackground src={heroMainIllustration} alt="Kuvitus: pentu kasvukäyrän ja datan edessä" panX={40} panY={20} zoom={1.04} minHeightClass="min-h-[50svh]">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial="hidden" animate="visible" variants={entranceAnimations.staggerContainer}>
              <motion.div variants={entranceAnimations.staggerChild} className="mb-4">
                <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)]">
                  <Sparkles className="w-4 h-4 mr-2" /> Uusi ja moderni
                </Badge>
              </motion.div>
              <motion.h1 variants={entranceAnimations.staggerChild} className="text-display-1 mb-2 text-white drop-shadow">
                Pennun kasvu
                <br />
                <span className="text-accent">ammattimaisesti</span>
              </motion.h1>
              <motion.p variants={entranceAnimations.staggerChild} className="text-body-xl text-white/90 max-w-3xl mx-auto">
                Seuraa kasvua, ruokintaa ja kehitystä – ilmaiseksi. Aloita minuutissa.
              </motion.p>
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </ScrollPanBackground>
      </section>

      {/* How it works: sticky horizontal steps */}
      <Section className="py-12">
        <h2 className="sr-only">Miten palvelu toimii</h2>
        <StickyHorizontalGallery
          items={[
            { id: 'h1', content: (<div><h3 className="text-h2 mb-2">1. Luo profiili</h3><p className="text-muted">Aloita nopeasti ilman rekisteröintiä – tallenna myöhemmin.</p></div>) },
            { id: 'h2', content: (<div><h3 className="text-h2 mb-2">2. Seuraa painoa</h3><p className="text-muted">Lisää viikoittaiset merkinnät ja katso kehitys graafeina.</p></div>) },
            { id: 'h3', content: (<div><h3 className="text-h2 mb-2">3. Laske ruokamäärä</h3><p className="text-muted">Saat suositukset iän, rodun ja aktiivisuuden mukaan.</p></div>) },
            { id: 'h4', content: (<div><h3 className="text-h2 mb-2">4. Tutustu oppaaseen</h3><p className="text-muted">Tietopankki ja turvallisuusvinkit yhden napin takana.</p></div>) },
          ]}
        />
      </Section>

      {/* Hero Section */}
      <Section className="pt-24 pb-16 mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="xl" padding="lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={entranceAnimations.staggerContainer}
              className="text-left"
            >
              <motion.div
                variants={entranceAnimations.staggerChild}
                className="mb-6"
              >
                <Badge className="bg-[var(--color-accent-50)] text-[var(--color-accent)] border-[var(--color-accent-200)] mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Uusi ja moderni
                </Badge>
              </motion.div>

              <motion.h1 
                variants={entranceAnimations.staggerChild}
                className="text-display-1 mb-6"
              >
                Pennun kasvu
                <br />
                <span className="text-accent">ammattimaisesti</span>
              </motion.h1>
              
              <motion.p 
                variants={entranceAnimations.staggerChild}
                className="text-body-xl text-muted mb-8 max-w-lg"
              >
                Seuraa koiranpentusi kasvua, ruokintaa ja kehitystä modernilla sovelluksella. 
                Täysin ilmainen käyttö ammattimaisilla työkaluilla.
              </motion.p>

              <motion.div
                variants={entranceAnimations.staggerChild}
                className="flex flex-col sm:flex-row gap-4 mb-8 mobile-button"
              >
                <Link to="/weight-tracker" aria-label="Aloita pennun painonseuranta – siirry painonseurantasivulle">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Scale className="w-5 h-5 mr-2" />
                    Aloita nyt – 1 min
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
                className="flex flex-wrap gap-6"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-body-sm text-muted">
                    <benefit.icon className="w-4 h-4 text-accent" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={heroMainIllustration}
                  alt="Pentulaskuri hero illustration"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
                
                {/* Floating stats */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-h6 font-semibold">98%</div>
                      <div className="text-caption text-muted">Tyytyväisyys</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-6 glass rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-h6 font-semibold">10k+</div>
                      <div className="text-caption text-muted">Käyttäjää</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="py-20 bg-[var(--color-surface-alt)] mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="xl" padding="lg">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6">
              Kaikki mitä tarvitset
              <br />
              <span className="text-accent">pennun kasvuun</span>
            </h2>
            <p className="text-body-xl text-muted max-w-3xl mx-auto">
              Ammattimaiset työkalut koiran kehityksen seuraamiseen ja optimoimiseen
            </p>
          </div>

          <CardGrid cols={2} gap="lg" stagger>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link key={index} to={feature.href}>
                  <Card variant={index === 0 ? "elevated" : "default"} className="h-full group cursor-pointer">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                        index === 0 ? 'bg-accent' : 'bg-[var(--color-primary-100)]'
                      }`}>
                        <Icon className={`w-7 h-7 ${
                          index === 0 ? 'text-white' : 'text-[var(--color-primary)]'
                        }`} />
                      </div>
                      <CardTitle className="group-hover:text-accent transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                        <span>Tutustu</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </CardGrid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="py-20 mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="xl" padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-4">Luotettu ratkaisu</h2>
            <p className="text-body-lg text-muted">
              Tuhannet koiranomistajat luottavat meihin päivittäin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mobile-grid-1">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-display-3 font-bold text-accent mb-2">
                  {stat.text ? (
                    stat.text
                  ) : (
                    <CountUp to={stat.numeric!} suffix={stat.suffix as string} />
                  )}
                </div>
                <div className="text-body-sm text-muted">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Growth Chart Section */}
      <Section className="py-20 bg-[var(--color-surface-alt)] mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="xl" padding="lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={growthChartHero}
                alt="Kasvukäyrä esimerkki"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>

            <div>
              <h2 className="text-h1 mb-6">
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
      <Section className="py-20">
        <Container size="lg" padding="lg">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-6">Usein kysytyt kysymykset</h2>
            <p className="text-body-lg text-muted">
              Vastaukset yleisimpiin pennun kasvua ja ruokintaa koskeviin kysymyksiin
            </p>
          </div>
          
          <FAQ items={faqs} />
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-white mobile-text-wrap responsive-media no-horizontal-scroll">
        <Container size="lg" padding="lg">
          <div className="text-center">
            <h2 className="text-h1 mb-6">
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