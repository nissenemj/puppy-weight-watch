import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, Heart, AlertTriangle, ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InfoNavigation from '@/components/InfoNavigation';

const FeedingMethods = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <InfoNavigation />
      <div className="container mx-auto py-8 space-y-8">
        
        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link to="/info">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Takaisin info-osioon
            </Button>
          </Link>
          <Link to="/">
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Siirry painolaskuriin
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold text-primary">
            Koiran Ruokintamenetelmien Vertaileva Selvitys
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Kattava analyysi kuiva-, märkä-, raaka- ja yhdistelmäruokinnasta Suomessa
          </p>
        </div>

        {/* Tiivistelmä */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tiivistelmä
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Kuivaruokinta täysravinnolla on edelleen yleisin ja käytännöllisin vaihtoehto, mutta 
              raakaruokinta, märkäruokinta ja yhdistelmäruokinnat (70/30 ja 50/50) tarjoavat merkittäviä 
              hyötyjä. Tutkimukset osoittavat, että jo <strong>20% raakaruoan osuus pennun ruokavaliossa 
              vähentää aikuisiän allergia- ja atopiaoireita merkittävästi</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Kuivaruokinta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Kuivaruokinta (Nappularuokinta)</CardTitle>
            <p className="text-muted-foreground">Yleisin ruokintamenetelmä Suomessa</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Kuivaruokinta täysravinnolla on Suomessa edelleen yleisin ruokintamenetelmä ja hyvästä syystä. 
              Laadukas kuivaruoka sisältää kaikki koiran tarvitsemat ravintoaineet sopivassa suhteessa.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Hyödyt</h4>
                <ul className="text-sm space-y-1">
                  <li>• Täysravinto takaa ravintoaineiden riittävyyden</li>
                  <li>• Kustannustehokas (30-70€/kk keskikokoiselle koiralle)</li>
                  <li>• Pitkä säilyvyys ja helppokäyttöisyys</li>
                  <li>• Hampaiden puhdistuminen kovien nappuloiden ansiosta</li>
                  <li>• Energiatiheys korkeampi kuin märkäruoassa</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Haitat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Korkea tärkkelyspitoisuus (50-60%) voi altistaa ylipainolle</li>
                  <li>• Kuumennusprosessi tuhoaa entsyymejä ja vitamiineja</li>
                  <li>• Voi aiheuttaa kroonista kuivumista</li>
                  <li>• Runsas määrä lisäaineita ja säilöntäaineita</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raakaruokinta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Raakaruokinta</CardTitle>
            <p className="text-muted-foreground">Kasvattanut suosiotaan merkittävästi</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Raakaruokinta perustuu koiran luonnolliseen ruokavalioon ja sisältää raakaa lihaa, luita, 
              sisäelimiä sekä vähän kasviksia.
            </p>

            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mb-4">
              <h4 className="font-semibold text-primary mb-2">Helsingin yliopiston tutkimustulokset</h4>
              <p className="text-sm">
                20% raakaruoan osuus pennun ruokavaliossa vähensi allergia- ja atopiaoireita aikuisiällä merkittävästi
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Hyödyt</h4>
                <ul className="text-sm space-y-1">
                  <li>• Parempi sulavuus kuin kuivaruoalla</li>
                  <li>• Luonnolliset entsyymit ja vitamiinit säilyvät</li>
                  <li>• Vähemmän korvatulehduksia ja vatsavaivoja</li>
                  <li>• Kiiltävämpi turkki ja parempi ihon kunto</li>
                  <li>• Vähemmän kroonisia suolistosairauksia</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Haitat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Korkeat kustannukset (jopa 240€/kk erikoisruokavaliolla)</li>
                  <li>• Hygieniariskit ja bakterivaarallisuus</li>
                  <li>• Vaatii tarkkaa suunnittelua</li>
                  <li>• Säilytyshaasteita ja tilantarvetta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Märkäruokinta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Märkäruokinta</CardTitle>
            <p className="text-muted-foreground">Korkea vesipitoisuus ja vahva maku</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Märkäruokinta on vesipitoisuudeltaan korkeaa (60-85%) ja maultaan vahvempaa kuin kuivaruoka. 
              Sopii erityisen hyvin koirille, joilla on ruokahalun ongelmia tai nesteytyksen tarpeita.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Hyödyt</h4>
                <ul className="text-sm space-y-1">
                  <li>• Korkea vesipitoisuus tukee nesteytystä</li>
                  <li>• Vahva maku - koirat syövät mielellään</li>
                  <li>• Helppo sulaa ja soveltuu herkkävatsaisille</li>
                  <li>• Vähemmän tärkkelystä kuin kuivaruoassa</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Haitat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Kalliimpaa kuin kuivaruoka</li>
                  <li>• Lyhyempi säilyvyys avoimen pakkauksen jälkeen</li>
                  <li>• Suurempi pakkaustuottama määrä</li>
                  <li>• Ei puhdista hampaita yhtä tehokkaasti</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yhdistelmäruokinnat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Yhdistelmäruokinnat (70/30 ja 50/50)</CardTitle>
            <p className="text-muted-foreground">Suosittu kompromissi käytännöllisyyden ja hyötyjen välillä</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">70/30-ruokinta</h4>
                <p className="text-sm">70% täysravintoa ja 30% lihaa, kalaa tai märkäruokaa. Varmistaa ravintoaineiden riittävyyden.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">50/50-ruokinta</h4>
                <p className="text-sm">Puolet kuivamuonaa ja puolet lihaa tai märkäruokaa. Vitamiinit kuivamuonasta, proteiinit lihasta.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Hyödyt</h4>
                <ul className="text-sm space-y-1">
                  <li>• Monipuolisuus ja maistuvuus</li>
                  <li>• Helpompi aloittaa kuin täysi raakaruokinta</li>
                  <li>• Lihan määrän lisääminen ruokavaliossa</li>
                  <li>• Kustannustehokkaampi kuin täysi raakaruokinta</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Haitat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Vaatii laskentaa ja suunnittelua</li>
                  <li>• Saattaa tarvita lisäravinteita</li>
                  <li>• Ruokien eri sulatusajat voivat aiheuttaa vatsaongelmia</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kustannusvertailu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Kustannusvertailu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-3 text-left">Ruokintamenetelmä</th>
                    <th className="border border-border p-3">Kuukausikustannus</th>
                    <th className="border border-border p-3">Vuosikustannus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Perusruokinta kuivaruoalla</td>
                    <td className="border border-border p-3 text-center">30-70€</td>
                    <td className="border border-border p-3 text-center">360-840€</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Laadukas kuivaruokinta</td>
                    <td className="border border-border p-3 text-center">40-50€</td>
                    <td className="border border-border p-3 text-center">480-600€</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Keskimääräinen ruokinta</td>
                    <td className="border border-border p-3 text-center">54€</td>
                    <td className="border border-border p-3 text-center">650€</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Raakaruokinta</td>
                    <td className="border border-border p-3 text-center">60-120€</td>
                    <td className="border border-border p-3 text-center">720-1440€</td>
                  </tr>
                  <tr className="bg-accent/10">
                    <td className="border border-border p-3 font-semibold">Allergikoiran erikoisruoka</td>
                    <td className="border border-border p-3 text-center font-semibold">240€</td>
                    <td className="border border-border p-3 text-center font-semibold">2880€</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ruokintasuositukset ikäkauden mukaan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ruokintasuositukset Ikäkauden Mukaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Pennut</h4>
                <ul className="text-sm space-y-1">
                  <li>• 2-3 kuukautta: 6 kertaa päivässä</li>
                  <li>• 3-4 kuukautta: 4 kertaa päivässä</li>
                  <li>• 4-6 kuukautta: 3 kertaa päivässä</li>
                  <li>• 6+ kuukautta: 2 kertaa päivässä</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Aikuiset koirat</h4>
                <ul className="text-sm space-y-1">
                  <li>• 2 kertaa päivässä on optimaalinen</li>
                  <li>• Kerran päivässä voi olla hyväksyttävää</li>
                  <li>• Säännölliset ruoka-ajat tärkeitä</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Seniorikoirat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Vähärasvainen ruoka hidastuneen aineenvaihdunnan takia</li>
                  <li>• Nivelten tukemiseen tähtäävät ravintoaineet</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terveysvaikutukset */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Terveysvaikutukset Tutkimusten Valossa
            </CardTitle>
            <p className="text-muted-foreground">Helsingin yliopiston DogRisk-tutkimusryhmän tulokset</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Raakaruoan hyödyt</h4>
                <p className="text-sm">20% raakaruoan osuus pennun ruokavaliossa vähensi allergia- ja atopiaoireita aikuisiällä merkittävästi</p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Suolistoterveys</h4>
                <p className="text-sm">Raakaruoka vähensi kroonisten suolistosairauksien todennäköisyyttä</p>
              </div>
            </div>
            
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent mb-2">⚠️ Kuivaruoan haitat</h4>
              <p className="text-sm">Yli 80% kuivaruoan osuus lisäsi allergiaoireita</p>
            </div>
          </CardContent>
        </Card>

        {/* Suositukset eri koiratyypeille */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Suositukset Eri Koiratyypeille</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Allergiakoirat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Eliminaatiodieetti raakaruoalla</li>
                  <li>• Yksivalkuainen kuivaruoka</li>
                  <li>• Monoproteiinitoiset vaihtoehdot</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Ylipainoiset koirat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Vähärasvainen kuivaruoka tai kotiruoka</li>
                  <li>• Aterioiden määrän vähentäminen</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Aktiiviset koirat</h4>
                <ul className="text-sm space-y-1">
                  <li>• Korkea proteiini- ja rasvapitoisuus</li>
                  <li>• Ruokinta vasta suorituksen jälkeen</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Johtopäätökset */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Johtopäätökset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              Ei ole olemassa yhtä "parasta" ruokintamenetelmää kaikille koirille. Valinta riippuu koiran 
              iästä, terveydentilasta, aktiivisuudesta ja omistajan resursseista.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-3">Tutkimusnäyttö tukee erityisesti:</h4>
              <ul className="text-sm space-y-2">
                <li>✅ Kuivaruokinta täysravinnolla on turvallinen perusvalinta useimmille koirille</li>
                <li>✅ Raakaruoan lisääminen jo 20% osuudella tuo merkittäviä terveyshyötyjä</li>
                <li>✅ Yhdistelmäruokinnat tarjoavat hyvän kompromissin käytännöllisyyden ja terveyshyötyjen välillä</li>
                <li>✅ Säännölliset ruoka-ajat ja painon seuranta ovat tärkeitä ruokintamenetelmästä riippumatta</li>
              </ul>
            </div>
            
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <p className="text-sm">
                <strong>Tärkeä muistutus:</strong> Ruokintapäätöstä tehtäessä kannattaa konsultoida eläinlääkäriä, 
                erityisesti jos koiralla on terveysongelmia tai erityistarpeita.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Käytä painolaskuria ruokinnan suunnittelussa</h3>
              <p className="text-muted-foreground">
                Seuraa koirasi painoa ja saa henkilökohtaisia ruokintasuosituksia valitsemallesi ruokintamenetelmälle.
              </p>
              <Link to="/">
                <Button size="lg" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Avaa painolaskuri
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedingMethods;