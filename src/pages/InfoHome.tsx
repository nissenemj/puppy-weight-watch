
import React from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Database, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import { createArticleSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData'
import heroImage from '@/assets/welcome-illustration.png'

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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-2xl">
                  Aloita tutkiminen
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-white border-white/30 hover:bg-white/10 px-8 py-4 text-lg rounded-2xl"
                >
                  Katso demovideoita
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Tutkittua ruokaa</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">15k+</div>
                  <div className="text-white/80 text-sm">Datapistettä</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-white/80 text-sm">Tarkkuus</div>
                </div>
              </div>
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

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/info/food-types">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Ruokatyypit
                </CardTitle>
                <CardDescription>
                  Kuiva-, märkä- ja raakaruokien analyysi
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/info/feeding-data">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  Annostelutiedot
                </CardTitle>
                <CardDescription>
                  Yksityiskohtaiset annosteluohjeet
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/info/safety">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Turvallisuus
                </CardTitle>
                <CardDescription>
                  Tuoteturvallisuus ja ajankohtaiset uutiset
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/info/puppy-guide">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-accent/10 backdrop-blur-sm border-0 shadow-xl rounded-2xl border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-accent">
                  <BookOpen className="h-5 w-5" />
                  Pennun ruokintaopas
                </CardTitle>
                <CardDescription>
                  Kattava opas pennun ruokintaan ja ravitsemukseen
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/info/socialization-guide">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-primary/10 backdrop-blur-sm border-0 shadow-xl rounded-2xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <BookOpen className="h-5 w-5" />
                  Pennun sosiaalistamisopas
                </CardTitle>
                <CardDescription>
                  Kattava opas pennun sosiaalistamiseen ja käytökseen
                </CardDescription>
              </CardHeader>
            </Card>
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
