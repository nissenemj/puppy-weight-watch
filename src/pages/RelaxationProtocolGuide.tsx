import React from 'react';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Brain, Heart, Timer, BookOpen, CheckCircle, Info, Target, List, Calendar, ArrowRight } from 'lucide-react';
import FAQ from '@/components/FAQ';
import { Navigation } from '@/components/Navigation';
import InfoCard from '@/components/InfoCard';
import InfoSection from '@/components/InfoSection';
import BackToTopButton from '@/components/BackToTopButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { createArticleSchema, createBreadcrumbSchema } from '@/utils/structuredData';
import heroImage from '@/assets/relaxation-protocol-infographic.jpg';

const RelaxationProtocolGuide = () => {
  const structuredData = [
    createArticleSchema(
      "Rentoutusprotokolla - Ohje koiran rauhoittumiseen",
      "Karen Overallin 15 päivän rentoutusprotokolla. Opi opettamaan koirallesi rauhoittumista ja itsehillintää.",
      heroImage
    ),
    createBreadcrumbSchema([
      { name: "Etusivu", url: window.location.origin },
      { name: "Oppaat", url: `${window.location.origin}/guides` },
      { name: "Rentoutusprotokolla", url: `${window.location.origin}/guides/relaxation-protocol` }
    ])
  ];

  const faqs = [
    {
      question: "Kuinka kauan yksi harjoituskerta kestää?",
      answer: "Yksi harjoituskerta kestää tyypillisesti 5-15 minuuttia riippuen päivästä ja harjoitusten määrästä. On tärkeää, että harjoittelu on positiivista eikä koira väsy liikaa."
    },
    {
      question: "Mitä teen, jos koira nousee ylös kesken harjoituksen?",
      answer: "Älä suutu. Ohjaa koira neutraalisti takaisin matolle (älä palkitse paluusta heti) ja peruuta harjoituksessa pari pykälää taaksepäin helpompaan tehtävään."
    },
    {
      question: "Voiko protokollan tehdä nopeamminkin kuin 15 päivässä?",
      answer: "Ei kannata. Protokolla on suunniteltu antamaan koiralle aikaa prosessoida oppimaansa. Kiirehtiminen voi heikentää tuloksia. Sen sijaan voit tehdä saman päivän harjoitukset useamman kerran."
    },
    {
      question: "Mikä matto tai alusta sopii parhaiten?",
      answer: "Mikä tahansa selkeästi erottuva alusta käy: koiran peti, matto, pyyhe tai fleece-viltti. Tärkeintä on, että käytät aina samaa alustaa, jotta siitä tulee visuaalinen vihje rauhoittumiselle."
    },
    {
      question: "Auttaako protokolla reaktiivisuuteen?",
      answer: "Kyllä. Rentoutusprotokolla on erinomainen pohjatyökalu reaktiivisuuden hoitoon. Se opettaa koiralle fysiologista rauhoittumista, mikä auttaa sitä käsittelemään stressaavia tilanteita paremmin."
    }
  ];

  return (
    <MobileOptimizedLayout>
      <SEO
        title="Rentoutusprotokolla - Ohje koiran rauhoittumiseen"
        description="Karen Overallin 15 päivän rentoutusprotokolla on tehokas tapa hoitaa eroahdistusta ja reaktiivisuutta."
        image={heroImage}
        type="article"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background page-with-navigation w-full overflow-x-hidden">
        <Navigation />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0 space-y-8">
          {/* Hero Section with infographic */}
          <div className="rounded-2xl overflow-hidden mb-12">
            <div className="relative">
              <img
                src={heroImage}
                alt="Karen Overallin Rentoutusprotokolla - Visuaalinen opas rauhalliseen koiraan"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Quick Navigation */}
          <InfoCard
            title="Pika-navigaatio"
            icon={<List className="h-5 w-5" />}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="#johdanto" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                <Brain className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">1. Johdanto</h3>
                <p className="text-sm text-muted-foreground">Rentoutuminen on taito, ei komento</p>
              </a>
              <a href="#tutkimusdata" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                <BookOpen className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">2. Tutkimusdata</h3>
                <p className="text-sm text-muted-foreground">Miksi rentoutus on tärkeää?</p>
              </a>
              <a href="#rakenne-ja-saannot" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                <Target className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">3. Protokollan säännöt</h3>
                <p className="text-sm text-muted-foreground">Valmistelu ja ohjeet</p>
              </a>
              <a href="#koulutusohjelma" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">4. 15 päivän ohjelma</h3>
                <p className="text-sm text-muted-foreground">Täydellinen tehtäväsarja</p>
              </a>
              <a href="#yhteenveto" className="p-3 rounded-lg border hover:bg-accent/10 transition-colors">
                <CheckCircle className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">5. Yhteenveto</h3>
                <p className="text-sm text-muted-foreground">Jatkotoimenpiteet</p>
              </a>
            </div>
          </InfoCard>

          {/* Section 1: Introduction */}
          <InfoSection
            id="johdanto"
            sectionNumber="Osa 1"
            title="Rentoutuminen on taito, ei komento"
            description="Karen Overallin kehittämä Rentoutusprotokolla on yksi maailman käytetyimmistä työkaluista koirien ahdistuksen hoitoon"
          >
            <div className="space-y-6">
              <InfoCard title="Protokollan ydinajatus" variant="warm">
                <div className="space-y-4">
                  <p className="text-sm">
                    Karen Overallin kehittämä <strong>Rentoutusprotokolla</strong> (Protocol for Relaxation) on yksi maailman
                    käytetyimmistä ja tieteellisesti arvostetuimmista työkaluista koirien ahdistuksen, ylivireyden ja
                    reaktiivisuuden hoidossa.
                  </p>
                  <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold text-primary mb-2">Ydinajatus</h4>
                    <p className="text-sm">
                      Protokolla opettaa koiralle, että <strong>rauhallisuus on aktiivinen valinta ja tila</strong>,
                      ei vain toimettomuutta.
                    </p>
                  </div>
                  <p className="text-sm">
                    Tämä 15 päivän ohjelma opettaa koiralle fysiologista rauhoittumista ja impulssikontrollia,
                    mikä auttaa suoraan sekä ulkoiluun että ääniherkkyyteen.
                  </p>
                </div>
              </InfoCard>
            </div>
          </InfoSection>

          {/* Section 2: Research Background */}
          <InfoSection
            id="tutkimusdata"
            sectionNumber="Osa 2"
            title="Perusta tutkimusdataan: Miksi rentoutus on tärkeää?"
            description="Viimeisin tutkimustieto korostaa kognitiivista ja hyvinvointilähtöistä koulutusta"
          >
            <div className="space-y-6">
              <InfoCard title="2.1 Reaktiivisuus on tunnetila, ei tottelemattomuutta" variant="cool">
                <div className="space-y-4">
                  <p className="text-sm">
                    Tutkimukset osoittavat, että reaktiivinen käytös (rähinä, hyökkäily) on lähes aina oire koiran
                    "kiihtymisportaikon" ylittymisestä. Koira ei ole "tottelematon", vaan sen mantelitumake (amygdala)
                    on kaapannut aivotoiminnan, estäen oppimisen.
                  </p>
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-accent">Vanhentuneet teoriat kumottu</h4>
                        <p className="text-sm mt-1">
                          Vanhentuneet "johtajuus-" tai "dominanssiteoriat" on tieteellisesti kumottu.
                          Nykyisin reaktiivisuutta lähestytään tunteiden säätelyn, stressinhallinnan ja
                          koiran oman vaikutusmahdollisuuden (agency) kautta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="2.2 Vaikutusmahdollisuudet (Agency)" variant="warm">
                <div className="space-y-3">
                  <p className="text-sm">
                    Kognitiotutkimukset korostavat, että kun koira saa itse vaikuttaa tilanteeseen
                    (esim. poistumalla uhkaavan asian luota), oppiminen nopeutuu ja stressitasot laskevat pysyvästi.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="2.3 Kivun ja stressin yhteys" variant="accent">
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        Tuoreet tutkimukset ovat löytäneet vahvan linkin kroonisen kivun, suoliston mikrobiomin
                        ja reaktiivisuuden välillä. <strong>Reaktiivisen koiran terveydentila tulisi aina tarkistaa.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="2.4 Kuinka protokolla toimii?" variant="purple">
                <div className="space-y-4">
                  <p className="text-sm">
                    Rentoutusprotokolla toimii luomalla koiralle turvallisen ja ennakoitavan rutiinin,
                    jossa se oppii, että matolla olo on lupa "sammuttaa järjestelmä".
                  </p>
                  <div className="bg-primary/5 p-3 rounded">
                    <h4 className="font-semibold text-primary text-sm mb-1">Biofeedback-mekanismi</h4>
                    <p className="text-sm">
                      Kun koira makaa paikoillaan ja sitä palkitaan rauhallisuudesta, sen syke laskee ja hengitys tasaantuu.
                      Tämä fysiologinen rauhoittuminen viestii aivoille, että "kaikki on hyvin".
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </InfoSection>

          {/* Section 3: Protocol Structure and Rules */}
          <InfoSection
            id="rakenne-ja-saannot"
            sectionNumber="Osa 3"
            title="Protokollan rakenne ja säännöt"
            description="15 päivän ohjelma, joka koostuu valmiista tehtävälistoista"
          >
            <div className="space-y-6">
              <InfoCard title="3.1 Valmistelu" variant="warm">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">1. Tietty alusta</h5>
                      <p className="text-xs">
                        Käytä tiettyä mattoa, pyyhettä tai petiä. Tästä tulee koiralle visuaalinen vihje
                        rauhoittumiselle ja sen "turvasatama".
                      </p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">2. Pienet namit</h5>
                      <p className="text-xs">
                        Käytä todella pieniä (herneen kokoisia tai pienempiä), mutta maistuvia herkkuja.
                      </p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">3. Rauhallinen mielentila</h5>
                      <p className="text-xs">
                        Älä tee tätä kiireessä. Koira peilaa sinun tunnetilaasi.
                      </p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="3.2 Säännöt - Noudata näitä tarkasti" variant="accent">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left font-semibold">Sääntö</th>
                        <th className="border border-border p-3 text-left font-semibold">Kuvaus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">Ei käskyttämistä</td>
                        <td className="border border-border p-3">
                          Älä hokee "paikka, paikka". Pyydä koira alussa matolle, ja sen jälkeen olet hiljaa.
                          Haluamme koiran tarkkailevan sinua ja ympäristöä, ei kuuntelevan käskyjä.
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">Koira valitsee asennon</td>
                        <td className="border border-border p-3">
                          Makuuasento on paras rentoutumiseen, mutta istuminenkin käy alussa.
                          Jos koira vaihtaa asentoa, se on ok, kunhan se pysyy matolla.
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Vapautus</td>
                        <td className="border border-border p-3">
                          Harjoitus ei lopu siihen, että koira nousee omin luvin.
                          Harjoitus loppuu sinun vapautussanaasi (esim. "Vapaa").
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">Virheet</td>
                        <td className="border border-border p-3">
                          Jos koira poistuu matolta ennen aikojaan, älä suutu.
                          Ohjaa koira neutraalisti takaisin ja peruuta harjoituksessa pari pykälää taaksepäin.
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Palkitseminen</td>
                        <td className="border border-border p-3">
                          Palkitse koira aina heti tehtävän suorittamisen jälkeen.
                          Palkkio on pieni, jotta harjoitusta voidaan jatkaa.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </InfoCard>
            </div>
          </InfoSection>

          {/* Section 4: Full 15-Day Program */}
          <InfoSection
            id="koulutusohjelma"
            sectionNumber="Osa 4"
            title="Täysimittainen koulutusohjelma (15 päivää)"
            description="Jokainen tehtävä on suoritettava onnistuneesti ennen siirtymistä seuraavaan"
          >
            <div className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mb-6">
                <p className="text-sm">
                  <strong>Ohje:</strong> Jokainen tehtävä on suoritettava onnistuneesti (koira pysyy rauhallisena matolla)
                  ennen kuin siirrytään seuraavaan. Jos koira nousee ylös tai on levoton, palaa edelliseen, helpompaan tehtävään.
                </p>
              </div>

              {/* Day 1 */}
              <InfoCard title="Päivä 1" variant="warm">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 5 sekuntia</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta taakse ja palaat</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 1 askeleen vasemmalle ja palaat</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 2 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun otat 2 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kerran</li>
                    <li>Istu/Makaa, kun otat 3 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun lasket ääneen 10:een</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kerran</li>
                    <li>Istu/Makaa, kun lasket ääneen 20:een</li>
                    <li>Istu/Makaa, kun otat 3 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kahdesti</li>
                    <li>Istu/Makaa 3 sekuntia</li>
                    <li>Istu/Makaa 5 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen taakse ja palaat</li>
                    <li>Istu/Makaa 3 sekuntia</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa 5 sekuntia</li>
                    <li>Istu/Makaa 3 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 2 */}
              <InfoCard title="Päivä 2" variant="cool">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta taakse ja palaat</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kerran</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kahdesti</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kolmesti</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa, kun lasket ääneen 10:een</li>
                    <li>Istu/Makaa, kun lasket ääneen 20:een</li>
                    <li>Istu/Makaa, kun lasket ääneen 30:een</li>
                    <li>Istu/Makaa 5 sekuntia</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa 5 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 3 */}
              <InfoCard title="Päivä 3" variant="warm">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta taakse ja palaat</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun otat 1 askeleen vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 2 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kevyesti</li>
                    <li>Istu/Makaa, kun taputat käsiäsi kovemmin</li>
                    <li>Istu/Makaa, kun lasket ääneen 15:een</li>
                    <li>Istu/Makaa, kun lasket ääneen 30:een</li>
                    <li>Istu/Makaa 10 sekuntia</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 4 */}
              <InfoCard title="Päivä 4" variant="cool">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun otat 5 askelta taakse ja palaat</li>
                    <li>Istu/Makaa, kun otat 6 askelta taakse ja palaat</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun otat 5 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa, kun otat 6 askelta oikealle ja palaat</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun otat 5 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa, kun otat 6 askelta vasemmalle ja palaat</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun taputat käsiäsi ja hyräilet</li>
                    <li>Istu/Makaa, kun taputat käsiäsi ja lasket 10:een</li>
                    <li>Istu/Makaa, kun kävelet koiran ympäri</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                    <li>Istu/Makaa, kun lasket ääneen 45:een</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 5 */}
              <InfoCard title="Päivä 5" variant="warm">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun kävelet koiran ympäri</li>
                    <li>Istu/Makaa, kun otat 2 askelta taakse, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta taakse, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta taakse, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun otat 2 askelta oikealle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta oikealle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta oikealle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun otat 2 askelta vasemmalle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 3 askelta vasemmalle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa, kun otat 4 askelta vasemmalle, taputat käsiäsi ja palaat</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun kävelet koiran ympäri ja taputat käsiäsi</li>
                    <li>Istu/Makaa, kun kävelet koiran ympäri ja lasket 20:een</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 6 */}
              <InfoCard title="Päivä 6" variant="cool">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun kävelet koiran ympäri</li>
                    <li>Istu/Makaa, kun kävelet nopeasti koiran ympäri</li>
                    <li>Istu/Makaa, kun hölkkäät koiran ympäri</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun kävelet ovelle ja takaisin</li>
                    <li>Istu/Makaa, kun kävelet ovelle, kosketat ovenkahvaa ja palaat</li>
                    <li>Istu/Makaa 15 sekuntia</li>
                    <li>Istu/Makaa, kun hölkkäät ovelle ja takaisin</li>
                    <li>Istu/Makaa, kun taputat käsiäsi ja kävelet koiran ympäri</li>
                    <li>Istu/Makaa, kun taputat käsiäsi ja hölkkäät koiran ympäri</li>
                    <li>Istu/Makaa 20 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 7 */}
              <InfoCard title="Päivä 7" variant="warm">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun kävelet ovelle, avaat sen ja suljet sen ja palaat</li>
                    <li>Istu/Makaa, kun hölkkäät ovelle, avaat sen ja suljet sen ja palaat</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun kaksi perheenjäsentä kävelee ohi yhdessä</li>
                    <li>Istu/Makaa, kun kaksi perheenjäsentä kävelee ohi ja puhuu hiljaa</li>
                    <li>Istu/Makaa, kun kaksi perheenjäsentä kävelee ohi ja nauraa</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                    <li>Istu/Makaa, kun toinen perheenjäsen kävelee koiran ympäri</li>
                    <li>Istu/Makaa, kun toinen perheenjäsen hölkkää koiran ympäri</li>
                    <li>Istu/Makaa 30 sekuntia</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Day 8 */}
              <InfoCard title="Päivä 8" variant="cool">
                <div className="overflow-x-auto">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Istu/Makaa 1 minuutti</li>
                    <li>Istu/Makaa, kun sinä ja toinen perheenjäsen kävelette koiran ympäri vastakkaisiin suuntiin</li>
                    <li>Istu/Makaa, kun sinä ja toinen perheenjäsen hölkkäätte koiran ympäri vastakkaisiin suuntiin</li>
                    <li>Istu/Makaa 1 minuutti</li>
                    <li>Istu/Makaa, kun sinä ja toinen perheenjäsen taputatte käsiänne samanaikaisesti</li>
                    <li>Istu/Makaa, kun sinä ja toinen perheenjäsen puhutte toisillenne koiran yli</li>
                    <li>Istu/Makaa 1 minuutti</li>
                    <li>Istu/Makaa, kun joku tulee ovelle, koputtaa ja lähtee</li>
                    <li>Istu/Makaa, kun joku tulee ovelle, soittaa ovikelloa ja lähtee</li>
                    <li>Istu/Makaa 1 minuutti</li>
                  </ol>
                </div>
              </InfoCard>

              {/* Days 9-15 */}
              <InfoCard title="Päivät 9-15: Yleistäminen" variant="purple">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <strong>Tärkeää:</strong> Päivät 9-15 ovat yleistämistä varten.
                      Toista aiemmat päivät uudessa ympäristössä (esim. toinen huone, takapiha, puisto).
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Päivä 9:</strong> Toista Päivä 1 uudessa paikassa</li>
                    <li><strong>Päivä 10:</strong> Toista Päivä 2 uudessa paikassa</li>
                    <li><strong>Päivä 11:</strong> Toista Päivä 3 uudessa paikassa</li>
                    <li><strong>Päivä 12:</strong> Toista Päivä 4 uudessa paikassa</li>
                    <li><strong>Päivä 13:</strong> Toista Päivä 5 uudessa paikassa</li>
                    <li><strong>Päivä 14:</strong> Toista Päivä 6 uudessa paikassa</li>
                    <li><strong>Päivä 15:</strong> Toista Päivä 7 uudessa paikassa</li>
                  </ul>
                  <Separator />
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Ylläpito</h5>
                    <p className="text-sm">
                      Jatka harjoittelua satunnaisesti eri paikoissa ja eri aikoina.
                      Yhdistele tehtäviä eri päiviltä ylläpitääksesi taitoa.
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </InfoSection>

          {/* Section 5: Summary */}
          <InfoSection
            id="yhteenveto"
            sectionNumber="Osa 5"
            title="Yhteenveto ja jatkotoimenpiteet"
            description="Rentoutusprotokolla on erinomainen pohja muille käyttäytymisen muokkausohjelmille"
          >
            <div className="space-y-6">
              <InfoCard title="Protokollan hyödyt" variant="warm">
                <div className="space-y-4">
                  <p className="text-sm">
                    Rentoutusprotokolla on erinomainen pohja, jonka päälle muut käyttäytymisen muokkausohjelmat
                    (kuten <strong>Engage-Disengage</strong> tai <strong>BAT 2.0</strong>) on helppo rakentaa.
                  </p>
                  <p className="text-sm">
                    Kun koira oppii fysiologisen rentoutumisen taidon, sen kyky käsitellä stressiä ja
                    uusia tilanteita paranee merkittävästi.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Muistutus" variant="purple">
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium">
                    🐾 Koulutus on maraton, ei sprintti. Ole kärsivällinen ja johdonmukainen.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Lähteet" variant="default">
                <div className="space-y-2 text-sm">
                  <p>[1] Overall, K. L. (1997). Clinical Behavioral Medicine for Small Animals. Mosby.</p>
                  <p>[2] Overall, K. L. (2020). Protocol for Relaxation: Behavior Modification Tier 1. [PDF-dokumentti].</p>
                  <p>[3] Käyttäjän toimittama tutkimusyhteenveto (2024–2025) koirien kognitiosta ja reaktiivisuudesta.</p>
                </div>
              </InfoCard>
            </div>
          </InfoSection>

          {/* FAQ Section */}
          <div className="mt-12">
            <FAQ title="Usein kysytyt kysymykset rentoutusprotokollasta" items={faqs} />
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Aloita rentoutusprotokolla tänään
            </h2>
            <p className="text-muted-foreground mb-6">
              Muista: Johdonmukaisuus on avain menestykseen. Aloita Päivästä 1 ja etene koiran tahdissa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/guides">
                <Button size="lg" variant="outline">
                  Takaisin oppaisiin
                </Button>
              </Link>
              <Link to="/guides/socialization">
                <Button size="lg">
                  Sosialisaatio-opas
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default RelaxationProtocolGuide;
