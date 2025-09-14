
import React from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Database, AlertTriangle, Utensils, Shield, Heart, Users, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import { AnimatedCard } from '@/components/ui/animated-card'
import { createArticleSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData'
import heroImage from '@/assets/puppy-care-guide.jpg'

export default function InfoHome() {
  const faqs = [
    {
      question: "Mikä on ero täysravinnon ja täydennysravinnon välillä?",
      answer: "Täysravinto on suunniteltu kattamaan yksinään kaikki koiran päivittäiset ravintotarpeet, kun taas täydennysravinto on tarkoitettu käytettäväksi muun ruoan ohella."
    },
    {
      question: "Onko raakaruokinta turvallista pennuille?",
      answer: "Helsingin yliopiston tutkimusten mukaan vähintään 20% raakaruokaa pennun ruokavaliossa vähentää allergia- ja atopiaoireita aikuisiässä merkittävästi."
    },
    {
      question: "Kuinka usein pennun ruokamäärää tulee säätää?",
      answer: "Pennun ruokamäärää tulee tarkistaa ja säätää viikoittain kasvun ja painonnousun mukaan ensimmäisten kuukausien ajan."
    }
  ];

  const breadcrumbs = [
    { name: "Etusivu", url: window.location.origin },
    { name: "Tietopankki", url: `${window.location.origin}/info` }
  ];

  const structuredData = [
    createArticleSchema(
      "Penturuoka-opas - Koiranpentujen ruokinta ja ravitsemus",
      "Laaja katsaus Suomessa myytäviin koiranpentujen ruokiin ja niiden annosteluun ohjelmistokehityksen näkökulmasta"
    ),
    createFAQSchema(faqs),
    createBreadcrumbSchema(breadcrumbs)
  ];

  return (
    <MobileOptimizedLayout>
    <div className="min-h-screen bg-gradient-soft page-with-navigation no-horizontal-scroll mobile-text-wrap responsive-media full-width-section">
      <SEO
        title="Tietopankki - Penturuoka-opas"
        description="Laaja katsaus koiranpentujen ruokintaan ja ravitsemukseen. Kuiva-, märkä- ja raakaruokien analyysi, annostelutiedot ja turvallisuusohjeet."
        keywords="penturuoka, koiranpennun ruokinta, ruokatyypit, annostelu, turvallisuus, Helsingin yliopisto, DogRisk"
        type="article"
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Dribbble-inspired Hero Header */}
      <div className="relative overflow-hidden bg-gradient-warm mobile-text-wrap responsive-media">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center mobile-grid-1">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Reaaliaikainen tietopankki
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Penturuoka-
                <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-200 bg-clip-text">
                  opas
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Laaja katsaus Suomessa myytäviin koiranpentujen ruokiin ja niiden annosteluun 
                <span className="font-semibold">ohjelmistokehityksen näkökulmasta</span>
              </p>
              
              
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <img 
                    src={heroImage} 
                    alt="Penturuoka-opas dashboard" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-10 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-width-content py-16">

        {/* Introduction Card */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6" />
              Johdanto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground leading-relaxed">
              Koiranpennun elämän ensimmäiset kuukaudet muodostavat ravitsemuksellisesti kriittisen ajanjakson, 
              joka luo perustan sen koko aikuisiän terveydelle ja hyvinvoinnille. Tämän nopean kasvun vaiheen aikana 
              pennun energia- ja ravintoainetarpeet ovat poikkeuksellisen korkeat suhteessa sen kehonpainoon.
            </p>
            <p className="text-card-foreground leading-relaxed mt-4">
              Tämän raportin tavoitteena on tarjota syvällinen ja dataan perustuva katsaus Suomen koiranpentujen 
              ruokamarkkinoihin erityisesti ohjelmistokehityksen näkökulmasta.
            </p>
          </CardContent>
        </Card>

        {/* Modern Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link to="/info/food-types" className="group">
            <AnimatedCard delay={0.1} className="h-full">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-2xl border border-orange-200/50 dark:border-orange-800/50 group-hover:border-orange-300/70 dark:group-hover:border-orange-700/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">Ruokatyypit</h3>
                <p className="text-blue-900 dark:text-blue-200 text-sm leading-relaxed mb-4">
                  Syväanalyysi kuiva-, märkä- ja raakaruokien eduista ja haitoista. Vertailu ravintosisällöstä ja soveltuvuudesta eri ikäkausiin.
                </p>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Lue lisää →</div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/info/feeding-data" className="group">
            <AnimatedCard delay={0.2} className="h-full">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 group-hover:border-blue-300/70 dark:group-hover:border-blue-700/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Annostelutiedot</h3>
                <p className="text-orange-900 dark:text-orange-200 text-sm leading-relaxed mb-4">
                  Tarkat laskukaavat ja suositukset pennun ruokamäärille. Ikä-, paino- ja rotukohtaiset ohjeet optimaalisen kasvun varmistamiseksi.
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tutustu dataan →</div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/info/safety" className="group">
            <AnimatedCard delay={0.3} className="h-full">
              <div className="bg-gradient-to-br from-red-100 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-red-200/50 dark:border-red-800/50 group-hover:border-red-300/70 dark:group-hover:border-red-700/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Turvallisuus</h3>
                <p className="text-green-900 dark:text-green-200 text-sm leading-relaxed mb-4">
                  Tuotevetoja, varoituksia ja turvallisuusohjeita. Ajankohtaiset uutiset ruokaturvallisuudesta ja vaarallisista ainesosista.
                </p>
                <div className="text-xs text-red-600 dark:text-red-400 font-medium">Turvallisuusinfo →</div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/info/puppy-guide" className="group">
            <AnimatedCard delay={0.4} className="h-full">
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 group-hover:border-green-300/70 dark:group-hover:border-green-700/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Pennun ruokintaopas</h3>
                <p className="text-red-900 dark:text-red-200 text-sm leading-relaxed mb-4">
                  Kattava vaiheittainen opas pennun ruokintaan syntymästä aikuistumiseen. Siirtymät, aikataulut ja erityistilanteet.
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Ruokintaopas →</div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/info/socialization-guide" className="group">
            <AnimatedCard delay={0.5} className="h-full">
              <div className="bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 group-hover:border-purple-300/70 dark:group-hover:border-purple-700/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">Sosiaalistamisopas</h3>
                <p className="text-lime-900 dark:text-lime-200 text-sm leading-relaxed mb-4">
                  Opas pennun sosiaalistamiseen ja käyttäytymiseen. Kohtaamiset, harjoittelu ja yhteisön rakentaminen pennun ympärille.
                </p>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Sosiaalistimine →</div>
              </div>
            </AnimatedCard>
          </Link>
        </div>


        <div className="mt-12">
          <FAQ items={faqs} />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Aloita tutkiminen
          </h2>
          <p className="text-muted-foreground mb-6">
            Tutki yksityiskohtaisia tietoja Suomen penturuokamarkkinoista
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/info/food-types">
              <Button size="lg">
                Tutustu ruokatyyppeihin
              </Button>
            </Link>
            <Link to="/info/feeding-data">
              <Button size="lg" variant="outline">
                Selaa annostelutietoja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </MobileOptimizedLayout>
  )
}
