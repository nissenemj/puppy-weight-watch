import React from 'react';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calculator, Users, Heart, Shield, MapPin, Zap, Home, Info } from 'lucide-react';
import FAQ from '@/components/FAQ';
import Navigation from '@/components/Navigation';
import InfoCard from '@/components/InfoCard';
import InfoSection from '@/components/InfoSection';
import InfoBadge from '@/components/InfoBadge';
import BackToTopButton from '@/components/BackToTopButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/welcome-illustration.png';

const SocializationGuide = () => {
  const faqs = [
    {
      question: "Milloin sosiaalistaminen pitäisi aloittaa?",
      answer: "Sosiaalistaminen alkaa jo kasvattajan luona 3-16 viikon iässä. Tämä on kriittinen ikkuna, jolloin pennun aivot ovat supermuovautuvia. Jatka sosiaalistamista heti kun pentu saapuu kotiin."
    },
    {
      question: "Voiko pentua sosiaalistaa ennen täyttä rokotussuojaa?",
      answer: "Kyllä, asiantuntijat suosittelevat turvallista sosiaalistamista: kanna pentua sylissä, istu viltillä puistossa ja tapaa vain tuttuja, rokotettuja koiria. Käytösongelmien riski on suurempi kuin tautiriski."
    },
    {
      question: "Miten tunnistan ylikuormittuneen pennun?",
      answer: "Ylikuormittunut pentu saattaa olla levoton, haukotella paljon, irrota katsekontaktin tai pyrkiä pois tilanteesta. Anna pennun levätä ja prosessoida kokemuksia - oppiminen tapahtuu unen aikana."
    },
    {
      question: "Ovatko koirapuistot sopivia pennuille?",
      answer: "Ei. Koirapuistot ovat liian arvaamattomia nuorille pennuille. Suosi ennalta sovittuja leikkitreffejä tuttujen, rauhallisten koirien kanssa."
    }
  ];

  return (
    <MobileOptimizedLayout>
    <div className="min-h-screen bg-background page-with-navigation w-full overflow-x-hidden">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={heroImage} 
              alt="Pennun sosiaalistamisopas" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-foreground">
            🐕 Kattava opas pennun sosiaalistamiseen
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
            Selviydy, menesty ja kasvata tasapainoinen aikuinen
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Onneksi olkoon uudesta perheenjäsenestä! Ensimmäiset kuukaudet ovat ratkaisevan tärkeitä, 
            ja oikeanlainen sosiaalistaminen on paras investointi, jonka voit koirasi tulevaisuuteen tehdä.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tämä opas antaa sinulle kaikki työkalut pennun sosiaalistamisviidakossa navigointiin – niin iloissa kuin haasteissakin.
          </p>
        </div>

        <InfoCard
          title="Pika-navigaatio"
          icon={<Calculator className="h-5 w-5" />}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#superpennun-mielen-rakennuspalikat" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Zap className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Superpennun mielen rakennuspalikat</h3>
              <p className="text-sm text-muted-foreground">Kriittinen ikkuna ja positiiviset kokemukset</p>
            </a>
            <a href="#sosiaalistaminen-luottamuksen-rakentamista" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Heart className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Sosiaalistaminen on luottamuksen rakentamista</h3>
              <p className="text-sm text-muted-foreground">Rutiinit, maltti ja virikkeistäminen</p>
            </a>
            <a href="#turvalliset-kohtaamiset-leikki" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Users className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Turvalliset kohtaamiset ja leikki</h3>
              <p className="text-sm text-muted-foreground">Pennun sosiaaliset taidot</p>
            </a>
            <a href="#ongelmatilanteita" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <AlertTriangle className="h-5 w-5 text-accent mb-2" />
              <h3 className="font-semibold">Ongelmatilanteita</h3>
              <p className="text-sm text-muted-foreground">Vianmääritys ja ratkaisut</p>
            </a>
            <a href="#erityistarpeet" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Heart className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Erityistarpeet: arka vs. reipas pentu</h3>
              <p className="text-sm text-muted-foreground">Yksilölliset tarpeet</p>
            </a>
            <a href="#turvallisuuden-varmistaminen" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <Shield className="h-5 w-5 text-accent mb-2" />
              <h3 className="font-semibold">Turvallisuuden varmistaminen</h3>
              <p className="text-sm text-muted-foreground">Ole tietoinen ja vaativa omistaja</p>
            </a>
            <a href="#paikalliset-resurssit" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
              <MapPin className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold">Paikalliset resurssit Kuopiossa</h3>
              <p className="text-sm text-muted-foreground">Koirakoulut ja turvalleset paikat</p>
            </a>
          </div>
        </InfoCard>

        <InfoCard
          title="Pennun tasapainoisen tulevaisuuden perusta"
          className="mb-8"
        >
          <div className="prose max-w-none">
            <p>
              Koiranpennun saapuminen kotiin on yksi elämän suurimmista iloista, mutta se tuo mukanaan myös 
              merkittävän vastuun. Yksi tärkeimmistä pennun hyvinvointiin vaikuttavista tekijöistä on sen sosiaalistaminen. 
              Ensimmäisten elinkuukausien aikana luodaan perusta koiran koko loppuelämän käytökselle ja henkiselle tasapainolle.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary my-6">
              <h4 className="font-semibold text-primary mb-2">Keskeinen viesti</h4>
              <p className="text-sm">
                Jokainen pentu on ainutlaatuinen, ja sen tapa kohdata maailma riippuu rodusta, luonteesta ja aiemmista kokemuksista. 
                Pitkä lista suoritettavia asioita on lähtökohta, mutta pennun kehonkieli on kompassi. Laatu korvaa aina määrän.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Osa 1: Superpennun mielen rakennuspalikat */}
        <InfoSection
          id="superpennun-mielen-rakennuspalikat"
          sectionNumber="Osa 1"
          title="Superpennun mielen rakennuspalikat"
          description="Tarkempi katsaus pennun henkisen kasvun perustekijöihin"
        >
          <div className="space-y-6">
            <InfoCard title="1.1 Kriittinen ikkuna: elämän perusta" variant="warm">
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Tavoite: Mahdollisimman paljon positiivisia kokemuksia 3–16 viikon iässä</h4>
                  <p className="text-sm">
                    Tämä ainutkertainen aikaikkuna on kuin aivojen supermuovautuva vaihe. Jopa 80% pennun aivoista 
                    kehittyy tänä aikana, ja kokemukset muovaavat pysyviä hermoratoja. Tämän kauden laiminlyöntiä 
                    on lähes mahdotonta paikata myöhemmin.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Viestijuoksu kasvattajalta</h4>
                  <p className="text-sm">
                    Sosiaalistaminen alkaa jo kasvattajan luona. Vastuullinen kasvattaja on jo tehnyt pohjatyön 
                    tarjoamalla virikkeitä ja totuttamalla pentua käsittelyyn. Sinun tehtäväsi on jatkaa tätä työtä saumattomasti.
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="1.2 Positiivisten kokemusten pankkitili: henkistä pääomaa ja resilienssiä" variant="cool">
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Tavoite: Kerätä mahdollisimman suuri saldo positiivisia kokemuksia</h4>
                  <p className="text-sm">
                    Jokainen onnistunut, turvallinen kohtaaminen on talletus pennun "sosiaalistamisen pankkitilille". 
                    Tämä puskuri auttaa sitä selviytymään elämän yllättävistä ja pelottavista tilanteista.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Mielen supervoimaa</h4>
                  <p className="text-sm">
                    Suuri saldo opettaa pennulle, että uudet asiat ovat lähtökohtaisesti mielenkiintoisia, eivät pelottavia.
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="1.3 Geenit & ympäristö: luonteen ja kokemusten yhteispeli" variant="purple">
              <div className="space-y-4">
                <p className="text-sm">
                  Perimä antaa raamit, mutta ympäristö maalaa taulun. Emän stressi tiineyden aikana voi vaikuttaa 
                  pentuihin, ja virikkeetön ympäristö jättää pysyvän jäljen.
                </p>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Kasvattajan vastuu</h4>
                  <p className="text-sm">
                    Hyvä kasvattaja valitsee jalostukseen tasapainoisia vanhempia ja tarjoaa pennuille virikkeellisen alun.
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 2: Sosiaalistaminen on luottamuksen rakentamista */}
        <InfoSection
          id="sosiaalistaminen-luottamuksen-rakentamista"
          sectionNumber="Osa 2"
          title="Sosiaalistaminen on luottamuksen rakentamista"
          description="Sosiaalistamishetki on paljon muutakin kuin vain uusien asioiden näkemistä"
        >
          <div className="space-y-6">
            <InfoCard title="2.1 Rutiinit luovat turvaa" variant="warm">
              <p className="text-sm">
                Tee sosiaalistamisesta osa arkea. Lyhyet, suunnitellut retket uusiin paikkoihin ovat tehokkaampia 
                kuin satunnaiset, pitkät rynnistykset. Anna pennun myös levätä ja prosessoida kokemuksiaan – 
                oppiminen tapahtuu unen aikana.
              </p>
            </InfoCard>

            <InfoCard title="2.2 Maltti on valttia" variant="cool">
              <div className="space-y-4">
                <p className="text-sm">
                  Opeta pentu tarkkailemaan maailmaa rauhassa. Istu puiston penkille ja anna pennun katsoa 
                  leikkiviä lapsia tai ohi kulkevia ihmisiä turvallisen matkan päästä.
                </p>
                
                <div className="bg-primary/5 p-3 rounded">
                  <p className="text-sm">
                    <strong>Hyöty:</strong> Tämä yksinkertainen harjoitus opettaa pennulle itsehillintää, 
                    josta on hyötyä monissa muissakin tilanteissa.
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="2.3 Ei pakottamiselle" variant="accent">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      Älä koskaan vedä tai pakota pentua kohti pelottavaa asiaa. Se on nopein tapa luoda pelkoja 
                      ja rikkoa luottamus. Sinun tehtäväsi on olla pennun turvasatama.
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="2.4 Virikkeistäminen sosiaalistamisella" variant="default">
              <div className="space-y-4">
                <p className="text-sm mb-4">
                  Koira on luotu tutkimaan. Maailman ihmettely on parasta aivojumppaa.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Ihmiset:</h5>
                    <p className="text-xs">Kaikenikäiset ja -näköiset ihmiset, myös ne, joilla on hattu, parta tai pyörätuoli</p>
                    
                    <h5 className="font-semibold text-sm">Eläimet:</h5>
                    <p className="text-xs">Rauhalliset, rokotetut aikuiset koirat ja muut eläimet turvalliselta etäisyydeltä</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Paikat ja pinnat:</h5>
                    <p className="text-xs">Kaupungin kadut, metsäpolut, hissit, erilaiset lattiamateriaalit</p>
                    
                    <h5 className="font-semibold text-sm">Äänet:</h5>
                    <p className="text-xs">Kodin ja kaupungin äänet, kuten imuri ja hälytysajoneuvot</p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 3: Turvalliset kohtaamiset ja leikki */}
        <InfoSection
          id="turvalliset-kohtaamiset-leikki"
          sectionNumber="Osa 3"
          title="Turvalliset kohtaamiset ja leikki - pennun sosiaaliset taidot"
          description="Leikki on elintärkeää pennun sosiaaliselle kehitykselle"
        >
          <div className="space-y-6">
            <InfoCard title="3.1 Vapauden ilo" variant="warm">
              <p className="text-sm">
                Paras sosiaalinen harjoitus on vapaa leikki sopivan ja tutun koirakaverin kanssa. 
                Pentu oppii koirien kieltä, jota ihminen ei voi sille opettaa.
              </p>
            </InfoCard>

            <InfoCard title="3.2 Vältä pakkotahtisuutta" variant="accent">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-accent">Varoitus</h4>
                    <p className="text-sm mt-1">
                      Koirapuistot eivät ole sopivia paikkoja nuorille pennuille. Riski huonoihin kokemuksiin 
                      ja tauteihin on liian suuri. Yksi pelottava tilanne voi jättää elinikäiset arvet.
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="3.3 Ympäristö on tärkeää" variant="default">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    ✅ Suosi
                  </h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Rauhallisia, tuttuja ympäristöjä</li>
                    <li>• Ohjattuja pentutreffejä</li>
                    <li>• Yksittäisiä leikkitreffejä</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    ❌ Vältä
                  </h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Kaoottisia koirapuistoja</li>
                    <li>• Tuntemattomia, riehakkaita koiria</li>
                    <li>• Tilanteita, joita et voi hallita</li>
                  </ul>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="3.4 Varo ylikuormittumista" variant="cool">
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Suurin riski: Ylikuormittuminen ja väsymys</h4>
                  <p className="text-sm">
                    Väsynyt pentu ei opi, vaan stressaantuu.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Energian purkaminen</h4>
                  <p className="text-sm">
                    Lyhyet, positiiviset kokemukset ja niiden jälkeinen lepo ovat avain onneen. 
                    Väsynyt (hyvällä tavalla) pentu on onnellinen pentu.
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 4: Ongelmia sosiaalistamisessa */}
        <InfoSection
          id="ongelmatilanteita"
          sectionNumber="Osa 4"
          title="Ongelmia sosiaalistamisessa? Vianmääritys ja ratkaisut"
          description="Joskus kaikki ei suju kuin tanssi. Tässä yleisimmät haasteet ja ratkaisut niihin."
        >
          <div className="space-y-6">
            <InfoCard title="4.1 Apua, pentu pelkää!" variant="accent">
              <div className="space-y-3">
                <p className="text-sm"><strong>Syy:</strong> Liian voimakas ärsyke, liian pieni etäisyys tai yllättävä tilanne.</p>
                <p className="text-sm">
                  <strong>Ratkaisu:</strong> Pysy itse rauhallisena. Älä sääli, mutta tue. Lisää etäisyyttä välittömästi 
                  ja poistu tilanteesta. Yritä myöhemmin uudelleen paljon helpommassa versiossa.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="4.2 Ylikuormitus ja 'pentuhepulit'" variant="warm">
              <div className="space-y-3">
                <p className="text-sm"><strong>Syy:</strong> Liikaa uusia asioita, liian vähän lepoa. Aivot käyvät ylikierroksilla.</p>
                <p className="text-sm">
                  <strong>Ratkaisu:</strong> Vähemmän on enemmän. Yksi uusi kokemus päivässä riittää. 
                  Varmista, että pentu saa nukkua ja levätä rauhassa kokemusten jälkeen. 
                  Uni on se, jolloin oppiminen tapahtuu.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="4.3 Koirapuistojen haasteet" variant="cool">
              <div className="space-y-3">
                <p className="text-sm"><strong>Syy:</strong> Hallitsematon ympäristö, tuntemattomat koirat, omistajien välinpitämättömyys.</p>
                <p className="text-sm">
                  <strong>Ratkaisu:</strong> Vältä koirapuistoja pennun kanssa. Suosi ennalta sovittuja leikkitreffejä 
                  tuttujen, rauhallisten koirien kanssa.
                </p>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 5: Erityistarpeet */}
        <InfoSection
          id="erityistarpeet"
          sectionNumber="Osa 5"
          title="Erityistarpeet: arka vs. reipas pentu"
          description="Yksi koko ei sovi kaikille"
        >
          <div className="space-y-6">
            <InfoCard title="5.1 Arka tai herkkä pentu" variant="warm">
              <div className="space-y-3">
                <p className="text-sm">
                  Tarvitsee enemmän aikaa, tilaa ja tukea. Etene hitaammin ja pienemmin askelin. 
                  Jokainen pienikin onnistuminen on suuri voitto.
                </p>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Erityishuomio</h4>
                  <p className="text-sm">
                    Vahvista itsevarmuutta onnistumisten kautta. Älä koskaan pakota.
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="5.2 Reipas ja itsevarma pentu" variant="cool">
              <div className="space-y-3">
                <p className="text-sm">
                  Tarvitsee myös rajoja ja malttia. Vaikka pentu tuntuisi pärjäävän missä vain, 
                  opeta sille myös rauhoittumista ja tarkkailua.
                </p>
                
                <div className="bg-primary/5 p-3 rounded">
                  <h4 className="font-semibold text-primary text-sm mb-1">Erityishuomio</h4>
                  <p className="text-sm">
                    Itsevarmuus ei ole sama kuin hyvät tavat. Ohjaa energiaa oikeisiin asioihin ja opeta, 
                    ettei kaikkien kanssa tarvitse rientää leikkimään.
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 6: Turvallisuuden varmistaminen */}
        <InfoSection
          id="turvallisuuden-varmistaminen"
          sectionNumber="Osa 6"
          title="Turvallisuuden varmistaminen: ole tietoinen ja vaativa omistaja"
          description="Vaikka sosiaalistaminen on tärkeää, turvallisuus on aina etusijalla"
        >
          <div className="space-y-6">
            <InfoCard title="6.1 Rokotusdilemma" variant="accent">
              <div className="space-y-3">
                <p className="text-sm"><strong>Haaste:</strong> Miten sosiaalistaa ennen täyttä rokotussuojaa?</p>
                <p className="text-sm">
                  <strong>Ratkaisu:</strong> Asiantuntijat ovat yksimielisiä: käytösongelmien riski puutteellisen 
                  sosiaalistamisen vuoksi on suurempi kuin tautiriski. Sosiaalista turvallisesti: kanna pentua sylissä, 
                  istu viltillä puistossa, tapaa vain tuttuja ja rokotettuja koiria siistissä ympäristössä.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="6.2 Mitä voit tehdä?" variant="default">
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-sm mb-2">Valitse luotettava koirakoulu</h5>
                  <p className="text-xs">Suosi ammattitaitoisia kouluttajia, jotka käyttävät positiivisia menetelmiä.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-sm mb-2">Tarkasta paikat etukäteen</h5>
                  <p className="text-xs">Jos harkitset koirapuistoa vanhemman koiran kanssa, käy siellä ensin itse ilman koiraa ja tarkkaile tilannetta.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-sm mb-2">Ole pentusi puolustaja</h5>
                  <p className="text-xs">Sinun tehtäväsi on suojella pentuasi huonoilta kokemuksilta. On täysin ok sanoa "ei", jos joku haluaa tulla tervehtimään epäsopivassa tilanteessa.</p>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Osa 7: Paikalliset resurssit Kuopiossa */}
        <InfoSection
          id="paikalliset-resurssit"
          sectionNumber="Osa 7"
          title="Paikalliset resurssit Kuopiossa"
          description="Ammattilaisen apu ja turvalliset ympäristöt"
        >
          <div className="space-y-6">
            <InfoCard title="7.1 Ammattilaisen apu: Kuopion koirakoulutu" variant="warm">
              <div className="space-y-4">
                <p className="text-sm mb-4">
                  Ammattilaisen ohjaama pentukurssi on erinomainen tapa tarjota pennulle turvallisia sosiaalisia kokemuksia.
                </p>

                <div className="bg-primary/5 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-primary text-sm mb-1">Vinkki</h4>
                      <p className="text-sm">
                        Pentukurssien paikat täyttyvät nopeasti! Kannattaa olla ajoissa liikkeellä ja tutustua 
                        useampaan vaihtoehtoon ennen valintaa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Palveluntarjoaja</th>
                        <th className="border border-border p-2 text-left">Kurssit ja hinta</th>
                        <th className="border border-border p-2 text-left">Huomioita</th>
                        <th className="border border-border p-2 text-left">Linkki</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-2 font-medium">Musti ja Mirri</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentukurssi (3-10 kk)</div>
                            <div className="text-xs text-muted-foreground">4 x 60 min, 89€</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Arjen taitoja rennossa ja turvallisessa ympäristössä</td>
                        <td className="border border-border p-2">
                          <a href="https://www.varaaheti.fi/trimmisfi/fi/kuopio_kolmisoppi/courses" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Ajanvaraus
                          </a>
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">Pondera</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentukurssi & arkitottelevaisuus</div>
                            <div className="text-xs text-muted-foreground">Useita ikävaiheille</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Tutkinnon suorittaneet eläintenkouluttajat, Kaivotie 23</td>
                        <td className="border border-border p-2">
                          <a href="https://www.pondera.fi/tuote-osasto/pentukurssit/" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Kotisivut
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Properro</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">ESKARI (yli 3 kk)</div>
                            <div className="text-xs text-muted-foreground">4 viikkoa, 129€</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Ryhmässä olemista, arkitaitoja ja hauskoja tehtäviä</td>
                        <td className="border border-border p-2">
                          <a href="https://www.properro.net/proeskari" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Ilmoittautuminen
                          </a>
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">KPSH ry</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentukurssi</div>
                            <div className="text-xs text-muted-foreground">Arki- ja harrastuskoirille</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Motivaatio, kontakti, hihnakäytös ja arjen haasteet</td>
                        <td className="border border-border p-2">
                          <a href="https://www.kpsh.net/harrastuslajit/muu-toiminta/pentukurssit/" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Kurssisivu
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Tassujen tahtiin</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentukoulu (2-6 kk)</div>
                            <div className="text-xs text-muted-foreground">Pienryhmät (2 koirakkoa)</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Yksilöllinen ohjaus, Volttikatu 6 Savilahdessa</td>
                        <td className="border border-border p-2">
                          <a href="https://www.tassujentahtiin.fi/kurssit/" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Kurssit
                          </a>
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">Tottis Studio HuiKee</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentutreffit & kurssit</div>
                            <div className="text-xs text-muted-foreground">12 vk-8 kk</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Valvotut pentuleikit, Telkkistentie 6 Kelloniemessä</td>
                        <td className="border border-border p-2">
                          <a href="https://www.tottisstudiohuikee.fi/pennut-ja-arkitaidot" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Arkitaidot
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Koiraurheilukeskus SAVO</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Pentujen tehokurssi</div>
                            <div className="text-xs text-muted-foreground">Arkielämä & harrastusten pohjat</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Suuri keskus Siilinjärvellä, noin 10 min Kuopiosta</td>
                        <td className="border border-border p-2">
                          <a href="https://www.koiraurheilukeskussavo.fi/kurssit-ja-valmennus/" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Kurssit
                          </a>
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">Koirakoulu Kannustava</td>
                        <td className="border border-border p-2">
                          <div>
                            <div className="font-medium">Yksityis- & ryhmätunnit</div>
                            <div className="text-xs text-muted-foreground">Koko P-Savo</div>
                          </div>
                        </td>
                        <td className="border border-border p-2">Erikoisosaaminen vireenhallinnassa ja metsästyskoirissa</td>
                        <td className="border border-border p-2">
                          <a href="https://www.koirakoulukannustava.fi" 
                             target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:text-primary/80 text-xs underline">
                            Kotisivut
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="7.2 Turvalliset leikkipaikat: Kuopion koirapuistot (vanhemmille koirille)" variant="cool">
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        Koirapuistot soveltuvat vasta vanhemmille, täysin rokotetuille ja sosiaalisesti taitaville koirille. 
                        Tarkasta puiston kunto aina etukäteen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Puiston nimi</th>
                        <th className="border border-border p-2 text-left">Sijainti</th>
                        <th className="border border-border p-2 text-left">Aitaukset</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-2 font-medium">Maljapuron koirapuisto</td>
                        <td className="border border-border p-2">Maljapuronpolku</td>
                        <td className="border border-border p-2">Kaksi aitausta (isot/pienet)</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">Saarijärven koirapuisto</td>
                        <td className="border border-border p-2">Rimpitie 1</td>
                        <td className="border border-border p-2">Kaksi aitausta (isot/pienet)</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Inkilänmäen koirapuisto</td>
                        <td className="border border-border p-2">Inkilänmäenkatu</td>
                        <td className="border border-border p-2">Yksi yhteinen aitaus</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-2 font-medium">Neulamäen koirapuisto</td>
                        <td className="border border-border p-2">Neulamäentie</td>
                        <td className="border border-border p-2">Yksi yhteinen aitaus</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Puijonlaakson koirapuisto</td>
                        <td className="border border-border p-2">Sammakkolammentien läheisyydessä</td>
                        <td className="border border-border p-2">Yksi yhteinen aitaus</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </InfoCard>
          </div>
        </InfoSection>

        {/* Asiantuntijan suositukset */}
        <InfoCard title="Asiantuntijan suositukset" variant="purple" className="mb-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4">Tärkeimmät muistisäännöt:</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Laatu korvaa aina määrän</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Etene aina pennun ehdoilla – lue sen kehonkieltä</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Älä koskaan pakota. Ole pennun turvasatama</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Muista lepo – oppiminen tapahtuu nukkuessa</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Vältä koirapuistoja nuoren pennun kanssa</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <p className="text-sm">Valitse ammattitaitoinen, positiivisiin menetelmiin sitoutunut koirakoulu</p>
                </div>
              </div>
            </div>
          </div>
        </InfoCard>

        <div className="mt-12">
          <FAQ title="Usein kysytyt kysymykset sosiaalistamisesta" items={faqs} />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Aloita sosiaalistaminen tänään
          </h2>
          <p className="text-muted-foreground mb-6">
            Muista: jokainen päivä on arvokas sosiaalistamiselle. Aloita pienestä ja etene pennun tahdissa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/puppy-book">
              <Button size="lg">
                Aloita Pentukirja
              </Button>
            </Link>
            <Link to="/info">
              <Button size="lg" variant="outline">
                Takaisin tietopankkiin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <BackToTopButton />
    </div>
    </MobileOptimizedLayout>
  );
};

export default SocializationGuide;