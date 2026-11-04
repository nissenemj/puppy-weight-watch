import { IllustratedGuideIntro } from "@/components/GuideIllustration";
import React from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Info, Microscope, TrendingUp, Heart } from 'lucide-react'

import InfoCard from '@/components/InfoCard'
import InfoSection from '@/components/InfoSection'
import InfoBadge from '@/components/InfoBadge'
import BackToTopButton from '@/components/BackToTopButton'

export default function FoodTypes() {
  return (
    <MobileOptimizedLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0">
        <IllustratedGuideIntro
          title="Penturuokien tyypit"
          description="Kuiva-, märkä- ja raakaruoka. Tutustu eri ruokatyyppeihin, niiden eroihin ja turvallisuuteen liittyviin kysymyksiin."
          artwork="feeding"
        />

        <InfoCard
          title="Helsingin yliopiston DogRisk-tutkimuksen keskeiset löydökset"
          variant="cool"
          icon={<Microscope className="h-6 w-6" aria-hidden="true" />}
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground leading-relaxed">
              Dosentti Anna Hielm-Björkmanin johtama tutkimusryhmä on seurannut useiden tuhansien 
              suomalaisten koiranomistajien vastauksia ja osoittanut merkittäviä syy-yhteyksiä 
              ruokinnan ja aikuisiän terveyden välillä.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                Kriittinen 20% raja-arvo
              </h3>
              <p className="text-sm text-card-foreground">
                <strong>Vähintään 20% raakaruoan osuus pennun ruokavaliossa</strong> vähentää 
                allergia- ja atopiaoireita aikuisiässä merkittävästi. Tämä löydös osoittaa, 
                että pienikin muutos pennun ruokavaliossa tuottaa elinikäisiä terveyshyötyjä.
              </p>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="🥘 Kuivaruoat (Ekstrudoidut täysravinnot)"
          description="Yleisin koiranruoan muoto Suomessa - käytännöllinen mutta ravitsemuksellisesti haasteellinen"
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground mb-4">
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
          </div>
        </InfoCard>

        <InfoCard
          title="🥩 Raakaruoat - Tieteellisesti todistetut hyödyt"
          variant="cool"
          className="mb-8"
        >
          <p className="text-card-foreground mb-4 font-medium">
            Helsingin yliopiston tutkimukset osoittavat selvästi raakaruokinnan merkittäviä terveyshyötyjä 
            erityisesti pentujen kehityksessä ja aikuisiän terveyden ylläpitämisessä.
          </p>
          
          <div className="space-y-6">
            {/* Scientific Benefits */}
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5" aria-hidden="true" />
                Tieteellisesti todistetut terveyshyödyt
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Allergiat ja atopia</h4>
                  <ul className="space-y-1 text-sm text-card-foreground">
                    <li>• 20% raakaruokaa vähentää allergiaoireita merkittävästi</li>
                    <li>• Raaka naudanmaha ja sisäelimet erityisen hyödyllisiä</li>
                    <li>• Elinikäiset terveyshyödyt pennun ruokavaliosta</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Suolistoterveys</h4>
                  <ul className="space-y-1 text-sm text-card-foreground">
                    <li>• Vähentää IBD-riskiä (tulehduksellinen suolistosairaus)</li>
                    <li>• Raa'at luut ja rustoluut suojaavia</li>
                    <li>• Marjat (mustikka, puolukka) tukevat suolistoa</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional benefits sections can be added here */}
          </div>
        </InfoCard>

        <InfoCard
          title="🥫 Märkäruoat (Säilykkeet ja annospussit)"
          description="Korkea kosteuspitoisuus ja erinomainen maistuvuus"
          className="mb-8"
        >
          <p className="text-card-foreground mb-4">
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
        </InfoCard>

        <InfoCard
          title="🔄 Suositukset yhdistelmäruokintaan tieteellisen näytön perusteella"
          variant="warm"
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground font-medium">
              Helsingin yliopiston tutkimusten perusteella optimaalinen ruokinta yhdistää 
              eri ruokatyyppien parhaat puolet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Pennuille</h3>
                <p className="text-sm text-card-foreground">
                  <strong>Vähintään 20% raakaruokaa</strong><br />
                  • Raaka naudanmaha<br />
                  • Sisäelimet<br />
                  • Marjat (mustikka, puolukka)<br />
                  • Loput täysravinto kuiva/märkä
                </p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Aikuisille (70/30)</h3>
                <p className="text-sm text-card-foreground">
                  <strong>70% täysravinto + 30% raakaruokaa</strong><br />
                  • Hyvä kompromissi<br />
                  • Käytännöllisyys säilyy<br />
                  • Terveyshyödyt maksimoituvat
                </p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Työkoirille (50/50)</h3>
                <p className="text-sm text-card-foreground">
                  <strong>50% raakaruokaa + 50% täysravinto</strong><br />
                  • Optimoitu suorituskyky<br />
                  • Parempi rasvanpoltto<br />
                  • Korkeampi energiatiheys
                </p>
              </div>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="⚠️ Täysravinnon ja täydennysravinnon kriittinen ero"
          variant="accent"
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground font-medium">
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
        </InfoCard>

        <InfoCard
          title="💰 Ekonomiset ja ympäristövaikutukset"
          description="Kustannukset ja kestävyys penturuokinnassa"
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Kustannustehokkuus vuodessa:</h3>
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
              <h3 className="font-semibold text-card-foreground">Ympäristövaikutukset:</h3>
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
        </InfoCard>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link to="/info">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin etusivulle
            </Button>
          </Link>
          <Link to="/info/feeding-data">
            <Button className="w-full sm:w-auto">
              Seuraava: Annostelutiedot
            </Button>
          </Link>
        </div>
        
        <BackToTopButton />
      </div>
    </MobileOptimizedLayout>
  )
}
