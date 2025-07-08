import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calculator, Weight, Utensils, PawPrint } from 'lucide-react';
import InfoNavigation from '@/components/InfoNavigation';
import InfoCard from '@/components/InfoCard';
import InfoSection from '@/components/InfoSection';
import InfoBadge from '@/components/InfoBadge';
import BackToTopButton from '@/components/BackToTopButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/welcome-illustration.png';

const PuppyGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-warm pt-14 w-full overflow-x-hidden">
      <InfoNavigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="flex justify-center mb-6">
          <img 
            src={heroImage} 
            alt="Pennun ruokintaopas" 
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
          🐕 Koiranpennun Ruokinnan Kattava Opas
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Annosteluohjeet, ravitsemus ja hyvinvointi - kaikki tarvittava terveen kasvun turvaamiseksi
        </p>
      </div>

      <InfoCard
        title="Pika-navigaatio"
        icon={<Calculator className="h-5 w-5" />}
        className="mb-8"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="#ruokintamuodot" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Utensils className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Ruokintamuodot</h3>
              <p className="text-sm text-muted-foreground">Kuiva-, märkä- ja raakaruoka</p>
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
      </InfoCard>

      <InfoCard
        title="Pennun Terveen Kasvun Perusta"
        className="mb-8"
      >
        <div className="prose max-w-none">
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
        </div>
      </InfoCard>

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

      {/* Comprehensive Guide Section */}
      <section id="kattava-opas">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">🦸‍♂️ Kattava opas pennun ruokintaan: selviydy, menesty ja kasvata terve aikuinen</CardTitle>
            <p className="text-muted-foreground text-center">
              Onneksi olkoon uudesta perheenjäsenestä! Ensimmäiset kuukaudet ovat ratkaisevan tärkeitä, 
              ja oikeanlainen ruokinta on paras investointi, jonka voit koirasi tulevaisuuteen tehdä. 
              Tämä opas on suunniteltu antamaan sinulle kaikki työkalut, joilla navigoit pentuajan 
              ruokintaviidakossa – niin iloissa kuin haasteissakin.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Superpennun rakennuspalikat */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="secondary">4.1</Badge>
                🦸‍♂️ Superpennun rakennuspalikat: tarkempi katsaus kuppiin
              </h3>
              
              <p className="mb-6">
                Kasvava pentu tarvitsee jopa kaksi kertaa enemmän energiaa painokiloa kohden kuin aikuinen koira. 
                Tämä energia on polttoainetta paitsi leikkiin, myös koko kehon kriittiseen kehitykseen.
              </p>
              
              <div className="grid gap-6">
                {/* Proteiini */}
                <Card className="bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Proteiini: elämän perusta (tavoite: 22–32 % kuiva-aineesta)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-blue-700">Miksi?</h5>
                        <p className="text-sm">
                          Proteiinit ovat välttämättömiä lihasten, elinten ja luuston rakennusaineita. 
                          Ne ovat myös kriittisiä toimivan immuunijärjestelmän, hormonien ja entsyymien tuotannolle.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-700">Laatu ennen kaikkea</h5>
                        <p className="text-sm">
                          Eläinperäiset proteiinit (liha, kala) sisältävät kaikki pennulle välttämättömät 
                          aminohapot oikeassa suhteessa, toisin kuin kasviproteiinit.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Rasvat */}
                <Card className="bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Rasvat: energiaa ja älynystyröitä (tavoite: 8–22 % kuiva-aineesta)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-green-700">Miksi?</h5>
                        <p className="text-sm">
                          Rasvat ovat tiivis energianlähde ja välttämättömiä rasvaliukoisten A-, D-, E- ja K-vitamiinien imeytymiselle.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-700">Aivojen superruoka</h5>
                        <p className="text-sm">
                          Omega-3-rasvahappoihin kuuluva <strong>DHA</strong> on todistetusti elintärkeä aivojen ja näön kehitykselle. 
                          Laadukkaissa penturuoissa on usein lisättynä esimerkiksi kalaöljyä DHA:n lähteeksi.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Hiilihydraatit */}
                <Card className="bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800">Hiilihydraatit & kuidut: virtaa ja vatsan hyvinvointia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-orange-700">Miksi?</h5>
                        <p className="text-sm">
                          Hyvin sulavat hiilihydraatit (riisi, kaura) tarjoavat tasaista energiaa ja ovat helliä 
                          pennun kehittyvälle ruoansulatusjärjestelmälle. Kuidut (tavoite 2-4 %) tukevat suoliston terveyttä, 
                          mutta liika kuitu voi haitata muiden ravintoaineiden imeytymistä.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Vitamiinit & kivennäisaineet */}
                <Card className="bg-purple-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Vitamiinit & kivennäisaineet: tarkkaa tasapainoa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-purple-700">Miksi?</h5>
                        <p className="text-sm">
                          Tässä piilee yksi penturuokinnan suurimmista haasteista. Erityisesti <strong>kalsiumin ja fosforin 
                          suhde (n. 1,2–1,4:1)</strong> on kriittinen luuston terveydelle.
                        </p>
                      </div>
                      <div className="bg-red-100 p-3 rounded border border-red-200">
                        <h5 className="font-semibold text-red-700">Varoitus suurille roduille</h5>
                        <p className="text-sm text-red-600">
                          Liiallinen kalsiumin saanti on erityisen vaarallista suurille ja jättiläisroduille, 
                          sillä se voi häiritä luuston normaalia kehitystä ja johtaa pysyviin kasvuhäiriöihin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Ongelmatilanteet */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="secondary">4.2</Badge>
                🚨 Ongelmia ruokakupilla? Vianmääritys ja ratkaisut
              </h3>
              
              <p className="mb-6">
                Joskus ruokinta ei suju kuin tanssi. Tässä yleisimmät haasteet ja ratkaisut niihin.
              </p>
              
              <div className="space-y-6">
                {/* Ei syö */}
                <Card className="bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Apua, pentu ei syö!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-red-700">Hampaiden vaihto (n. 4–6 kk)</h5>
                        <p className="text-sm">
                          Ikenet voivat olla arat, jolloin kovan nappulan pureskelu sattuu. 
                          <strong>Ratkaisu:</strong> Kostuta nappuloita lämpimällä vedellä tai maidottomalla liemellä 
                          tai tarjoa väliaikaisesti märkäruokaa. Purulelut voivat myös helpottaa oloa.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700">Stressi ja ympäristön muutokset</h5>
                        <p className="text-sm">
                          Muutto uuteen kotiin, uudet ihmiset tai muut rutiinien muutokset voivat tilapäisesti viedä ruokahalun. 
                          <strong>Ratkaisu:</strong> Anna pennulle rauha ja aikaa sopeutua. Tarjoa ruokaa säännöllisesti ja rauhallisessa paikassa.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700">Nirsoilu</h5>
                        <p className="text-sm">
                          Jatkuvasti saatavilla oleva ruoka voi opettaa pennun nirsoilemaan. 
                          <strong>Ratkaisu:</strong> Rajoita ruokailuaika 15–20 minuuttiin. Jos ruoka ei maistu, 
                          ota kuppi pois ja tarjoa sitä uudelleen seuraavalla ruokinta-ajalla.
                        </p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded border border-yellow-200">
                        <h5 className="font-semibold text-yellow-700">Milloin eläinlääkäriin?</h5>
                        <p className="text-sm text-yellow-600">
                          Jos ruokahaluttomuus jatkuu yli 24 tuntia tai siihen liittyy muita oireita 
                          (oksentelu, ripuli, velttous), ota yhteyttä eläinlääkäriin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Vatsa kuralle */}
                <Card className="bg-yellow-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800">Vatsa kuralle – yleisimmät ruokintavirheet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-yellow-700">Liian nopea ruokavalion muutos</h5>
                        <p className="text-sm">
                          Pennun ruoansulatusjärjestelmä on herkkä. <strong>Ratkaisu:</strong> Tee kaikki muutokset 
                          ruokavalioon vähitellen 7–10 päivän aikana sekoittamalla uutta ruokaa vanhaan kasvavissa suhteissa.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-yellow-700">Yliruokinta</h5>
                        <p className="text-sm">
                          Lihavuus pentuna on valtava riski nivelille ja luustolle, ja se voi aiheuttaa pysyviä vaurioita. 
                          <strong>Ratkaisu:</strong> Seuraa pennun painoa ja kuntoluokitusta. Kylkiluiden tulee tuntua, mutta ei näkyä. 
                          Säädä annoskokoa tarpeen mukaan.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-yellow-700">Väärän ruoan syöttäminen</h5>
                        <p className="text-sm">
                          Aikuisten koirien ruoka ei sisällä tarpeeksi ravintoaineita kasvavalle pennulle. 
                          Toisaalta liian energiapitoinen ruoka suurikokoiselle pennulle voi aiheuttaa liian nopeaa kasvua ja luusto-ongelmia.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Erityistarpeet */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="secondary">4.3</Badge>
                🧐 Erityistarpeet ja -ruokavaliot: yksi koko ei sovi kaikille
              </h3>
              
              <div className="space-y-6">
                {/* Rotukohtaiset vaatimukset */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">Rotukohtaiset vaatimukset</h4>
                  
                  <div className="grid gap-4">
                    <Card className="bg-blue-50/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800">Pienet rodut (&lt;10 kg)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Niillä on nopea aineenvaihdunta ja pieni vatsalaukku. Ne saavuttavat aikuiskokonsa jo 8–12 kuukaudessa.
                        </p>
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-semibold text-blue-700">Erityisriski</h5>
                            <p className="text-sm">
                              Hypoglykemia eli verensokerin lasku, erityisesti stressitilanteissa. 
                              Tämän vuoksi useat pienet ateriat päivässä ovat tärkeitä.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-blue-700">Ruokasuositus</h5>
                            <p className="text-sm">Energiatiheä ruoka ja pieni nappulakoko.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Suuret ja jättiläisrodut (&gt;25 kg)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Kasvavat hitaasti, jopa 18–24 kuukauden ikään saakka.
                        </p>
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-semibold text-green-700">Erityisriski</h5>
                            <p className="text-sm">
                              Luuston ja nivelten kehityshäiriöt, jos kasvu on liian nopeaa tai kalsiumia on ruoassa liikaa. 
                              Myös mahalaukun kiertymän riski on suurempi suurilla aterioilla.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-700">Ruokasuositus</h5>
                            <p className="text-sm">
                              Erityisesti suurille roduille suunniteltu penturuoka, jossa on maltillinen energiapitoisuus 
                              ja tarkasti kontrolloitu kalsiumin määrä. Useampi pieni ateria päivässä on parempi kuin yksi suuri.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Erityisruokavaliot */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">Erityisruokavaliot</h4>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Viljaton ruokinta</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Sopii koirille, joilla on todettu vilja-allergia tai -herkkyys. Viljattomassa ruoassa 
                          viljat on korvattu muilla hiilihydraatin lähteillä, kuten perunalla tai herneellä.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Allergiat ja herkkä vatsa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Jos pennulla on jatkuvia iho- tai vatsaoireita, syynä voi olla ruoka-aineallergia.
                        </p>
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-semibold">Ratkaisu</h5>
                            <p className="text-sm">
                              Eläinlääkärin valvonnassa toteutettu eliminaatiodieetti, jossa käytetään vain yhtä 
                              proteiininlähdettä (ns. monoproteiiniruoka), on tehokas tapa selvittää allergian aiheuttaja.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold">Tieteellinen näyttö</h5>
                            <p className="text-sm">
                              Helsingin yliopiston DogRisk-tutkimusryhmä on osoittanut, että vähän prosessoitu, 
                              raakaruokapainotteinen ruokavalio pentuaikana on yhteydessä merkittävästi pienempään 
                              allergioiden ja atopian riskiin aikuisiällä.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ruoan turvallisuus */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="secondary">4.4</Badge>
                🛡️ Ruoan turvallisuus: ole tietoinen ja vaativa kuluttaja
              </h3>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
                <p className="text-sm">
                  Vaikka koiranruoan valmistus Suomessa on pääosin laadukasta, takaisinvetoja tapahtuu. 
                  Tapaukset kuten <strong>SMAAK-ruoan korkeat glykoalkaloidipitoisuudet</strong> ja 
                  <strong>Hau-Hau Champion -puruluiden aiheuttamat oireilut</strong> ovat muistutuksia siitä, 
                  että ongelmia esiintyy.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Valvonnan haasteet</h4>
                  <p className="text-sm">
                    Ruokaviraston valvontaresurssit ovat rajalliset, mikä korostaa omistajan omaa vastuuta.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Mitä voit tehdä?</h4>
                  <ol className="text-sm space-y-2 ml-4">
                    <li><strong>1. Seuraa tiedotteita:</strong> Pidä silmällä Ruokaviraston virallisia tiedotteita.</li>
                    <li><strong>2. Valitse luotettavia merkkejä:</strong> Suosi valmistajia, jotka ovat avoimia tuotantoprosesseistaan ja raaka-aineistaan.</li>
                    <li><strong>3. Ilmoita ongelmista:</strong> Jos epäilet ruoan aiheuttavan koirallesi oireita, ole yhteydessä valmistajaan ja tee ilmoitus Ruokavirastolle.</li>
                  </ol>
                </div>
              </div>
            </div>

            <Separator />

            {/* Loppusanat */}
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-3 text-center">Lopuksi</h4>
              <p className="text-sm text-center">
                Lopulta tärkeintä on löytää tasapaino, joka sopii juuri sinun pennullesi ja elämäntilanteeseesi. 
                Seuraa, opi ja säädä ruokintaa tarpeen mukaan. Kysy rohkeasti neuvoa eläinlääkäriltä tai 
                ravitsemusasiantuntijalta. <strong>Onnea matkaan kohti tervettä aikuisuutta!</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation to Calculator */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Haluatko laskea pennun ruokamäärän?</h3>
            <p className="text-muted-foreground">
              Käytä interaktiivista laskuria sopivan ruokamäärän määrittämiseen
            </p>
            <Link to="/calculator">
              <Button size="lg" className="gap-2">
                <Calculator className="h-5 w-5" />
                Siirry laskuriin
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <BackToTopButton />
      </div>
    </div>
  );
};

export default PuppyGuide;