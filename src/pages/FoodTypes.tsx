
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Info, Microscope, TrendingUp, Heart } from 'lucide-react'
import InfoNavigation from '@/components/InfoNavigation'

export default function FoodTypes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-14">
      <InfoNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Penturuokien tyypit ja tieteellinen analyysi
          </h1>
        </div>

        {/* Scientific Overview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Microscope className="h-6 w-6" />
              Helsingin yliopiston DogRisk-tutkimuksen keskeiset löydökset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-800 leading-relaxed">
                Dosentti Anna Hielm-Björkmanin johtama tutkimusryhmä on seurannut useiden tuhansien 
                suomalaisten koiranomistajien vastauksia ja osoittanut merkittäviä syy-yhteyksiä 
                ruokinnan ja aikuisiän terveyden välillä.
              </p>
              
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Kriittinen 20% raja-arvo
                </h3>
                <p className="text-sm text-blue-700">
                  <strong>Vähintään 20% raakaruoan osuus pennun ruokavaliossa</strong> vähentää 
                  allergia- ja atopiaoireita aikuisiässä merkittävästi. Tämä löydös osoittaa, 
                  että pienikin muutos pennun ruokavaliossa tuottaa elinikäisiä terveyshyötyjä.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dry Food - Updated with Scientific Evidence */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">🥘 Kuivaruoat (Ekstrudoidut täysravinnot)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Kuivaruoat ovat yleisin koiranruoan muoto Suomessa. Kuumennusprosessi tuhoaa entsyymejä, 
              vitamiineja ja aminohappoja, minkä vuoksi niihin lisätään keinotekoisia vitamiineja ja kivennäisaineita.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Käytännölliset hyödyt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Käytännöllisyys:</strong> Helppo varastoida huoneenlämmössä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Kustannustehokkuus:</strong> 30-70 euroa kuukaudessa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span><strong>Aktivointi:</strong> Soveltuu erinomaisesti aktivointileluissa käytettäväksi</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Tieteelliset huomiot
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Immuunijärjestelmä:</strong> Heikkenee entsyymien ja antioksidanttien vähyydestä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Korkea tärkkelyspitoisuus:</strong> Jopa 50-60%, altistaa ylipainolle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span><strong>Ennenaikainen vanheneminen:</strong> Noin 7 vuoden iässä näkyvät vaikutukset</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raw Food - Comprehensive Scientific Update */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">🥩 Raakaruoat - Tieteellisesti todistetut hyödyt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 mb-4 font-medium">
              Helsingin yliopiston tutkimukset osoittavat selvästi raakaruokinnan merkittäviä terveyshyötyjä 
              erityisesti pentujen kehityksessä ja aikuisiän terveyden ylläpitämisessä.
            </p>
            
            <div className="space-y-6">
              {/* Scientific Benefits */}
              <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Tieteellisesti todistetut terveyshyödyt
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Allergiat ja atopia</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• 20% raakaruokaa vähentää allergiaoireita merkittävästi</li>
                      <li>• Raaka naudanmaha ja sisäelimet erityisen hyödyllisiä</li>
                      <li>• Elinikäiset terveyshyödyt pennun ruokavaliosta</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Suolistoterveys</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Vähentää IBD-riskiä (tulehduksellinen suolistosairaus)</li>
                      <li>• Raa'at luut ja rustoluut suojaavia</li>
                      <li>• Marjat (mustikka, puolukka) tukevat suolistoa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Molecular Biology */}
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <h3 className="font-semibold text-blue-800 mb-3">Molekyylibiologiset vaikutukset</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Geenitoiminta</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Aktivoi ihon immuunipuolustusta</li>
                      <li>• Lisää antioksidanttien tuotantoa</li>
                      <li>• Tulehduksia estäviä vaikutuksia</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Aineenvaihdunta</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Korkeammat karnitiini- ja kreatiinipitoisuudet</li>
                      <li>• Parempi rasva-aineenvaihdunta</li>
                      <li>• Tehostunut energiantuotanto lihassoluissa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gut Microbiome */}
              <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
                <h3 className="font-semibold text-purple-800 mb-3">Suolistomikrobiotan hyödyt</h3>
                <div className="space-y-2 text-sm text-purple-700">
                  <p><strong>Mikrobiotan monimuotoisuus:</strong> Raakaruokinta tukee hyödyllisten bakteerien kasvua (Firmicutes, Bacteroidetes, Proteobacteria)</p>
                  <p><strong>Butyraatin tuotanto:</strong> Hyödylliset mikrobit tuottavat voihappoa, joka vähentää tulehduksia ja parantaa suolen seinämää</p>
                  <p><strong>Endotoksemian esto:</strong> Estää myrkytystilan syntymistä suolistossa</p>
                </div>
              </div>

              {/* Performance Benefits */}
              <div className="bg-orange-100 p-4 rounded-lg border border-orange-300">
                <h3 className="font-semibold text-orange-800 mb-3">Suorituskyky ja käyttäytyminen</h3>
                <div className="space-y-2 text-sm text-orange-700">
                  <p><strong>Työkoirien suorituskyky:</strong> Korkean rasva- ja proteiinipitoisuuden ruokavalio parantaa rasvanpolttokykyä jopa 30%</p>
                  <p><strong>Psykologiset vaikutukset:</strong> Syöminen aktivoi parasympaattisen hermoston ja rauhoittaa koiraa</p>
                </div>
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
              Märkäruoat sisältävät merkittävän määrän kosteutta (60–85 %) ja voivat olla osa 
              yhdistelmäruokintaa raakaruoan kanssa optimaalisten terveyshyötyjen saavuttamiseksi.
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
                    <span><strong>Yhdistelmäruokinta:</strong> Sopii hyvin raakaruoan kanssa</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Huomioitavat seikat
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Kustannukset:</strong> Yleensä kuivaruokaa kalliimpaa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span><strong>Säilyvyys:</strong> Avattu pakkaus säilyy jääkaapissa vain vuorokauden</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combination Feeding Recommendations */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-800">
              🔄 Suositukset yhdistelmäruokintaan tieteellisen näytön perusteella
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-800 font-medium">
                Helsingin yliopiston tutkimusten perusteella optimaalinen ruokinta yhdistää 
                eri ruokatyyppien parhaat puolet.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Pennuille</h3>
                  <p className="text-sm text-green-700">
                    <strong>Vähintään 20% raakaruokaa</strong><br />
                    • Raaka naudanmaha<br />
                    • Sisäelimet<br />
                    • Marjat (mustikka, puolukka)<br />
                    • Loput täysravinto kuiva/märkä
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Aikuisille (70/30)</h3>
                  <p className="text-sm text-blue-700">
                    <strong>70% täysravinto + 30% raakaruokaa</strong><br />
                    • Hyvä kompromissi<br />
                    • Käytännöllisyys säilyy<br />
                    • Terveyshyödyt maksimoituvat
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Työkoirille (50/50)</h3>
                  <p className="text-sm text-purple-700">
                    <strong>50% raakaruokaa + 50% täysravinto</strong><br />
                    • Optimoitu suorituskyky<br />
                    • Parempi rasvanpoltto<br />
                    • Korkeampi energiatiheys
                  </p>
                </div>
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
                    Sitä voi syöttää ainoana ravinnonlähteenä tai yhdistää raakaruokaan.
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">Täydennysravinto (Complementary Food)</h3>
                  <p className="text-sm text-orange-700">
                    Ei ole tasapainotettu kattamaan kaikkia ravintotarpeita. Tarkoitettu käytettäväksi muun ruoan ohella, 
                    esimerkiksi makupalana tai aktivointiin.
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

        {/* Economic and Environmental Impact */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Ekonomiset ja ympäristövaikutukset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Kustannustehokkuus vuodessa:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Kuivaruoka:</strong> 360-840 euroa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Erikoisruokinta:</strong> Jopa 2880 euroa allergikoiralle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Keskimäärin:</strong> 1561 euroa vuodessa koiran perustarpeisiin</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Ympäristövaikutukset:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Keskikokoisen koiran vuosittaiset hiilipäästöt: 0,35-1,4 tonnia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Vastaa noin 1/4 henkilöauton päästöistä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Koiranruoka hyödyntää elintarviketuotannon sivuvirtoja</span>
                  </li>
                </ul>
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
