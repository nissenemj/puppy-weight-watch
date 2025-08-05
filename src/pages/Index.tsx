import Navigation from '@/components/Navigation'
import SEO from '@/components/SEO'
import FAQ from '@/components/FAQ'
import ImageOptimized from '@/components/ImageOptimized'
import { createWebApplicationSchema, createWeightTrackingSchema, createFAQSchema } from '@/utils/structuredData'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPaw, FaDog, FaBone, FaHeart, FaChartLine, FaCalculator, FaBook, FaInfoCircle } from 'react-icons/fa'
import { Bell, TrendingUp, Users, Award } from 'lucide-react'
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
    <div className="min-h-screen bg-grass-gradient prevent-overflow">
      <SEO
        title="Pentulaskuri - Koiranpennun Painonseuranta ja Kasvuseuranta"
        description="Seuraa koiranpentusi kasvua ja kehitystä söpöllä ja helppokäyttöisellä sovelluksella. Ilmainen painonseuranta, ruokalaskuri ja annostelutaulukot pentujen kasvattajille."
        keywords="pentulaskuri, koiranpentu, painonseuranta, koiran kasvu, ruokinta, annostelu, kasvukäyrä, pentu-sovellus"
        structuredData={structuredData}
        url={window.location.origin}
      />
      <Navigation />
      
{/* Korjattu Hero Section */}
<motion.section 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  className="relative overflow-hidden w-full"
>
  {/* Background gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-600/20"></div>
  
  <div className="relative z-10 text-center px-4 py-8 md:px-8 md:py-16 w-full max-w-full">
    {/* Viral badges - mobiilioptimoidut */}
    <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs md:text-sm">
        <TrendingUp className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">Trending #1</span>
        <span className="sm:hidden">#1</span>
      </Badge>
      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs md:text-sm">
        <Users className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">50K+ Users</span>
        <span className="sm:hidden">50K+</span>
      </Badge>
    </div>

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mb-6 md:mb-8 w-full flex justify-center"
    >
      <img
        src={heroPuppy}
        alt="Adorable puppy"
        className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full shadow-2xl object-cover"
      />
      <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-yellow-400 text-white p-1 md:p-2 rounded-full animate-bounce">
        <FaHeart className="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </motion.div>

    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 px-2 leading-tight"
    >
      Watch Your Puppy Thrive! 📈🐶
    </motion.h1>
    
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 max-w-full mx-auto px-2 leading-relaxed"
    >
      Track weight, get AI-powered tips, and join 50,000+ happy puppy parents! 🎉
    </motion.p>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md mx-auto px-2"
    >
      <Link to="/weight-tracker" className="w-full sm:w-auto flex-1">
        <motion.button 
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-base md:text-xl px-6 py-3 md:px-12 md:py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPaw className="w-4 h-4 md:w-6 md:h-6" />
          <span className="truncate">Start Free Tracking</span>
        </motion.button>
      </Link>
      <motion.button 
        className="text-base md:text-xl px-4 py-3 md:px-8 md:py-6 rounded-full border-2 border-purple-300 hover:bg-purple-50 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaCalculator className="w-4 h-4 md:w-6 md:h-6" />
        <span className="truncate">Take Quiz</span>
      </motion.button>
    </motion.div>

    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 px-2">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
          ))}
        </div>
        <span className="text-center">50,000+ happy puppy parents</span>
      </div>
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400">⭐</div>
        ))}
        <span>4.9/5 rating</span>
      </div>
    </div>
  </div>
</motion.section>

{/* Korjattu Features Grid */}
<section className="py-8 md:py-16 px-4 w-full max-w-full overflow-hidden">
  <div className="text-center mb-8 md:mb-12 w-full">
    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-2 leading-tight">
      Why 50,000+ Puppy Parents Choose Us 🚀
    </h2>
    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-full mx-auto px-2 leading-relaxed">
      Join the viral movement of data-driven puppy care
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-full mx-auto">
    <motion.div whileHover={{ scale: 1.02 }} className="relative w-full">
      <div className="p-4 md:p-8 rounded-3xl shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-100 w-full">
        <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 md:p-3 rounded-full">
          <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div className="text-center w-full">
          <div className="text-4xl md:text-6xl mb-4">📈</div>
          <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">AI Growth Tracking</h3>
          <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">Real-time growth charts with AI-powered insights and health alerts</p>
          <Link to="/weight-tracker">
            <motion.button 
              className="border border-purple-300 text-purple-600 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-purple-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Demo
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>

    <motion.div whileHover={{ scale: 1.02 }} className="relative w-full">
      <div className="p-4 md:p-8 rounded-3xl shadow-xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100 w-full">
        <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 md:p-3 rounded-full">
          <FaPaw className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div className="text-center w-full">
          <div className="text-4xl md:text-6xl mb-4">🍲</div>
          <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">Smart Food Calculator</h3>
          <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">Personalized feeding recommendations based on breed, age, and growth</p>
          <Link to="/calculator">
            <motion.button 
              className="border border-green-300 text-green-600 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-green-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Calculate Now
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>

    <motion.div whileHover={{ scale: 1.02 }} className="relative w-full md:col-span-2 lg:col-span-1">
      <div className="p-4 md:p-8 rounded-3xl shadow-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-100 w-full">
        <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-2 md:p-3 rounded-full">
          <Users className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div className="text-center w-full">
          <div className="text-4xl md:text-6xl mb-4">❤️</div>
          <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">Viral Community</h3>
          <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">Share your puppy's journey and get support from 50K+ parents</p>
          <Link to="/puppy-book">
            <motion.button 
              className="border border-pink-300 text-pink-600 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-pink-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Community
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
</section>

      <div className="mobile-container py-8 md:py-16">
        <FAQ items={faqs} />
      </div>
    </div>
  )
}

export default Index
