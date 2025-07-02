
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BookOpen, Database, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function InfoHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            🐕 Penturuoka-opas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Laaja katsaus Suomessa myytäviin koiranpentujen ruokiin ja niiden annosteluun ohjelmistokehityksen näkökulmasta
          </p>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Johdanto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Koiranpennun elämän ensimmäiset kuukaudet muodostavat ravitsemuksellisesti kriittisen ajanjakson, 
              joka luo perustan sen koko aikuisiän terveydelle ja hyvinvoinnille. Tämän nopean kasvun vaiheen aikana 
              pennun energia- ja ravintoainetarpeet ovat poikkeuksellisen korkeat suhteessa sen kehonpainoon.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Tämän raportin tavoitteena on tarjota syvällinen ja dataan perustuva katsaus Suomen koiranpentujen 
              ruokamarkkinoihin erityisesti ohjelmistokehityksen näkökulmasta.
            </p>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/info/food-types">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
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
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
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
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
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

          <Link to="/info/puppy-guide" className="md:col-span-2 lg:col-span-1">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-accent/10 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-accent">
                  <BookOpen className="h-5 w-5" />
                  Pennun Ruokintaopas
                </CardTitle>
                <CardDescription>
                  Kattava opas pennun ruokintaan ja ravitsemukseen
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Key Insights */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Keskeiset havainnot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Markkinoiden keskittyneisyys</h3>
                <p className="text-sm text-blue-700">
                  Musti Group hallitsee vahvasti Suomen lemmikkiruokamarkkinoita
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Annosteluohjeiden epästandardius</h3>
                <p className="text-sm text-green-700">
                  Valmistajien annosteluohjeet vaihtelevat merkittävästi
                </p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">Täys- ja täydennysravinto</h3>
                <p className="text-sm text-orange-700">
                  Kriittinen ero ravitsemuksellisesti täydellisten ruokien välillä
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aloita tutkiminen
          </h2>
          <p className="text-gray-600 mb-6">
            Tutki yksityiskohtaisia tietoja Suomen penturuokamarkkinoista
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/info/food-types">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
