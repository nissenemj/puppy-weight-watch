
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function FoodTypes() {
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
            Penturuokien tyypit ja analyysi
          </h1>
        </div>

        {/* Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6" />
              Yleiskatsaus ruokatyyppeihin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Koiranpennun ruokavaliota suunniteltaessa omistajalla on valittavanaan kolme pääasiallista ruokatyyppiä: 
              kuivaruoka, märkäruoka ja raakaruoka. Jokaisella tyypillä on omat ravitsemukselliset ja käytännölliset 
              ominaisuutensa, etunsa ja haittansa.
            </p>
          </CardContent>
        </Card>

        {/* Dry Food */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">🥘 Kuivaruoat (Ekstrudoidut täysravinnot)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Kuivaruoat, eli nappulat, ovat yleisin ja käytetyin koiranruoan muoto. Ne valmistetaan tyypillisesti 
              ekstruusioprosessilla, jossa raaka-ainemassa kypsennetään korkeassa paineessa ja lämpötilassa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Hyödyt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Käytännöllisyys:</strong> Helppo varastoida huoneenlämmössä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Kustannustehokkuus:</strong> Alhainen kosteuspitoisuus tekee siitä energiatiheää</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Hammasterveys:</strong> Nappuloiden pureskelu voi puhdistaa hampaan pintaa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Aktivointi:</strong> Soveltuu erinomaisesti aktivointileluissa käytettäväksi</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Haitat ja huomioitavat seikat
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Maistuvuus:</strong> Jotkut koirat saattavat pitää märkäruokaa houkuttelevampana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Nesteensaanti:</strong> Vaatii riittävän juomaveden saatavuuden</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wet Food */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">🥫 Märkäruoat (Säilykkeet ja annospussit)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Märkäruoat sisältävät merkittävän määrän kosteutta, tyypillisesti 60–85 %. Ne myydään usein purkeissa, 
              annospusseissa tai -rasioissa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Hyödyt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Erinomainen maistuvuus:</strong> Voimakas tuoksu ja maku</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Nesteensaanti:</strong> Korkea vesipitoisuus tukee nestetasapainoa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Soveltuvuus:</strong> Helppo syödä hammasongelmaisille</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Haitat ja huomioitavat seikat
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Säilyvyys:</strong> Avattu pakkaus säilyy jääkaapissa vain vuorokauden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Kustannukset:</strong> Yleensä kuivaruokaa kalliimpaa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Pakkausjäte:</strong> Tuottaa enemmän jätettä</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raw Food */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">🥩 Raakaruoat (BARF ja raakatäysravinnot)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Raakaruokinta perustuu ajatukseen koiran ruokkimisesta kypsentämättömillä raaka-aineilla. 
              Markkinoilla on sekä itse koottavia ruokavalioita että kaupallisesti valmistettuja raakatäysravintoja.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Mahdolliset hyödyt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Turkin ja ihon kunnon parantuminen (anekdoottinen näyttö)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Ulostemäärien pieneneminen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Hampaiden puhtauden säilyminen</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Riskit ja haasteet
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Ravitsemuksellinen tasapaino:</strong> Vaikea varmistaa ilman asiantuntemusta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Mikrobiologiset riskit:</strong> Salmonella, kampylobakteeri, E. coli</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Luiden vaarat:</strong> Hammasmurtumat, tukehtumiset, suolisto-ongelmat</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Distinction */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-800">
              ⚠️ Täysravinnon ja täydennysravinnon kriittinen ero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-800 font-medium">
                Tämä ero on elintärkeä paitsi koiran terveydelle, myös minkä tahansa ruokintalaskurin toimintalogiikalle.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Täysravinto (Complete Food)</h3>
                  <p className="text-sm text-green-700">
                    Suunniteltu kattamaan yksinään kaikki koiran päivittäiset ravintotarpeet oikeassa suhteessa. 
                    Sitä voi syöttää ainoana ravinnonlähteenä.
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">Täydennysravinto (Complementary Food)</h3>
                  <p className="text-sm text-orange-700">
                    Ei ole tasapainotettu kattamaan kaikkia ravintotarpeita. Tarkoitettu käytettäväksi muun ruoan ohella, 
                    esimerkiksi makupalana.
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Varoitus sekaruokinnasta:</h4>
                <p className="text-sm text-red-700">
                  Jos omistaja korvaa osan täysravinnosta täydennysravinnolla, pentu jää vaille merkittävää osaa 
                  tarvitsemistaan vitamiineista ja kivennäisaineista, mikä johtaa pitkällä aikavälillä vakaviin puutostiloihin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to="/info">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin etusivulle
            </Button>
          </Link>
          <Link to="/info/market-analysis">
            <Button>
              Seuraava: Markkina-analyysi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
