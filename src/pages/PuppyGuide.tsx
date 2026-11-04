import { IllustratedGuideIntro } from "@/components/GuideIllustration";
import React from 'react';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calculator, Weight, Utensils, PawPrint } from 'lucide-react';
import FAQ from '@/components/FAQ';
import { Navigation } from '@/components/Navigation';
import InfoCard from '@/components/InfoCard';
import AdBanner from '@/components/AdBanner';
import InfoSection from '@/components/InfoSection';
import InfoBadge from '@/components/InfoBadge';
import BackToTopButton from '@/components/BackToTopButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { createArticleSchema, createBreadcrumbSchema } from '@/utils/structuredData';
import { guideArtwork } from '@/data/guideArtwork';
const puppyCareGuide = guideArtwork.feeding.src;

const PuppyGuide = () => {
  const structuredData = [
    createArticleSchema(
      "Kattava opas pennun ruokintaan",
      "Opi kaikki koiranpennun ruokinnasta: energiatarve, proteiinit, rasvat, ja oikeat ruokintatavat.",
      puppyCareGuide
    ),
    createBreadcrumbSchema([
      { name: "Etusivu", url: window.location.origin },
      { name: "Oppaat", url: `${window.location.origin}/guides` },
      { name: "Ruokintaopas", url: `${window.location.origin}/guides/puppy-guide` }
    ])
  ];

  return (
    <MobileOptimizedLayout>
      <SEO
        title="Kattava opas pennun ruokintaan"
        description="Opi kaikki koiranpennun ruokinnasta: energiatarve, proteiinit, rasvat, ja oikeat ruokintatavat. Vältä yleisimmät virheet."
        image={puppyCareGuide}
        type="article"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background page-with-navigation w-full overflow-x-hidden">
        <Navigation />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0">

          <div className="lg:grid lg:grid-cols-[1fr_160px] lg:gap-8">
            <div className="space-y-8 min-w-0">
              <IllustratedGuideIntro
                title="Kattava opas pennun ruokintaan"
                description="Ravintoaineet, ruokintarutiinit ja pennun kasvu. Tutustu oppaan aiheisiin ja etsi arkeenne sopiva lähtökohta."
                artwork="feeding"
              />

              <InfoCard
                title="Pika-navigaatio"
                icon={<Calculator className="h-5 w-5" />}
                className="mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="#superpennun-rakennuspalikat" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <PawPrint className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold">Superpennun rakennuspalikat</h3>
                    <p className="text-sm text-muted-foreground">Proteiinit, rasvat ja ravinteiden tasapaino</p>
                  </a>
                  <a href="#ruokinta-koulutus" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <Utensils className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold">Ruokinta on koulutusta</h3>
                    <p className="text-sm text-muted-foreground">Rutiinit, maltti ja virikkeistäminen</p>
                  </a>
                  <a href="#liikunta-leikki" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <Weight className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold">Liikunta ja leikki</h3>
                    <p className="text-sm text-muted-foreground">Oikeanlaista liikuntaa pennulle</p>
                  </a>
                  <a href="#ongelmatilanteita" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-accent mb-2" />
                    <h3 className="font-semibold">Ongelmatilanteita</h3>
                    <p className="text-sm text-muted-foreground">Ruokahaluttomuus ja ratkaisut</p>
                  </a>
                  <a href="#erityistarpeet" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <PawPrint className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold">Erityistarpeet roduittain</h3>
                    <p className="text-sm text-muted-foreground">Pienet vs. suuret rodut</p>
                  </a>
                  <a href="#turvallisuus" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-accent mb-2" />
                    <h3 className="font-semibold">Ruoan turvallisuus</h3>
                    <p className="text-sm text-muted-foreground">Kuluttajavastuu ja varovaisuus</p>
                  </a>
                </div>
              </InfoCard>

              <InfoCard
                title="Pennun terveen kasvun perusta"
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

              {/* Osa 1: Superpennun Rakennuspalikat */}
              <section id="superpennun-rakennuspalikat">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 1: Superpennun rakennuspalikat</CardTitle>
                    <p className="text-muted-foreground">Tarkempi katsaus pennun ravitsemuksen perustekijöihin</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mb-6">
                      <h4 className="font-semibold text-primary mb-2">Energiatarve</h4>
                      <p className="text-sm">
                        Kasvava pentu tarvitsee jopa kaksi kertaa enemmän energiaa painokiloa kohden kuin aikuinen koira.
                        Tämä energia on polttoainetta paitsi leikkiin, myös koko kehon kriittiseen kehitykseen.
                      </p>
                    </div>

                    {/* Proteiini */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">1.1</Badge>
                        Proteiini: elämän perusta
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Tavoite: 22–32% kuiva-aineesta</h4>
                          <p className="text-sm">
                            Proteiinit ovat välttämättömiä lihasten, elinten ja luuston rakennusaineita.
                            Ne ovat myös kriittisiä toimivan immuunijärjestelmän, hormonien ja entsyymien tuotannolle.
                          </p>
                        </div>

                        <div className="bg-primary/5 p-3 rounded">
                          <h4 className="font-semibold text-primary text-sm mb-1">Laatu ennen kaikkea</h4>
                          <p className="text-sm">
                            Eläinperäiset proteiinit (liha, kala) sisältävät kaikki pennulle välttämättömät aminohapot
                            oikeassa suhteessa, toisin kuin kasviproteiinit.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Rasvat */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">1.2</Badge>
                        Rasvat: energiaa ja älynystyröitä
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Tavoite: 8–22% kuiva-aineesta</h4>
                          <p className="text-sm">
                            Rasvat ovat tiivis energianlähde ja välttämättömiä rasvaliukoisten A-, D-, E- ja K-vitamiinien imeytymiselle.
                            Toisin kuin me ihmiset, koiran tulee saada suurin osa päivittäisestä energiastaan rasvoista.
                          </p>
                        </div>

                        <div className="bg-primary/5 p-3 rounded">
                          <h4 className="font-semibold text-primary text-sm mb-1">Aivojen superruoka</h4>
                          <p className="text-sm">
                            Omega-3-rasvahappoihin kuuluva DHA on todistetusti elintärkeä aivojen ja näön kehitykselle.
                            Laadukkaissa penturuoissa on usein lisättynä esimerkiksi kalaöljyä DHA:n lähteeksi.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Hiilihydraatit */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">1.3</Badge>
                        Hiilihydraatit & kuidut: virtaa ja vatsan hyvinvointia
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Hyvin sulavat hiilihydraatit (riisi, kaura) tarjoavat tasaista energiaa ja ovat helliä
                          pennun kehittyvälle ruoansulatusjärjestelmälle.
                        </p>

                        <div className="bg-primary/5 p-3 rounded">
                          <h4 className="font-semibold text-primary text-sm mb-1">Kuidut (tavoite 2-4%)</h4>
                          <p className="text-sm">
                            Tukevat suoliston terveyttä, mutta liika kuitu voi haitata muiden ravintoaineiden imeytymistä.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Vitamiinit ja kivennäisaineet */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">1.4</Badge>
                        Vitamiinit & kivennäisaineet: tarkkaa tasapainoa
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Tässä piilee yksi penturuokinnan suurimmista haasteista. Erityisesti kalsiumin ja
                          fosforin suhde (n. 1,2–1,4:1) on kriittinen luuston terveydelle.
                        </p>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-accent">Varoitus suurille roduille</h4>
                              <p className="text-sm mt-1">
                                Liiallinen kalsiumin saanti on erityisen vaarallista suurille ja jättiläisroduille,
                                sillä se voi häiritä luuston normaalia kehitystä ja johtaa pysyviin kasvuhäiriöihin.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 2: Ruokinta on Koulutusta */}
              <section id="ruokinta-koulutus">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 2: Ruokinta on koulutusta ja aivojumppaa</CardTitle>
                    <p className="text-muted-foreground">Ruokahetki on paljon muutakin kuin vain vatsan täyttämistä</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Rutiinit */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">2.1</Badge>
                        Rutiinit luovat turvaa
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Tarjoa ruoka säännöllisinä aikoina rauhallisessa paikassa, jossa pentu saa syödä ilman häiriöitä.
                          Johdonmukaiset rutiinit auttavat pentua ennakoimaan päivän kulkua ja pysymään rauhallisempana.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Maltti */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">2.2</Badge>
                        Maltti on valttia
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Opeta pentu istumaan ja odottamaan lupaa ennen kuin se ryntää kupille. Voit aloittaa pyytämällä
                          istumista ja antamalla luvan heti. Vähitellen pidennä odotusaikaa.
                        </p>

                        <div className="bg-primary/5 p-3 rounded">
                          <p className="text-sm">
                            <strong>Hyöty:</strong> Tämä yksinkertainen harjoitus opettaa pennulle itsehillintää,
                            josta on hyötyä monissa muissakin tilanteissa.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Ei kerjäämiselle */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">2.3</Badge>
                        Ei kerjäämiselle
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Vältä antamasta ruokaa omalta lautaseltasi, sillä se opettaa koiran kerjäämään.
                          Muista, että ihmisten ruoka voi olla haitallista.
                        </p>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">🔥 Hauska fakta</h4>
                          <p className="text-sm">
                            Yksi nakki pienelle 5 kg koiralle vastaa samaa kuin 75 kg aikuinen söisi 15 nakkia kerralla!
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Virikkeistäminen */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">2.4</Badge>
                        Virikkeistäminen ruoalla
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Koira on luotu käyttämään nenäänsä. Kupista syömisen sijaan voit tarjoa osan päivän ruoasta virikkeellistämällä.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Piilottelu</h4>
                            <p className="text-xs">Piilota nappuloita asuntoon tai nurmikolle pennun etsittäväksi</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Aktivointilelu</h4>
                            <p className="text-xs">Käytä -kuppeja, joista pennun täytyy työskennellä saadakseen ruokansa</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Tuhoaminen</h4>
                            <p className="text-xs">Anna pennun repiä ruokansa esiin pahvilaatikoista - sallittua tuhoamista!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 3: Liikunta ja Leikki */}
              <section id="liikunta-leikki">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 3: Liikunta ja leikki - pennun fysiikka ja fysiologia</CardTitle>
                    <p className="text-muted-foreground">Liikunta on elintärkeää pennun fyysiselle ja henkiselle kehitykselle</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Vapauden ilo */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">3.1</Badge>
                        Vapauden ilo
                      </h3>

                      <div className="space-y-3">
                        <p className="text-sm">
                          Paras liikunta on vapaa leikki ja liikkuminen pennun omilla ehdoilla, mieluiten toisten
                          sopivien koirien kanssa tai rauhallisilla metsälenkeillä. Anna pennun liikkua niin paljon kuin se itse jaksaa.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Vältä pakkotahtisuutta */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">3.2</Badge>
                        Vältä pakkotahtisuutta
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-accent">Varoitus</h4>
                              <p className="text-sm mt-1">
                                Älä juoksuta pentua pyörän vierellä tai pakota sitä toistuviin, raskaisiin suorituksiin,
                                kuten portaiden kiipeämiseen. Ne ovat liian raskaita kasvavalle luustolle ja nivelille.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Alusta on tärkeä */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">3.3</Badge>
                        Alusta on tärkeä
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Suosi ✅</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Pehmeitä alustoja (metsä, nurmi)</li>
                            <li>• Luonnollisia maastoja</li>
                            <li>• Vaihtelevaa maastoa</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-accent">Vältä ❌</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Pitkiä lenkkejä kovalla asfaltilla</li>
                            <li>• Toistuvaa kovalla alustalla juoksemista</li>
                            <li>• Liukkaita pintoja</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Liukastumisenesto */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">3.4</Badge>
                        Varo liukastumisia
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <p className="text-sm">
                            <strong>Suurin loukkaantumisriski:</strong> Liukastuminen kotona liukkailla lattioilla pentuhepulien aikana.
                            Matot voivat auttaa, mutta varovaisuus on valttia.
                          </p>
                        </div>

                        <div className="bg-primary/5 p-3 rounded">
                          <p className="text-sm">
                            <strong>Energian purkaminen:</strong> Riittävä liikunta purkaa pennun energiaa ja auttaa sitä
                            rauhoittumaan kotona. Väsynyt pentu on onnellinen pentu (ja omistajakin saa hetken rauhaa).
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 4: Ruokintamuodot (entinen Osa 1) */}
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
                        Kuivaruoka (täysravintonappulat)
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
                        Märkäruoka (säilykkeet ja annospussit)
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
                        Sekaruokinta: eri ruokintatapojen yhdistäminen
                      </h3>

                      <p className="text-sm mb-4">
                        Sekaruokinta yhdistää eri ruokintatapojen parhaita puolia. Kriittistä on laskea annoskoot
                        kalorien perusteella, ei tilavuuden.
                      </p>

                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Sekaruokinnan laskeminen</CardTitle>
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
                    <CardTitle className="text-2xl">Osa 3: Pennun ruokinnan tiede</CardTitle>
                    <p className="text-muted-foreground">Ymmärrä mitä ja miksi syötät</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Kriittiset ravitsemustarpeet */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">3.1</Badge>
                        Pennun kriittiset ravitsemustarpeet
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-primary">Energia ja proteiini</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Pennut tarvitsevat 2x enemmän kaloreita/kg kuin aikuiset</li>
                            <li>• Proteiini: vähintään 22-32% kuiva-aineesta</li>
                            <li>• Rasva: 10-25% energiansaantiin ja hermoston kehitykseen</li>
                          </ul>
                        </div>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Kalsium-fosforisuhde (Ca:P)</h4>
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
                        Herkkujen 10% sääntö
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

              {/* Osa 4: Ongelmatilanteita */}
              <section id="ongelmatilanteita" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 4: Ongelmia ruokakupilla? Vianmääritys ja ratkaisut</CardTitle>
                    <p className="text-muted-foreground">Joskus ruokinta ei suju kuin tanssi. Tässä yleisimmät haasteet ja ratkaisut niihin.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Apua, pentu ei syö! */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">4.1</Badge>
                        Apua, pentu ei syö!
                      </h3>

                      <div className="space-y-4">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Hampaiden vaihto (n. 4–6 kk)</h4>
                          <p className="text-sm mb-2">
                            Ikenet voivat olla arat, jolloin kovan nappulan pureskelu sattuu.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Kostuta nappuloita lämpimällä vedellä tai maidottomalla liemellä
                            tai tarjoa väliaikaisesti märkäruokaa. Purulelut voivat myös helpottaa oloa.
                          </p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">Stressi ja ympäristön muutokset</h4>
                          <p className="text-sm mb-2">
                            Muutto uuteen kotiin, uudet ihmiset tai muut rutiinien muutokset voivat tilapäisesti viedä ruokahalun.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Anna pennulle rauha ja aikaa sopeutua. Tarjoa ruokaa säännöllisesti ja rauhallisessa paikassa.
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-3 rounded">
                            <h4 className="font-semibold text-sm mb-1">Rokotusten jälkeen</h4>
                            <p className="text-sm">On normaalia, että ruokahalu on heikompi vuorokauden ajan rokotusten jälkeen.</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded">
                            <h4 className="font-semibold text-sm mb-1">Nirsoilu</h4>
                            <p className="text-sm">Jatkuvasti saatavilla oleva ruoka voi opettaa pennun nirsoilemaan.
                              <strong>Ratkaisu:</strong> Rajoita ruokailuaika 15–20 minuuttiin.</p>
                          </div>
                        </div>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-accent">Milloin eläinlääkäriin?</h4>
                              <p className="text-sm mt-1">
                                Jos ruokahaluttomuus jatkuu yli 24 tuntia tai siihen liittyy muita oireita
                                (oksentelu, ripuli, velttous), ota yhteyttä eläinlääkäriin.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Vatsa kuralle */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">4.2</Badge>
                        Vatsa kuralle – yleisimmät ruokintavirheet
                      </h3>

                      <div className="space-y-4">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Liian nopea ruokavalion muutos</h4>
                          <p className="text-sm mb-2">
                            Pennun ruoansulatusjärjestelmä on herkkä eikä siedä nopeita muutoksia.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Tee kaikki muutokset ruokavalioon vähitellen useiden päivien aikana
                            sekoittamalla uutta ruokaa vanhaan kasvavissa suhteissa.
                          </p>
                        </div>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">Yliruokinta</h4>
                          <p className="text-sm mb-2">
                            Lihavuus pentuna on valtava riski nivelille ja luustolle, ja se voi aiheuttaa pysyviä vaurioita.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Seuraa pennun painoa ja kuntoluokitusta. Kylkiluiden tulee tuntua,
                            mutta ei näkyä. Säädä annoskokoa tarpeen mukaan.
                          </p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">Resurssien vartiointi</h4>
                          <p className="text-sm mb-2">
                            Jotkut koirat tulevat omistushaluisiksi ruoastaan tai luistaan.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Älä luo kilpailutilannetta ottamalla kuppia pois kesken syömisen.
                            Sen sijaan opeta luopumista tekemällä siitä kannattavaa: vaihda lelu tai puruluu hetkeksi
                            vielä herkullisempaan namiin ja anna alkuperäinen takaisin. Tämä opettaa pennulle,
                            että lähestyvä ihminen on hyvä asia, ei uhka.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 5: Erityistarpeet */}
              <section id="erityistarpeet">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 5: Erityistarpeet ja -ruokavaliot: yksi koko ei sovi kaikille</CardTitle>
                    <p className="text-muted-foreground">Rotukohtaiset vaatimukset ja erityisruokavaliot</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Rotukohtaiset vaatimukset */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">5.1</Badge>
                        Rotukohtaiset vaatimukset
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-blue-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800">Pienet rodut (&lt;10 kg)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <p className="text-sm">
                                Niillä on nopea aineenvaihdunta ja pieni vatsalaukku. Ne saavuttavat aikuiskokonsa jo 8–12 kuukaudessa.
                              </p>
                              <div className="bg-accent/10 p-3 rounded border border-accent/20">
                                <h4 className="font-semibold text-accent text-sm mb-1">Erityisriski: Hypoglykemia</h4>
                                <p className="text-sm">
                                  Verensokerin lasku, erityisesti stressitilanteissa. Tämän vuoksi useat pienet ateriat päivässä ovat tärkeitä.
                                </p>
                              </div>
                              <div className="bg-primary/5 p-3 rounded">
                                <h4 className="font-semibold text-primary text-sm mb-1">Ruokasuositus</h4>
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
                            <div className="space-y-3">
                              <p className="text-sm">
                                Kasvavat hitaasti, jopa 18–24 kuukauden ikään saakka.
                              </p>
                              <div className="bg-accent/10 p-3 rounded border border-accent/20">
                                <h4 className="font-semibold text-accent text-sm mb-1">Erityisriskit</h4>
                                <p className="text-sm">
                                  Luuston ja nivelten kehityshäiriöt, jos kasvu on liian nopeaa tai kalsiumia on ruoassa liikaa.
                                  Myös mahalaukun kiertymän riski on suurempi suurilla aterioilla.
                                </p>
                              </div>
                              <div className="bg-primary/5 p-3 rounded">
                                <h4 className="font-semibold text-primary text-sm mb-1">Ruokasuositus</h4>
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

                    <Separator />

                    {/* Erityisruokavaliot */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">5.2</Badge>
                        Erityisruokavaliot
                      </h3>

                      <div className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded">
                          <h4 className="font-semibold mb-2">Viljaton ruokinta</h4>
                          <p className="text-sm">
                            Sopii koirille, joilla on todettu vilja-allergia tai -herkkyys.
                            Viljattomassa ruoassa viljat on korvattu muilla hiilihydraatin lähteillä, kuten perunalla tai herneellä.
                          </p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">Allergiat ja herkkä vatsa</h4>
                          <p className="text-sm mb-2">
                            Jos pennulla on jatkuvia iho- tai vatsaoireita, syynä voi olla ruoka-aineallergia.
                          </p>
                          <p className="text-sm">
                            <strong>Ratkaisu:</strong> Eläinlääkärin valvonnassa toteutettu eliminaatiodieetti,
                            jossa käytetään vain yhtä proteiininlähdettä (ns. monoproteiiniruoka),
                            on tehokas tapa selvittää allergian aiheuttaja.
                          </p>
                        </div>

                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h4 className="font-semibold text-accent mb-2">🔬 Tieteellinen näyttö</h4>
                          <p className="text-sm">
                            Helsingin yliopiston DogRisk-tutkimusryhmä on osoittanut, että vähän prosessoitu,
                            raakaruokapainotteinen ruokavalio pentuaikana on yhteydessä merkittävästi pienempään
                            allergioiden ja atopian riskiin aikuisiällä.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 6: Turvallisuus */}
              <section id="turvallisuus">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Osa 6: Ruoan turvallisuus: ole tietoinen ja vaativa kuluttaja</CardTitle>
                    <p className="text-muted-foreground">Vaikka koiranruoan valmistus Suomessa on pääosin laadukasta, takaisinvetoja tapahtuu</p>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mb-6">
                      <h4 className="font-semibold text-accent mb-2">⚠️ Esimerkkitapaukset</h4>
                      <p className="text-sm">
                        Tapaukset kuten SMAAK-ruoan korkeat glykoalkaloidipitoisuudet ja Hau-Hau Champion -puruluiden
                        aiheuttamat oireilut ovat muistutuksia siitä, että ongelmia esiintyy.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Badge variant="secondary">6.1</Badge>
                        Valvonnan haasteet
                      </h3>

                      <p className="text-sm mb-4">
                        <a href="https://www.ruokavirasto.fi/" className="text-primary hover:underline" target="_blank" rel="noopener">Ruokaviraston</a> valvontaresurssit ovat rajalliset, mikä korostaa omistajan omaa vastuuta.
                      </p>

                      <div>
                        <h4 className="font-semibold text-primary mb-3">Mitä voit tehdä?</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-semibold text-sm mb-2">Seuraa tiedotteita</h5>
                            <p className="text-sm">Pidä silmällä <a href="https://www.ruokavirasto.fi/elaimet/rehut/" className="text-primary hover:underline" target="_blank" rel="noopener">Ruokaviraston</a> virallisia tiedotteita.</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-semibold text-sm mb-2">Valitse luotettavia merkkejä</h5>
                            <p className="text-sm">Suosi valmistajia, jotka ovat avoimia tuotantoprosesseistaan ja raaka-aineistaan.</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-semibold text-sm mb-2">Ilmoita ongelmista</h5>
                            <p className="text-sm">Jos epäilet ruoan aiheuttavan koirallesi oireita, ole yhteydessä valmistajaan ja tee ilmoitus <a href="https://www.ruokavirasto.fi/yritykset/elintarvikeala/valvonta/ilmoitukset-ja-palautteet/" className="text-primary hover:underline" target="_blank" rel="noopener">Ruokavirastolle</a>.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                      <h4 className="font-semibold text-primary mb-2">Tasapainon löytäminen</h4>
                      <p className="text-sm">
                        Lopulta tärkeintä on löytää tasapaino, joka sopii juuri sinun pennullesi ja elämäntilanteeseesi.
                        Seuraa, opi ja säädä ruokintaa tarpeen mukaan. Kysy rohkeasti neuvoa eläinlääkäriltä tai
                        ravitsemusasiantuntijalta. Onnea matkaan kohti tervettä aikuisuutta!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Osa 5: Yhteenveto */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">Osa 5: Asiantuntijan suositukset</CardTitle>
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
                        <li>• <a href="https://www.ruokavirasto.fi/elaimet/rehut/" className="text-primary hover:underline" target="_blank" rel="noopener">Ruokavirasto - rehut</a></li>
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

              {/* FAQ Section */}
              <section id="usein-kysytyt-kysymykset">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Usein kysytyt kysymykset</CardTitle>
                    <p className="text-muted-foreground">Kattava kokoelma yleisimpiä pennun ruokintaan liittyviä kysymyksiä</p>
                  </CardHeader>
                  <CardContent>
                    <FAQ items={[
                      // Painonseuranta ja kasvu
                      {
                        question: "Kuinka usein minun pitäisi punnita pentuni?",
                        answer: "Pennut tulisi punnita viikoittain ensimmäisten kuukausien ajan. Tämä auttaa seuraamaan kasvua ja varmistamaan, että pentu kehittyy normaalisti."
                      },
                      {
                        question: "Milloin pentu saavuttaa aikuispainonsa?",
                        answer: "Pienet rodut saavuttavat aikuispainonsa noin 8-12 kuukaudessa, keskikokoiset 12-15 kuukaudessa ja suuret rodut 18-24 kuukaudessa."
                      },
                      {
                        question: "Mikä on normaali painonnousu pennulle?",
                        answer: "Terve pentu yleensä kaksinkertaistaa syntymäpainonsa ensimmäisen viikon aikana ja kolminkertaistaa sen kahden viikon ikään mennessä."
                      },
                      // Ruokinta ja ruokamäärät
                      {
                        question: "Kuinka paljon ruokaa pentu tarvitsee painon mukaan?",
                        answer: "Ruokamäärä lasketaan elopainokiloa kohden. Pienet rodut (1-5 kg): 42g/kg 6 viikon iässä, vähennetään 31g/kg 7 kuukauteen mennessä. Suuret rodut (10-20 kg): 26g/kg 6 viikon iässä, vähennetään 19g/kg 8 kuukauteen mennessä. Esimerkki: 4kg, 5kk ikäinen pentu tarvitsee noin 136g päivässä."
                      },
                      {
                        question: "Kuinka monta kertaa päivässä pentua tulisi ruokkia?",
                        answer: "7-10 viikkoa: 4 kertaa päivässä. 3-4 kuukautta: 3 kertaa päivässä. 4-6 kuukautta: 3 kertaa päivässä. 6-7 kuukautta: 2 kertaa päivässä. Vuoden ikäisenä: 1-2 kertaa päivässä. Sopiva ruokintaväli on noin 4 tuntia."
                      },
                      {
                        question: "Tulisiko kuivaruoan nappulat turvottaa pennulle?",
                        answer: "Kyllä, turvottaminen on suositeltavaa pennuille, joiden hampaat ovat vielä kehittymässä. Kuivaruoan nappuloilla menee 'jokunen tunti turvota'. Lämpimällä vedellä turvottaminen on nopeampaa. Turvottaminen varmistaa riittävän nesteyden saannin."
                      },
                      {
                        question: "Milloin voin lopettaa nappuloiden turvottamisen?",
                        answer: "Noin 5 kuukauden iässä voi lopettaa pienen koiran ruoan kostuttamisen. Hampaiden vaihtuminen tapahtuu 3-7 kuukauden ikäisenä. Siirtymä tehdään asteittain: ensin turvotettuna, sitten maistellen kuivia, lopulta kokonaan kuivina kun hampaat ovat kehittyneet riittävästi."
                      },
                      {
                        question: "Kuinka paljon raakaruokaa pentu tarvitsee?",
                        answer: "Raakaruokinnassa pentu syö keskimäärin 2,5-3% oletetusta aikuispainosta. Määrät ovat aina suuntaa antavia ja ruokamäärää tulee säätää pennun painokehityksen mukaan. Seuraa pennun kasvua ja säädä määriä tarpeen mukaan."
                      },
                      {
                        question: "Miten seurata pennun ruokamäärien riittävyyttä?",
                        answer: "Seuraa pennun painokehitystä ja säädä ruokamäärää tarpeen mukaan. Pentu tulisi pitää hoikkana ja hyvässä kunnossa. Kylkiluut tulee tuntua kevyesti ihon ja ohuen rasvakerroksen alta. Tarjoa ruokaa tiettyinä ruoka-aikoina noin 15 minuutin ajan."
                      },
                      {
                        question: "Miksi pennulle ei voi antaa aikuisen koiran ruokaa?",
                        answer: "Penturuoka sisältää enemmän energiaa ja proteiinia kuin aikuisen koiran ruoka. Aikuisten koirien ruoka on pennulle liian kevyttä nopeaan kasvuun ja kehitykseen. Valitse pennulle aina laadukas, lihapitoinen penturuoka, joka tukee optimaalista kasvua."
                      },
                      {
                        question: "Mitä hyötyä kuivien nappuloiden syömisestä on?",
                        answer: "Kuivat nappulat auttavat tukemaan suuhygieniaa nappuloiden mekaanisen harjausvaikutuksen ansiosta. Aikuinen koira voi syödä kuivaruokaa kuivana, kunhan vettä on jatkuvasti saatavilla. Kuivat nappulat ovat parempia koiran hampaille kuin turvonneet."
                      }
                    ]} title="" />
                  </CardContent>
                </Card>
              </section>

            </div>

            {/* Sidebar Ad (Desktop Only) */}
            <div className="hidden lg:block space-y-8 relative">
              <div className="sticky top-24">
                <div className="text-xs font-medium text-stone-500 mb-2 text-center uppercase tracking-wider">Mainos</div>
                <AdBanner variant="skyscraper" />
              </div>
            </div>

          </div>

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
    </MobileOptimizedLayout>
  );
};

export default PuppyGuide;