import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Heart, 
  Calendar, 
  Camera,
  Users,
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import heroIllustration from '@/assets/hero-illustration.png';
import puppyWaveGif from '@/assets/puppy-wave-gif.png';
import growthStages from '@/assets/growth-stages.png';

const PuppyBookLanding: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Kuukausittainen seuranta",
      description: "Dokumentoi pennun kasvu kuukausittain 0-12 kuukauden ikään asti"
    },
    {
      icon: Award,
      title: "Virstanpylväät",
      description: "Merkkaa tärkeät hetket: ensimmäinen rokotus, sosiaalistaminen, komennot"
    },
    {
      icon: Users,
      title: "Ystäväalbumi",
      description: "Tallenna pennun kaverit ja sosiaaliset kohtaamiset"
    },
    {
      icon: Camera,
      title: "Muistogalleria",
      description: "Kuvat, videot ja tarinat pennun elämästä"
    },
    {
      icon: Heart,
      title: "Terveyspäiväkirja",
      description: "Rokotukset, madotukset ja eläinlääkärikäynnit"
    },
    {
      icon: Book,
      title: "Digitaalinen muistokirja",
      description: "Koko ensimmäinen vuosi yhdessä kirjassa"
    }
  ];

  const milestones = [
    "0-2 kuukautta: Silmien avautuminen ja ensimmäiset askeleet",
    "2-4 kuukautta: Rokotukset ja sosiaalistamisen aloitus", 
    "4-6 kuukautta: Peruskomennot ja hihnakävely",
    "6-8 kuukautta: Teini-ikä ja itsenäistyminen",
    "8-12 kuukautta: Aikuistuminen ja persoonallisuuden kehitys"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <SEO 
        title="Pentukirja - Tallenna pennun ensimmäinen vuosi"
        description="Digitaalinen pentukirja pennun ensimmäisen vuoden dokumentointiin. Virstanpylväät, muistot, ystävät ja kasvu yhdessä paikassa."
        keywords="pentukirja, pentu, koira, muistot, virstanpylväät, kasvuseuranta, digitaalinen kirja"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-playful font-bold text-gray-800 mb-6">
                Pennun Ensimmäinen Vuosi 🐶
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Luo ainutlaatuinen muistokirja pennustasi. Tallenna virstanpylväitä, 
                muistoja ja seuraa kasvua henkilökohtaisessa pentukirjassa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/puppy-book">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    Aloita pentukirja
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-orange-300 text-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-orange-50 transition-all"
                >
                  Katso esimerkkiä
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src={heroIllustration}
                  alt="Pentukirja hero"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src={puppyWaveGif}
                    alt="Pentu heiluttaa häntää"
                    className="w-20 h-20 rounded-xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-playful font-bold text-gray-800 mb-4">
              Miksi pentukirja? ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pennun ensimmäinen vuosi on täynnä ihmeellisiä hetkiä. 
              Älä anna niiden kadota - tallenna jokainen tärkeä hetki!
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Stages Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-playful font-bold text-gray-800 mb-6">
                Seuraa pennun kasvua 📈
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Jokainen kuukausi tuo mukanaan uusia oppeja ja hetkiä. 
                Kirjaamme ylös tärkeimmät virstanpylväät jokaisesta vaiheesta.
              </p>
              
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{milestone}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src={growthStages}
                alt="Pennun kasvuvaiheet"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-playful font-bold mb-6">
              Aloita pennun tarinan kirjoittaminen tänään! 📖
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Luo ainutlaatuinen muistokirja, jota koko perhe voi täyttää ja josta voitte nauttia vuosien ajan.
            </p>
            
            <Link to="/puppy-book">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
              >
                <Book className="w-6 h-6" />
                Luo pentukirja ilmaiseksi
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PuppyBookLanding;