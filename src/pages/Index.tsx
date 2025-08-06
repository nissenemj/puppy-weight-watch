import React from 'react'
import Navigation from '@/components/Navigation'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import ImageOptimized from '@/components/ImageOptimized'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPaw, FaDog, FaBone, FaHeart, FaChartLine, FaCalculator, FaBook, FaInfoCircle } from 'react-icons/fa'
import { Bell, TrendingUp, Users, Award, ChartLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import heroPuppy from '@/assets/hero-puppy.png'
import growthStages from '@/assets/growth-stages.png'

const Index = () => {
  const faqs = [
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
    <div className="min-h-screen bg-gradient-hero prevent-overflow relative overflow-hidden">
      <SEO
        title="Pentulaskuri - Koiran Kasvun & Ruokinnan Seuranta"
        description="Moderni ja helppokäyttöinen sovellus koiran kasvun seuraamiseen. Seuraa painoa, ruokintaa ja kehitystä ammattimaisilla työkaluilla. Ilmainen käyttö."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus, moderni"
        structuredData={structuredData}
        url={window.location.origin}
      />
      
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-300/30 rounded-full float-animation"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-orange-400/40 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-10 w-5 h-5 bg-blue-400/20 rounded-full float-animation"></div>
      </div>
      <Navigation />
      
{/* Modern 3D Hero Section - Hellodani inspired */}
<motion.section 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  className="relative min-h-screen flex items-center justify-center px-4 py-20"
>
  <div className="container mx-auto text-center relative z-10">
    {/* Floating status badges */}
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">Yli 10,000 käyttäjää</span>
      </div>
      <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
        <Award className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">Suomen suosituin</span>
      </div>
    </motion.div>

    {/* 3D Hero Image with holographic elements */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative mb-12"
    >
      <div className="relative inline-block">
        <div className="float-animation">
          <img
            src={heroPuppy}
            alt="Koiran pentu"
            className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FFD23F)',
              padding: '4px'
            }}
          />
        </div>
        
        {/* Holographic UI elements floating around */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 glass rounded-2xl p-3 opacity-80"
        >
          <FaChartLine className="w-6 h-6 text-blue-500" />
        </motion.div>
        
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -left-4 glass rounded-2xl p-3 opacity-80"
        >
          <FaPaw className="w-6 h-6 text-orange-500" />
        </motion.div>
        
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-8 glass rounded-full p-2 opacity-70"
        >
          <FaHeart className="w-4 h-4 text-pink-500" />
        </motion.div>
      </div>
    </motion.div>

    {/* Main heading with gradient text */}
    <motion.h1 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
    >
      <span className="text-gradient">Koirasi kasvu</span>
      <br />
      <span className="text-gray-800">ammattimaisesti</span>
    </motion.h1>
    
    {/* Subtitle */}
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
    >
      Seuraa pennun kasvua, ruokintaa ja kehitystä modernilla sovelluksella. 
      <br className="hidden sm:block" />
      <span className="text-gradient font-semibold">Täysin ilmainen käyttö.</span>
    </motion.p>

    {/* CTA Buttons with delightful interactions */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
    >
      <Link to="/weight-tracker">
        <motion.button 
          className="btn-delightful bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover-3d flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaChartLine className="w-5 h-5" />
          Aloita seuranta
        </motion.button>
      </Link>
      
      <Link to="/calculator">
        <motion.button 
          className="glass px-8 py-4 rounded-2xl font-semibold text-lg hover-3d flex items-center gap-3 text-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaCalculator className="w-5 h-5" />
          Ruokalaskuri
        </motion.button>
      </Link>
    </motion.div>

    {/* Social proof */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600"
    >
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="text-yellow-400 text-xl">★</div>
          ))}
        </div>
        <span className="font-medium">4.9/5 tähteä</span>
      </div>
      
      <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
      
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-500" />
        <span>Yli 10,000 tyytyväistä käyttäjää</span>
      </div>
    </motion.div>
  </div>
</motion.section>

{/* Modern Features Section - Glassmorphism Cards */}
<section className="py-20 px-4 relative">
  <div className="container mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
        <span className="text-gradient">Kaikki mitä tarvitset</span>
        <br />
        <span className="text-gray-800">koirasi kasvuun</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Ammattimaiset työkalut koiran kehityksen seuraamiseen ja optimoimiseen
      </p>
    </motion.div>

    {/* Bento Grid Layout */}
    <div className="bento-grid max-w-7xl mx-auto">
      {/* Large feature card - Growth tracking */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bento-item glass rounded-3xl p-8 hover-3d"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gradient-primary p-3 rounded-2xl">
              <FaChartLine className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-500 bg-white/50 px-3 py-1 rounded-full">
              Suosituin
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Kasvun seuranta</h3>
          <p className="text-gray-600 mb-6 flex-grow">
            Seuraa pennun painoa ja kasvua visuaalisilla kaavioilla. Automaattiset hälytykset poikkeavista arvoista.
          </p>
          
          <Link to="/weight-tracker" className="group">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <span>Aloita seuranta</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Food calculator card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bento-item glass rounded-3xl p-8 hover-3d"
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-cool p-3 rounded-2xl w-fit mb-6">
            <FaCalculator className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ruokalaskuri</h3>
          <p className="text-gray-600 mb-6 flex-grow">
            Laske optimaalinen ruokamäärä pennun iän, painon ja rodun perusteella.
          </p>
          
          <Link to="/calculator" className="group">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>Laske</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                →
              </motion.div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Puppy book card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bento-item glass rounded-3xl p-8 hover-3d"
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-purple p-3 rounded-2xl w-fit mb-6">
            <FaBook className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pentukirja</h3>
          <p className="text-gray-600 mb-6 flex-grow">
            Tallenna muistoja, virstanpylväitä ja seuraa koirasi kehitystä.
          </p>
          
          <Link to="/puppy-book" className="group">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <span>Avaa kirja</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
              >
                →
              </motion.div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Info center card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bento-item glass rounded-3xl p-8 hover-3d"
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-warm p-3 rounded-2xl w-fit mb-6">
            <FaInfoCircle className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tietopankki</h3>
          <p className="text-gray-600 mb-6 flex-grow">
            Kattavat oppaat ruokinnasta, koulutuksesta ja terveydenhuollosta.
          </p>
          
          <Link to="/info" className="group">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <span>Tutustu</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.2 }}
              >
                →
              </motion.div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bento-item glass rounded-3xl p-8 hover-3d bg-gradient-organic text-white"
      >
        <div className="text-center h-full flex flex-col justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-2">Yli 10,000</h3>
          <p className="text-white/90 mb-4">tyytyväistä käyttäjää</p>
          
          <div className="flex justify-center gap-1 mb-2">
            {[1,2,3,4,5].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="text-yellow-300 text-xl"
              >
                ★
              </motion.div>
            ))}
          </div>
          
          <p className="text-white/90 text-sm">4.9/5 keskiarvo</p>
        </div>
      </motion.div>
    </div>
  </div>
</section>
      </div>
    </motion.div>
  </div>
</section>

{/* Modern FAQ Section */}
<section className="py-20 px-4 bg-gray-50/50">
  <div className="container mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
        <span className="text-gradient">Usein kysytyt</span>
        <br />
        <span className="text-gray-800">kysymykset</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Löydä vastauksia yleisimpiin pentujen ruokintaan ja kasvuun liittyviin kysymyksiin
      </p>
    </motion.div>

    <div className="max-w-4xl mx-auto">
      <FAQ items={faqs} />
    </div>
  </div>
</section>

{/* Modern CTA Section */}
<section className="py-20 px-4 relative overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-organic opacity-90"></div>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  
  <div className="container mx-auto relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center text-white"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-6xl mb-8"
      >
        🚀
      </motion.div>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Aloita koirasi 
        <br />
        <span className="text-yellow-300">kasvumatka tänään</span>
      </h2>
      
      <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
        Liity yli 10,000 tyytyväisen käyttäjän joukkoon ja anna koirallesi paras mahdollinen alku elämään
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <Link to="/weight-tracker">
          <motion.button 
            className="btn-delightful bg-white text-gray-800 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover-3d flex items-center gap-3 min-w-[250px] justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChartLine className="w-6 h-6" />
            Aloita ilmainen seuranta
          </motion.button>
        </Link>
        
        <Link to="/calculator">
          <motion.button 
            className="glass-dark border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover-3d flex items-center gap-3 min-w-[250px] justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calculator className="w-6 h-6" />
            Kokeile ruokalaskuria
          </motion.button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1,2,3,4,5].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="text-yellow-300 text-2xl"
              >
                ★
              </motion.div>
            ))}
          </div>
          <span className="font-semibold text-lg">4.9/5 tähteä</span>
        </div>
        
        <div className="w-px h-8 bg-white/30 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-3 h-3 bg-green-400 rounded-full"
          ></motion.div>
          <span className="text-lg">Täysin ilmainen käyttö</span>
        </div>
      </div>
    </motion.div>
  </div>
  
  {/* Floating elements */}
  <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
  <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl float-animation"></div>
  <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg animate-bounce"></div>
</section>
    </div>
  )
}

export default Index
