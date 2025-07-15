import React from "react";
import { motion } from "framer-motion";

// Assuming you have these components in your project structure.
// If not, you'll need to create them.
// For example: src/components/ui/button.jsx and src/components/ui/card.jsx
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

// Import local images as specified.
import puppyHero from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

const testimonials = [
  {
    text: "Helppo käyttää, pentuni kasvaa hienosti!",
    author: "Anna, labradorin omistaja 🐕",
    stars: 5,
    img: puppyHero, // Using dog1.png for the first testimonial
  },
  {
    text: "Painonseuranta motivoi pitämään huolta!",
    author: "Mikko, corgin omistaja 🐶",
    stars: 5,
    img: dog2,
  },
  {
    text: "Ruokalaskuri on superkätevä!",
    author: "Sari, villakoiran omistaja 🐩",
    stars: 5,
    img: dog3,
  },
];

export default function App() {
  // Define custom colors to be used in Tailwind classes.
  // This approach avoids the need to configure tailwind.config.js for this example.
  const customStyles = `
    <style>
      .bg-cute-green { background-color: #A8E6CF; }
      .text-cute-green { color: #A8E6CF; }
      .bg-cute-green\\/10 { background-color: rgba(168, 230, 207, 0.1); }
      .bg-cute-green\\/20 { background-color: rgba(168, 230, 207, 0.2); }
      .text-fun-orange { color: #FFAB76; }
      .bg-fun-orange { background-color: #FFAB76; }
      .font-poppins { font-family: 'Poppins', sans-serif; }
      .font-fredoka { font-family: 'Fredoka One', cursive; }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  `;

  return (
    <div className="bg-gradient-to-b from-cute-green to-white min-h-screen font-poppins">
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 md:p-16">
        <motion.img
          src={puppyHero}
          alt="Söpö pentu"
          className="w-48 md:w-64 mx-auto rounded-full shadow-lg border-4 border-white"
          whileHover={{ rotate: [0, 10, -10, 0], transition: { duration: 0.8, repeat: Infinity } }}
        />
        <h1 className="text-4xl md:text-5xl font-bold text-fun-orange mt-6 font-fredoka">
          Seuraa pennun kasvua hauskasti! 🐶💕
        </h1>
        <p className="text-lg md:text-xl mt-2 mb-4 text-gray-700">
          Painonseuranta, ruokamäärät ja vinkkejä – varmista paras alku pennullesi.
        </p>
        <Button className="bg-fun-orange text-white text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition">
          Luo profiili ilmaiseksi
        </Button>
        <div className="mt-4 text-gray-600 font-semibold">
          Jo yli <span className="text-fun-orange font-bold">10 000</span> pentua seurannassa!
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-16">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">📈</span>
            <h3 className="font-bold text-lg mb-1">Painonseuranta</h3>
            <p className="text-center text-sm text-gray-600">Seuraa kasvukäyrää reaaliajassa!</p>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">🍲</span>
            <h3 className="font-bold text-lg mb-1">Ruokalaskuri</h3>
            <p className="text-center text-sm text-gray-600">Laske pennun oikea ruokamäärä helposti.</p>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">❤️</span>
            <h3 className="font-bold text-lg mb-1">Yhteisö</h3>
            <p className="text-center text-sm text-gray-600">Jaa kokemuksia muiden omistajien kanssa.</p>
          </Card>
        </motion.div>
      </section>
      
      {/* Feature List */}
      <ul className="flex flex-wrap justify-center gap-4 mb-8 px-4 text-gray-700">
        <li className="bg-white/50 rounded-full px-4 py-1">📈 Näe kasvukäyrä reaaliajassa!</li>
        <li className="bg-white/50 rounded-full px-4 py-1">🍲 Henkilökohtaiset ruokavinkit!</li>
        <li className="bg-white/50 rounded-full px-4 py-1">❤️ Tuki ja yhteisö!</li>
      </ul>

      {/* Testimonials Section */}
      <section className="bg-cute-green/10 py-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 font-fredoka">Mitä käyttäjät sanovat?</h2>
        <div className="flex overflow-x-auto gap-6 px-4 pb-4">
          {testimonials.map((t, i) => (
            <Card key={i} className="min-w-[250px] flex-shrink-0 p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-fun-orange">★</span>
                ))}
              </div>
              <p className="italic text-gray-700">"{t.text}"</p>
              <div className="flex items-center gap-2 mt-2">
                <img src={t.img} alt={t.author} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                <span className="text-sm font-semibold text-gray-600">{t.author}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="text-center py-10 px-4">
        <h3 className="text-xl font-bold mb-2 text-gray-800">Aloita nyt – rekisteröidy ja saat ilmaisen pentukirjan!</h3>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Sähköpostisi"
            className="border border-gray-300 rounded-full px-4 py-2 w-full sm:w-auto flex-grow focus:ring-2 focus:ring-fun-orange"
            required
          />
          <Button className="bg-fun-orange text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition w-full sm:w-auto">
            Rekisteröidy
          </Button>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="bg-cute-green/20 py-6 text-center flex flex-col md:flex-row justify-between items-center px-8 gap-4 text-gray-600">
        <div className="flex gap-4">
          <a href="#about" className="hover:underline">Tietoa meistä</a>
          <a href="#contact" className="hover:underline">Yhteystiedot</a>
          <a href="#privacy" className="hover:underline">Tietosuoja</a>
        </div>
        <div className="flex gap-4 text-2xl">
          <a href="https://x.com" aria-label="X" className="hover:text-fun-orange transition"><span>🐦</span></a>
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-fun-orange transition"><span>📸</span></a>
        </div>
      </footer>
    </div>
  );
}

