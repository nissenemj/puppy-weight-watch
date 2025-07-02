import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calculator, Weight, Utensils, PawPrint } from 'lucide-react';

const PuppyGuide = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Koiranpennun Ruokinnan Kattava Opas
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Annosteluohjeet, ravitsemus ja hyvinvointi - kaikki tarvittava terveen kasvun turvaamiseksi
        </p>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pika-navigaatio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="#ruokintamuodot" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Utensils className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Ruokintamuodot</h3>
              <p className="text-sm text-muted-foreground">Kuiva-, märkä- ja raakaruoka</p>
            </a>
            <a href="#annosteluohjeet" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Weight className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Annosteluohjeet</h3>
              <p className="text-sm text-muted-foreground">Merkkikohtaiset taulukot</p>
            </a>
            <a href="#ravitsemustiede" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <PawPrint className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Ravitsemustiede</h3>
              <p className="text-sm text-muted-foreground">Miksi ja mitä syöttää</p>
            </a>
            <a href="#haasteet" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <AlertTriangle className="h-5 w-5 text-accent mb-2" />
              <h3 className="font-semibold">Haasteet</h3>
              <p className="text-sm text-muted-foreground">Nirsoilu ja vatsavaivat</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Johdanto */}
      <Card>
        <CardHeader>
          <CardTitle>Pennun Terveen Kasvun Perusta</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Koiranpennun saapuminen kotiin on yksi elämän suurimmista iloista, mutta se tuo mukanaan myös 
            merkittävän vastuun. Yksi tärkeimmistä pennun hyvinvointiin vaikuttavista tekijöistä on sen ruokinta. 
            Ensimmäisten elinkuukausien aikana luodaan perusta koiran koko loppuelämän terveydelle.
          </p>
          
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary my-6">
            <h4 className="font-semibold text-primary mb-2">Keskeinen viesti</h4>
            <p className="text-sm">
              Jokainen pentu on ainutlaatuinen, ja sen energiantarve riippuu rodusta, iästä, aktiivisuustasosta 
              ja aineenvaihdunnasta. Ruokapussin annostelutaulukko on lähtökohta, mutta kuntoluokka on kompassi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Osa 1: Ruokintamuodot */}
      <section id="ruokintamuodot">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Osa 1: Ruokintamuodot</CardTitle>
            <p className="text-muted-foreground">Vertailu kuiva-, märkä- ja raakaruoan välillä</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Kuivaruoka */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">1.1</Badge>
                Kuivaruoka (Täysravintonappulat)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Hyödyt</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Käytännöllisyys ja säilyvyys</li>
                    <li>• Taloudellisuus</li>
                    <li>• Hampaiden terveys</li>
                    <li>• Helppo aktivointikäyttö</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Haitat</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Matala kosteuspitoisuus (3-12%)</li>
                    <li>• Vähemmän houkutteleva maistuvuus</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Laadukas, pennuille suunniteltu kuivaruoka on täysravintoa, joka sisältää kaikki tarvittavat 
                ravintoaineet oikeassa suhteessa.
              </p>
            </div>

            <Separator />

            {/* Märkäruoka */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">1.2</Badge>
                Märkäruoka (Säilykkeet ja Annospussit)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Hyödyt</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Erinomainen nesteytys (60-85%)</li>
                    <li>• Korkea maistuvuus</li>
                    <li>• Pehmeä koostumus</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Haitat</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Korkeammat kustannukset</li>
                    <li>• Lyhyempi säilyvyys avattuna</li>
                    <li>• Suuremmat annoskoot</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Raakaruokinta */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">1.3</Badge>
                Raakaruokinta (BARF)
              </h3>
              
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-accent">Tärkeä varoitus</h4>
                    <p className="text-sm mt-1">
                      Raakaruokinta on vaativa ruokintamuoto, joka sisältää merkittäviä riskejä erityisesti 
                      kasvavalle pennulle. Kokemattoman omistajan ei tule koskaan koostaa pennun raakaruokavaliota 
                      itsenäisesti.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Suurimmat riskit:</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Ravitsemuksellinen epätasapaino:</strong> Virheet kalsium-fosforisuhteessa voivat johtaa pysyviin luuston kehityshäiriöihin</li>
                  <li>• <strong>Bakteeririski:</strong> Salmonella ja E. coli vaarantavat sekä koiran että perheen terveyden</li>
                  <li>• <strong>Luista aiheutuvat vaarat:</strong> Terävät luunsirut voivat aiheuttaa vakavia vaurioita</li>
                </ul>
                
                <p className="text-sm bg-muted/50 p-3 rounded">
                  <strong>Suositus:</strong> Käytä kaupallisesti valmistettuja, tasapainotettuja raakatäysravintoja 
                  (esim. MUSH Vaisto Puppy), jotka on ammattilaisten toimesta suunniteltu.
                </p>
              </div>
            </div>

            <Separator />

            {/* Sekaruokinta */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">1.4</Badge>
                Sekaruokinta: Eri Ruokintatapojen Yhdistäminen
              </h3>
              
              <p className="text-sm mb-4">
                Sekaruokinta yhdistää eri ruokintatapojen parhaita puolia. Kriittistä on laskea annoskoot 
                kalorien perusteella, ei tilavuuden.
              </p>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Sekaruokinnan Laskeminen</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm space-y-2">
                    <li><strong>1.</strong> Määritä päivittäinen kokonaiskaloritarve kuivaruoan annostelutaulukon perusteella</li>
                    <li><strong>2.</strong> Päätä sekoitussuhde (esim. 75% kuivaruokaa, 25% märkäruokaa kaloreista)</li>
                    <li><strong>3.</strong> Laske kunkin ruoan grammamäärät energiapitoisuuden mukaan</li>
                    <li><strong>4.</strong> Jaa päiväannos useammalle aterialle</li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded text-sm">
                    <strong>Esimerkki:</strong> 600 kcal/päivä tarve → 450 kcal kuivaruokaa (112.5g) + 150 kcal märkäruokaa (167g)
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Osa 2: Annosteluohjeet */}
      <section id="annosteluohjeet">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Osa 2: Yksityiskohtaiset Annosteluohjeet Merkeittäin</CardTitle>
            <p className="text-muted-foreground">Tarkka annostelu pennun iän ja koon mukaan</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent mb-2">Tärkeä muistutus</h4>
              <p className="text-sm">
                Nämä taulukot ovat suuntaa-antavia. Pennun todellinen tarve voi vaihdella. 
                Seuraa aina pennun kuntoluokkaa ja säädä annoskokoa tarvittaessa.
              </p>
            </div>

            {/* MUSH Vaisto */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">2.1</Badge>
                MUSH Vaisto® Puppy (Raakaruoka)
              </h3>
              
              <p className="text-sm mb-4">
                Pennulle annetaan päivässä raakaruokaa noin 5–10% sen nykyisestä painosta. 
                Päiväannos jaetaan 2–4 ateriaan.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left">Arvioitu aikuispaino (kg)</th>
                      <th className="border border-border p-2">1-2 kk (g/päivä)</th>
                      <th className="border border-border p-2">2-4 kk (g/päivä)</th>
                      <th className="border border-border p-2">4-6 kk (g/päivä)</th>
                      <th className="border border-border p-2">6-9 kk (g/päivä)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-border p-2">5</td><td className="border border-border p-2">500</td><td className="border border-border p-2">375</td><td className="border border-border p-2">250</td><td className="border border-border p-2">150</td></tr>
                    <tr><td className="border border-border p-2">10</td><td className="border border-border p-2">1000</td><td className="border border-border p-2">750</td><td className="border border-border p-2">500</td><td className="border border-border p-2">300</td></tr>
                    <tr><td className="border border-border p-2">25</td><td className="border border-border p-2">2000</td><td className="border border-border p-2">1500</td><td className="border border-border p-2">1000</td><td className="border border-border p-2">600</td></tr>
                    <tr><td className="border border-border p-2">40</td><td className="border border-border p-2">3000</td><td className="border border-border p-2">2250</td><td className="border border-border p-2">1500</td><td className="border border-border p-2">900</td></tr>
                    <tr><td className="border border-border p-2">60</td><td className="border border-border p-2">6000</td><td className="border border-border p-2">4500</td><td className="border border-border p-2">3000</td><td className="border border-border p-2">1800</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Hau-Hau Champion */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">2.2</Badge>
                Hau-Hau Champion Pentu & Emo (Kuivaruoka)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left">Arvioitu aikuispaino (kg)</th>
                      <th className="border border-border p-2">1-2 kk (g/päivä)</th>
                      <th className="border border-border p-2">3-4 kk (g/päivä)</th>
                      <th className="border border-border p-2">5-6 kk (g/päivä)</th>
                      <th className="border border-border p-2">7-12 kk (g/päivä)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-border p-2">5</td><td className="border border-border p-2">70</td><td className="border border-border p-2">90</td><td className="border border-border p-2">90</td><td className="border border-border p-2">80</td></tr>
                    <tr><td className="border border-border p-2">10</td><td className="border border-border p-2">100</td><td className="border border-border p-2">140</td><td className="border border-border p-2">140</td><td className="border border-border p-2">130</td></tr>
                    <tr><td className="border border-border p-2">20</td><td className="border border-border p-2">160</td><td className="border border-border p-2">200</td><td className="border border-border p-2">230</td><td className="border border-border p-2">200</td></tr>
                    <tr><td className="border border-border p-2">30</td><td className="border border-border p-2">180</td><td className="border border-border p-2">260</td><td className="border border-border p-2">300</td><td className="border border-border p-2">260</td></tr>
                    <tr><td className="border border-border p-2">50</td><td className="border border-border p-2">220</td><td className="border border-border p-2">290</td><td className="border border-border p-2">400</td><td className="border border-border p-2">330</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Puuttuvat annosteluohjeet verkossa</h4>
              <p className="text-sm">
                Suurten merkkien (Acana, Royal Canin, SMAAK) annosteluohjeet löytyvät <strong>aina tuotepakkauksesta</strong>. 
                Tämä on luotettavin tapa varmistaa oikea annostus, sillä valmistajat päivittävät ohjeita säännöllisesti.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Osa 3: Ravitsemustiede */}
      <section id="ravitsemustiede">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Osa 3: Pennun Ruokinnan Tiede</CardTitle>
            <p className="text-muted-foreground">Ymmärrä mitä ja miksi syötät</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Kriittiset ravitsemustarpeet */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">3.1</Badge>
                Pennun Kriittiset Ravitsemustarpeet
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Energia ja Proteiini</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Pennut tarvitsevat 2x enemmän kaloreita/kg kuin aikuiset</li>
                    <li>• Proteiini: vähintään 22-32% kuiva-aineesta</li>
                    <li>• Rasva: 10-25% energiansaantiin ja hermoston kehitykseen</li>
                  </ul>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Kalsium-Fosforisuhde (Ca:P)</h4>
                  <p className="text-sm">
                    <strong>Luuston kehityksen kulmakivi!</strong> Virheellinen suhde voi johtaa pysyviin 
                    kehityshäiriöihin. Oikea suhde: 1:1 - 2:1.
                  </p>
                  <p className="text-sm mt-2 font-semibold">
                    ⚠️ Älä koskaan lisää kalsiumlisäravinteita täysravintoon!
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Kuntoluokitus */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">3.2</Badge>
                Kuntoluokitus (Body Condition Score)
              </h3>
              
              <p className="text-sm mb-4">
                Tärkein työkalu oikean ruokamäärän arviointiin. Tavoite: hoikka pentu koko kasvukauden ajan.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-accent mb-2">1. Kylkiluiden tunnustelu</h4>
                  <p className="text-sm">Kylkiluiden tulisi tuntua helposti ohuen rasvakerroksen alta</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">2. Vyötärön tarkastelu</h4>
                  <p className="text-sm">Selvästi erottuva vyötärö ylhäältä katsottuna</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">3. Vatsalinjan tarkastelu</h4>
                  <p className="text-sm">Vatsalinjan tulisi nousta loivasti ylöspäin</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* 10% sääntö */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">3.3</Badge>
                Herkkujen 10% Sääntö
              </h3>
              
              <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm">
                  <strong>Herkkujen osuus max 10% päivittäisestä kokonaiskalorimäärästä.</strong> 
                  Tämä varmistaa ravitsemuksellisen tasapainon ja painonhallinnan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Osa 4: Haasteet */}
      <section id="haasteet">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Osa 4: Yleisimmät Ruokintahaasteet</CardTitle>
            <p className="text-muted-foreground">Ratkaisuja nirsoiluun ja vatsavaivoihin</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Nirsoileva pentu */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">4.1</Badge>
                Nirsoileva Pentu
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-accent mb-2">Yleisiä syitä:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Liikaa herkkuja päivän aikana</li>
                    <li>• Vapaa ruokinta (ruoka jatkuvasti tarjolla)</li>
                    <li>• Opittu käytös ("saan jotain parempaa")</li>
                    <li>• Stressi tai sairaus</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-2">Ratkaisut:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Säännölliset ruoka-ajat (15-20 min)</li>
                    <li>• Lopeta herkkujen antaminen</li>
                    <li>• Tee ruoasta houkuttelevampaa (lämmin vesi)</li>
                    <li>• Rauhoita ruokailutilanne</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ripuli */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">4.2</Badge>
                Pennun Ripuli
              </h3>
              
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mb-4">
                <h4 className="font-semibold text-accent mb-2">⚠️ Milloin välittömästi eläinlääkäriin:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Verinen tai musta uloste</li>
                  <li>• Raju oksentelu</li>
                  <li>• Voimakas apaattisuus</li>
                  <li>• Korkea kuume (yli 39.5°C)</li>
                  <li>• Kieltäytyminen juomasta</li>
                  <li>• Ripuli kestää yli 24 tuntia</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Kotihoito lievässä ripulissa:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Älä paastota pentua</li>
                  <li>• Tarjoa pieniä annoksia helposti sulavaa ruokaa</li>
                  <li>• Varmista riittävä nesteytys</li>
                  <li>• Harkitse probiootteja</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Ruokinnan riskit */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">4.3</Badge>
                Ruokinnan Riskit
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Yliruokinnan vaarat</h4>
                  <p className="text-sm">
                    "Pullea pentu" ei ole terve pentu. Liika energiansaanti kiihdyttää kasvua 
                    epänormaalisti ja rasittaa kehittyviä niveliä.
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Kotiruokavalion riskit</h4>
                  <p className="text-sm">
                    Valtaosa verkosta löytyvistä resepteistä on ravitsemuksellisesti puutteellisia. 
                    Vaatii ammattilaisen apua.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Osa 5: Yhteenveto */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Osa 5: Asiantuntijan Suositukset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Tärkeimmät muistisäännöt:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li>✅ Valitse laadukas pentujen täysravinto</li>
                <li>✅ Taulukko on lähtökohta, kuntoluokka on kompassi</li>
                <li>✅ Älä lisää ylimääräisiä vitamiineja</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li>✅ Herkut max 10% päivän kaloreista</li>
                <li>✅ Tee ruokavalion muutokset hitaasti</li>
                <li>✅ Rakenna luottamuksellinen suhde eläinlääkäriin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hyödylliset linkit */}
      <Card>
        <CardHeader>
          <CardTitle>Hyödylliset linkit ja lähteet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Viralliset lähteet:</h4>
              <ul className="space-y-1">
                <li>• <a href="https://www.ruokavirasto.fi/elaimet/rehut/" className="text-primary hover:underline" target="_blank" rel="noopener">Ruokavirasto - Rehut</a></li>
                <li>• <a href="https://www.helsinki.fi/fi/tutkimusryhmat/koiratutkimus" className="text-primary hover:underline" target="_blank" rel="noopener">DogRisk-tutkimusryhmä</a></li>
                <li>• <a href="https://www.balanceit.com" className="text-primary hover:underline" target="_blank" rel="noopener">BalanceIT.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Asiantuntija-analyysit:</h4>
              <ul className="space-y-1">
                <li>• <a href="https://www.luonnollinenruokinta.fi/blog/" className="text-primary hover:underline" target="_blank" rel="noopener">Luonnollinen ruokinta -blogi</a></li>
                <li>• <a href="https://www.tassuapu.fi/blogi/" className="text-primary hover:underline" target="_blank" rel="noopener">TassuApu</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyGuide;