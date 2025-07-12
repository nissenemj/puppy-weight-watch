
import Navigation from '@/components/Navigation'
import ModernPuppyWeightTracker from '@/components/ModernPuppyWeightTracker'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import ImageOptimized from '@/components/ImageOptimized'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import heroPuppy from '@/assets/hero-puppy.png'
import growthStages from '@/assets/growth-stages.png'

const Index = () => {
  const faqs = [
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
    {
      question: "Voiko sovellusta käyttää ilman rekisteröitymistä?",
      answer: "Kyllä! Voit käyttää perusominaisuuksia ilman rekisteröitymistä. Rekisteröityminen mahdollistaa tietojen tallentamisen ja synkronoinnin."
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
  ];

  const structuredData = [
    createWebApplicationSchema(),
    createWeightTrackingSchema(),
    createFAQSchema(faqs)
  ];

  return (
    <div className="min-h-screen bg-grass-gradient">
      <SEO
        title="Pentulaskuri - Koiranpennun Painonseuranta ja Kasvuseuranta"
        description="Seuraa koiranpentusi kasvua ja kehitystä söpöllä ja helppokäyttöisellä sovelluksella. Ilmainen painonseuranta, ruokalaskuri ja annostelutaulukot pentujen kasvattajille."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus"
        structuredData={structuredData}
        url={window.location.origin}
      />
      <Navigation />
      
      {/* Hero Section with Central Puppy and Navigation Cards */}
      <section className="relative min-h-screen flex items-center justify-center bg-grass-gradient overflow-hidden">
        {/* Grass pattern background */}
        <div className="absolute inset-0 bg-emerald-50/30 opacity-60"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
            
            {/* Left Navigation Cards */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-primary/10">
                <div className="text-center">
                  <div className="text-3xl mb-2">🐕</div>
                  <h3 className="font-heading font-semibold text-sm text-primary">Painonseuranta</h3>
                </div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-accent/10">
                <div className="text-center">
                  <div className="text-3xl mb-2">🦴</div>
                  <h3 className="font-heading font-semibold text-sm text-accent">Ruokinta</h3>
                </div>
              </div>
            </div>

            {/* Central Hero Content */}
            <div className="lg:col-span-3 text-center">
              {/* Large Central Puppy */}
              <div className="mb-8 animate-puppy-bounce">
                <img 
                  src={heroPuppy} 
                  alt="Kultainen noutaja pentu" 
                  className="mx-auto w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
                />
              </div>
              
              {/* Hero Text */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 text-foreground">
                <span className="bg-gradient-warm bg-clip-text text-transparent">
                  Pentulaskuri
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 font-body leading-relaxed max-w-2xl mx-auto">
                Seuraa rakkaasi koiranpentusi kasvua ja kehitystä helposti 🐾
              </p>
              
              {/* CTA Button */}
              <button className="bg-gradient-primary text-white px-6 py-3 rounded-2xl text-base font-heading font-semibold shadow-playful hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Aloita seuranta
              </button>
            </div>

            {/* Right Navigation Cards */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-primary/10">
                <div className="text-center">
                  <div className="text-3xl mb-2">🐾</div>
                  <h3 className="font-heading font-semibold text-sm text-primary">Laskuri</h3>
                </div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-accent/10">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <h3 className="font-heading font-semibold text-sm text-accent">Tietoa</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4 text-foreground">
              Kaikki tarvittava pennun hoitoon
            </h2>
            <p className="text-base text-muted-foreground font-body max-w-2xl mx-auto">
              Seuraa kasvua, laske ruokamäärät ja pidä huolta pennun terveydestä
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10">
              <div className="text-center">
                <div className="text-4xl mb-4">🐕‍🦺</div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-primary">Kasvuseuranta</h3>
                <p className="text-sm text-muted-foreground">Seuraa pennun painon ja koon kehitystä helposti</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-accent/10">
              <div className="text-center">
                <div className="text-4xl mb-4">🍖</div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-accent">Ruokamäärät</h3>
                <p className="text-sm text-muted-foreground">Laske optimaaliset ruokamäärät iän ja painon mukaan</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/10">
              <div className="text-center">
                <div className="text-4xl mb-4">🩺</div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-primary">Terveys</h3>
                <p className="text-sm text-muted-foreground">Muistutukset rokotuksista ja terveystarkistuksista</p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-accent/10">
              <div className="text-center">
                <div className="text-4xl mb-4">📲</div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-accent">Helppokäyttö</h3>
                <p className="text-sm text-muted-foreground">Yksinkertainen käyttöliittymä mobiilissa ja tietokoneella</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModernPuppyWeightTracker />
      
      <div className="container mx-auto px-4 py-16">
        <FAQ items={faqs} />
      </div>
    </div>
  )
}

export default Index
