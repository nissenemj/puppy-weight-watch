
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, AlertTriangle, Building2 } from 'lucide-react'

export default function MarketAnalysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/info">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Suomen koiranruokamarkkinoiden analyysi
          </h1>
        </div>

        {/* Market Leader */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Markkinajohtaja ja sen vaikutus tuotevalikoimaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Suomen lemmikkieläintuotteiden vähittäiskauppaa hallitsee voimakkaasti <strong>Musti Group</strong>, 
                joka omistaa Musti ja Mirri -ketjun. Se on Pohjoismaiden suurin ja Euroopan neljänneksi suurin 
                lemmikkitarvikeketju, ja sen liikevaihdosta jopa kaksi kolmasosaa muodostuu eläinruoista.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Musti Groupin strategiset brändit:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <span className="bg-white px-2 py-1 rounded text-blue-700">Purenatural</span>
                  <span className="bg-white px-2 py-1 rounded text-blue-700">Brit Care</span>
                  <span className="bg-white px-2 py-1 rounded text-blue-700">Canagan</span>
                  <span className="bg-white px-2 py-1 rounded text-blue-700">Nutrima</span>
                  <span className="bg-white px-2 py-1 rounded text-blue-700">SMAAK</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Tämä hallitseva markkina-asema antaa yritykselle merkittävän vallan siihen, mitä tuotteita 
                suomalaisille kuluttajille on laajasti tarjolla ja miten niitä markkinoidaan. Nämä brändit on 
                usein asemoitu premium- tai superpremium-hintaluokkaan ja ne saavat myymälöissä huomattavan näkyvyyden.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Structure */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Markkinoiden kilpailutilanne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Musti & Mirri</h3>
                  <p className="text-sm text-blue-700">
                    Erikoisliikkeet, oma ja eksklusiivinen tuotevalikoima, premium-asemointi
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Peten Koiratarvike</h3>
                  <p className="text-sm text-green-700">
                    Verkkokauppa, laaja tuotevalikoima, kilpailukykyiset hinnat
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">Päivittäistavarakaupat</h3>
                  <p className="text-sm text-orange-700">
                    Prisma, K-Citymarket, tunnetut massamarkkinabrändit (Hau-Hau Champion)
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Markkinavaikutukset:</h3>
                <p className="text-sm text-yellow-700">
                  Kuluttajan mielikuva "suosituimmista" tai "parhaista" koiranruokamerkeistä ei välttämättä 
                  perustu puhtaasti objektiiviseen vertailuun, vaan on vahvasti sidoksissa markkinointipanostuksiin 
                  ja tuotteiden saatavuuteen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMAAK Case Study */}
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              Tapausesimerkki: SMAAK-laatuongelma (Marraskuu 2023)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-800 font-medium">
                Marraskuussa 2023 Suomen koiranruokamarkkinoita vavisutti tapaus, jossa Musti ja Mirri joutui 
                vetämään myynnistä tiettyjä tuote-eriä omasta SMAAK Herkkä kala viljaton -koiranruoastaan.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Oireet:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Pahoinvointi</li>
                  <li>• Väsymys</li>
                  <li>• Raajojen tilapäinen heikkous</li>
                  <li>• Joissain tapauksissa koira jouduttu lopettamaan</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-red-800">Tapauksen merkitys:</h3>
                <ul className="text-sm text-red-700 space-y-2">
                  <li>• Konkreettinen muistutus tuoteturvallisuuden kriittisestä merkityksestä</li>
                  <li>• Osoittaa, että laatuongelmia voi esiintyä myös premium-tuotteissa</li>
                  <li>• SMAAK oli Musti Groupin oma "lippulaivabrändi"</li>
                  <li>• Asetti kyseenalaiseksi koko laadunvalvontaprosessin</li>
                  <li>• Rapauttaa kuluttajien luottamusta brändiin ja jälleenmyyjään</li>
                </ul>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                <p className="text-sm text-red-800 font-medium">
                  <strong>Opetus:</strong> Brändin maine, markkinointi tai korkea hinta eivät ole absoluuttisia takeita 
                  tuotteen virheettömyydestä. Koiranomistajan on aina syytä olla valpas ja seurata lemmikkinsä vointia, 
                  erityisesti uuteen ruokaan siirryttäessä.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Implications */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Markkinoiden vaikutukset kuluttajiin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Positiiviset vaikutukset:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Laaja erikoisliikkeiden verkosto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Asiantunteva henkilökunta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Korkealaatuisia tuotteita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Tutkimus ja tuotekehitys</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Mahdolliset haitat:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">!</span>
                    <span>Rajallinen tuotevalikoima</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">!</span>
                    <span>Korkeammat hinnat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">!</span>
                    <span>Markkinointiperusteinen tuotevalikoima</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">!</span>
                    <span>Vähemmän kilpailua</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to="/info/food-types">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edellinen: Ruokatyypit
            </Button>
          </Link>
          <Link to="/info/feeding-data">
            <Button>
              Seuraava: Annostelutiedot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
