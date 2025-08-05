
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Database, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeaderButtons from '@/components/HeaderButtons'
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Tietopankki - Penturuoka-opas"
        description="Laaja katsaus koiranpentujen ruokintaan ja ravitsemukseen. Kuiva-, märkä- ja raakaruokien analyysi, annostelutiedot ja turvallisuusohjeet."
        keywords="penturuoka, koiranpennun ruokinta, ruokatyypit, annostelu, turvallisuus, Helsingin yliopisto, DogRisk"
        type="article"
        structuredData={structuredData}
      />
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <HeaderButtons showLogo={true} logoText="Tietopankki" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={heroImage} 
              alt="Penturuoka-opas" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">
            🐕 Penturuoka-opas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Laaja katsaus Suomessa myytäviin koiranpentujen ruokiin ja niiden annosteluun ohjelmistokehityksen näkökulmasta
          </p>
        </div>

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
  )
}
