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

      {/* Kriittinen muistutus */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-accent mb-2">Tärkeimmät Muistisäännöt</h3>
              <ul className="space-y-1 text-sm">
                <li>• Valitse laadukas pentujen täysravinto</li>
                <li>• Taulukko on lähtökohta, kuntoluokka on kompassi</li>
                <li>• Älä lisää ylimääräisiä vitamiineja</li>
                <li>• Herkut max 10% päivän kaloreista</li>
                <li>• Tee ruokavalion muutokset hitaasti 7-10 päivässä</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jatko-osiot placeholder */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Seuraavaksi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Osa 2: Annosteluohjeet</h4>
                <p className="text-sm text-muted-foreground">Yksityiskohtaiset taulukot merkeittäin</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Osa 3: Ravitsemustiede</h4>
                <p className="text-sm text-muted-foreground">Ca:P-suhde, kuntoluokitus ja energiantarpeet</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Osa 4: Haasteet</h4>
                <p className="text-sm text-muted-foreground">Nirsoilu, ripuli ja hätätilanteet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyGuide;